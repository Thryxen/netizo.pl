import { ContactSection } from '@/components/home/contact-section';
import { DeferredCallbackDialog } from '@/components/home/deferred-callback-dialog';
import { HomeUiProvider } from '@/components/home/home-ui-context';
import { SiteFooter } from '@/components/home/site-footer';
import { SkipLink } from '@/components/home/skip-link';
import { FeaturesSection } from '@/components/metin2cms/features-section';
import { LaunchSection } from '@/components/metin2cms/launch-section';
import { METIN2CMS_COPY } from '@/components/metin2cms/metin2cms-copy';
import { Metin2CmsHeader } from '@/components/metin2cms/metin2cms-header';
import { Metin2CmsScene } from '@/components/metin2cms/metin2cms-scene';
import { PerformanceSection } from '@/components/metin2cms/performance-section';
import { PillarsSection } from '@/components/metin2cms/pillars-section';
import { ShowcaseSection } from '@/components/metin2cms/showcase-section';
import { SystemSection } from '@/components/metin2cms/system-section';
import { ThreatsSection } from '@/components/metin2cms/threats-section';
import { TrustedSection } from '@/components/metin2cms/trusted-section';
import { MotionRoot } from '@/components/motion/motion-root';
import { GuideSection } from '@/components/services/guide-section';
import { ServiceFaqSection } from '@/components/services/service-faq-section';
import { ServiceHero } from '@/components/services/service-hero';
import { useInPageAnchors } from '@/hooks/use-in-page-anchors';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { usePageUrls } from '@/lib/site';
import type { FaqItem } from '@/types/home';

/** Props of the Metin2 CMS page (Metin2CmsController): its FAQ (lang/{pl,en}/metin2cms.php). */
type Metin2CmsPageProps = { faq: FaqItem[] };

/**
 * Metin2 CMS (/metin2cms, /en/metin2cms): the ready-made system for Metin2 private servers, framed like the service
 * pages, with an ink drawing of the game's own models as its hero. The hero, whose servers trust it, the three parts of the system, what is
 * included and what we add to order, the four foundations as the game's classes, how little the website asks of the
 * game database, the threats it answers, the longer read on choosing a CMS (the service pages' guide, without a
 * photo), the four steps to launch, and only then the deployments in
 * one compact card, the FAQ and the home page's contact section.
 */
export default function Metin2Cms({ faq }: Metin2CmsPageProps) {
    const copy = useCopy(METIN2CMS_COPY);
    const pageUrls = usePageUrls();
    const sections = useMetin2CmsSections();
    useInPageAnchors();

    return (
        <MotionRoot>
            <HomeUiProvider initialContactTab="quick">
                <SkipLink />
                <Metin2CmsHeader />
                <main id="main-content" tabIndex={-1} className="outline-none">
                    <ServiceHero
                        copy={copy}
                        scene={<Metin2CmsScene className="absolute inset-0" />}
                        contactTab="quick"
                        area={copy.hero.area}
                        secondary={{ label: copy.hero.secondary, href: `#${sections.system}` }}
                    />
                    <TrustedSection />
                    <SystemSection />
                    <FeaturesSection />
                    <PillarsSection />
                    <PerformanceSection />
                    <ThreatsSection />
                    <GuideSection guide={copy.guide} />
                    <LaunchSection />
                    <ShowcaseSection />
                    <ServiceFaqSection title={copy.faq.title} faq={faq} />
                    <ContactSection title={copy.contact.title} lead={copy.contact.lead} messagePlaceholder={copy.contact.messagePlaceholder} />
                </main>
                <SiteFooter homeHref={pageUrls.home} />
                <DeferredCallbackDialog />
            </HomeUiProvider>
        </MotionRoot>
    );
}
