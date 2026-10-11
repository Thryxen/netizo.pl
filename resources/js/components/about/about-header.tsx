import { SubpageHeader } from '@/components/home/subpage-header';
import { localized, useCopy } from '@/lib/i18n';
import { type AboutSection, useAboutSections, useHomeSections } from '@/lib/sections';
import { usePageUrls } from '@/lib/site';

const COPY = localized({
    pl: {
        pageName: 'O nas',
        sections: [
            { key: 'team', label: 'Zespół' },
            { key: 'howWeWork', label: 'Jak pracujemy' },
            { key: 'company', label: 'Dane firmy' },
        ] as { key: AboutSection; label: string }[],
        quoteShort: 'Wycena',
        quote: 'Wyceń projekt',
    },
    en: {
        pageName: 'About us',
        sections: [
            { key: 'team', label: 'Team' },
            { key: 'howWeWork', label: 'How we work' },
            { key: 'company', label: 'Company details' },
        ],
        quoteShort: 'Quote',
        quote: 'Get a quote',
    },
});

/** Header of the about page: the button leads to the contact section of the home page. */
export function AboutHeader() {
    const copy = useCopy(COPY);
    const sectionIds = useAboutSections();
    const homeSections = useHomeSections();
    const pageUrls = usePageUrls();

    return (
        <SubpageHeader
            pageName={copy.pageName}
            sections={copy.sections.map(({ key, label }) => ({ href: `#${sectionIds[key]}`, label }))}
            cta={{ href: `${pageUrls.home}#${homeSections.contact}`, label: copy.quote, shortLabel: copy.quoteShort }}
        />
    );
}
