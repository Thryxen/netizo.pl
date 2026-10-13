import { ExternalLink } from '@/components/home/external-link';
import { InfoLinkLabel } from '@/components/home/info-link-label';
import { LanguageSwitcher } from '@/components/home/language-switcher';
import { Logo } from '@/components/home/logo';
import { Container, Rivet } from '@/components/home/section';
import { SocialIcon } from '@/components/home/social-icon';
import { localized, useCopy } from '@/lib/i18n';
import { clientPanelUrl, company, contact, socialNetworkNames, useInfoLinks, usePageUrls, useServiceLinks, useSocialProfiles } from '@/lib/site';
import { cn } from '@/lib/utils';

const COPY = localized({
    pl: {
        home: 'Netizo – strona główna',
        tagline: 'Tworzymy strony WWW dla ambitnych. Zbudujmy to razem, od pomysłu do wdrożenia. Opieka techniczna, SEO i optymalizacja kosztów utrzymania.',
        services: 'Usługi',
        info: 'Informacje',
        clientPanel: 'Panel klienta',
        contact: 'Kontakt',
        meetings: 'Spotkania w Lesznie',
        nip: 'NIP',
        regon: 'REGON',
        socials: 'Obserwuj nas',
    },
    en: {
        home: 'Netizo – home page',
        tagline: 'We build websites for ambitious companies. Let’s build it together, from idea to launch. Technical care, SEO and lower running costs.',
        services: 'Services',
        info: 'Information',
        clientPanel: 'Client portal',
        contact: 'Contact',
        meetings: 'Meetings in Leszno',
        nip: 'Tax ID (NIP)',
        regon: 'REGON',
        socials: 'Follow us',
    },
});

/** Links are 44px tall touch targets below md; from md they collapse to the text line. */
const linkClass = cn(
    'inline-flex min-h-11 items-center rounded-sm text-muted-foreground transition-colors hover:text-foreground md:min-h-0',
    'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
);

/**
 * Item of the registry line in the bottom bar, divided from the previous one by a hairline. The list is shifted left
 * under an overflow clip, so the item that starts a row (the first one, or the first after a wrap) loses its divider.
 */
const registryItemClass = '-ml-px border-l border-border px-3';

type SiteFooterProps = {
    /** Where the logo leads: the top of the page on the home page (default), the home page (of the page's language) elsewhere. */
    homeHref?: string;
};

export function SiteFooter({ homeHref = '#' }: SiteFooterProps) {
    const copy = useCopy(COPY);
    const infoLinks = useInfoLinks();
    const serviceLinks = useServiceLinks();
    const socialProfiles = useSocialProfiles();
    const pageUrls = usePageUrls();

    return (
        <footer className="border-t border-border">
            <Container className="py-14 md:py-16">
                <Rivet side="left" />
                <Rivet side="right" />
                <div className="grid gap-10 sm:grid-cols-4 lg:grid-cols-12 lg:gap-8">
                    <div className="sm:col-span-4 lg:col-span-4">
                        <a href={homeHref} aria-label={copy.home} className={cn(linkClass, '-ml-1 p-1 text-foreground')}>
                            <Logo className="h-10" />
                        </a>
                        <p className="mt-4 max-w-md leading-relaxed text-pretty text-muted-foreground">{copy.tagline}</p>
                    </div>

                    <nav aria-labelledby="footer-services-heading" className="lg:col-span-2">
                        <h2 id="footer-services-heading" className="text-sm font-medium">
                            {copy.services}
                        </h2>
                        <ul className="mt-2 flex flex-col text-sm md:mt-4 md:gap-3">
                            {serviceLinks.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href} className={linkClass}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-labelledby="footer-info-heading" className="lg:col-span-2">
                        <h2 id="footer-info-heading" className="text-sm font-medium">
                            {copy.info}
                        </h2>
                        <ul className="mt-2 flex flex-col text-sm md:mt-4 md:gap-3">
                            <li>
                                <ExternalLink href={clientPanelUrl} rel="noopener" className={linkClass}>
                                    {copy.clientPanel}
                                </ExternalLink>
                            </li>
                            {infoLinks.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href} hrefLang={link.hrefLang} className={linkClass}>
                                        <InfoLinkLabel link={link} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="lg:col-span-2">
                        <h2 className="text-sm font-medium">{copy.contact}</h2>
                        <ul className="mt-2 flex flex-col text-sm md:mt-4 md:gap-3">
                            <li>
                                <a href={pageUrls.leszno} className={linkClass}>
                                    {copy.meetings}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${contact.email}`} className={linkClass}>
                                    {contact.email}
                                </a>
                            </li>
                            <li>
                                <a href={contact.phone.href} className={cn(linkClass, 'whitespace-nowrap')}>
                                    {contact.phone.display}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {socialProfiles.length > 0 && (
                        <div className="lg:col-span-2">
                            <h2 className="text-sm font-medium">{copy.socials}</h2>
                            <ul className="mt-2 flex flex-col text-sm md:mt-4 md:gap-3">
                                {socialProfiles.map(({ network, url }) => (
                                    <li key={network}>
                                        <ExternalLink href={url} className={cn(linkClass, 'gap-2')}>
                                            <SocialIcon network={network} className="size-4" />
                                            {socialNetworkNames[network]}
                                        </ExternalLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </Container>

            <div className="border-t border-border">
                <Container className="flex flex-wrap items-center justify-between gap-4 py-6">
                    <Rivet side="left" />
                    <Rivet side="right" />
                    <div className="overflow-hidden">
                        <ul className="-ml-3 flex flex-wrap gap-y-1 text-sm text-muted-foreground">
                            {/* The SSR server and the browser may disagree on the year around New Year (or across time zones). */}
                            <li suppressHydrationWarning className={registryItemClass}>
                                © {new Date().getFullYear()} {company.name}
                            </li>
                            <li className={registryItemClass}>
                                {company.street}, {company.postalCode} {company.city}
                            </li>
                            <li className={cn(registryItemClass, 'tabular-nums')}>
                                {copy.nip} {company.nip}
                            </li>
                            <li className={cn(registryItemClass, 'tabular-nums')}>
                                {copy.regon} {company.regon}
                            </li>
                        </ul>
                    </div>
                    <LanguageSwitcher variant="link" />
                </Container>
            </div>
        </footer>
    );
}
