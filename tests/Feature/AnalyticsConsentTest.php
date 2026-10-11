<?php

use Illuminate\Support\Facades\Facade;
use Whitecube\LaravelCookieConsent\CookiesManager;

beforeEach(function () {
    $this->withoutVite();
});

it('loads no analytics before the visitor consents, with Consent Mode defaulting to denied', function (string $url) {
    $this->get($url)
        ->assertOk()
        ->assertSee("gtag('consent', 'default'", false)
        ->assertSee("analytics_storage: 'denied'", false)
        ->assertDontSee('googletagmanager.com/gtag/js', false)
        ->assertDontSee('googletagmanager.com/ns.html', false)
        ->assertDontSee('clarity', false);
})->with(['/', '/en', '/partnerzy', '/o-nas']);

it('lists the Google Analytics 4 cookies in the cookie banner', function () {
    expect(config('cookieconsent.google_analytics.id'))->toBe('G-YP98QHKF97');

    $this->get('/')
        ->assertOk()
        ->assertSee('_ga_YP98QHKF97')
        ->assertDontSee('_clck');
});

it('adds the Google Analytics tag with the granted consent once the visitor accepts all cookies', function () {
    $scripts = $this->postJson(route('cookieconsent.accept.all'))
        ->assertOk()
        ->json('scripts');

    expect($scripts)->toHaveCount(1)
        ->and($scripts[0])
        ->toContain("w.gtag('consent', 'update', { analytics_storage: 'granted' });")
        ->toContain("w.gtag('config', \"G-YP98QHKF97\");")
        ->toContain("'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(\"G-YP98QHKF97\")")
        ->toContain("w.addEventListener('load', load, { once: true })")
        ->not->toContain('clarity');
});

it('adds no analytics when the visitor accepts only the essential cookies', function () {
    $this->postJson(route('cookieconsent.accept.essentials'))
        ->assertOk()
        ->assertJsonMissingPath('scripts');
});

it('loads the Google Analytics tag after the page for a visitor who already accepted analytics cookies', function () {
    $cookieName = config('cookieconsent.cookie.name');
    $consent = $this->postJson(route('cookieconsent.accept.all'))->getCookie($cookieName, decrypt: false)->getValue();

    // The consent manager reads the cookie when it is first resolved, which in a test happens before the request.
    Facade::clearResolvedInstance(CookiesManager::class);

    $this->withCookie($cookieName, $consent)
        ->get('/')
        ->assertOk()
        ->assertSee('https://www.googletagmanager.com/gtag/js?id=', false)
        ->assertDontSee('id="cookies-policy"', false);
});
