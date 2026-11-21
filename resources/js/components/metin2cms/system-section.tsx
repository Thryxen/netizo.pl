import { Check } from 'lucide-react';
import { bleedClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { METIN2CMS_COPY } from './metin2cms-copy';
import { METIN2CMS_VIGNETTES } from './metin2cms-vignettes';

/**
 * Co dostajesz (#system): the three parts of the system on the shared-border grid rail to rail. Each cell shows its
 * part in use (a vignette on a muted stage, as on the service pages), then what it is and what it covers. The grid
 * leaves its bottom hairline to the next section.
 */
export function SystemSection() {
    const copy = useCopy(METIN2CMS_COPY).system;
    const id = useMetin2CmsSections().system;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <ul className="grid gap-px bg-border lg:grid-cols-3">
                    {copy.parts.map((part, index) => {
                        const Vignette = METIN2CMS_VIGNETTES[index];

                        return (
                            <li key={part.title} className="flex min-w-0 flex-col bg-background px-4 pt-4 pb-8 sm:px-6 sm:pt-6 lg:px-7 lg:pt-7 lg:pb-9">
                                <Vignette />
                                <h3 className="mt-6 text-lg font-semibold tracking-tight text-balance sm:text-xl">{part.title}</h3>
                                <p className="mt-2 max-w-[44ch] leading-relaxed text-pretty text-muted-foreground">{part.description}</p>
                                <ul className="mt-5 flex flex-col gap-2.5 text-[0.9375rem]">
                                    {part.points.map((point) => (
                                        <li key={point} className="flex items-start gap-2.5">
                                            <Check aria-hidden="true" className="mt-1 size-4 shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Section>
    );
}
