<?php

namespace App\Services;

/**
 * Netizo's JSON-LD: one `@graph` document per public page, rendered by the root view as `structuredData` (encoded with
 * JSON_HEX_TAG, so text typed in the admin panel cannot end the script tag). Every page, in either language, names the
 * same organization (`https://netizo.pl/#organization`) and website (`https://netizo.pl/#website`): the home pages
 * describe Netizo in full, the other pages carry a summary under the same @id, and each page links itself to both.
 */
class StructuredData
{
    /** The brand: the organization's and the website's name, and the first crumb of every breadcrumb trail. */
    public const NAME = 'Netizo';

    /** The other name Netizo goes by (the home screen icon's title, `apple-mobile-web-app-title`). */
    private const ALTERNATE_NAME = 'Netizo.pl';

    /** The logo: the square app icon, the same in both languages. */
    private const LOGO = 'images/icons/icon-512.png';

    private const LOGO_SIZE = 512;

    /** Size of every share image (`og:image`), the main image of a page. */
    private const IMAGE_WIDTH = 1200;

    private const IMAGE_HEIGHT = 630;

    /** The contact address: on the pages, in the JSON-LD and in security.txt (SecurityTxtController). */
    public const EMAIL = 'kontakt@netizo.pl';

    private const TELEPHONE = '+48884343924';

    /**
     * The JSON-LD document of a page: Netizo (`$organization`, by default its summary), the website and the page's nodes.
     *
     * @param  list<array<string, mixed>>  $nodes
     * @param  array<string, mixed>|null  $organization
     * @return array{'@context': string, '@graph': list<array<string, mixed>>}
     */
    public static function document(array $nodes, ?array $organization = null): array
    {
        return [
            '@context' => 'https://schema.org',
            '@graph' => [$organization ?? self::organizationSummary(), self::website(), ...$nodes],
        ];
    }

