import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { Check } from 'lucide-react';
import { TechTag } from '@/components/home/tech-tag';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { ClientPanelFlow } from './client-panel-flow';
import { METIN2CMS_COPY } from './metin2cms-copy';
import { PILLAR_VIGNETTES } from './metin2cms-vignettes';

/**
 * Fundamenty (#fundamenty, #foundations): what the system stands on. Four cells on the shared-border grid rail to rail,
 * each showing its part in use (a vignette on a muted stage, as on the service pages), then what that part does. A tag
 * under each title says whether the part is included, made to order or optional (maintenance and its zero-downtime
 * deploys). Under
 * them a band on the client panel: fixes and ideas go there as tasks, the team is on the chat and the code is downloaded
 * there, over a live mock of the panel taking a bug and a quoted new feature to done (ClientPanelFlow), with what the
 * system is built with as tech tags.
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
                                <TechTag className="mt-2 self-start">{item.note}</TechTag>
                                <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{item.description}</p>
                            </li>
                        );
                    })}
                </ul>
                <div className={cn('border-t border-border py-9 lg:py-12', gutterClassName)}>
                    <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
                        <div className="lg:col-span-5">
                            <h3 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">{copy.ownership.title}</h3>
                            <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{copy.ownership.description}</p>
                            <ul className="mt-6 flex flex-wrap gap-1.5">
                                {copy.ownership.stack.map((technology) => (
                                    <li key={technology}>
                                        <TechTag>{technology}</TechTag>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <ul className="flex flex-col gap-2.5 lg:col-span-7">
                            {copy.ownership.points.map((point) => (
                                <li key={point} className="flex gap-2.5 leading-relaxed text-pretty">
                                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0" strokeWidth={2.25} />
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <ClientPanelFlow className="mt-9 lg:mt-10" />
                </div>
            </div>
        </Section>
    );
}
