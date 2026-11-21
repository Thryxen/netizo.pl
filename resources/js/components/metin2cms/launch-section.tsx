import { bleedClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { METIN2CMS_COPY } from './metin2cms-copy';

/**
 * Wdrożenie (#wdrozenie, #launch): the four steps from the first call to launch, on the shared-border grid rail to rail
 * (one column on phones, two from sm, four from lg), each under its number.
 */
export function LaunchSection() {
    const copy = useCopy(METIN2CMS_COPY).launch;
    const id = useMetin2CmsSections().launch;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <ol className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                    {copy.steps.map((step, index) => (
                        <li key={step.title} className="flex min-w-0 flex-col bg-background px-4 py-8 sm:px-6 lg:px-7 lg:py-10">
                            <span aria-hidden="true" className="font-mono text-sm text-muted-foreground tabular-nums">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="mt-8 text-lg font-semibold tracking-tight text-balance sm:text-xl">{step.title}</h3>
                            <p className="mt-2 leading-relaxed text-pretty text-muted-foreground">{step.description}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </Section>
    );
}
