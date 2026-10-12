<?php

use App\Http\Controllers\LegalPageController;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

it('serves the privacy policy, the terms and the partner program terms in Polish and in English', function (string $name, string $path) {
    expect(route($name, absolute: false))->toBe($path);
})->with([
    ['privacy', '/polityka-prywatnosci'],
    ['en.privacy', '/en/privacy-policy'],
    ['terms', '/regulamin'],
    ['en.terms', '/en/terms'],
    ['partners.terms', '/partnerzy/regulamin'],
    ['en.partners.terms', '/en/partners/terms'],
]);

it('renders the privacy policy with the cookies the cookie banner lists', function (string $path) {
    $this->get($path)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('privacy-policy')
            ->where('effectiveDate', LegalPageController::PRIVACY_EFFECTIVE_DATE)
            ->where('cookieSettingsUrl', route('cookieconsent.reset'))
            ->where('cookies', fn (Collection $cookies): bool => $cookies->pluck('category', 'name')->all() === [
                config('cookieconsent.cookie.name') => 'essentials',
                config('session.cookie') => 'essentials',
                'XSRF-TOKEN' => 'essentials',
                'appearance' => 'essentials',
                '_ga' => 'analytics',
                '_ga_YP98QHKF97' => 'analytics',
            ])
            ->has('cookies.0', fn (Assert $cookie) => $cookie->hasAll(['category', 'name', 'description', 'duration'])));
})->with(['/polityka-prywatnosci', '/en/privacy-policy']);

it('describes each cookie with the banner\'s description and lifetime', function () {
    $this->get('/polityka-prywatnosci')
        ->assertInertia(fn (Assert $page) => $page
            ->where('cookies', fn (Collection $cookies): bool => $cookies->firstWhere('name', 'appearance') === [
                'category' => 'essentials',
                'name' => 'appearance',
                'description' => 'Zapamiętuje wybrany motyw strony (jasny lub ciemny).',
                'duration' => 525600,
            ]));
});

it('has the description of the theme cookie in both languages', function (string $locale, string $description) {
    // The banner translates its cookies when they are registered, at boot, from the path (in a test: always Polish).
    expect(trans('cookieConsent::cookies.defaults.appearance', [], $locale))->toBe($description);
})->with([
    ['pl', 'Zapamiętuje wybrany motyw strony (jasny lub ciemny).'],
    ['en', 'Remembers the theme you picked (light or dark).'],
]);

it('renders the terms of service in each language', function (string $path) {
    $this->get($path)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('terms')
            ->where('effectiveDate', LegalPageController::TERMS_EFFECTIVE_DATE)
            ->missing('cookies'));
})->with(['/regulamin', '/en/terms']);

it('renders the partner program terms in each language', function (string $path) {
    $this->get($path)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('partner-terms')
            ->where('effectiveDate', LegalPageController::PARTNER_TERMS_EFFECTIVE_DATE)
            ->missing('cookies'));
})->with(['/partnerzy/regulamin', '/en/partners/terms']);

it('renders the SEO tags, canonical URL and hreflang alternates of each document', function (string $path, string $polish, string $english, string $title) {
    $this->get($path)
        ->assertOk()
        ->assertSee("<title>{$title}</title>", false)
        ->assertSee('<link rel="canonical" href="'.url($path).'">', false)
        ->assertSee('<link rel="alternate" hreflang="pl" href="'.url($polish).'">', false)
        ->assertSee('<link rel="alternate" hreflang="en" href="'.url($english).'">', false)
        ->assertSee('<link rel="alternate" hreflang="x-default" href="'.url($polish).'">', false)
        ->assertSee('<meta property="og:url" content="'.url($path).'">', false);
})->with([
    ['/polityka-prywatnosci', '/polityka-prywatnosci', '/en/privacy-policy', 'Polityka prywatności | Netizo'],
    ['/en/privacy-policy', '/polityka-prywatnosci', '/en/privacy-policy', 'Privacy policy | Netizo'],
    ['/regulamin', '/regulamin', '/en/terms', 'Regulamin serwisu | Netizo'],
    ['/en/terms', '/regulamin', '/en/terms', 'Terms of service | Netizo'],
    ['/partnerzy/regulamin', '/partnerzy/regulamin', '/en/partners/terms', 'Regulamin programu partnerskiego | Netizo'],
    ['/en/partners/terms', '/partnerzy/regulamin', '/en/partners/terms', 'Partner program terms | Netizo'],
]);

it('shares each document with its own image', function (string $path, string $image) {
    $this->get($path)
        ->assertOk()
        ->assertSee('<meta property="og:image" content="'.asset("assets/images/{$image}").'">', false)
        ->assertSee('<meta name="twitter:image" content="'.asset("assets/images/{$image}").'">', false);
})->with([
    ['/polityka-prywatnosci', 'og-netizo-polityka-prywatnosci.png'],
    ['/en/privacy-policy', 'og-netizo-privacy-policy-en.png'],
    ['/regulamin', 'og-netizo-regulamin.png'],
    ['/en/terms', 'og-netizo-terms-en.png'],
    ['/partnerzy/regulamin', 'og-netizo-regulamin-partnerski.png'],
    ['/en/partners/terms', 'og-netizo-partner-terms-en.png'],
]);

