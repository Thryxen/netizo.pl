import { LegalPage } from '@/components/legal/legal-page';
import { TERMS } from '@/components/legal/terms-copy';
import { localized, useCopy } from '@/lib/i18n';
import { usePageUrls } from '@/lib/site';
import type { TermsPageProps } from '@/types/legal';

const COPY = localized({
    pl: { privacy: 'Polityka prywatności' },
    en: { privacy: 'Privacy policy' },
});

/** Regulamin serwisu (/regulamin, /en/terms): the terms of the site's services, numbered like a Polish regulamin. */
export default function Terms({ effectiveDate }: TermsPageProps) {
    const copy = useCopy(COPY);
    const pageUrls = usePageUrls();

    return (
        <LegalPage
            document={useCopy(TERMS)}
            numbering="paragraph"
            effectiveDate={effectiveDate}
            otherDocument={{ href: pageUrls.privacy, label: copy.privacy }}
        />
    );
}
