import { Check, Clock } from 'lucide-react';
import { type CSSProperties, type FocusEvent, useRef, useState } from 'react';
import { useHomeUi } from '@/components/home/home-ui-context';
import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useEntrance } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { formatPln, localized, useCopy, useLocale } from '@/lib/i18n';
import { useServiceSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import type { ServiceOffer } from '@/types/services';
import type { ServiceCopy } from './service-copy';

const COPY = localized({
    pl: {
        from: 'od',
        upTo: (amount: string): string => `zwykle do ${amount}`,
        noCeiling: 'zakres i cenę ustalamy po analizie',
        andUp: 'i więcej',
        includes: 'Co zwykle obejmuje',
        timeline: 'Termin',
        quote: 'Zapytaj o wycenę',
        note: 'Kwoty to typowe przedziały z naszych wycen, a nie cennik pakietów. Dokładną cenę podajemy bezpłatnie po briefie, a odpowiadamy w ciągu 24 godzin.',
    },
    en: {
        from: 'from',
        upTo: (amount: string): string => `usually up to ${amount}`,
        noCeiling: 'we set the scope and price after the analysis',
        andUp: 'and up',
        includes: 'What it usually includes',
        timeline: 'Timeline',
        quote: 'Ask for a quote',
        note: 'These are typical ranges from our quotes, not package prices. We give you the exact price for free after the brief, and we reply within 24 hours.',
    },
});

/**
 * The scale fills once when it comes into view, a segment after the other (scaleX from the left). Under the `html.js`
 * gate and with motion allowed it waits empty; SSR, no JS and reduced motion show it full. A segment of the tier being
 * pointed at or focused stays ink; the other one steps back.
 */
const SCALE_CSS = `
@keyframes nz-price-fill { from { transform: scaleX(0); } }
@media screen and (prefers-reduced-motion: no-preference) {
    .js [data-price-scale]:not([data-revealed]) [data-price-fill] { transform: scaleX(0); }
    .js [data-price-scale][data-revealed=''] [data-price-fill] {
        animation: nz-price-fill 0.9s var(--ease-expo-out) backwards;
        animation-delay: calc(0.15s + var(--segment, 0) * 0.45s);
    }
}
[data-price-fill] { transform-origin: left; }
[data-price-segment][data-dimmed] [data-price-fill] { opacity: 0.25; }
`;

/** A square where the scale meets a rail or the hairline between the tiers (as the steps' markers on the partner page). */
function ScaleMarker({ className }: { className: string }) {
    return <span aria-hidden="true" className={cn('absolute top-1/2 z-10 size-[11px] -translate-y-1/2 bg-foreground', className)} />;
}

type PricingSectionProps = {
    pricing: ServiceCopy['pricing'];
    offers: ServiceOffer[];
};

/**
 * Ile kosztuje (#cennik, #pricing): the two tiers side by side (stacked on phones), each with the price it starts at,
 * what it usually stays under, who it is for, how long it takes (where the site says so) and what it usually includes.
 * The grid's top edge is the price scale: one segment per tier from its price to the next one's (dashed where there is no
 * usual ceiling), with the amounts over the markers, so "od" reads as the start of a range rather than as a price. A tier
 * that ends below the next one's price (websites: 1 499 zł, then 1 799 zł) shows its own ceiling at the end of its segment.
 */
export function PricingSection({ pricing, offers }: PricingSectionProps) {
    const copy = useCopy(COPY);
    const locale = useLocale();
    const id = useServiceSections().pricing;
    const { openContact } = useHomeUi();
    const scaleRef = useRef<HTMLDivElement>(null);
    const entrance = useEntrance(scaleRef, { amount: 0.4 });
    const [activeTier, setActiveTier] = useState<number | null>(null);
    const hasCeiling = offers[offers.length - 1]?.priceTo !== null;

    const leaveTier = (event: FocusEvent<HTMLLIElement>): void => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setActiveTier(null);
        }
    };

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <style>{SCALE_CSS}</style>
            <SectionHeading id={`${id}-heading`} title={pricing.title} lead={pricing.lead} />

            {/* The amounts over the scale's markers: the first at the left rail, the middle one over the hairline between the
                tiers, the last at the right rail (or "and up" where the second tier has no usual ceiling). A tier's ceiling also
                closes its segment where the next tier starts higher, so the gap between them shows. */}
            <div aria-hidden="true" className={cn('relative grid grid-cols-2 pb-3 text-xs font-medium whitespace-nowrap tabular-nums sm:text-sm', bleedClassName)}>
                {offers.map((offer, index) => {
                    const isLast = index === offers.length - 1;
                    const endsBelowNext = !isLast && offer.priceTo !== null && offer.priceTo < offers[index + 1].priceFrom;

                    return (
                        <span key={offer.name} className={cn('flex min-w-0 items-baseline justify-between gap-2 sm:gap-3', index === 0 ? 'pl-4 sm:pl-6 lg:pl-10' : 'pl-3 sm:pl-4')}>
                            <span>{formatPln(offer.priceFrom, locale)}</span>
                            {/* The end amount from sm: on phones two amounts do not fit half the width, and the tier says it in words. */}
                            {(isLast || endsBelowNext) && (
                                <span className={cn('hidden sm:inline', isLast ? 'pr-4 sm:pr-6 lg:pr-10' : 'pr-3 sm:pr-4', !offer.priceTo && 'font-normal text-muted-foreground')}>
                                    {offer.priceTo ? formatPln(offer.priceTo, locale) : copy.andUp}
                                </span>
                            )}
                        </span>
                    );
                })}
            </div>

            {/* Decorative: every tier states its own range in words. */}
            <div
                ref={scaleRef}
                aria-hidden="true"
                data-price-scale=""
                data-revealed={entrance === 'pending' ? undefined : entrance === 'entering' ? '' : 'static'}
                className={cn('relative grid h-[3px] grid-cols-2 bg-border', bleedClassName)}
            >
                {offers.map((offer, index) => (
                    <span
                        key={offer.name}
                        data-price-segment=""
                        data-dimmed={activeTier !== null && activeTier !== index ? '' : undefined}
                        style={{ '--segment': index } as CSSProperties}
                        className="relative block overflow-hidden"
                    >
                        <span
                            data-price-fill=""
                            className={cn(
                                'absolute inset-0 block transition-opacity duration-300',
                                offer.priceTo ? 'bg-foreground' : 'bg-[repeating-linear-gradient(to_right,var(--foreground)_0_8px,transparent_8px_14px)]',
                            )}
                        />
                    </span>
                ))}
                {/* The rails exist from md (as the rivets), so the markers at the scale's ends do too. */}
                <ScaleMarker className="-left-[6px] hidden md:block" />
                <ScaleMarker className="left-1/2 -ml-[5px]" />
                {hasCeiling && <ScaleMarker className="-right-[6px] hidden md:block" />}
            </div>

            <div className={cn('relative', bleedClassName)}>
                <ul className="grid gap-px bg-border md:grid-cols-2">
                    {offers.map((offer, index) => (
                        <li
                            key={offer.name}
                            onMouseEnter={() => setActiveTier(index)}
                            onMouseLeave={() => setActiveTier(null)}
                            onFocus={() => setActiveTier(index)}
                            onBlur={leaveTier}
                            className={cn('flex min-w-0 flex-col bg-background pt-8 pb-10 lg:pt-10 lg:pb-12', gutterClassName)}
                        >
                            <h3 className="text-xl font-semibold tracking-tight">{offer.name}</h3>
                            <p className="mt-5 flex flex-wrap items-baseline gap-x-2 leading-none">
                                <span className="text-lg font-medium text-muted-foreground">{copy.from}</span>
                                <span className="text-[2.5rem] font-semibold tracking-[-0.03em] whitespace-nowrap tabular-nums sm:text-[2.75rem]">{formatPln(offer.priceFrom, locale)}</span>
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">{offer.priceTo ? copy.upTo(formatPln(offer.priceTo, locale)) : copy.noCeiling}</p>
                            <p className="mt-5 max-w-[46ch] leading-relaxed text-pretty">{offer.description}</p>
                            {offer.timeline && (
                                <p className="mt-4 flex items-center gap-2 text-sm">
                                    <Clock aria-hidden="true" className="size-4 text-muted-foreground" />
                                    <span className="sr-only">{copy.timeline}: </span>
                                    {offer.timeline}
                                </p>
                            )}
                            <h4 className="mt-7 text-sm font-medium">{copy.includes}</h4>
                            <ul className="mt-3 grid gap-2.5 text-[0.9375rem] leading-snug">
                                {offer.includes.map((item) => (
                                    <li key={item} className="flex gap-2.5">
                                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
                                        <span className="text-pretty">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto pt-8">
                                <Button variant="outline" size="lg" className="max-md:h-11" onClick={() => openContact('brief')}>
                                    {copy.quote}
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <p className={cn('max-w-3xl py-7 text-sm leading-relaxed text-pretty text-muted-foreground md:py-8', gutterClassName)}>{copy.note}</p>
            </div>
        </Section>
    );
}
