import type { CSSProperties, ReactNode, RefObject } from 'react';
import { BriefArtifact } from '@/components/home/process/brief-artifact';
import { DesignArtifact } from '@/components/home/process/design-artifact';
import { LaunchArtifact } from '@/components/home/process/launch-artifact';
import { STEP_MS, type StepState } from '@/components/home/process/process-data';
import { ProcessStyles } from '@/components/home/process/process-styles';
import { SprintArtifact } from '@/components/home/process/sprint-artifact';
import { useProcessRelay } from '@/components/home/process/use-process-relay';
import { bleedClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useServiceSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import type { ServiceCopy } from './service-copy';

type ServiceProcessSectionProps = {
    process: ServiceCopy['process'];
    artifacts: ServiceCopy['processArtifacts'];
};

/**
 * Jak powstaje (#proces, #process): the four stages as the home page's relay (home/process): one bleed block rail to
 * rail on the shared-border grid, a row of four from lg, 2 × 2 from md and a list below. When the stages come into view
 * the rail runs from stage to stage and each stage's live preview plays as it is reached (a brief to approve, a
 * prototype, a sprint on the staging version, the release), in this service's own words (`processArtifacts` in its
 * copy). Without JS, during SSR and under reduced motion every stage shows its finished frame and the rail is full.
 */
export function ServiceProcessSection({ process, artifacts }: ServiceProcessSectionProps) {
    const id = useServiceSections().process;
    const relay = useProcessRelay();
    const previews: ((state: StepState) => ReactNode)[] = [
        (state) => <BriefArtifact state={state} content={artifacts.brief} />,
        (state) => <DesignArtifact state={state} content={artifacts.design} />,
        (state) => <SprintArtifact state={state} content={artifacts.sprint} />,
        (state) => <LaunchArtifact state={state} content={artifacts.launch} />,
    ];

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <ProcessStyles />
            <SectionHeading id={`${id}-heading`} title={process.title} lead={process.lead} />

            {/* The top-left corner carries stage 1's marker (md+), so only the right end gets a rivet. */}
            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="right" />
                <ol
                    ref={relay.rowRef}
                    data-process-relay=""
                    data-relay-live={relay.live ? '' : undefined}
                    data-relay-instant={relay.instant ? '' : undefined}
                    className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4"
                >
                    {process.steps.map((step, index) => (
                        <StageCell
                            key={step.title}
                            index={index}
                            title={step.title}
                            description={step.description}
                            isLast={index === process.steps.length - 1}
                            state={relay.states[index]}
                            artifactRef={relay.artifactRefs[index]}
                            preview={previews[index](relay.states[index])}
                        />
                    ))}
                </ol>
            </div>
        </Section>
    );
}

type StageCellProps = {
    index: number;
    title: string;
    description: string;
    isLast: boolean;
    state: StepState;
    artifactRef: RefObject<HTMLDivElement | null>;
    preview: ReactNode;
};

function StageCell({ index, title, description, isLast, state, artifactRef, preview }: StageCellProps) {
    return (
        <li
            data-step-state={state}
            style={{ '--relay-ms': `${STEP_MS[index]}ms` } as CSSProperties}
            className="relative flex min-w-0 flex-col bg-background pt-8 pr-4 pb-10 pl-11 sm:pr-6 sm:pl-[3.25rem] md:px-6 md:pt-7 md:pb-8 lg:px-5 xl:px-7 xl:pt-8 xl:pb-9"
        >
            {/* md+: this stage's stretch of the rail is its cell's top edge (the hairline above it). */}
            <span aria-hidden="true" className="absolute inset-x-0 -top-px z-10 hidden h-px md:block">
                <span data-relay-fill="x" className="block size-full bg-foreground" />
            </span>
            {/* Below md: a line down the left, from this stage's marker to the next one (the last runs to the end). */}
            <span
                aria-hidden="true"
                className={cn('absolute top-[46px] left-[21px] z-10 w-px bg-border sm:left-[29px] md:hidden', isLast ? 'bottom-0' : '-bottom-[47px]')}
            >
                <span data-relay-fill="y" className="block size-full bg-foreground" />
            </span>
            <span aria-hidden="true" data-relay-marker="" className="absolute top-10 left-4 z-20 size-[11px] sm:left-6 md:-top-[6px] md:-left-[6px]" />
            {/* 2 × 2: the second row's hairline meets the right rail at the fourth cell. */}
            {isLast && <Rivet side="right" className="lg:hidden" />}

            <div className="flex items-baseline gap-3 lg:min-h-14">
                <span aria-hidden="true" data-relay-number="" className="font-mono text-lg leading-none">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h3>
            </div>

            <div ref={artifactRef} aria-hidden="true" className="mt-5">
                {preview}
            </div>

            <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
        </li>
    );
}
