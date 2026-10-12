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
        ->assertDontSee('assets/js/google-analytics.js', false)
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

it('adds the Google Analytics tag as a file once the visitor accepts all cookies', function () {
    $scripts = $this->postJson(route('cookieconsent.accept.all'))
        ->assertOk()
        ->json('scripts');

    // The banner adds the tag to a page whose nonce this response does not know, so it carries no inline code.
    expect($scripts)->toHaveCount(1)
        ->and($scripts[0])
        ->toMatch('#<script src="[^"]+/assets/js/google-analytics\.js\?v=[0-9a-f]{8}"#')
        ->toContain('data-measurement-id="G-YP98QHKF97"')
        ->toMatch('#<script[^>]*></script>#')
        ->not->toContain('clarity');
});

it('grants the analytics consent and loads gtag.js after the page from the Google Analytics file', function () {
    expect(file_get_contents(public_path('assets/js/google-analytics.js')))
        ->toContain('data-measurement-id')
        ->toContain("w.gtag('consent', 'update', { analytics_storage: 'granted' });")
        ->toContain("w.gtag('config', measurementId);")
        ->toContain("'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId)")
        ->toContain("w.addEventListener('load', load, { once: true })");
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

    $response = $this->withCookie($cookieName, $consent)
        ->get('/')
        ->assertOk()
        ->assertDontSee('id="cookies-policy"', false);

    expect(preg_match('#<script src="[^"]+/assets/js/google-analytics\.js[^>]*>#', (string) $response->getContent(), $tag))->toBe(1)
        ->and($tag[0])
        ->toContain('data-measurement-id="G-YP98QHKF97"')
        ->toContain('nonce="'.scriptNonce($response).'"')
        ->toContain(' defer');
});
