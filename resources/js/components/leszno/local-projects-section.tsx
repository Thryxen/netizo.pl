import { ProjectFrame } from '@/components/home/project-frame';
import { ProjectMetrics } from '@/components/home/project-metrics';
import { Container, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { ProjectCardList } from '@/components/projects/project-grid';
import { Button, buttonVariants } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useHomeSections, useLesznoSections } from '@/lib/sections';
import { useCaseStudyUrl, usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { ProjectSummary } from '@/types/projects';

const COPY = localized({
    pl: {
        title: 'Realizacje dla firm z regionu',
        lead: 'Strony, które zbudowaliśmy dla firm z naszej okolicy. Każda ma swoje case study: wyzwania, rozwiązania i wyniki.',
        all: 'Wszystkie realizacje',
        open: 'Zobacz case study',
    },
    en: {
        title: 'Projects for businesses from the region',
        lead: 'Websites we built for businesses from our area. Each has its own case study: the challenges, solutions and results.',
        all: 'All projects',
        open: 'See the case study',
    },
});

/**
 * Realizacje (#realizacje, #projects): the panel's projects marked as from the region. The first one (Treepro, the
 * page's case) as a wide feature: its screenshot window beside its name, type, description and numbers; the others as
 * the cards of the list of projects. Left out while no project is marked.
 */
export function LocalProjectsSection({ projects }: { projects: ProjectSummary[] }) {
    const copy = useCopy(COPY);
    const id = useLesznoSections().projects;
    const pageUrls = usePageUrls();
    const contactId = useHomeSections().contact;
    const caseStudyUrl = useCaseStudyUrl();

    if (projects.length === 0) {
        return null;
    }

    const [featured, ...others] = projects;
    const titleId = `realizacja-${featured.slug}-title`;

    return (
        <>
            <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-12 md:pb-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                    <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} className="mb-0 md:mb-0" />
                    <Button variant="outline" size="lg" className="shrink-0 self-start max-md:h-11 lg:self-end" asChild>
                        <a href={pageUrls.projects}>{copy.all}</a>
                    </Button>
                </div>
            </Section>

            <div className="border-t border-border">
                <Container className="px-0 sm:px-0 lg:px-0">
                    <Rivet side="left" />
                    <Rivet side="right" />
                    <article aria-labelledby={titleId} className="group/project group/frame relative grid lg:grid-cols-12">
                        <div className="p-4 sm:p-6 lg:col-span-7 lg:border-r lg:border-border lg:p-10">
                            <ProjectFrame project={featured} />
                        </div>
                        <div className={cn('flex flex-col pt-2 pb-10 lg:col-span-5 lg:py-10', gutterClassName)}>
                            {featured.category && <p className="text-sm text-muted-foreground">{featured.category}</p>}
                            <h3 id={titleId} className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.035em]">
                                <a
                                    href={caseStudyUrl(featured.slug)}
                                    className="rounded-sm underline-offset-4 outline-none after:absolute after:inset-0 after:content-[''] group-hover/project:underline focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
                                >
                                    {featured.title}
                                </a>
                            </h3>
                            <p className="mt-4 max-w-[52ch] leading-relaxed text-pretty">{featured.description}</p>
                            <div className="mt-auto pt-8">
                                <ProjectMetrics metrics={featured.metrics} />
                                <span aria-hidden="true" className={cn(buttonVariants({ variant: 'outline' }), 'mt-8 max-md:h-11 group-hover/project:bg-accent')}>
                                    {copy.open}
                                </span>
                            </div>
                        </div>
                    </article>
                </Container>
            </div>

            {others.length > 0 && (
                <div className="border-t border-border">
                    <Container className="px-0 sm:px-0 lg:px-0">
                        <ProjectCardList projects={others} contactUrl={`#${contactId}`} headingLevel="h3" />
                    </Container>
                </div>
            )}
        </>
    );
}
