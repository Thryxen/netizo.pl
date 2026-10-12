import { Photo } from '@/components/home/photo';
import { PLACEHOLDER_DARK, PLACEHOLDER_LIGHT } from '@/components/home/project-frame';
import { Section, SectionHeading } from '@/components/home/section';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useAboutSections } from '@/lib/sections';
import { useCaseStudyUrl, usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { AboutProject } from '@/types/about';
import { CARD } from './card';

const COPY = localized({
    pl: {
        title: 'Wybrane realizacje',
        lead: 'Kilka projektów, które prowadziliśmy od rozmowy do wdrożenia. Wszystkie, z opisem wyzwań, rozwiązań i wyników, są w realizacjach.',
        open: 'Zobacz case study',
        all: 'Wszystkie realizacje',
    },
    en: {
        title: 'Selected projects',
        lead: 'A few projects we ran from the first call to the launch. All of them, with the challenges, solutions and results, are on the projects page.',
        open: 'See the case study',
        all: 'All projects',
    },
});

/** Intrinsic size of a screenshot frame: 16:10, cropped to the top of the page. */
const SCREENSHOT_WIDTH = 1600;
const SCREENSHOT_HEIGHT = 1000;

type AboutProjectsSectionProps = {
    projects: AboutProject[];
};

/**
 * Realizacje (#realizacje, #projects): the first projects of the panel's order as cards, the top of each screenshot in a
 * 16:10 frame, each leading to its case study, and a link to the list of all of them (/realizacje).
 */
export function AboutProjectsSection({ projects }: AboutProjectsSectionProps) {
    const copy = useCopy(COPY);
    const sectionId = useAboutSections().projects;
    const pageUrls = usePageUrls();
    const caseStudyUrl = useCaseStudyUrl();

    if (projects.length === 0) {
        return null;
    }

    return (
        <Section id={sectionId} labelledBy={`${sectionId}-heading`}>
            <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
                <SectionHeading id={`${sectionId}-heading`} title={copy.title} lead={copy.lead} className="mb-0 md:mb-0" />
                <Button variant="outline" size="lg" className="max-md:h-11" asChild>
                    <a href={pageUrls.projects}>{copy.all}</a>
                </Button>
            </div>

            <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
                {projects.map((project) => (
                    <li key={project.id} className={cn(CARD, 'flex flex-col overflow-hidden')}>
                        {project.thumbnailUrl ? (
                            <Photo
                                src={project.thumbnailUrl}
                                alt=""
                                width={SCREENSHOT_WIDTH}
                                height={SCREENSHOT_HEIGHT}
                                className="aspect-[16/10] border-b border-border"
                                imgClassName="object-top"
                            />
                        ) : (
                            <div aria-hidden="true" className="relative aspect-[16/10] overflow-hidden border-b border-border bg-muted">
                                <img src={PLACEHOLDER_LIGHT} alt="" loading="lazy" decoding="async" className="size-full object-cover dark:hidden" />
                                <img src={PLACEHOLDER_DARK} alt="" loading="lazy" decoding="async" className="hidden size-full object-cover dark:block" />
                            </div>
                        )}
                        <div className="flex flex-1 flex-col p-6 md:p-7">
                            <p className="text-sm text-muted-foreground">{project.category}</p>
                            <h3 className="mt-1 text-xl font-semibold tracking-[-0.02em]">{project.title}</h3>
                            <p className="mt-3 line-clamp-3 leading-relaxed text-pretty text-muted-foreground">{project.description}</p>
                            <a
                                href={caseStudyUrl(project.slug)}
                                className="mt-auto inline-flex min-h-11 items-center self-start pt-4 text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 md:min-h-0"
                            >
                                {copy.open}
                                <span className="sr-only">: {project.title}</span>
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
