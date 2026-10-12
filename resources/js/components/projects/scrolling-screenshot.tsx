import { ChevronDown } from 'lucide-react';
import { useScroll, useTransform } from 'motion/react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { BrowserBar, PLACEHOLDER_DARK, PLACEHOLDER_LIGHT } from '@/components/home/project-frame';
import { ThemedImage } from '@/components/home/themed-image';
import { useMotionStyle, useReducedMotionPreference } from '@/components/motion';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/home';

const COPY = localized({
    pl: {
        alt: (title: string): string => `Cała strona ${title}`,
        scrollable: (title: string): string => `Cała strona ${title} (przewijana)`,
        expand: 'Pokaż całą stronę',
        collapse: 'Zwiń podgląd',
    },
    en: {
        alt: (title: string): string => `The whole ${title} website`,
        scrollable: (title: string): string => `The whole ${title} website (scrollable)`,
        expand: 'Show the whole page',
        collapse: 'Collapse the preview',
    },
});

/** From lg the window sticks beside the text and scrolls the site with the reader; below it the reader opens it. */
const PINNED_QUERY = '(min-width: 64rem)';

/** Below lg the folded window is at most this tall: 68% of the viewport, up to 34rem (`max-lg:max-h-[…]` below). */
const FOLDED_VIEWPORT_SHARE = 0.68;
const FOLDED_MAX_REM = 34;

/** The scroll position thumb: 2.5rem tall, 0.5rem from the window's top and bottom edges. */
const THUMB_TRAVEL = 'calc(var(--scrub, 0) * (100cqh - 3.5rem))';

type ScrollingScreenshotProps = {
    project: Pick<Project, 'title' | 'url' | 'thumbnailUrl' | 'fullImageUrl'>;
    className?: string;
};

/**
 * A browser window onto the whole page of the project.
 *
 * From lg it sticks beside the case study text and scrolls itself with the reader: over the column's height it runs
 * from the top of the site to its bottom (`--scrub`, 0–1 from scroll, moves the screenshot by its overflow,
 * −(100% − 100cqh) of the window, the size container), with a thumb on the right edge showing how far it has got.
 * Under reduced motion it stays put and is a focusable region the reader scrolls themselves.
 *
 * Below lg there is no scrubbing (it would rush past on a phone): the window shows the top of the site, and "Pokaż całą
 * stronę" unfolds the whole screenshot in place, so the page's own scroll walks through it; "Zwiń podgląd" folds it
 * back and brings the window into view again.
 */
export function ScrollingScreenshot({ project, className }: ScrollingScreenshotProps) {
    const copy = useCopy(COPY);
    const viewportId = useId();
    const trackRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const reduced = useReducedMotionPreference();
    const isPinned = useMediaQuery(PINNED_QUERY);
    const [isExpanded, setIsExpanded] = useState(false);
    const [unfolded, setUnfolded] = useState<{ height: number; canExpand: boolean }>({ height: 0, canExpand: false });
    const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
    const scrub = useTransform([scrollYProgress], ([progress]: number[]) => (reduced || !isPinned ? 0 : progress));
    const imageUrl = project.fullImageUrl ?? project.thumbnailUrl;
    const isRegion = reduced && isPinned && imageUrl !== null;
    const canExpand = !isPinned && unfolded.canExpand;

    useMotionStyle(viewportRef, { '--scrub': scrub });

    /** The image's full height at the window's width, and whether the folded window hides part of it. */
    const measure = useCallback((): void => {
        const image = imageRef.current;

        if (!image) {
            return;
        }

        const rem = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
        const foldedHeight = Math.min(window.innerHeight * FOLDED_VIEWPORT_SHARE, FOLDED_MAX_REM * rem);

        setUnfolded({ height: image.offsetHeight, canExpand: image.offsetHeight > foldedHeight + 1 });
    }, []);

    useEffect(() => {
        const image = imageRef.current;

        if (!image || typeof ResizeObserver === 'undefined') {
            return;
        }

        const observer = new ResizeObserver(measure);
        observer.observe(image);

        return () => observer.disconnect();
    }, [measure]);

    const toggle = (): void => {
        if (!isExpanded) {
            setIsExpanded(true);

            return;
        }

        setIsExpanded(false);

        const frame = frameRef.current;

        if (frame && frame.getBoundingClientRect().top < 0) {
            frame.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' });
        }
    };

    return (
        <div ref={trackRef} className={cn('relative', className)}>
            <div ref={frameRef} className="overflow-hidden rounded-lg border bg-background lg:sticky lg:top-[calc(var(--header-height)+2.5rem)]">
                <BrowserBar url={project.url} />
                <div
                    id={viewportId}
                    ref={viewportRef}
                    role={isRegion ? 'region' : undefined}
                    aria-label={isRegion ? copy.scrollable(project.title) : undefined}
                    tabIndex={isRegion ? 0 : undefined}
                    style={canExpand && isExpanded ? { maxHeight: `${unfolded.height}px` } : undefined}
                    className={cn(
                        'relative overflow-hidden bg-muted',
                        'max-lg:max-h-[min(68svh,34rem)] max-lg:transition-[max-height] max-lg:duration-700 max-lg:ease-expo-out',
                        'lg:h-[min(calc(100svh-var(--header-height)-7.5rem),46rem)] lg:[container-type:size]',
                        isRegion && 'overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2',
                    )}
                >
                    {imageUrl ? (
                        <>
                            <img
                                ref={imageRef}
                                src={imageUrl}
                                alt={copy.alt(project.title)}
                                loading="lazy"
                                decoding="async"
                                onLoad={measure}
                                style={{ transform: 'translateY(calc(var(--scrub, 0) * (100cqh - 100%)))' }}
                                className="block h-auto w-full lg:min-h-full lg:object-cover lg:object-top lg:will-change-transform"
                            />
                            {!reduced && (
                                <span aria-hidden="true" className="pointer-events-none absolute top-2 right-2 bottom-2 hidden w-1 rounded-full bg-black/10 lg:block">
                                    <span
                                        style={{ transform: `translateY(${THUMB_TRAVEL})` }}
                                        className="absolute inset-x-0 top-0 h-10 rounded-full bg-black/45 shadow-[0_0_0_1px_rgb(255_255_255/0.55)]"
                                    />
                                </span>
                            )}
                            {canExpand && (
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-background via-background/60 to-transparent transition-opacity duration-300',
                                        isExpanded && 'opacity-0',
                                    )}
                                />
                            )}
                        </>
                    ) : (
                        <ThemedImage light={PLACEHOLDER_LIGHT} dark={PLACEHOLDER_DARK} alt="" width={1536} height={1024} className="block aspect-[16/10] size-full object-cover lg:aspect-auto" />
                    )}
                </div>
                {canExpand && (
                    <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={viewportId}
                        onClick={toggle}
                        className="flex h-12 w-full items-center justify-center gap-2 border-t bg-muted/60 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset"
                    >
                        {isExpanded ? copy.collapse : copy.expand}
                        <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform duration-300', isExpanded && 'rotate-180')} />
                    </button>
                )}
            </div>
        </div>
    );
}

/** Whether `query` matches; false on the server and in the hydrating render, then live. */
function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window.matchMedia !== 'function') {
            return;
        }

        const media = window.matchMedia(query);
        const update = (): void => setMatches(media.matches);

        update();
        media.addEventListener('change', update);

        return () => media.removeEventListener('change', update);
    }, [query]);

    return matches;
}
