import { usePage } from '@inertiajs/react';
import { useLocale } from '@/lib/i18n';
import { formatLegalDate } from './legal-format';

/** The day the current legal document took effect (its page's `effectiveDate` prop), in words. */
export function EffectiveDate() {
    const { effectiveDate } = usePage<{ effectiveDate: string }>().props;

    return <time dateTime={effectiveDate}>{formatLegalDate(effectiveDate, useLocale())}</time>;
}
