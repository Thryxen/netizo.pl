<?php

use App\Models\Project;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

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
        ->assertSee('<title>O nas: Damian Idzik i Kamil Nawrot – Leszno | Netizo</title>', false)
        ->assertSee('<link rel="canonical" href="'.url('/o-nas').'">', false)
        ->assertSee('<link rel="alternate" hreflang="pl" href="'.url('/o-nas').'">', false)
        ->assertSee('<link rel="alternate" hreflang="en" href="'.url('/en/about').'">', false)
        ->assertSee('<link rel="alternate" hreflang="x-default" href="'.url('/o-nas').'">', false)
        ->assertSee('<meta property="og:url" content="'.url('/o-nas').'">', false)
        ->assertSee('<meta property="og:image" content="'.asset('assets/images/og-netizo-o-nas.png').'">', false)
        ->assertSee('<meta name="twitter:image" content="'.asset('assets/images/og-netizo-o-nas.png').'">', false)
        ->assertDontSee('og-netizo-2.png', false)
        ->assertDontSee('Strony internetowe i aplikacje webowe dla firm – Leszno', false);
});

it('renders the English SEO tags on /en/about', function () {
    $this->get('/en/about')
        ->assertOk()
        ->assertSee('<html lang="en"', false)
        ->assertSee('<title>About us: Damian Idzik, Kamil Nawrot – Leszno, Poland | Netizo</title>', false)
        ->assertSee('<link rel="canonical" href="'.url('/en/about').'">', false)
        ->assertSee('<meta property="og:image" content="'.asset('assets/images/og-netizo-about-en.png').'">', false)
        ->assertDontSee('og-netizo-en.png', false);
});

it('renders a search result description that opens with the call to action and no meta keywords', function (string $path, string $description) {
    $this->get($path)
        ->assertOk()
        ->assertSee('<meta name="description" content="'.$description.'">', false)
        ->assertDontSee('<meta name="keywords"', false);

    expect(mb_strlen($description))->toBeLessThanOrEqual(155);
})->with([
    'polish' => ['/o-nas', 'Poznaj Damiana Idzika i Kamila Nawrota z Netizo. Strony, sklepy i aplikacje webowe dla firm z całej Polski, a w Lesznie i okolicach z dojazdem do klienta.'],
    'english' => ['/en/about', 'Meet Damian Idzik and Kamil Nawrot of Netizo. Websites, online stores and web apps for companies across Poland, with on-site meetings around Leszno.'],
]);

it('describes the page and the two co-founders in the AboutPage JSON-LD', function () {
    $graph = jsonLdGraph($this->get('/o-nas'));
    $aboutPage = $graph->firstWhere('@type', 'AboutPage');
    $organization = $graph->firstWhere('@type', 'Organization');

    expect($aboutPage)->not->toBeNull()
        ->and($aboutPage['url'])->toBe(url('/o-nas'))
        ->and($aboutPage['inLanguage'])->toBe('pl')
        ->and($aboutPage['about'])->toBe(['@id' => url('/').'/#organization'])
        ->and(array_column($graph->firstWhere('@type', 'BreadcrumbList')['itemListElement'], 'name'))->toBe(['Netizo', 'O nas'])
        ->and($organization['@id'])->toBe(url('/').'/#organization')
        ->and($organization['name'])->toBe('Netizo')
        ->and($organization['url'])->toBe(url('/').'/')
        ->and($organization['member'])->toBe([
            ['@type' => 'Person', 'name' => 'Damian Idzik', 'jobTitle' => 'Współzałożyciel'],
            ['@type' => 'Person', 'name' => 'Kamil Nawrot', 'jobTitle' => 'Współzałożyciel'],
        ]);
});

it('uses English job titles and the same organization in the JSON-LD on /en/about', function () {
    $graph = jsonLdGraph($this->get('/en/about'));
    $organization = $graph->firstWhere('@type', 'Organization');

    expect($graph->firstWhere('@type', 'AboutPage')['inLanguage'])->toBe('en')
        ->and($organization['@id'])->toBe(url('/').'/#organization')
        ->and($organization['url'])->toBe(url('/').'/')
        ->and(array_column($organization['member'], 'jobTitle'))->toBe(['Co-founder', 'Co-founder']);
});

it('does not repeat the home page organization or FAQ JSON-LD', function () {
    $graph = jsonLdGraph($this->get('/o-nas'));

    expect($graph->firstWhere('@type', 'ProfessionalService'))->toBeNull()
        ->and($graph->firstWhere('@type', 'FAQPage'))->toBeNull();
});

it('ships 1200x630 share images under the size link previews accept', function (string $file) {
    $imagePath = public_path("assets/images/{$file}");

    expect($imagePath)->toBeFile()
        ->and(array_slice(getimagesize($imagePath), 0, 2))->toBe([1200, 630])
        ->and(getimagesize($imagePath)['mime'])->toBe('image/png')
        ->and(filesize($imagePath))->toBeLessThan(300 * 1024);
})->with(['og-netizo-o-nas.png', 'og-netizo-about-en.png']);
