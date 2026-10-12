import { type Locale, localeTags } from '@/lib/i18n';

/** A `YYYY-MM-DD` date in words: "11 października 2026", "October 11, 2026" (UTC, so the server and browser agree). */
export function formatLegalDate(date: string, locale: Locale): string {
    return new Intl.DateTimeFormat(localeTags[locale], { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}

const MINUTES_PER_UNIT = [
    ['year', 365 * 24 * 60],
    ['day', 24 * 60],
    ['hour', 60],
    ['minute', 1],
] as const;

/** A cookie lifetime in minutes, in the largest whole unit: "2 godziny", "1 rok", "2 lata" / "2 hours", "1 year". */
export function formatCookieDuration(minutes: number, locale: Locale): string {
    const [unit, size] = MINUTES_PER_UNIT.find(([, unitMinutes]) => minutes % unitMinutes === 0) ?? MINUTES_PER_UNIT[3];

    return new Intl.NumberFormat(localeTags[locale], { style: 'unit', unit, unitDisplay: 'long' }).format(minutes / size);
}
