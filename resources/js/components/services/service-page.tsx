import type { ComponentType, ReactNode } from 'react';
import { ContactSection } from '@/components/home/contact-section';
import { DeferredCallbackDialog } from '@/components/home/deferred-callback-dialog';
import { HomeUiProvider } from '@/components/home/home-ui-context';
import { SiteFooter } from '@/components/home/site-footer';
import { SkipLink } from '@/components/home/skip-link';
import { MotionRoot } from '@/components/motion/motion-root';
import { useInPageAnchors } from '@/hooks/use-in-page-anchors';
import { type Localized, useCopy } from '@/lib/i18n';
import type { PhotoName } from '@/lib/photos';
import { usePageUrls } from '@/lib/site';
import type { ServicePageProps } from '@/types/services';
import { GuideSection } from './guide-section';
import { OtherServicesSection } from './other-services-section';
import { PricingSection } from './pricing-section';
import type { ServiceCopy } from './service-copy';
import { ServiceFaqSection } from './service-faq-section';
import { ServiceHeader } from './service-header';
import { ServiceHero } from './service-hero';
import { ServiceProcessSection } from './service-process-section';
import { ServiceProjectsSection } from './service-projects-section';
import { ScopeSection } from './scope-section';

type ServicePageTemplateProps = ServicePageProps & {
    copy: Localized<ServiceCopy>;
    /** The hero's photo scene (absolutely filling the stage). */
    scene: ReactNode;
    /** The scope's vignettes, one per item in the copy's order. */
    vignettes: ComponentType[];
    /** The guide's photo. */
    guidePhoto: PhotoName;
    /** The brief's project types checked from the start (brief-options.ts values). */
    briefTypes: string[];
};

/**
 * A service page (pages/services/*.tsx): the hero with its photo scene and figures, what the service includes, the
 * tiers over the price scale, the four stages, the projects of the panel tagged with the service, the guide, the FAQ,
 * the other services and the home page's contact section (brief and quick message, the callback dialog), framed like
 * the home page. Each page passes its own copy, scene and vignettes, so its chunk carries only its own.
 */
export function ServicePage({ offers, faq, projects, otherServices, copy, scene, vignettes, guidePhoto, briefTypes }: ServicePageTemplateProps) {
    const service = useCopy(copy);
    const pageUrls = usePageUrls();
    useInPageAnchors();

    return (
        <MotionRoot>
            <HomeUiProvider>
                <SkipLink />
                <ServiceHeader name={service.name} quote={service.hero.quote} quoteShort={service.hero.quoteShort} hasProjects={projects.length > 0} />
                <main id="main-content" tabIndex={-1} className="outline-none">
                    <ServiceHero copy={service} scene={scene} />
                    <ScopeSection scope={service.scope} vignettes={vignettes} />
                    <PricingSection pricing={service.pricing} offers={offers} />
                    <ServiceProcessSection process={service.process} artifacts={service.processArtifacts} />
                    <ServiceProjectsSection title={service.projects.title} projects={projects} />
                    <GuideSection guide={service.guide} photoName={guidePhoto} />
                    <ServiceFaqSection title={service.faq.title} faq={faq} />
                    <OtherServicesSection services={otherServices} />
                    <ContactSection briefTypes={briefTypes} />
                </main>
                <SiteFooter homeHref={pageUrls.home} />
                <DeferredCallbackDialog />
            </HomeUiProvider>
        </MotionRoot>
    );
}
