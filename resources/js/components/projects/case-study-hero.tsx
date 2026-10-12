import { ExternalLinkIcon } from 'lucide-react';
import { useScroll, useTransform } from 'motion/react';
import { type CSSProperties, useRef } from 'react';
import { ExternalLink } from '@/components/home/external-link';
import { BrowserBar, PLACEHOLDER_DARK, PLACEHOLDER_LIGHT } from '@/components/home/project-frame';
import { Container, Rivet } from '@/components/home/section';
import { ThemedImage } from '@/components/home/themed-image';
import { SplitLines, useMotionStyle, useReducedMotionPreference } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useHomeSections } from '@/lib/sections';
import { usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/home';
import { titleFitStyle } from './title-fit';

const COPY = localized({
    pl: {
        breadcrumb: 'Ścieżka strony',
        projects: 'Realizacje',
        visit: 'Zobacz stronę',
        quote: 'Wyceń podobny projekt',
        alt: (title: string): string => `Zrzut ekranu strony ${title}`,
    },
    en: {
        breadcrumb: 'Breadcrumb',
        projects: 'Projects',
        visit: 'Visit the website',
        quote: 'Get a quote for a similar project',
        alt: (title: string): string => `Screenshot of the ${title} website`,
    },
});

/** Same first-screen choreography as the other heroes (app.css `[data-split-line]`, `[data-hero-rise]`). */
const RISE_AT = 0.45;
const RISE_STAGGER = 0.08;

const riseDelay = (index: number): CSSProperties => ({ '--hero-rise-delay': `${RISE_AT + index * RISE_STAGGER}s` }) as CSSProperties;

/** Below lg the stage runs rail to rail under the copy; from lg it is the right 7/12, up to the rail (as the partner hero). */
const STAGE_BLEED =
    '-mx-4 aspect-[4/3] border-t border-border sm:-mx-6 sm:aspect-[16/11] lg:col-span-7 lg:ml-0 lg:-mr-10 lg:aspect-auto lg:border-t-0 lg:border-l';

/** The window over the wash of colour: lifted like the home page's scene chips (no shadow in dark mode). */
const WINDOW_SURFACE = 'border bg-background shadow-[0_1px_2px_rgb(0_0_0/0.05),0_28px_56px_-24px_rgb(0_0_0/0.45)] dark:shadow-none';

/** How far (px) the window drifts up while the hero scrolls away. */
const DRIFT = 56;

/**
 * Case study hero: the breadcrumb, the project's name rising in, its type, the short description and the two ways on
 * (the live site, a quote); on the right the stage, where the site's own colours (its screenshot, blurred) light the
 * wall behind a browser window showing the top of the site. The window rises in after the copy and drifts with the
 * scroll.
 */
export function CaseStudyHero({ project }: { project: Project }) {
    const copy = useCopy(COPY);
    const pageUrls = usePageUrls();
    const homeSections = useHomeSections();

    return (
        <section aria-labelledby="hero-heading" className="relative">
            <Container>
                <div className="grid lg:min-h-[min(calc(100svh-var(--header-height)-6rem),52rem)] lg:grid-cols-12">
                    <div className="max-w-2xl pt-8 pb-12 [container-type:inline-size] sm:pt-14 lg:col-span-5 lg:flex lg:max-w-none lg:flex-col lg:justify-center lg:py-14 lg:pr-10">
                        <nav aria-label={copy.breadcrumb}>
                            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                                <li>
                                    <a
                                        href={pageUrls.projects}
                                        className="inline-flex min-h-11 items-center rounded-sm underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 md:min-h-0"
                                    >
                                        {copy.projects}
                                    </a>
                                </li>
                                <li aria-hidden="true" className="text-foreground/25">
                                    /
                                </li>
                                <li aria-current="page" className="min-w-0 truncate text-foreground">
                                    {project.title}
                                </li>
                            </ol>
                        </nav>

                        <SplitLines
                            id="hero-heading"
                            lines={[project.title]}
                            style={titleFitStyle(project.title)}
                            className="mt-5 text-[max(1.75rem,min(clamp(2.75rem,min(10vw,11svh),5.5rem),var(--title-fit)))] leading-[0.98] font-semibold tracking-[-0.05em] text-balance break-words lg:text-[max(1.75rem,min(clamp(2.75rem,min(5.4vw,9svh),5.25rem),var(--title-fit)))]"
                        />
                        {project.category && (
                            <p data-hero-rise="" style={riseDelay(0)} className="mt-4 text-lg text-muted-foreground">
                                {project.category}
                            </p>
                        )}
                        <p data-hero-rise="" style={riseDelay(1)} className="mt-7 max-w-xl text-lg leading-relaxed text-pretty">
                            {project.description}
                        </p>
                        <div data-hero-rise="" style={riseDelay(2)} className="mt-9 flex flex-wrap items-center gap-3">
                            {project.liveUrl && (
                                <Button size="lg" className="max-md:h-11" asChild>
                                    <ExternalLink href={project.liveUrl}>
                                        {copy.visit}
                                        <ExternalLinkIcon aria-hidden="true" />
                                    </ExternalLink>
                                </Button>
                            )}
                            <Button size="lg" variant="outline" className="max-md:h-11" asChild>
                                <a href={`${pageUrls.home}#${homeSections.contact}`}>{copy.quote}</a>
                            </Button>
                        </div>
                    </div>

                    <HeroStage project={project} alt={copy.alt(project.title)} />
                </div>
            </Container>
        </section>
    );
}

/**
 * The stage: the screenshot scaled up and blurred into a wash of the site's colours (one download with the window's
 * image), a light veil of the page colour over it, and the window. The rise (CSS) and the drift (scroll) sit on two
 * nested elements so their transforms never meet.
 */
function HeroStage({ project, alt }: { project: Project; alt: string }) {
    const stageRef = useRef<HTMLDivElement>(null);
    const driftRef = useRef<HTMLDivElement>(null);
    const reduced = useReducedMotionPreference();
    const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -DRIFT]);
    const screenshot = project.thumbnailUrl ?? project.fullImageUrl;

    useMotionStyle(driftRef, { y });

    return (
        <div ref={stageRef} className={cn('relative isolate overflow-hidden bg-muted', STAGE_BLEED)}>
            {screenshot && (
                <img
                    src={screenshot}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    className="absolute inset-0 -z-10 size-full scale-125 object-cover opacity-80 blur-3xl saturate-150 dark:opacity-65"
                />
            )}
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-background/25 dark:bg-background/30" />

            <div className="absolute inset-0 flex items-center justify-center p-[7%] lg:p-[9%]">
                <div data-hero-rise="" style={riseDelay(3)} className="w-full max-w-[46rem]">
                    <div ref={driftRef} className={cn('overflow-hidden rounded-lg', WINDOW_SURFACE)}>
                        <BrowserBar url={project.url} />
                        <div className="aspect-[16/10] bg-muted">
                            {screenshot ? (
                                <img
                                    src={screenshot}
                                    alt={alt}
                                    width={1600}
                                    height={1000}
                                    fetchPriority="high"
                                    decoding="async"
                                    className="block size-full object-cover object-top"
                                />
                            ) : (
                                <ThemedImage
                                    light={PLACEHOLDER_LIGHT}
                                    dark={PLACEHOLDER_DARK}
                                    alt=""
                                    width={1536}
                                    height={1024}
                                    loading="eager"
                                    className="block size-full object-cover"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Rivet side="left" className="lg:hidden" />
            <Rivet side="right" className="lg:hidden" />
            <Rivet side="left" edge="bottom" className="md:hidden lg:block" />
        </div>
    );
}
