import { bleedClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useServiceSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import type { ServiceCopy } from './service-copy';

/** A square on the rail at the start of a step (filled: the stages are a plan, not progress). */
function RailMarker({ className }: { className: string }) {
    return <span aria-hidden="true" className={cn('absolute z-20 size-[11px] bg-foreground', className)} />;
}

/**
 * Jak powstaje (#proces, #process): the four stages on the shared-border grid, a row of four from lg and a list below,
 * with the rail along their top edge (lg) or down their left side and a square where each stage starts, as on the
 * partner page's steps (static here: the page's one orchestrated moment is the price scale).
 */
export function ServiceProcessSection({ process }: { process: ServiceCopy['process'] }) {
    const id = useServiceSections().process;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={process.title} lead={process.lead} />

            {/* lg: the top corners carry the first marker and the rail's end, so the rivets show only below lg. */}
            <div className={cn('relative border-t border-border lg:border-foreground', bleedClassName)}>
                <Rivet side="left" className="lg:hidden" />
                <Rivet side="right" className="lg:hidden" />
                <ol className="relative grid gap-px bg-border lg:grid-cols-4">
                    {/* Below lg: the rail runs down the left, from the first marker to the end of the list. */}
                    <span aria-hidden="true" className="absolute top-10 bottom-0 left-[21px] z-10 w-px bg-foreground sm:left-[29px] lg:hidden" />
                    <RailMarker className="-top-[6px] -right-[6px] hidden lg:block" />

                    {process.steps.map((step, index) => (
                        <li
                            key={step.title}
                            className="relative flex min-w-0 flex-col bg-background pt-8 pr-4 pb-10 pl-11 sm:pr-6 sm:pl-[3.25rem] lg:px-6 lg:pt-9 lg:pb-10 xl:px-7"
                        >
                            <RailMarker className="top-[2.15rem] left-4 sm:left-6 lg:-top-[6px] lg:-left-[6px]" />
                            <span aria-hidden="true" className="font-mono text-sm text-muted-foreground">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="mt-2 text-xl font-semibold tracking-tight">{step.title}</h3>
                            <p className="mt-3 max-w-[46ch] leading-relaxed text-pretty text-muted-foreground">{step.description}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </Section>
    );
}
