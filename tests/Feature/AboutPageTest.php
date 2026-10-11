<?php

use App\Models\Project;
use Illuminate\Support\Collection;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

/**
 * @return Collection<int, mixed>
 */
function aboutPageSchemas(string $path): Collection
{
    $response = test()->get($path)->assertOk();

    preg_match_all('/<script type="application\/ld\+json">(.*?)<\/script>/s', $response->getContent(), $matches);

    return collect($matches[1])->map(fn (string $json): mixed => json_decode(trim($json), true));
}

it('serves the about page at /o-nas and /en/about', function () {
    expect(route('about', absolute: false))->toBe('/o-nas')
        ->and(route('en.about', absolute: false))->toBe('/en/about');
});

it('renders the about page as an Inertia response in each language', function (string $path) {
    $this->get($path)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('about')
            ->has('projects')
            ->where('previewSamples', false)
            ->missing('faq'));
})->with(['/o-nas', '/en/about']);

it('shows up to three active projects in the order of the panel, as cards', function () {
    Project::factory()->create(['title' => 'Trzeci', 'sort_order' => 3]);
    Project::factory()->create(['title' => 'Pierwszy', 'sort_order' => 1, 'url' => 'pierwszy.pl']);
    Project::factory()->create(['title' => 'Drugi', 'sort_order' => 2]);
    Project::factory()->create(['title' => 'Czwarty', 'sort_order' => 4]);
    Project::factory()->inactive()->create(['title' => 'Ukryty', 'sort_order' => 0]);

    $this->get('/o-nas')
        ->assertInertia(fn (Assert $page) => $page
            ->has('projects', 3)
            ->where('projects.0.title', 'Pierwszy')
            ->where('projects.0.liveUrl', 'https://pierwszy.pl')
            ->where('projects.1.title', 'Drugi')
            ->where('projects.2.title', 'Trzeci')
            ->has('projects.0', fn (Assert $project) => $project
                ->hasAll(['id', 'slug', 'title', 'category', 'description', 'liveUrl', 'thumbnailUrl'])
                ->missing('fullDescription')
                ->missing('challenges')));
});

it('shows the English copy of a project on /en/about, falling back to the Polish one', function () {
    Project::factory()->create(['category' => 'Sklep internetowy', 'category_en' => 'Online store', 'description' => 'Opis po polsku', 'description_en' => null]);

    $this->get('/en/about')
        ->assertInertia(fn (Assert $page) => $page
            ->where('projects.0.category', 'Online store')
            ->where('projects.0.description', 'Opis po polsku'));
});

it('previews the sample content only in the local environment', function () {
    $this->app['env'] = 'local';

    $this->get('/o-nas')->assertInertia(fn (Assert $page) => $page->where('previewSamples', true));
});

it('renders its own SEO tags, canonical URL and hreflang alternates', function () {
    $this->get('/o-nas')
        ->assertOk()
        ->assertSee('<title>O nas: Damian Idzik i Kamil Nawrot | Netizo</title>', false)
        ->assertSee('<link rel="canonical" href="'.url('/o-nas').'">', false)
        ->assertSee('<link rel="alternate" hreflang="pl" href="'.url('/o-nas').'">', false)
        ->assertSee('<link rel="alternate" hreflang="en" href="'.url('/en/about').'">', false)
        ->assertSee('<link rel="alternate" hreflang="x-default" href="'.url('/o-nas').'">', false)
        ->assertSee('<meta property="og:url" content="'.url('/o-nas').'">', false)
        ->assertSee('<meta property="og:image" content="'.asset('assets/images/og-netizo-o-nas.png').'">', false)
        ->assertSee('<meta name="twitter:image" content="'.asset('assets/images/og-netizo-o-nas.png').'">', false)
        ->assertDontSee('og-netizo-2.png', false)
        ->assertDontSee('Tworzymy Strony WWW dla Ambitnych Firm', false);
});

it('renders the English SEO tags on /en/about', function () {
    $this->get('/en/about')
        ->assertOk()
        ->assertSee('<html lang="en"', false)
        ->assertSee('<title>About us: Damian Idzik and Kamil Nawrot | Netizo</title>', false)
        ->assertSee('<link rel="canonical" href="'.url('/en/about').'">', false)
        ->assertSee('<meta property="og:image" content="'.asset('assets/images/og-netizo-about-en.png').'">', false)
        ->assertDontSee('og-netizo-en.png', false);
});

it('keeps the meta description within the length search results show', function (string $locale) {
    $description = trans('about.seo.description', [], $locale);

    expect($description)->not->toBe('about.seo.description')
        ->and(mb_strlen($description))->toBeLessThanOrEqual(160);
})->with(['pl', 'en']);

it('describes the page and the two co-owners in the AboutPage JSON-LD', function () {
    $aboutPage = aboutPageSchemas('/o-nas')->firstWhere('@type', 'AboutPage');

    expect($aboutPage)->not->toBeNull()
        ->and($aboutPage['url'])->toBe(url('/o-nas'))
        ->and($aboutPage['inLanguage'])->toBe('pl')
        ->and($aboutPage['about']['@type'])->toBe('Organization')
        ->and($aboutPage['about']['name'])->toBe('Netizo')
        ->and($aboutPage['about']['url'])->toBe(url('/'))
        ->and($aboutPage['about']['member'])->toBe([
            ['@type' => 'Person', 'name' => 'Damian Idzik', 'jobTitle' => 'Współwłaściciel'],
            ['@type' => 'Person', 'name' => 'Kamil Nawrot', 'jobTitle' => 'Współwłaściciel'],
        ]);
});

it('uses English job titles and the English home page in the JSON-LD on /en/about', function () {
    $aboutPage = aboutPageSchemas('/en/about')->firstWhere('@type', 'AboutPage');

    expect($aboutPage['inLanguage'])->toBe('en')
        ->and($aboutPage['about']['url'])->toBe(url('/en'))
        ->and(array_column($aboutPage['about']['member'], 'jobTitle'))->toBe(['Co-owner', 'Co-owner']);
});

it('does not repeat the home page organization or FAQ JSON-LD', function () {
    $schemas = aboutPageSchemas('/o-nas');

    expect($schemas->firstWhere('@type', 'ProfessionalService'))->toBeNull()
        ->and($schemas->firstWhere('@type', 'FAQPage'))->toBeNull();
});

it('ships 1200x630 share images under the size link previews accept', function (string $file) {
    $imagePath = public_path("assets/images/{$file}");

    expect($imagePath)->toBeFile()
        ->and(array_slice(getimagesize($imagePath), 0, 2))->toBe([1200, 630])
        ->and(getimagesize($imagePath)['mime'])->toBe('image/png')
        ->and(filesize($imagePath))->toBeLessThan(300 * 1024);
})->with(['og-netizo-o-nas.png', 'og-netizo-about-en.png']);
