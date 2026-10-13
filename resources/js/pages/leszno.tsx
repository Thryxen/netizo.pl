import { ContactSection } from '@/components/home/contact-section';
import { DeferredCallbackDialog } from '@/components/home/deferred-callback-dialog';
import { HomeUiProvider } from '@/components/home/home-ui-context';
import { SiteFooter } from '@/components/home/site-footer';
import { SkipLink } from '@/components/home/skip-link';
import { AreaSection } from '@/components/leszno/area-section';
import { LESZNO_COPY } from '@/components/leszno/leszno-copy';
import { LesznoHeader } from '@/components/leszno/leszno-header';
import { LesznoScene } from '@/components/leszno/leszno-scene';
import { LocalProjectsSection } from '@/components/leszno/local-projects-section';
import { MeetingSection } from '@/components/leszno/meeting-section';
import { ReviewsSection } from '@/components/leszno/reviews-section';
import { MotionRoot } from '@/components/motion/motion-root';
import { OtherServicesSection } from '@/components/services/other-services-section';
import { PricingSection } from '@/components/services/pricing-section';
import { ServiceFaqSection } from '@/components/services/service-faq-section';
import { ServiceHero } from '@/components/services/service-hero';
import { useInPageAnchors } from '@/hooks/use-in-page-anchors';
import { useCopy } from '@/lib/i18n';
import { usePageUrls, useServiceLinks } from '@/lib/site';
import type { LesznoPageProps } from '@/types/services';

/**
 * Tworzenie stron internetowych w Lesznie (/tworzenie-stron-internetowych/leszno, /en/website-development/leszno): the
 * one page for the area we travel to, framed like the service pages. The hero (the meeting at the client's company),
 * the towns and the map, how a meeting runs, the websites page's tiers, the projects from the region, the testimonials,
 * the local FAQ, the other services and the contact section, asking for a meeting. No address in Leszno and no office
 * map: we come to the client.
 */
export default function Leszno({ offers, faq, projects, otherServices }: LesznoPageProps) {
    const copy = useCopy(LESZNO_COPY);
    const pageUrls = usePageUrls();
    const websitesLabel = useServiceLinks().find((link) => link.href === pageUrls.websites)?.label ?? '';
    useInPageAnchors();

    return (
        <MotionRoot>
            <HomeUiProvider initialContactTab="quick">
                <SkipLink />
                <LesznoHeader name={copy.name} cta={copy.headerCta} hasProjects={projects.length > 0} />
                <main id="main-content" tabIndex={-1} className="outline-none">
                    <ServiceHero
                        copy={copy}
                        scene={<LesznoScene className="absolute inset-0" />}
                        trail={[{ label: websitesLabel, href: pageUrls.websites }]}
                        contactTab="quick"
                        area={copy.area}
                    />
                    <AreaSection />
                    <MeetingSection />
                    <PricingSection pricing={copy.pricing} offers={offers} />
                    <LocalProjectsSection projects={projects} />
                    <ReviewsSection />
                    <ServiceFaqSection title={copy.faq.title} faq={faq} />
                    <OtherServicesSection services={otherServices} />
                    <ContactSection briefTypes={['website']} title={copy.contact.title} lead={copy.contact.lead} messagePlaceholder={copy.contact.messagePlaceholder} />
                </main>
                <SiteFooter homeHref={pageUrls.home} />
                <DeferredCallbackDialog />
            </HomeUiProvider>
        </MotionRoot>
    );
}
