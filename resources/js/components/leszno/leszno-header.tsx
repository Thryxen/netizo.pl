import { SubpageHeader } from '@/components/home/subpage-header';
import { localized, useCopy } from '@/lib/i18n';
import { useHomeSections, useLesznoSections } from '@/lib/sections';

const COPY = localized({
    pl: { area: 'Dojazd', pricing: 'Cennik', projects: 'Realizacje', reviews: 'Opinie', faq: 'FAQ' },
    en: { area: 'Where we meet', pricing: 'Pricing', projects: 'Projects', reviews: 'Reviews', faq: 'FAQ' },
});

type LesznoHeaderProps = {
    /** "Leszno i okolice" beside the logo. */
    name: string;
    cta: { label: string; shortLabel: string };
    /** The page shows projects from the region (else the header does not link to a section that is not there). */
    hasProjects: boolean;
};

/**
 * Header of the Leszno page: its name beside the logo, its sections (lg+) and the button that leads to the contact
 * section on this page, to book a meeting.
 */
export function LesznoHeader({ name, cta, hasProjects }: LesznoHeaderProps) {
    const copy = useCopy(COPY);
    const sections = useLesznoSections();
    const contactId = useHomeSections().contact;

    return (
        <SubpageHeader
            pageName={name}
            sections={[
                { href: `#${sections.area}`, label: copy.area },
                { href: `#${sections.pricing}`, label: copy.pricing },
                ...(hasProjects ? [{ href: `#${sections.projects}`, label: copy.projects }] : []),
                { href: `#${sections.reviews}`, label: copy.reviews },
                { href: `#${sections.faq}`, label: copy.faq },
            ]}
            cta={{ href: `#${contactId}`, ...cta }}
        />
    );
}
