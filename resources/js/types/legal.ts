/** A cookie listed by the cookie banner (App\Providers\CookiesServiceProvider), described in the page's language. */
export type ListedCookie = {
    /** The banner's category: `essentials` (no consent needed) or `analytics` (only after consent). */
    category: string;
    name: string;
    description: string;
    /** Lifetime in minutes. */
    duration: number;
};

/** Props of the privacy policy (LegalPageController@privacy). */
export type PrivacyPolicyPageProps = {
    /** The day the current version took effect, `YYYY-MM-DD`. */
    effectiveDate: string;
    cookies: ListedCookie[];
    /** The cookie banner's reset endpoint: a POST there clears the consent and brings the banner back. */
    cookieSettingsUrl: string;
};

/** Props of the terms of service (LegalPageController@terms). */
export type TermsPageProps = {
    /** The day the current version took effect, `YYYY-MM-DD`. */
    effectiveDate: string;
};

/** Props of the partner programme terms (LegalPageController@partnerTerms). */
export type PartnerTermsPageProps = {
    /** The day the current version took effect, `YYYY-MM-DD`. */
    effectiveDate: string;
};
