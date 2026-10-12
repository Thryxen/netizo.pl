import { usePage } from '@inertiajs/react';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { localized, useCopy, useLocale } from '@/lib/i18n';
import type { ListedCookie, PrivacyPolicyPageProps } from '@/types/legal';
import { formatCookieDuration } from './legal-format';

const COPY = localized({
    pl: {
        caption: 'Pliki cookie zapisywane przez netizo.pl',
        name: 'Nazwa',
        purpose: 'Do czego służy',
        duration: 'Ile działa',
        categories: {
            essentials: 'Niezbędne: działają bez zgody',
            analytics: 'Analityczne: tylko po Twojej zgodzie',
        } as Record<string, string>,
        settings: 'Zmień ustawienia cookies',
    },
    en: {
        caption: 'Cookies set by netizo.pl',
        name: 'Name',
        purpose: 'What it does',
        duration: 'Lifetime',
        categories: {
            essentials: 'Essential: set without consent',
            analytics: 'Analytics: only with your consent',
        },
        settings: 'Change cookie settings',
    },
});

/** The banner's cookies by category, in the order the banner lists them. */
function groupByCategory(cookies: ListedCookie[]): [string, ListedCookie[]][] {
    const groups = new Map<string, ListedCookie[]>();

    cookies.forEach((cookie) => groups.set(cookie.category, [...(groups.get(cookie.category) ?? []), cookie]));

    return [...groups];
}

/**
 * The cookies of the site as the cookie banner lists them (LegalPageController::cookies()), so the table follows the
 * banner: turning Google Analytics off removes its rows too.
 */
export function CookieTable() {
    const copy = useCopy(COPY);
    const locale = useLocale();
    const { cookies } = usePage<PrivacyPolicyPageProps>().props;

    return (
        <div className="overflow-x-auto border border-border bg-card">
            <table className="w-full text-left text-sm leading-snug">
                <caption className="sr-only">{copy.caption}</caption>
                <thead className="bg-muted/60 text-foreground">
                    <tr>
                        <th scope="col" className="w-[34%] px-4 py-3 font-medium">
                            {copy.name}
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium">
                            {copy.purpose}
                        </th>
                        <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap">
                            {copy.duration}
                        </th>
                    </tr>
                </thead>
                {groupByCategory(cookies).map(([category, categoryCookies]) => (
                    <tbody key={category}>
                        <tr className="border-t border-border">
                            <th scope="colgroup" colSpan={3} className="px-4 pt-5 pb-1 font-medium text-foreground">
                                {copy.categories[category] ?? category}
                            </th>
                        </tr>
                        {categoryCookies.map((cookie) => (
                            <tr key={cookie.name}>
                                <th scope="row" className="px-4 py-2.5 align-top font-mono text-[0.8125rem] font-normal break-all text-foreground">
                                    {cookie.name}
                                </th>
                                <td className="px-4 py-2.5 align-top">{cookie.description}</td>
                                <td className="px-4 py-2.5 align-top whitespace-nowrap">{formatCookieDuration(cookie.duration, locale)}</td>
                            </tr>
                        ))}
                    </tbody>
                ))}
            </table>
        </div>
    );
}

/**
 * Clears the saved cookie choice and brings the banner back: a plain POST to the banner's reset endpoint, which sends
 * the visitor back to this page (no script needed). The banner itself lives outside the Inertia root.
 */
export function CookieSettingsButton({ className }: { className?: string }) {
    const copy = useCopy(COPY);
    const { cookieSettingsUrl } = usePage<PrivacyPolicyPageProps>().props;

    return (
        <form method="post" action={cookieSettingsUrl} className={className}>
            <Button type="submit" variant="outline" className="max-md:h-11">
                <Cookie aria-hidden="true" />
                {copy.settings}
            </Button>
        </form>
    );
}
