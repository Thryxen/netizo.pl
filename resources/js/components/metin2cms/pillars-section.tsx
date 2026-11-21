import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { TechTag } from '@/components/home/tech-tag';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { METIN2CMS_COPY } from './metin2cms-copy';
import { PILLAR_VIGNETTES } from './metin2cms-vignettes';

/**
 * Fundamenty (#fundamenty, #foundations): what the system stands on. Four cells on the shared-border grid rail to rail,
 * each showing its part in use (a vignette on a muted stage, as on the service pages), then what that part does; under
 * them a band on who owns the code, with what it is built with as tech tags.
 */
export function PillarsSection() {
    const copy = useCopy(METIN2CMS_COPY).pillars;
    const id = useMetin2CmsSections().pillars;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
                    {copy.items.map((item, index) => {
                        const Vignette = PILLAR_VIGNETTES[index];

                        return (
                            <li key={item.title} className="flex min-w-0 flex-col bg-background px-4 pt-4 pb-8 sm:px-6 sm:pt-6 lg:px-6 lg:pt-6 lg:pb-9">
                                <Vignette />
                                <h3 className="mt-6 text-lg font-semibold tracking-tight text-balance sm:text-xl">{item.title}</h3>
                                <p className="mt-2 leading-relaxed text-pretty text-muted-foreground">{item.description}</p>
                            </li>
                        );
                    })}
                </ul>
                <div className={cn('grid gap-3 border-t border-border py-9 lg:grid-cols-12 lg:items-baseline lg:py-10', gutterClassName)}>
                    <h3 className="text-xl font-semibold tracking-tight lg:col-span-4">{copy.ownership.title}</h3>
                    <div className="lg:col-span-8">
                        <p className="max-w-2xl leading-relaxed text-pretty text-muted-foreground">{copy.ownership.description}</p>
                        <ul className="mt-5 flex flex-wrap gap-1.5">
                            {copy.ownership.stack.map((technology) => (
                                <li key={technology}>
                                    <TechTag>{technology}</TechTag>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Section>
    );
}
