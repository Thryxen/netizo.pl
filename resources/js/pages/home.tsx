import { CallbackFab } from '@/components/home/callback-fab';
import { ClientsSection } from '@/components/home/clients-section';
import { ContactSection } from '@/components/home/contact-section';
import { FaqSection } from '@/components/home/faq-section';
import { FounderQuoteSection } from '@/components/home/founder-quote-section';
import { Hero } from '@/components/home/hero';
import { HomeUiProvider, useHomeUi } from '@/components/home/home-ui-context';
import { MissionSection } from '@/components/home/mission-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { PanelSection } from '@/components/home/panel-section';
import { PartnerCtaSection } from '@/components/home/partner-cta-section';
import { ProcessSection } from '@/components/home/process-section';
import { ProjectsSection } from '@/components/home/projects-section';
import { ServicesSection } from '@/components/home/services-section';
import { SiteFooter } from '@/components/home/site-footer';
import { SkipLink } from '@/components/home/skip-link';
import { SiteHeader } from '@/components/home/site-header';
import { MotionRoot } from '@/components/motion/motion-root';
import { useInPageAnchors } from '@/hooks/use-in-page-anchors';
import { deferred, useDeferredComponent } from '@/lib/deferred';
import type { HomePageProps } from '@/types/home';

const callbackDialog = deferred(() => import('@/components/home/callback-dialog').then((module) => module.CallbackDialog));

/** The callback dialog's code is fetched once the page is idle, or on the first open if that comes sooner. */
function DeferredCallbackDialog() {
    const { callbackOpen } = useHomeUi();
    const CallbackDialog = useDeferredComponent(callbackDialog, callbackOpen);

    return CallbackDialog ? <CallbackDialog /> : null;
}

export default function Home({ projects, clients, faq }: HomePageProps) {
    useInPageAnchors();

    return (
        <MotionRoot>
            <HomeUiProvider>
                <SkipLink />
                <SiteHeader />
                <main id="main-content" tabIndex={-1} className="outline-none">
                    <Hero />
                    <ServicesSection />
                    <ProjectsSection projects={projects} />
                    <MissionSection />
                    <ClientsSection clients={clients} />
                    <FounderQuoteSection />
                    <ProcessSection />
                    <PanelSection />
                    <FaqSection faq={faq} />
                    <PartnerCtaSection />
                    <NewsletterSection />
                    <ContactSection />
                </main>
                <SiteFooter />
                <CallbackFab />
                <DeferredCallbackDialog />
            </HomeUiProvider>
        </MotionRoot>
    );
}
