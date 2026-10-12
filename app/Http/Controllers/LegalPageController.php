<?php

namespace App\Http\Controllers;

use App\Services\LocalizedRoutes;
use Artesaos\SEOTools\Facades\JsonLdMulti;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Inertia\Inertia;
use Inertia\Response;
use Whitecube\LaravelCookieConsent\Cookie;
use Whitecube\LaravelCookieConsent\CookiesCategory;
use Whitecube\LaravelCookieConsent\Facades\Cookies;

/**
 * The privacy policy (/polityka-prywatnosci, /en/privacy-policy), the terms of service (/regulamin, /en/terms) and the
 * partner programme terms (/partnerzy/regulamin, /en/partners/terms). The documents themselves live in
 * resources/js/components/legal/; the English ones are translations of the Polish ones.
 */
class LegalPageController extends Controller
{
    /** The day the current privacy policy took effect; change it with every new version of the document. */
    public const PRIVACY_EFFECTIVE_DATE = '2026-10-12';

    /** The day the current terms of service took effect; change it with every new version of the document. */
    public const TERMS_EFFECTIVE_DATE = '2026-10-12';

    /**
     * The day the current partner programme terms took effect; change it with every new version of the document. An
     * application stores the version its sender accepted (partner_applications.terms_version).
     */
    public const PARTNER_TERMS_EFFECTIVE_DATE = '2026-10-12';

    public function privacy(): Response
    {
        $this->seo('privacy', self::PRIVACY_EFFECTIVE_DATE);

        return Inertia::render('privacy-policy', [
            'effectiveDate' => self::PRIVACY_EFFECTIVE_DATE,
            'cookies' => $this->cookies(),
            'cookieSettingsUrl' => route('cookieconsent.reset'),
        ]);
    }

    public function terms(): Response
    {
        $this->seo('terms', self::TERMS_EFFECTIVE_DATE);

        return Inertia::render('terms', [
            'effectiveDate' => self::TERMS_EFFECTIVE_DATE,
        ]);
    }

    public function partnerTerms(): Response
    {
        $this->seo('partner_terms', self::PARTNER_TERMS_EFFECTIVE_DATE, 'partners.terms');

        return Inertia::render('partner-terms', [
            'effectiveDate' => self::PARTNER_TERMS_EFFECTIVE_DATE,
        ]);
    }

    /**
     * Meta tags, the canonical URL with hreflang alternates and the WebPage JSON-LD of the document `$name`
     * (lang/{pl,en}/legal.php), served by the route `$routeName` (by default the document's name).
     */
    private function seo(string $name, string $effectiveDate, ?string $routeName = null): void
    {
        $routeName ??= $name;
        $title = __("legal.{$name}.title");
        $description = __("legal.{$name}.description");
        $imageUrl = asset(__("legal.{$name}.image"));

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);

        OpenGraph::setTitle($title)
            ->setDescription($description)
            ->setType('website')
            ->setSiteName('Netizo')
            ->addImage($imageUrl, ['width' => 1200, 'height' => 630]);

        TwitterCard::setTitle($title)
            ->setDescription($description)
            ->setType('summary_large_image')
            ->setImage($imageUrl);

        $this->localizedSeo($routeName);

        JsonLdMulti::setTitle(__("legal.{$name}.name"))
            ->setDescription($description)
            ->setType('WebPage')
            ->setUrl(LocalizedRoutes::url($routeName))
            ->addValue('inLanguage', app()->getLocale())
            ->addValue('dateModified', $effectiveDate)
            ->addValue('publisher', [
                '@type' => 'Organization',
                'name' => 'Netizo',
                'url' => LocalizedRoutes::url('home'),
            ]);
    }

    /**
     * The cookies listed by the cookie banner (App\Providers\CookiesServiceProvider), described in the current language:
     * the policy's table and the banner come from one list, so they cannot drift apart.
     *
     * @return list<array{category: string, name: string, description: string, duration: int}>
     */
    private function cookies(): array
    {
        return collect(Cookies::getCategories())
            ->flatMap(fn (CookiesCategory $category): array => array_map(fn (Cookie $cookie): array => [
                'category' => $category->key(),
                'name' => $cookie->name,
                'description' => (string) $cookie->description,
                'duration' => $cookie->duration,
            ], $category->getCookies()))
            ->values()
            ->all();
    }
}
