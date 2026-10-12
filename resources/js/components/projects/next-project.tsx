import { ProjectFrame } from '@/components/home/project-frame';
import { Container, Rivet } from '@/components/home/section';
import { buttonVariants } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useCaseStudySections } from '@/lib/sections';
import { useCaseStudyUrl } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { ProjectSummary } from '@/types/projects';
import { titleFitStyle } from './title-fit';

const COPY = localized({
    pl: { title: 'Następna realizacja', open: 'Zobacz case study' },
    en: { title: 'Next project', open: 'See the case study' },
});

/**
 * Następna realizacja (#nastepna-realizacja, #next-project): one large link to the next case study in the panel's
 * order, its name set big beside its screenshot window. The window scrolls the site while the link is hovered or has
 * keyboard focus (`group/frame`, `group/project`, as on the home page).
 */
export function NextProject({ project }: { project: ProjectSummary | null }) {
    const copy = useCopy(COPY);
    const sectionId = useCaseStudySections().next;
    const caseStudyUrl = useCaseStudyUrl();

    if (!project) {
        return null;
    }

    return (
        <section id={sectionId} aria-labelledby={`${sectionId}-heading`} className="relative border-t border-border">
            <Container className="py-16 md:py-24">
                <Rivet side="left" />
                <Rivet side="right" />
                <h2 id={`${sectionId}-heading`} className="text-sm font-medium text-muted-foreground">
                    {copy.title}
                </h2>
                <div className="group/project group/frame mt-6 md:mt-8">
                    <a
                        href={caseStudyUrl(project.slug)}
                        className="grid gap-10 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:grid-cols-2 lg:items-center lg:gap-16"
                    >
                        <div className="min-w-0 [container-type:inline-size]">
                            <p
                                style={titleFitStyle(project.title)}
                                className="text-[max(1.75rem,min(clamp(2.75rem,8vw,5rem),var(--title-fit)))] leading-[0.95] font-semibold tracking-[-0.05em] text-balance break-words decoration-2 underline-offset-[0.14em] group-hover/project:underline lg:text-[max(1.75rem,min(clamp(3rem,5.2vw,5rem),var(--title-fit)))]"
                            >
                                {project.title}
                            </p>
                            {project.category && <p className="mt-5 text-lg text-muted-foreground">{project.category}</p>}
                            <p className="mt-6 max-w-md leading-relaxed text-pretty text-muted-foreground">{project.description}</p>
                            {/* Looks like a button; the whole block is the link. */}
                            <span className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'mt-8 max-md:h-11 group-hover/project:bg-accent')}>{copy.open}</span>
                        </div>
                        <ProjectFrame project={project} alt="" />
                    </a>
                </div>
            </Container>
        </section>
    );
}
