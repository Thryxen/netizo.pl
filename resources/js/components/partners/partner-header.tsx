import { SubpageHeader } from '@/components/home/subpage-header';
import { localized, useCopy } from '@/lib/i18n';
import { type PartnerSection, usePartnerSections } from '@/lib/sections';

const COPY = localized({
    pl: {
        pageName: 'Program partnerski',
        sections: [
            { key: 'howItWorks', label: 'Jak to działa' },
            { key: 'calculator', label: 'Kalkulator' },
            { key: 'rules', label: 'Zasady' },
            { key: 'faq', label: 'FAQ' },
        ] as { key: PartnerSection; label: string }[],
        joinShort: 'Dołącz',
        join: 'Dołącz do programu',
    },
    en: {
        pageName: 'Partner program',
        sections: [
            { key: 'howItWorks', label: 'How it works' },
            { key: 'calculator', label: 'Calculator' },
            { key: 'rules', label: 'Terms' },
            { key: 'faq', label: 'FAQ' },
        ],
        joinShort: 'Join',
        join: 'Join the program',
    },
});

/** Header of the partner programme page; "Dołącz" has the button, so it is not among the section links. */
export function PartnerHeader() {
    const copy = useCopy(COPY);
    const sectionIds = usePartnerSections();

    return (
        <SubpageHeader
            pageName={copy.pageName}
            sections={copy.sections.map(({ key, label }) => ({ href: `#${sectionIds[key]}`, label }))}
            cta={{ href: `#${sectionIds.join}`, label: copy.join, shortLabel: copy.joinShort }}
        />
    );
}
