import { Check, Plus } from 'lucide-react';
import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { METIN2CMS_COPY } from './metin2cms-copy';

/**
 * Funkcje (#funkcje, #features): one block rail to rail split by a hairline. What every deployment includes, in three
 * lists (player, admin, under the hood), and beside it what we add to order.
 */
export function FeaturesSection() {
    const copy = useCopy(METIN2CMS_COPY).features;
    const id = useMetin2CmsSections().features;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative grid border-t border-border lg:grid-cols-12', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />

                <div className={cn('py-10 lg:col-span-8 lg:py-12', gutterClassName)}>
                    <h3 className="text-xl font-semibold tracking-tight">{copy.included}</h3>
                    <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-3">
                        {copy.groups.map((group) => (
                            <div key={group.title}>
                                <h4 className="text-sm font-medium text-muted-foreground">{group.title}</h4>
                                <ul className="mt-4 flex flex-col gap-3 text-[0.9375rem] leading-snug">
                                    {group.items.map((item) => (
                                        <li key={item} className="flex items-start gap-2.5">
                                            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={cn('border-t border-border bg-muted/50 py-10 lg:col-span-4 lg:border-t-0 lg:border-l lg:py-12', gutterClassName)}>
                    <h3 className="text-xl font-semibold tracking-tight">{copy.custom}</h3>
                    <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{copy.customLead}</p>
                    <ul className="mt-7 flex flex-wrap gap-2">
                        {copy.customItems.map((item) => (
                            <li key={item} className="inline-flex items-center gap-1.5 rounded-md border bg-background py-1.5 pr-3 pl-2 text-sm">
                                <Plus aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Section>
    );
}