    /**
     * Netizo in full, for the home pages. A service-area business with no office: the address is the registered
     * business address (the footer shows the same details, `company` in resources/js/lib/site.ts); work is remote
     * across Poland, and around Leszno Netizo travels to the client.
     *
     * @return array<string, mixed>
     */
    public static function organization(): array
    {
        return array_filter([
            '@type' => 'ProfessionalService',
            '@id' => self::id(self::homeUrl(), 'organization'),
            'name' => self::NAME,
            'alternateName' => self::ALTERNATE_NAME,
            'url' => self::homeUrl(),
            'description' => __('home.seo.organization_description'),
            'logo' => self::logo(),
            'image' => self::reference(self::homeUrl(), 'logo'),
            'email' => self::EMAIL,
            'telephone' => self::TELEPHONE,
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'contactType' => 'customer service',
                'email' => self::EMAIL,
                'telephone' => self::TELEPHONE,
                'availableLanguage' => LocalizedRoutes::LOCALES,
            ],
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => 'ul. Wiosny Ludów 12 lok. 8',
                'postalCode' => '63-600',
                'addressLocality' => 'Kępno',
                'addressRegion' => 'wielkopolskie',
                'addressCountry' => 'PL',
            ],
            'taxID' => '6192060508',
            'identifier' => [
                '@type' => 'PropertyValue',
                'propertyID' => 'REGON',
                'value' => '527974955',
            ],
            'areaServed' => [
                ['@type' => 'Country', 'name' => __('home.seo.country')],
                ['@type' => 'City', 'name' => 'Leszno'],
                ['@type' => 'City', 'name' => 'Rydzyna'],
                ['@type' => 'City', 'name' => 'Wschowa'],
                ['@type' => 'City', 'name' => 'Kościan'],
                ['@type' => 'City', 'name' => 'Gostyń'],
                ['@type' => 'City', 'name' => 'Rawicz'],
            ],
            'knowsLanguage' => LocalizedRoutes::LOCALES,
            'priceRange' => '$$',
            'hasMap' => SocialProfiles::googleBusinessProfile(),
            'sameAs' => SocialProfiles::urls() ?: null,
        ], fn (mixed $value): bool => $value !== null);
    }

    /**
     * Netizo on the pages other than the home pages: the same @id with what identifies it. Typed as a plain
     * Organization, because a LocalBusiness (ProfessionalService) without its address would be incomplete.
     *
     * @param  array<string, mixed>  $properties  What the page adds about Netizo (the co-owners on the about page).
     * @return array<string, mixed>
     */
    public static function organizationSummary(array $properties = []): array
    {
        return array_filter([
            '@type' => 'Organization',
            '@id' => self::id(self::homeUrl(), 'organization'),
            'name' => self::NAME,
            'alternateName' => self::ALTERNATE_NAME,
            'url' => self::homeUrl(),
            'logo' => self::logo(),
            'sameAs' => SocialProfiles::urls() ?: null,
            ...$properties,
        ], fn (mixed $value): bool => $value !== null);
    }

    /**
     * The page `$url` as a WebPage (or the kind of page `$type` names) of Netizo's website, followed by its breadcrumb
     * trail when it has one.
     *
     * @param  list<array{name: string, url: string}>  $trail  The pages below the home page down to this one; empty on
     *                                                         the home page.
     * @param  array<string, mixed>  $properties  The page's other properties (its main entity, the date of its version).
     * @return list<array<string, mixed>>
     */
    public static function page(string $type, string $url, string $name, string $description, ?string $imageUrl, array $trail = [], array $properties = []): array
    {
        $page = array_filter([
            '@type' => $type,
            '@id' => self::id($url, 'webpage'),
            'url' => self::normalizedUrl($url),
            'name' => $name,
            'description' => $description,
            'inLanguage' => app()->getLocale(),
            'isPartOf' => self::reference(self::homeUrl(), 'website'),
            'publisher' => self::organizationReference(),
            'breadcrumb' => $trail === [] ? null : self::reference($url, 'breadcrumb'),
            'primaryImageOfPage' => $imageUrl === null ? null : [
                '@type' => 'ImageObject',
                '@id' => self::id($url, 'primaryimage'),
                'url' => $imageUrl,
                'contentUrl' => $imageUrl,
                'width' => self::IMAGE_WIDTH,
                'height' => self::IMAGE_HEIGHT,
            ],
            'image' => $imageUrl === null ? null : self::reference($url, 'primaryimage'),
            ...$properties,
        ], fn (mixed $value): bool => $value !== null);

        return $trail === [] ? [$page] : [$page, self::breadcrumbs($url, $trail)];
    }

    /**
     * The FAQ of the page `$url` (its questions and answers as the page shows them), part of that page.
     *
     * @param  list<array{question: string, answer: string}>  $faq
     * @return array<string, mixed>
     */
    public static function faq(string $url, array $faq): array
    {
        return [
            '@type' => 'FAQPage',
            '@id' => self::id($url, 'faq'),
            'isPartOf' => self::reference($url, 'webpage'),
            'inLanguage' => app()->getLocale(),
            'mainEntity' => array_map(fn (array $item): array => [
                '@type' => 'Question',
                'name' => $item['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $item['answer'],
                ],
            ], $faq),
        ];
    }

    /**
     * The @id of the node `$node` (webpage, project…) of the page `$url`.
     */
    public static function id(string $url, string $node): string
    {
        return self::normalizedUrl($url).'#'.$node;
    }

    /**
     * A link to the node `$node` (webpage, project…) of the page `$url`.
     *
     * @return array{'@id': string}
     */
    public static function reference(string $url, string $node): array
    {
        return ['@id' => self::id($url, $node)];
    }

    /**
     * A link to Netizo, the organization every page names.
     *
     * @return array{'@id': string}
     */
    public static function organizationReference(): array
    {
        return self::reference(self::homeUrl(), 'organization');
    }

    /**
     * The website, the same in both languages (its preferred name in search results).
     *
     * @return array<string, mixed>
     */
    private static function website(): array
    {
        return [
            '@type' => 'WebSite',
            '@id' => self::id(self::homeUrl(), 'website'),
            'url' => self::homeUrl(),
            'name' => self::NAME,
            'alternateName' => self::ALTERNATE_NAME,
            'inLanguage' => LocalizedRoutes::LOCALES,
            'publisher' => self::organizationReference(),
        ];
    }

    /**
     * Netizo → the pages of `$trail`, each in the current language.
     *
     * @param  list<array{name: string, url: string}>  $trail
     * @return array<string, mixed>
     */
    private static function breadcrumbs(string $url, array $trail): array
    {
        $crumbs = [['name' => self::NAME, 'url' => LocalizedRoutes::url('home')], ...$trail];

        return [
            '@type' => 'BreadcrumbList',
            '@id' => self::id($url, 'breadcrumb'),
            'itemListElement' => array_map(fn (array $crumb, int $index): array => [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $crumb['name'],
                'item' => self::normalizedUrl($crumb['url']),
            ], $crumbs, array_keys($crumbs)),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function logo(): array
    {
        return [
            '@type' => 'ImageObject',
            '@id' => self::id(self::homeUrl(), 'logo'),
            'url' => asset(self::LOGO),
            'contentUrl' => asset(self::LOGO),
            'width' => self::LOGO_SIZE,
            'height' => self::LOGO_SIZE,
            'caption' => self::NAME,
        ];
    }

    /**
     * The root of the domain (`https://netizo.pl/`): the address of the organization and of the website in every
     * language.
     */
    private static function homeUrl(): string
    {
        return self::normalizedUrl(route('home'));
    }

    /**
     * The URL with the slash of the domain root (`https://netizo.pl` → `https://netizo.pl/`), so a node has one @id
     * however its URL was built.
     */
    public static function normalizedUrl(string $url): string
    {
        return in_array(parse_url($url, PHP_URL_PATH), [null, ''], true) ? $url.'/' : $url;
    }
}
