import { type ReactNode, type RefObject, useState } from 'react';
import { SceneBackdrop, sceneProps, STAGE_SIZES } from '@/components/home/scenes/scene-parts';
import { useLiveLoop } from '@/components/motion/use-in-view-loop';
import type { PhotoName } from '@/lib/photos';
import { cn } from '@/lib/utils';

/**
 * One round: nothing → the first chip → the second → the third, which holds (the static frame) before all leave. Each
 * scene decides which slot's chip comes first, so the chips tell its story in order.
 */
const PHASE_MS = [700, 1300, 1300, 3600] as const;

/**
 * Before the loop has started, under the inline script's `html.js` gate, the chips wait hidden, so the first round plays
 * from its start instead of the static frame flashing first. SSR, no JS and reduced motion show the static frame.
 */
const SCENE_CSS = `
@media screen and (prefers-reduced-motion: no-preference) {
    .js [data-service-scene]:not([data-started]) [data-service-chip] { opacity: 0; }
}
`;

export type ServiceSceneLoop = {
    ref: RefObject<HTMLDivElement | null>;
    /** The loop's step: 0 nothing, 1–3 the chips arrive one by one (3 is the static frame). */
    step: number;
    active: boolean;
    started: boolean;
};

/** The clock of a hero scene: runs only while the scene is at least 30% in view, the static frame is the full set. */
export function useServiceScene(): ServiceSceneLoop {
    const { ref, step, active } = useLiveLoop<HTMLDivElement>(PHASE_MS, { staticStep: PHASE_MS.length - 1, amount: 0.3 });
    const [started, setStarted] = useState(false);

    if (active && !started) {
        setStarted(true);
    }

    return { ref, step, active, started };
}

type ServiceSceneProps = {
    loop: ServiceSceneLoop;
    photoName: PhotoName;
    /** The photo's crop, e.g. `object-[58%_50%]`. */
    imgClassName?: string;
    /** The chips over the photo's calm right-hand wall: top (arrives from above), middle (sm+), bottom. */
    top: ReactNode;
    middle: ReactNode;
    bottom: ReactNode;
    className?: string;
};

/**
 * A service page's hero stage, in the language of the partner page's referral scene: a photo of the client's world from
 * the series, with the outcome of the service arriving over its calm wall as small pieces of interface, one after
 * another. Decorative (the hero's copy says the same); the loop runs only while in view.
 */
export function ServiceScene({ loop, photoName, imgClassName, top, middle, bottom, className }: ServiceSceneProps) {
    return (
        <div ref={loop.ref} {...sceneProps(loop.active)} data-service-scene="" data-started={loop.started ? '' : undefined} className={cn('relative overflow-hidden bg-muted', className)}>
            <style>{SCENE_CSS}</style>
            <SceneBackdrop name={photoName} eager sizes={STAGE_SIZES} imgClassName={imgClassName} />

            <div data-service-chip="" className="absolute inset-x-3 top-3 sm:inset-x-auto sm:top-6 sm:right-6 sm:w-[20rem]">
                {top}
            </div>
            <div data-service-chip="" className="absolute top-1/2 right-6 hidden w-[15.5rem] -translate-y-1/2 sm:block">
                {middle}
            </div>
            <div data-service-chip="" className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[20rem]">
                {bottom}
            </div>
        </div>
    );
}
