import { MapPin, Phone } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { useHomeUi } from '@/components/home/home-ui-context';
import { Container, gutterClassName, Rivet } from '@/components/home/section';
import { SplitLines } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useServiceSections } from '@/lib/sections';
import { contact, usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { ServiceCopy } from './service-copy';

const COPY = localized({
    pl: {
        breadcrumb: 'Ścieżka strony',
        home: 'Netizo',
        pricing: 'Zobacz cennik',
        call: 'Zadzwoń',
        area: 'Leszno, cała Polska',
        facts: 'Ceny i terminy w skrócie',
    },
    en: {
        breadcrumb: 'Breadcrumb',
        home: 'Netizo',
        pricing: 'See pricing',
        call: 'Call',
        area: 'Leszno, across Poland',
        facts: 'Prices and timelines at a glance',
    },
});

/** Same first-screen choreography as the other heroes (app.css `[data-split-line]`, `[data-hero-rise]`). */
const RISE_AT = 0.45;
const RISE_STAGGER = 0.08;

const riseDelay = (index: number): CSSProperties => ({ '--hero-rise-delay': `${RISE_AT + index * RISE_STAGGER}s` }) as CSSProperties;

/** Below lg the stage runs rail to rail under the copy; from lg it is the right 7/12, up to the rail (as the partner hero). */
const STAGE_BLEED =
    '-mx-4 aspect-[4/5] border-t border-border sm:-mx-6 sm:aspect-[16/11] lg:col-span-7 lg:ml-0 lg:-mr-10 lg:aspect-auto lg:border-t-0 lg:border-l';

/** Shared borders for a 2×2 (below lg) / 1×4 (lg) strip, as under the home and partner heroes. */
const FACT_CELL_BORDERS = ['border-r border-b lg:border-b-0', 'border-b lg:border-r lg:border-b-0', 'border-r', ''];

const linkFocus = 'rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

type ServiceHeroProps = {
    copy: ServiceCopy;
    /** The photo scene on the right (absolutely filling the stage). */
    scene: ReactNode;
};

/**
 * Hero of a service page, split like the partner and about heroes: the breadcrumb, the H1 rising in line by line, the
 * lead, the quote button (to the brief on this page) and the way to the pricing, the number to call; on the right the
 * service's photo scene. Under it four figures on the shared-border grid: what the service costs and how long it takes.
 */
export function ServiceHero({ copy: service, scene }: ServiceHeroProps) {
    const copy = useCopy(COPY);
    const { openContact } = useHomeUi();
    const sections = useServiceSections();
    const pageUrls = usePageUrls();
    const { hero } = service;

    return (
        <section aria-labelledby="hero-heading" className="relative">
            <Container>
                <div className="grid lg:min-h-[min(calc(100svh-var(--header-height)-8.5rem),54rem)] lg:grid-cols-12">
                    <div className="max-w-2xl pt-8 pb-12 sm:pt-14 lg:col-span-5 lg:flex lg:max-w-none lg:flex-col lg:justify-center lg:py-14 lg:pr-8 lg:[container-type:inline-size] xl:pr-10">
                        <nav aria-label={copy.breadcrumb}>
                            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                                <li>
                                    <a href={pageUrls.home} className={cn('inline-flex min-h-11 items-center underline-offset-4 hover:text-foreground hover:underline md:min-h-0', linkFocus)}>
                                        {copy.home}
                                    </a>
                                </li>
                                <li aria-hidden="true" className="text-foreground/25">
                                    /
                                </li>
                                <li aria-current="page" className="text-foreground">
                                    {service.name}
                                </li>
                            </ol>
                        </nav>

                        <SplitLines
                            id="hero-heading"
                            lines={hero.headingLines}
                            wideLines={hero.wideLines}
                            className="mt-5 text-[clamp(2.375rem,min(6vw,9svh),4.25rem)] leading-[1.04] font-semibold tracking-[-0.04em] lg:text-[clamp(2.25rem,min(12cqw,3.9vw,7svh),3.5rem)]"
                        />
                        <p data-hero-rise="" style={riseDelay(0)} className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground lg:text-[1.0625rem] xl:text-lg">
                            {hero.lead}
                        </p>
                        <div data-hero-rise="" style={riseDelay(1)} className="mt-9 flex flex-wrap items-center gap-3 lg:mt-8">
                            <Button size="lg" className="max-md:h-11" onClick={() => openContact('brief')}>
                                {hero.quote}
                            </Button>
                            <Button size="lg" variant="outline" className="max-md:h-11" asChild>
                                <a href={`#${sections.pricing}`}>{copy.pricing}</a>
                            </Button>
                        </div>
                        <p data-hero-rise="" style={riseDelay(2)} className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.9375rem] text-muted-foreground md:mt-6">
                            <a
                                href={contact.phone.href}
                                className={cn(
                                    'inline-flex min-h-11 items-center gap-2 font-medium text-foreground tabular-nums underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground md:min-h-0',
                                    linkFocus,
                                )}
                            >
                                <Phone aria-hidden="true" className="size-4" />
                                <span className="sr-only">{copy.call}: </span>
                                {contact.phone.display}
                            </a>
                            <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
                            <span className="inline-flex items-center gap-2">
                                <MapPin aria-hidden="true" className="size-4 text-foreground" />
                                {copy.area}
                            </span>
                        </p>
                    </div>

                    <div className={cn('relative', STAGE_BLEED)}>
                        {scene}
                        <Rivet side="left" className="lg:hidden" />
                        <Rivet side="right" className="lg:hidden" />
                        <Rivet side="left" edge="bottom" className="md:hidden lg:block" />
                    </div>
                </div>
            </Container>

            <div className="border-t border-border">
                <Container className="px-0 sm:px-0 lg:px-0">
                    <Rivet side="left" />
                    <Rivet side="right" />
                    <ul aria-label={copy.facts} className="grid grid-cols-2 lg:grid-cols-4">
                        {hero.facts.map((fact, index) => (
                            <li key={fact.label} className={cn('flex min-w-0 flex-col gap-2 border-border py-7 sm:py-8', gutterClassName, FACT_CELL_BORDERS[index])}>
                                {/* "od" / "from" sits over the amount (in English it would not fit beside it); a cell without one
                                    keeps the empty line, so every value stands at the same height. */}
                                <span className="flex flex-col">
                                    <span className="h-5 text-sm leading-5 text-muted-foreground">{fact.prefix}</span>
                                    {/* Scales with the screen on the narrowest phones, where "PLN 15,000" would not fit half the width. */}
                                    <span className="text-[clamp(1.5rem,7.5vw,1.875rem)] leading-none font-semibold tracking-tight whitespace-nowrap tabular-nums sm:text-[2.25rem] lg:text-[2.5rem]">
                                        {fact.value}
                                    </span>
                                </span>
                                <span className="text-sm leading-snug text-muted-foreground">{fact.label}</span>
                            </li>
                        ))}
                    </ul>
                </Container>
            </div>
        </section>
    );
}
