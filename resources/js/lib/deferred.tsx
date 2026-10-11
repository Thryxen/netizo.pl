import { type ComponentType, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Code splitting for parts of a page that are not needed for its first screen (forms below the fold, dialogs). Their
 * code sits in its own chunk, imported dynamically, so it gets no modulepreload and doesn't compete with the first
 * screen. The SSR server loads every deferred component before rendering (`loadDeferredComponents()` in
 * lib/pages.ts), so a `DeferredBlock` is still in the HTML in full.
 */
export type Deferred<P extends object> = {
    /** Fetches the code (once; a failed fetch can be retried) and resolves with the component. */
    load: () => Promise<ComponentType<P>>;
    /** The component once its code is here, else null. */
    loaded: () => ComponentType<P> | null;
};

const registry: Array<() => Promise<unknown>> = [];

/**
 * @example const briefWizard = deferred(() => import('./brief/brief-wizard').then((module) => module.BriefWizard));
 */
export function deferred<P extends object>(importComponent: () => Promise<ComponentType<P>>): Deferred<P> {
    let component: ComponentType<P> | null = null;
    let pending: Promise<ComponentType<P>> | null = null;

    const load = (): Promise<ComponentType<P>> => {
        pending ??= importComponent().then(
            (imported) => (component = imported),
            (error: unknown) => {
                pending = null;

                throw error;
            },
        );

        return pending;
    };

    registry.push(load);

    return { load, loaded: () => component };
}

/** SSR: fetch the code of every deferred component registered so far, so the server renders them in full. */
export function loadDeferredComponents(): Promise<unknown> {
    return Promise.all(registry.map((load) => load()));
}

/** Runs `callback` once the page has loaded and the main thread is idle. Returns a cancel function. */
export function whenPageIdle(callback: () => void): () => void {
    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;

    const schedule = (): void => {
        if (typeof window.requestIdleCallback === 'function') {
            idleHandle = window.requestIdleCallback(callback, { timeout: 2000 });
        } else {
            timeoutHandle = window.setTimeout(callback, 300);
        }
    };

    if (document.readyState === 'complete') {
        schedule();
    } else {
        window.addEventListener('load', schedule, { once: true });
    }

    return () => {
        window.removeEventListener('load', schedule);

        if (idleHandle !== null) {
            window.cancelIdleCallback(idleHandle);
        }

        if (timeoutHandle !== null) {
            window.clearTimeout(timeoutHandle);
        }
    };
}

/**
 * The deferred component once its code is here, for parts with no server markup (a closed dialog renders nothing):
 * null on the server and in the first client render. The code is fetched as soon as `now` is true, otherwise once
 * the page is idle after loading, so the first open needs no wait.
 */
export function useDeferredComponent<P extends object>(target: Deferred<P>, now = false): ComponentType<P> | null {
    const [component, setComponent] = useState<ComponentType<P> | null>(null);

    useEffect(() => {
        if (component) {
            return;
        }

        let isCancelled = false;
        const load = (): void => {
            target.load().then(
                (loaded) => {
                    if (!isCancelled) {
                        setComponent(() => loaded);
                    }
                },
                () => {
                    // Offline or a stale deploy: the next trigger tries again.
                },
            );
        };

        if (now || target.loaded()) {
            load();

            return () => {
                isCancelled = true;
            };
        }

        const cancelIdle = whenPageIdle(load);

        return () => {
            isCancelled = true;
            cancelIdle();
        };
    }, [component, now, target]);

    return component;
}

/** Stable object: React writes innerHTML only when this prop changes, so the server-rendered markup stays put. */
const KEEP_SERVER_HTML = { __html: '' };

type DeferredBlockProps<P extends object> = {
    component: Deferred<P>;
    className?: string;
} & (Partial<P> extends P ? { props?: P } : { props: P });

/**
 * A server-rendered block (a form below the fold) whose code arrives later: until then the client keeps the server's
 * markup in place untouched (no hydration, no layout shift), then renders the component over it in one commit. The
 * code is fetched when the block comes within a screen of the viewport, or at once on a pointer press or focus inside
 * it; focus moves to the matching control of the fresh markup. Without SSR the block stays empty until then.
 */
export function DeferredBlock<P extends object>({ component: target, props, className }: DeferredBlockProps<P>) {
    const [Component, setComponent] = useState<ComponentType<P> | null>(target.loaded);
    const blockRef = useRef<HTMLDivElement>(null);
    const focusedIdRef = useRef('');

    useEffect(() => {
        const block = blockRef.current;

        if (Component || !block) {
            return;
        }

        let isCancelled = false;
        let observer: IntersectionObserver | null = null;

        const load = (): void => {
            observer?.disconnect();
            target.load().then(
                (loaded) => {
                    if (isCancelled) {
                        return;
                    }

                    const active = document.activeElement;
                    focusedIdRef.current = active instanceof HTMLElement && block.contains(active) ? active.id : '';
                    setComponent(() => loaded);
                },
                () => {
                    // Offline or a stale deploy: the next trigger tries again.
                },
            );
        };

        if (typeof IntersectionObserver === 'function') {
            observer = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        load();
                    }
                },
                { rootMargin: '100% 0px' },
            );
            observer.observe(block);
        } else {
            load();
        }

        block.addEventListener('pointerdown', load);
        block.addEventListener('focusin', load);

        return () => {
            isCancelled = true;
            observer?.disconnect();
            block.removeEventListener('pointerdown', load);
            block.removeEventListener('focusin', load);
        };
    }, [Component, target]);

    useLayoutEffect(() => {
        if (Component && focusedIdRef.current !== '') {
            document.getElementById(focusedIdRef.current)?.focus();
            focusedIdRef.current = '';
        }
    }, [Component]);

    if (!Component) {
        return <div key="server" ref={blockRef} className={className} dangerouslySetInnerHTML={KEEP_SERVER_HTML} suppressHydrationWarning />;
    }

    return (
        <div key="client" className={className}>
            <Component {...(props as P)} />
        </div>
    );
}
