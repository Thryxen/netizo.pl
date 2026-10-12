import { Container, Section, SectionHeading } from '@/components/home/section';
import { ProjectCardList } from '@/components/projects/project-grid';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useHomeSections, useServiceSections } from '@/lib/sections';
import { usePageUrls } from '@/lib/site';
import type { ProjectSummary } from '@/types/projects';

const COPY = localized({
    pl: {
        lead: 'Każda realizacja ma swoje case study: wyzwania, rozwiązania, wyniki i technologie.',
        all: 'Wszystkie realizacje',
    },
    en: {
        lead: 'Each project has its own case study: the challenges, solutions, results and technologies.',
        all: 'All projects',
    },
});

type ServiceProjectsSectionProps = {
    title: string;
    projects: ProjectSummary[];
};

/**
 * Realizacje (#realizacje, #projects): the projects of the panel tagged with the service, as the cards of the list of
 * projects (their headings one level down, under this section's own), with the way to every project. Left out while no
 * project is tagged with the service.
 */
export function ServiceProjectsSection({ title, projects }: ServiceProjectsSectionProps) {
    const copy = useCopy(COPY);
    const id = useServiceSections().projects;
    const pageUrls = usePageUrls();
    const contactId = useHomeSections().contact;

    if (projects.length === 0) {
        return null;
    }

    return (
        <>
            <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-12 md:pb-16">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
                    <SectionHeading id={`${id}-heading`} title={title} lead={copy.lead} className="mb-0 md:mb-0" />
                    <Button variant="outline" size="lg" className="shrink-0 self-start max-md:h-11 lg:self-end" asChild>
                        <a href={pageUrls.projects}>{copy.all}</a>
                    </Button>
                </div>
            </Section>
            <div className="border-t border-border">
                <Container className="px-0 sm:px-0 lg:px-0">
                    <ProjectCardList projects={projects} contactUrl={`#${contactId}`} headingLevel="h3" />
                </Container>
            </div>
        </>
    );
}
