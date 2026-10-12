import { Handshake } from 'lucide-react';
import { LegalPage } from '@/components/legal/legal-page';
import { PARTNER_TERMS } from '@/components/legal/partner-terms-copy';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { usePageUrls } from '@/lib/site';
import type { PartnerTermsPageProps } from '@/types/legal';

const COPY = localized({
    pl: { programme: 'Strona programu', privacy: 'Polityka prywatności' },
    en: { programme: 'Program page', privacy: 'Privacy policy' },
});

/**
 * Regulamin programu partnerskiego (/partnerzy/regulamin, /en/partners/terms): the binding terms of the partner
 * programme, numbered like a Polish regulamin; the hero leads back to the programme page.
 */
export default function PartnerTerms({ effectiveDate }: PartnerTermsPageProps) {
    const copy = useCopy(COPY);
    const pageUrls = usePageUrls();

    return (
        <LegalPage
            document={useCopy(PARTNER_TERMS)}
            numbering="paragraph"
            effectiveDate={effectiveDate}
            heroActions={
                <Button variant="outline" className="max-md:h-11" asChild>
                    <a href={pageUrls.partners}>
                        <Handshake aria-hidden="true" />
                        {copy.programme}
                    </a>
                </Button>
            }
            otherDocument={{ href: pageUrls.privacy, label: copy.privacy }}
        />
    );
}
