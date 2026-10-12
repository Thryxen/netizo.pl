import { ProjectFrame } from '@/components/home/project-frame';
import { ProjectMetrics } from '@/components/home/project-metrics';
import { Container, Rivet, Section } from '@/components/home/section';
import { Button, buttonVariants } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useHomeSections, useProjectsSections } from '@/lib/sections';
import { useCaseStudyUrl, usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { ProjectSummary } from '@/types/projects';

const COPY = localized({
    pl: {
        list: 'Lista realizacji',
        open: 'Zobacz case study',
        empty: 'Pierwsze realizacje pokażemy tu wkrótce.',
        write: 'Napisz do nas',
        nextTitle: 'Tu może być Twój projekt',
        nextLead: 'Opisz w kilku zdaniach, co chcesz zbudować. Odpowiemy w ciągu 24 godzin z pytaniami i pierwszą wyceną.',
        nextAction: 'Opisz swój projekt',
    },
    en: {
        list: 'List of projects',
        open: 'See the case study',
        empty: 'We’ll show our first projects here soon.',
        write: 'Write to us',
        nextTitle: 'Your project could be next',
        nextLead: 'Describe what you want to build in a few sentences. We’ll reply within 24 hours with questions and a first quote.',
        nextAction: 'Describe your project',
    },
});

/**
 * The list of projects (/realizacje, /en/projects): every project as a card on the shared-border grid (ProjectCardList),
 * or a note with the way to write to us while there are none yet.
 */
export function ProjectGrid({ projects }: { projects: ProjectSummary[] }) {
    const copy = useCopy(COPY);
    const homeSections = useHomeSections();
    const pageUrls = usePageUrls();
    const listId = useProjectsSections().list;
    const contactUrl = `${pageUrls.home}#${homeSections.contact}`;

    if (projects.length === 0) {
        return (
            <Section id={listId} labelledBy="projects-list-heading">
                <h2 id="projects-list-heading" className="sr-only">
                    {copy.list}
                </h2>
                <div className="flex flex-col items-start gap-6 border p-8 md:p-10">
                    <p className="text-lg leading-relaxed">{copy.empty}</p>
                    <Button variant="outline" className="max-md:h-11" asChild>
                        <a href={contactUrl}>{copy.write}</a>
                    </Button>
                </div>
            </Section>
        );
    }

    return (
        <section id={listId} aria-labelledby="projects-list-heading" className="border-t border-border">
            <h2 id="projects-list-heading" className="sr-only">
                {copy.list}
            </h2>
            <Container className="px-0 sm:px-0 lg:px-0">
                <ProjectCardList projects={projects} contactUrl={contactUrl} />
            </Container>
        </section>
    );
}

type ProjectCardListProps = {
    projects: ProjectSummary[];
    /** Where the cell inviting the reader's project leads (the contact form). */
    contactUrl: string;
    /** Level of the cards' headings: h2 on the list of projects, h3 under a section's own heading (a service page). */
    headingLevel?: 'h2' | 'h3';
};

/**
 * The projects as a two-column grid rail to rail (one column on phones), inside a <Container> without its gutter: cells
 * share their hairlines, with rivets where a row's hairline meets a rail. With an odd number of projects the last row is
 * completed (md+) by a cell inviting the reader's own project. The last row leaves its bottom hairline to what follows.
 */
export function ProjectCardList({ projects, contactUrl, headingLevel = 'h2' }: ProjectCardListProps) {
    const copy = useCopy(COPY);
    const Heading = headingLevel;
    const hasOpenCell = projects.length % 2 === 1;

    return (
        <ul className="grid md:grid-cols-2 [&>li]:border-b [&>li]:border-border max-md:[&>li:last-child]:border-b-0 md:[&>li:nth-last-child(-n+2)]:border-b-0">
            {projects.map((project, index) => (
                <li key={project.id} className={cn('relative', index % 2 === 0 && 'md:border-r')}>
                    <Rivet side={index % 2 === 0 ? 'left' : 'right'} />
                    <ProjectCard project={project} headingLevel={headingLevel} />
                </li>
            ))}
            {hasOpenCell && (
                <li className="relative max-md:hidden">
                    <Rivet side="right" />
                    <div className="flex h-full flex-col justify-between gap-10 bg-muted/40 p-6 sm:p-8 lg:p-10">
                        <div>
                            <Heading className="max-w-md text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-balance">{copy.nextTitle}</Heading>
                            <p className="mt-4 max-w-md leading-relaxed text-pretty text-muted-foreground">{copy.nextLead}</p>
                        </div>
                        <Button size="lg" className="self-start" asChild>
                            <a href={contactUrl}>{copy.nextAction}</a>
                        </Button>
                    </div>
                </li>
            )}
        </ul>
    );
}

/**
 * One project: its screenshot window, name, type, description and numbers. The name is the link and covers the card
 * (`after:inset-0`); hovering the card, or focusing its link, scrolls the site in the window (`group/frame`,
 * `group/project`, as on the home page).
 */
function ProjectCard({ project, headingLevel }: { project: ProjectSummary; headingLevel: 'h2' | 'h3' }) {
    const copy = useCopy(COPY);
    const caseStudyUrl = useCaseStudyUrl();
    const titleId = `realizacja-${project.slug}-title`;
    const Heading = headingLevel;

    return (
        <article aria-labelledby={titleId} className="group/project group/frame relative flex h-full flex-col p-4 sm:p-6 lg:p-10">
            <ProjectFrame project={project} />
            <div className="mt-6 flex flex-1 flex-col md:mt-8">
                <Heading id={titleId} className="text-2xl leading-tight font-semibold tracking-tight md:text-[1.75rem]">
                    <a
                        href={caseStudyUrl(project.slug)}
                        className="rounded-sm underline-offset-4 outline-none after:absolute after:inset-0 after:content-[''] group-hover/project:underline focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
                    >
                        {project.title}
                    </a>
                </Heading>
                {project.category && <p className="mt-1.5 text-sm text-muted-foreground">{project.category}</p>}
                <p className="mt-4 max-w-[56ch] leading-relaxed text-pretty">{project.description}</p>
                <div className="mt-auto pt-8">
                    <ProjectMetrics metrics={project.metrics} />
                    <span aria-hidden="true" className={cn(buttonVariants({ variant: 'outline' }), 'mt-8 max-md:h-11 group-hover/project:bg-accent')}>
                        {copy.open}
                    </span>
                </div>
            </div>
        </article>
    );
}
