<?php

use App\Http\Controllers\LegalPageController;
use App\Models\Client;
use App\Models\Project;
use Illuminate\Support\Carbon;

beforeEach(function () {
    $this->withoutVite();
});

/**
 * The sitemap's entries: each <loc> with its <lastmod> and hreflang alternates.
 *
 * @return list<array{loc: string, lastmod: string, alternates: array<string, string>}>
 */
function sitemapEntries(): array
{
    $xml = simplexml_load_string(test()->get('/sitemap.xml')->assertOk()->getContent());
    $entries = [];

    foreach ($xml->url as $url) {
        $alternates = [];

        foreach ($url->children('http://www.w3.org/1999/xhtml')->link as $link) {
            $alternates[(string) $link->attributes()->hreflang] = (string) $link->attributes()->href;
        }

        $entries[] = ['loc' => (string) $url->loc, 'lastmod' => (string) $url->lastmod, 'alternates' => $alternates];
    }

    return $entries;
}

it('is served by the application, not as a static file', function () {
    expect(public_path('sitemap.xml'))->not->toBeFile();

    $this->get('/sitemap.xml')
        ->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=utf-8')
        ->assertCookieMissing(config('session.cookie'))
        ->assertCookieMissing('XSRF-TOKEN');
});

it('lists every public page in both languages and the case study of every active project', function () {
    Project::factory()->create(['slug' => 'zloty-klos', 'sort_order' => 1]);
    Project::factory()->create(['slug' => 'mebloteka', 'sort_order' => 2]);
    Project::factory()->inactive()->create(['slug' => 'ukryty']);

    expect(array_column(sitemapEntries(), 'loc'))->toBe([
        url('/'), url('/en'),
        url('/realizacje'), url('/en/projects'),
        url('/o-nas'), url('/en/about'),
        url('/partnerzy'), url('/en/partners'),
        url('/polityka-prywatnosci'), url('/en/privacy-policy'),
        url('/regulamin'), url('/en/terms'),
        url('/realizacje/zloty-klos'), url('/en/projects/zloty-klos'),
        url('/realizacje/mebloteka'), url('/en/projects/mebloteka'),
    ]);
});

it('gives every entry reciprocal hreflang alternates with the Polish page as x-default', function () {
    Project::factory()->create(['slug' => 'zloty-klos']);

    $entries = collect(sitemapEntries());

    foreach ($entries as $entry) {
        expect(array_keys($entry['alternates']))->toBe(['pl', 'en', 'x-default'])
            ->and($entry['alternates'])->toContain($entry['loc'])
            ->and($entry['alternates']['x-default'])->toBe($entry['alternates']['pl']);

        foreach ($entry['alternates'] as $href) {
            expect($entries->firstWhere('loc', $href)['alternates'] ?? null)->toBe($entry['alternates']);
        }
    }
});

it('lists only pages that answer 200 with the same canonical URL', function () {
    Project::factory()->create(['slug' => 'zloty-klos']);

    foreach (sitemapEntries() as $entry) {
        expect($entry['loc'])->not->toContain('#');

        $this->get(parse_url($entry['loc'], PHP_URL_PATH) ?? '/')
            ->assertOk()
            ->assertSee('<link rel="canonical" href="'.$entry['loc'].'">', false);
    }
});

it('dates a page by its last change, including the panel data it shows', function () {
    Carbon::setTestNow('2031-05-04 12:00:00');
    Project::factory()->create(['slug' => 'zloty-klos']);
    Carbon::setTestNow('2031-06-01 12:00:00');
    Client::query()->create(['name' => 'Klient', 'url' => null, 'sort_order' => 1, 'is_active' => true]);
    Carbon::setTestNow();

    $lastmods = collect(sitemapEntries())->pluck('lastmod', 'loc');

    expect($lastmods[url('/')])->toBe('2031-06-01')
        ->and($lastmods[url('/realizacje')])->toBe('2031-05-04')
        ->and($lastmods[url('/en/projects/zloty-klos')])->toBe('2031-05-04')
        ->and($lastmods[url('/regulamin')])->toBe(LegalPageController::TERMS_EFFECTIVE_DATE)
        ->and($lastmods->every(fn (string $date): bool => preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) === 1))->toBeTrue();
});
