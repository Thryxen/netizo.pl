import { Check } from 'lucide-react';
import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { CountUp } from '@/components/motion';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { METIN2CMS_COPY } from './metin2cms-copy';

/** Shared borders of the three figures: a column on phones, a row from md. */
const FACT_BORDERS = ['border-b md:border-r md:border-b-0', 'border-b md:border-r md:border-b-0', ''];

/**
 * Wydajność (#wydajnosc, #performance): how little the website asks of the game database. One block rail to rail: the
 * reasons on the left, on the right an example hour as two bars (the visits to the ranking against the queries they
 * cost the game database), then the cache times as three figures.
 */
export function PerformanceSection() {
    const copy = useCopy(METIN2CMS_COPY).performance;
    const id = useMetin2CmsSections().performance;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />

                <div className="grid lg:grid-cols-12">
                    <ul className={cn('flex flex-col justify-center gap-4 py-10 text-lg leading-snug lg:col-span-5 lg:py-12', gutterClassName)}>
                        {copy.points.map((point) => (
                            <li key={point} className="flex items-start gap-3">
                                <Check aria-hidden="true" className="mt-1 size-5 shrink-0" />
                                {point}
                            </li>
                        ))}
                    </ul>

                    <figure className={cn('border-t border-border bg-muted/50 py-10 lg:col-span-7 lg:border-t-0 lg:border-l lg:py-12', gutterClassName)}>
                        <figcaption className="text-sm text-muted-foreground">{copy.example}</figcaption>
                        <dl className="mt-7 flex flex-col gap-8">
                            <div>
                                <dt className="text-[0.9375rem] font-medium">{copy.visits}</dt>
                                <dd className="mt-3 flex items-center gap-4">
                                    <span aria-hidden="true" className="h-9 flex-1 rounded-sm bg-foreground" />
                                    <CountUp value={copy.visitsValue} from={9000} duration={1.6} className="w-[6.5ch] shrink-0 text-right text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl" />
                                </dd>
                            </div>
                            <div>
                                <dt className="text-[0.9375rem] font-medium">{copy.queries}</dt>
                                <dd className="mt-3 flex items-center gap-4">
                                    <span aria-hidden="true" className="flex h-9 flex-1 rounded-sm bg-foreground/8">
                                        <span className="h-full w-1 rounded-sm bg-foreground" />
                                    </span>
                                    <span className="w-[6.5ch] shrink-0 text-right text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{copy.queriesValue}</span>
                                </dd>
                            </div>
                        </dl>
                    </figure>
                </div>

                <ul className="grid border-t border-border md:grid-cols-3">
                    {copy.facts.map((fact, index) => (
                        <li key={fact.label} className={cn('flex flex-col gap-2 border-border py-7 sm:py-8', gutterClassName, FACT_BORDERS[index])}>
                            <span className="text-[2rem] leading-none font-semibold tracking-tight whitespace-nowrap tabular-nums lg:text-[2.5rem]">{fact.value}</span>
                            <span className="text-sm leading-snug text-muted-foreground">{fact.label}</span>
                        </li>
                    ))}
                </ul>
                <p className={cn('border-t border-border py-5 text-sm text-muted-foreground', gutterClassName)}>{copy.note}</p>
            </div>
        </Section>
    );
}
