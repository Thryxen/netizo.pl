import { usePage } from '@inertiajs/react';
import { localized, useLocale } from '@/lib/i18n';

/**
 * Contact details and links repeated across the header, footer, contact section and callback dialog.
 */

export const contact = {
    email: 'kontakt@netizo.pl',
    phone: {
        display: '+48 884 343 924',
        href: 'tel:+48884343924',
    },
} as const;

/**
 * Registered company details shown in the footer, the same in both languages. Netizo is Kamil Nawrot's sole
 * proprietorship (CEIDG): he is the service provider of the terms and the data controller of the privacy policy.
 */
export const company = {
    name: 'Netizo',
    owner: 'Kamil Nawrot',
    street: 'ul. Wiosny Ludów 12 lok. 8',
    postalCode: '63-600',
    city: 'Kępno',
    nip: '6192060508',
    regon: '527974955',
} as const;

export const clientPanelUrl = 'https://panel-klienta.netizo.pl';

/** Brand names of the social networks with an icon (components/home/social-icon.tsx), the same in both languages. */
export const socialNetworkNames = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    linkedin: 'LinkedIn',
    discord: 'Discord',
    google: 'Google',
} as const;

export type SocialNetwork = keyof typeof socialNetworkNames;

export type SocialProfile = { network: SocialNetwork; url: string };

function isSocialNetwork(network: string): network is SocialNetwork {
    return Object.hasOwn(socialNetworkNames, network);
}

/**
 * Netizo's social profiles, set in .env (config/socials.php) and shared by HandleInertiaRequests on public pages:
 * only the networks with a URL, in config order. A network without an icon here is skipped.
 */
export function useSocialProfiles(): SocialProfile[] {
    const socials = usePage<{ socials?: { network: string; url: string }[] }>().props.socials ?? [];

    return socials.filter((profile): profile is SocialProfile => isSocialNetwork(profile.network));
}

/** Pages of the site in each language (routes/web.php). A project's case study is `${projects}/${slug}` (caseStudyUrl). */
export const pageUrls = localized({
    pl: {
        home: '/',
        websites: '/tworzenie-stron-internetowych',
        stores: '/sklepy-internetowe',
        apps: '/aplikacje-webowe',
        mobile: '/aplikacje-mobilne',
        ai: '/automatyzacja-ai',
        devops: '/devops-i-chmura',
        projects: '/realizacje',
        partners: '/partnerzy',
        partnerTerms: '/partnerzy/regulamin',
        about: '/o-nas',
        privacy: '/polityka-prywatnosci',
        terms: '/regulamin',
    },
    en: {
        home: '/en',
        websites: '/en/website-development',
        stores: '/en/online-stores',
        apps: '/en/web-applications',
        mobile: '/en/mobile-apps',
        ai: '/en/ai-automation',
        devops: '/en/devops-cloud',
        projects: '/en/projects',
        partners: '/en/partners',
        partnerTerms: '/en/partners/terms',
        about: '/en/about',
        privacy: '/en/privacy-policy',
        terms: '/en/terms',
    },
});

export type InfoLink = {
    href: string;
    label: string;
    /**
     * Language of the linked page when it differs from the current one (a page that exists in Polish only): the link
     * gets `hrefLang` and a "PL" marker (InfoLinkLabel).
     */
    hrefLang?: 'pl';
};

export const infoLinks = localized<InfoLink[]>({
    pl: [
        { href: '/realizacje', label: 'Realizacje' },
        { href: '/o-nas', label: 'O nas' },
        { href: '/partnerzy', label: 'Program partnerski' },
        { href: '/regulamin', label: 'Regulamin' },
        { href: '/polityka-prywatnosci', label: 'Polityka prywatności' },
    ],
    en: [
        { href: '/en/projects', label: 'Projects' },
        { href: '/en/about', label: 'About us' },
        { href: '/en/partners', label: 'Partner program' },
        { href: '/en/terms', label: 'Terms of service' },
        { href: '/en/privacy-policy', label: 'Privacy policy' },
    ],
});

/** The service pages (App\Enums\Service), in the footer's "Usługi" column and the mobile menu. */
export const serviceLinks = localized<InfoLink[]>({
    pl: [
        { href: '/tworzenie-stron-internetowych', label: 'Strony internetowe' },
        { href: '/sklepy-internetowe', label: 'Sklepy internetowe' },
        { href: '/aplikacje-webowe', label: 'Aplikacje webowe' },
        { href: '/aplikacje-mobilne', label: 'Aplikacje mobilne' },
        { href: '/automatyzacja-ai', label: 'AI & Automatyzacja' },
        { href: '/devops-i-chmura', label: 'DevOps & Cloud' },
    ],
    en: [
        { href: '/en/website-development', label: 'Websites' },
        { href: '/en/online-stores', label: 'Online stores' },
        { href: '/en/web-applications', label: 'Web applications' },
        { href: '/en/mobile-apps', label: 'Mobile apps' },
        { href: '/en/ai-automation', label: 'AI & automation' },
        { href: '/en/devops-cloud', label: 'DevOps & cloud' },
    ],
});

/** Page URLs in the language of the current page. */
export function usePageUrls(): (typeof pageUrls)['pl'] {
    return pageUrls[useLocale()];
}

/** URL of a project's case study in the language of the current page (the slug is the same in both languages). */
export function useCaseStudyUrl(): (slug: string) => string {
    const projectsUrl = usePageUrls().projects;

    return (slug: string): string => `${projectsUrl}/${encodeURIComponent(slug)}`;
}

/** Footer and menu links in the language of the current page. */
export function useInfoLinks(): InfoLink[] {
    return infoLinks[useLocale()];
}

/** The service pages in the language of the current page. */
export function useServiceLinks(): InfoLink[] {
    return serviceLinks[useLocale()];
}
