import { AboutCtaSection } from '@/components/about/about-cta-section';
import { AboutHeader } from '@/components/about/about-header';
import { AboutHero } from '@/components/about/about-hero';
import { AboutProjectsSection } from '@/components/about/about-projects-section';
import { CompanySection } from '@/components/about/company-section';
import { HowWeWorkSection } from '@/components/about/how-we-work-section';
import { StorySection } from '@/components/about/story-section';
import { TeamSection } from '@/components/about/team-section';
import { TestimonialsSection } from '@/components/about/testimonials-section';
import { SiteFooter } from '@/components/home/site-footer';
import { SkipLink } from '@/components/home/skip-link';
import { MotionRoot } from '@/components/motion/motion-root';
import { useInPageAnchors } from '@/hooks/use-in-page-anchors';
import { usePageUrls } from '@/lib/site';
import type { AboutPageProps } from '@/types/about';

/**
 * O nas (/o-nas, /en/about): the people behind Netizo, their story, how a project runs, selected projects, client
 * testimonials and the company details. The story and the testimonials show only real entries (samples while
 * previewing locally), so on the site they appear once they are filled in.
 */
export default function About({ projects, previewSamples }: AboutPageProps) {
    const pageUrls = usePageUrls();
    useInPageAnchors();

    return (
        <MotionRoot>
            {/* Unframed (app.css): no rails, rivets or section hairlines; the sections use rounded cards. */}
            <div data-unframed="">
            <SkipLink />
            <AboutHeader />
            <main id="main-content" tabIndex={-1} className="outline-none">
                <AboutHero />
                <TeamSection />
                <StorySection previewSamples={previewSamples} />
                <HowWeWorkSection />
                <AboutProjectsSection projects={projects} />
                <TestimonialsSection previewSamples={previewSamples} />
                <CompanySection />
                <AboutCtaSection />
            </main>
            <SiteFooter homeHref={pageUrls.home} />
            </div>
        </MotionRoot>
    );
}
