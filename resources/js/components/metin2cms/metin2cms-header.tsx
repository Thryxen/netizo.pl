import { SubpageHeader } from '@/components/home/subpage-header';
import { useCopy } from '@/lib/i18n';
import { useHomeSections, useMetin2CmsSections, useServiceSections } from '@/lib/sections';
import { METIN2CMS_COPY } from './metin2cms-copy';

/**
 * Header of the Metin2 CMS page: its name beside the logo, its sections (lg+) and the button that leads to the contact
 * section on this page.
 */
export function Metin2CmsHeader() {
    const copy = useCopy(METIN2CMS_COPY);
    const sections = useMetin2CmsSections();
    const faqId = useServiceSections().faq;
    const contactId = useHomeSections().contact;

    return (
        <SubpageHeader
            pageName={copy.name}
            sections={[
                { href: `#${sections.system}`, label: copy.header.system },
                { href: `#${sections.features}`, label: copy.header.features },
                { href: `#${sections.performance}`, label: copy.header.performance },
                { href: `#${sections.caseStudy}`, label: copy.header.caseStudy },
                { href: `#${faqId}`, label: copy.header.faq },
            ]}
            cta={{ href: `#${contactId}`, label: copy.hero.quote, shortLabel: copy.hero.quoteShort }}
        />
    );
}
