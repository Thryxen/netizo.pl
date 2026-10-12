import { Check, Clock } from 'lucide-react';
import { useHomeUi } from '@/components/home/home-ui-context';
import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { Button } from '@/components/ui/button';
import { formatPln, formatPlnRange, localized, useCopy, useLocale } from '@/lib/i18n';
import { useServiceSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import type { ServiceOffer } from '@/types/services';
import type { ServiceCopy } from './service-copy';

const COPY = localized({
    pl: {
        from: 'od',
        noCeiling: 'zakres i cenę ustalamy po analizie',
        includes: 'Co zwykle obejmuje',
        timeline: 'Termin',
        quote: 'Zapytaj o wycenę',
        note: 'Kwoty to typowe przedziały z naszych wycen, a nie cennik pakietów. Dokładną cenę podajemy bezpłatnie po briefie, a odpowiadamy w ciągu 24 godzin.',
    },
    en: {
        from: 'from',
        noCeiling: 'we set the scope and price after the analysis',
        includes: 'What it usually includes',
        timeline: 'Timeline',
        quote: 'Ask for a quote',
        note: 'These are typical ranges from our quotes, not package prices. We give you the exact price for free after the brief, and we reply within 24 hours.',
    },
});

type PricingSectionProps = {
    pricing: ServiceCopy['pricing'];
    offers: ServiceOffer[];
};

/**
 * Ile kosztuje (#cennik, #pricing): the two tiers side by side (stacked on phones), each with its usual range of prices
 * ("1 299–4 999 zł", or "od 4 499 zł" where there is no usual ceiling), who it is for, how long it takes and what it
 * usually includes. The range is the tier's headline, so no separate scale is needed.
 */
export function PricingSection({ pricing, offers }: PricingSectionProps) {
    const copy = useCopy(COPY);
    const locale = useLocale();
    const id = useServiceSections().pricing;
    const { openContact } = useHomeUi();
    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={pricing.title} lead={pricing.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <ul className="grid gap-px bg-border md:grid-cols-2">
                    {offers.map((offer) => (
                        <li
                            key={offer.name}
                            className={cn('flex min-w-0 flex-col bg-background pt-8 pb-10 lg:pt-10 lg:pb-12', gutterClassName)}
                        >
                            <h3 className="text-xl font-semibold tracking-tight">{offer.name}</h3>
                            {offer.priceTo ? (
                                <p className="mt-5 text-[2rem] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap tabular-nums sm:text-[2.5rem]">
                                    {formatPlnRange(offer.priceFrom, offer.priceTo, locale)}
                                </p>
                            ) : (
                                <>
                                    <p className="mt-5 flex flex-wrap items-baseline gap-x-2 leading-none">
                                        <span className="text-lg font-medium text-muted-foreground">{copy.from}</span>
                                        <span className="text-[2rem] font-semibold tracking-[-0.03em] whitespace-nowrap tabular-nums sm:text-[2.5rem]">
                                            {formatPln(offer.priceFrom, locale)}
                                        </span>
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">{copy.noCeiling}</p>
                                </>
                            )}
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