it('ships 1200x630 share images of the documents under the size link previews accept', function (string $file) {
    $imagePath = public_path("assets/images/{$file}");

    expect($imagePath)->toBeFile()
        ->and(array_slice(getimagesize($imagePath), 0, 2))->toBe([1200, 630])
        ->and(getimagesize($imagePath)['mime'])->toBe('image/png')
        ->and(filesize($imagePath))->toBeLessThan(300 * 1024);
})->with([
    'og-netizo-polityka-prywatnosci.png',
    'og-netizo-privacy-policy-en.png',
    'og-netizo-regulamin.png',
    'og-netizo-terms-en.png',
    'og-netizo-regulamin-partnerski.png',
    'og-netizo-partner-terms-en.png',
]);

it('keeps the meta descriptions within the length search results show', function (string $key, string $locale) {
    $description = trans("legal.{$key}.description", [], $locale);

    expect($description)->not->toBe("legal.{$key}.description")
        ->and(mb_strlen($description))->toBeLessThanOrEqual(160);
})->with(['privacy', 'terms', 'partner_terms'])->with(['pl', 'en']);

it('describes each document as a WebPage with its effective date, published by Netizo', function (string $path, string $date, array $crumbs) {
    $graph = jsonLdGraph($this->get($path));
    $webPage = $graph->firstWhere('@type', 'WebPage');
    $breadcrumbs = $graph->firstWhere('@type', 'BreadcrumbList');

    expect($webPage)->not->toBeNull()
        ->and($webPage['url'])->toBe(url($path))
        ->and($webPage['dateModified'])->toBe($date)
        ->and($webPage['publisher'])->toBe(['@id' => url('/').'/#organization'])
        ->and($graph->firstWhere('@type', 'Organization')['name'])->toBe('Netizo')
        ->and(array_column($breadcrumbs['itemListElement'], 'name'))->toBe(array_keys($crumbs))
        ->and(array_column($breadcrumbs['itemListElement'], 'item'))->toBe(array_values($crumbs));
})->with([
    ['/polityka-prywatnosci', LegalPageController::PRIVACY_EFFECTIVE_DATE, fn (): array => ['Netizo' => url('/').'/', 'Polityka prywatności' => url('/polityka-prywatnosci')]],
    ['/en/terms', LegalPageController::TERMS_EFFECTIVE_DATE, fn (): array => ['Netizo' => url('/en'), 'Terms of service' => url('/en/terms')]],
    ['/partnerzy/regulamin', LegalPageController::PARTNER_TERMS_EFFECTIVE_DATE, fn (): array => ['Netizo' => url('/').'/', 'Program partnerski' => url('/partnerzy'), 'Regulamin' => url('/partnerzy/regulamin')]],
]);

it('links the cookie banner to the privacy policy in the language of the page', function (string $path, string $policy) {
    $this->get($path)
        ->assertOk()
        ->assertSee('<a href="'.url($policy).'">', false);
})->with([
    ['/', '/polityka-prywatnosci'],
    ['/en', '/en/privacy-policy'],
]);

it('clears the cookie consent and returns to the policy when the visitor changes the cookie settings', function () {
    $this->from(url('/polityka-prywatnosci'))
        ->post(route('cookieconsent.reset'))
        ->assertRedirect(url('/polityka-prywatnosci'))
        ->assertCookieExpired(config('cookieconsent.cookie.name'));
});

it('lists every document in both languages in the sitemap, with hreflang alternates', function (string $path, string $polishPath, string $englishPath) {
    [$url, $polish, $english] = [url($path), url($polishPath), url($englishPath)];
    $sitemap = simplexml_load_string($this->get('/sitemap.xml')->assertOk()->getContent());
    $sitemap->registerXPathNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    $sitemap->registerXPathNamespace('xhtml', 'http://www.w3.org/1999/xhtml');

    $entry = $sitemap->xpath("//s:url[s:loc='{$url}']");

    expect($entry)->toHaveCount(1);

    $entry[0]->registerXPathNamespace('xhtml', 'http://www.w3.org/1999/xhtml');
    $alternates = collect($entry[0]->xpath('xhtml:link'))->mapWithKeys(fn (SimpleXMLElement $link): array => [(string) $link['hreflang'] => (string) $link['href']]);

    expect($alternates->all())->toBe(['pl' => $polish, 'en' => $english, 'x-default' => $polish]);
})->with([
    ['/polityka-prywatnosci', '/polityka-prywatnosci', '/en/privacy-policy'],
    ['/en/privacy-policy', '/polityka-prywatnosci', '/en/privacy-policy'],
    ['/regulamin', '/regulamin', '/en/terms'],
    ['/en/terms', '/regulamin', '/en/terms'],
    ['/partnerzy/regulamin', '/partnerzy/regulamin', '/en/partners/terms'],
    ['/en/partners/terms', '/partnerzy/regulamin', '/en/partners/terms'],
]);
