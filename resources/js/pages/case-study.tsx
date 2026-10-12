import { SiteFooter } from '@/components/home/site-footer';
import { SkipLink } from '@/components/home/skip-link';
import { MotionRoot } from '@/components/motion/motion-root';
import { CaseStudyHero } from '@/components/projects/case-study-hero';
import { CaseStudyResults } from '@/components/projects/case-study-results';
import { CaseStudyStory } from '@/components/projects/case-study-story';
import { NextProject } from '@/components/projects/next-project';
import { ProjectsCtaSection } from '@/components/projects/projects-cta-section';
import { ProjectsHeader } from '@/components/projects/projects-header';
import { useInPageAnchors } from '@/hooks/use-in-page-anchors';
import { usePageUrls } from '@/lib/site';
import type { CaseStudyPageProps } from '@/types/projects';

/**
 * A project's case study (/realizacje/{slug}, /en/projects/{slug}): the hero over the site's own colours, the results,
 * the story told beside a window scrolling through the whole site, the challenges with their solutions, the next
 * project and the call to action.
 */
export default function CaseStudy({ project, nextProject }: CaseStudyPageProps) {
    const pageUrls = usePageUrls();
    useInPageAnchors();

    return (
        <MotionRoot>
            <SkipLink />
            <ProjectsHeader project={project} />
            <main id="main-content" tabIndex={-1} className="outline-none">
                <CaseStudyHero project={project} />
                <CaseStudyResults metrics={project.metrics} />
                <CaseStudyStory project={project} />
                <NextProject project={nextProject} />
                <ProjectsCtaSection />
            </main>
            <SiteFooter homeHref={pageUrls.home} />
        </MotionRoot>
    );
}
