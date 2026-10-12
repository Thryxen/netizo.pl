import type { CSSProperties } from 'react';
import { ParallaxPhoto } from '@/components/about/parallax-photo';
import { Container, Rivet } from '@/components/home/section';
import { SplitLines } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useHomeSections, useProjectsSections } from '@/lib/sections';
import { usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';

/** The heading in three fixed lines at every width (the widest, "dla naszych klientów.", still fits the md column). */
const COPY = localized({
    pl: {
        headingLines: ['Strony i aplikacje,', 'które pracują', 'dla naszych klientów.'],
        lead: 'Strony firmowe, sklepy i aplikacje webowe, które zaprojektowaliśmy i zbudowaliśmy. Przy każdej opisujemy, z czym przyszedł klient, co zrobiliśmy i co się zmieniło.',
        browse: 'Zobacz realizacje',
        quote: 'Wyceń swój projekt',
    },
    en: {
        headingLines: ['Websites and apps', 'that work for', 'our clients.'],
        lead: 'Company websites, online stores and web apps we designed and built. For each one we describe what the client came with, what we did and what changed.',
        browse: 'See the projects',
        quote: 'Get a quote for your project',
    },
});

/** Same first-screen choreography as the other heroes (app.css `[data-split-line]`, `[data-hero-rise]`). */
const RISE_AT = 0.45;
const RISE_STAGGER = 0.08;

const riseDelay = (index: number): CSSProperties => ({ '--hero-rise-delay': `${RISE_AT + index * RISE_STAGGER}s` }) as CSSProperties;

/** Below lg the mosaic runs rail to rail under the copy; from lg it is the right 7/12, up to the rail (as the partner hero). */
const STAGE_BLEED =
    '-mx-4 aspect-[4/3] border-t border-border sm:-mx-6 sm:aspect-[16/9] lg:col-span-7 lg:ml-0 lg:-mr-10 lg:aspect-auto lg:border-t-0 lg:border-l';

/**
 * Hero of the list of projects: the heading rising in line by line, the lead and the two ways on (down to the projects,
 * a quote); on the right a mosaic of the work behind every project, three photos of the series in shared hairlines:
 * writing the code (`about-code`), planning on the wall (`mission-workshop`) and the launch at the client's
 * (`about-visit`), each drifting with the scroll. No project screenshots: the projects are in the list right below. The
 * height is the copy's (no first-screen height).
 */
export function ProjectsHero() {
    const copy = useCopy(COPY);
    const pageUrls = usePageUrls();
    const homeSections = useHomeSections();
    const listId = useProjectsSections().list;

    return (
        <section aria-labelledby="hero-heading" className="relative">
            <Container>
                <div className="grid lg:grid-cols-12">
                    <div className="max-w-2xl pt-8 pb-10 sm:pt-12 lg:col-span-5 lg:flex lg:max-w-none lg:flex-col lg:justify-center lg:py-12 lg:pr-8 lg:[container-type:inline-size] xl:pr-10">
                        <SplitLines
                            id="hero-heading"
                            lines={copy.headingLines}
                            className="text-[clamp(2.125rem,min(8.6vw,9svh),4rem)] leading-[1.04] font-semibold tracking-[-0.04em] lg:text-[clamp(2rem,min(9.4cqw,3.5vw,7svh),3.375rem)]"
                        />
                        <p data-hero-rise="" style={riseDelay(0)} className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground lg:text-[1.0625rem] xl:text-lg">
                            {copy.lead}
                        </p>
                        <div data-hero-rise="" style={riseDelay(1)} className="mt-9 flex flex-wrap items-center gap-3 lg:mt-8">
                            <Button size="lg" className="max-md:h-11" asChild>
                                <a href={`#${listId}`}>{copy.browse}</a>
                            </Button>
                            <Button size="lg" variant="outline" className="max-md:h-11" asChild>
                                <a href={`${pageUrls.home}#${homeSections.contact}`}>{copy.quote}</a>
                            </Button>
                        </div>
                    </div>

                    <div className={cn('relative', STAGE_BLEED)}>
                        <div className="absolute inset-0 grid grid-cols-[5fr_7fr] grid-rows-2 gap-px bg-border">
                            <ParallaxPhoto
                                name="about-code"
                                sizes="(min-width: 1200px) 290px, (min-width: 1024px) 24vw, 42vw"
                                alt=""
                                eager
                                className="row-span-2"
                                imgClassName="object-[50%_40%]"
                            />
                            <ParallaxPhoto name="mission-workshop" sizes="(min-width: 1200px) 410px, (min-width: 1024px) 34vw, 58vw" alt="" eager />
                            <ParallaxPhoto name="about-visit" sizes="(min-width: 1200px) 410px, (min-width: 1024px) 34vw, 58vw" alt="" eager />
                        </div>
                        <Rivet side="left" className="lg:hidden" />
                        <Rivet side="right" className="lg:hidden" />
                        <Rivet side="left" edge="bottom" className="md:hidden lg:block" />
                    </div>
                </div>
            </Container>
        </section>
    );
}
