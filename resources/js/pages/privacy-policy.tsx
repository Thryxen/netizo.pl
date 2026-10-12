import { CookieSettingsButton } from '@/components/legal/cookie-table';
import { DataRoutesSection } from '@/components/legal/data-routes-section';
import { LegalPage } from '@/components/legal/legal-page';
import { PRIVACY_POLICY } from '@/components/legal/privacy-policy-copy';
import { localized, useCopy } from '@/lib/i18n';
import { usePageUrls } from '@/lib/site';
import type { PrivacyPolicyPageProps } from '@/types/legal';

const COPY = localized({
    pl: { terms: 'Regulamin serwisu' },
    en: { terms: 'Terms of service' },
});

/**
 * Polityka prywatności (/polityka-prywatnosci, /en/privacy-policy): where the data from each form goes, at a glance,
 * then the full policy. The cookie table and the cookie settings button read the page's props.
 */
export default function PrivacyPolicy({ effectiveDate }: PrivacyPolicyPageProps) {
    const copy = useCopy(COPY);
    const pageUrls = usePageUrls();

    return (
        <LegalPage
            document={useCopy(PRIVACY_POLICY)}
            numbering="decimal"
            effectiveDate={effectiveDate}
            heroActions={<CookieSettingsButton />}
            summary={<DataRoutesSection />}
            otherDocument={{ href: pageUrls.terms, label: copy.terms }}
        />
    );
}
