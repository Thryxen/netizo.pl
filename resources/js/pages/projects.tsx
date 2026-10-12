import { SiteFooter } from '@/components/home/site-footer';
import { SkipLink } from '@/components/home/skip-link';
import { MotionRoot } from '@/components/motion/motion-root';
import { ProjectGrid } from '@/components/projects/project-grid';
import { ProjectsCtaSection } from '@/components/projects/projects-cta-section';
import { ProjectsHeader } from '@/components/projects/projects-header';
import { ProjectsHero } from '@/components/projects/projects-hero';
import { useInPageAnchors } from '@/hooks/use-in-page-anchors';
import { usePageUrls } from '@/lib/site';
import type { ProjectsPageProps } from '@/types/projects';

/**
 * Realizacje (/realizacje, /en/projects): every active project of the panel as a card leading to its case study.
 */
export default function Projects({ projects }: ProjectsPageProps) {
    const pageUrls = usePageUrls();
    useInPageAnchors();

    return (
        <MotionRoot>
            <SkipLink />
            <ProjectsHeader />
            <main id="main-content" tabIndex={-1} className="outline-none">
                <ProjectsHero />
                <ProjectGrid projects={projects} />
                <ProjectsCtaSection />
            </main>
            <SiteFooter homeHref={pageUrls.home} />
        </MotionRoot>
    );
}
