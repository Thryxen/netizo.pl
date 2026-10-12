import { SubpageHeader } from '@/components/home/subpage-header';
import { localized, useCopy } from '@/lib/i18n';
import { useHomeSections, useServiceSections } from '@/lib/sections';

const COPY = localized({
    pl: { scope: 'Zakres', pricing: 'Cennik', projects: 'Realizacje', faq: 'FAQ' },
    en: { scope: 'What’s included', pricing: 'Pricing', projects: 'Projects', faq: 'FAQ' },
});

type ServiceHeaderProps = {
    /** The service's name beside the logo. */
    name: string;
    quote: string;
    quoteShort: string;
    /** The page shows its projects (else the header does not link to a section that is not there). */
    hasProjects: boolean;
};

/**
 * Header of a service page: the service's name beside the logo, its sections (lg+) and the quote button, which leads to
 * the contact section on this page (the brief, with the service's project type checked).
 */
export function ServiceHeader({ name, quote, quoteShort, hasProjects }: ServiceHeaderProps) {
    const copy = useCopy(COPY);
    const sections = useServiceSections();
    const contactId = useHomeSections().contact;

    return (
        <SubpageHeader
            pageName={name}
            sections={[
                { href: `#${sections.scope}`, label: copy.scope },
                { href: `#${sections.pricing}`, label: copy.pricing },
                ...(hasProjects ? [{ href: `#${sections.projects}`, label: copy.projects }] : []),
                { href: `#${sections.faq}`, label: copy.faq },
            ]}
            cta={{ href: `#${contactId}`, label: quote, shortLabel: quoteShort }}
        />
    );
}
