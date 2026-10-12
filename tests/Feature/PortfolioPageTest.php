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
function portfolioSchemas(string $path): Collection
{
    $response = test()->get($path)->assertOk();

    preg_match_all('/<script type="application\/ld\+json">(.*?)<\/script>/s', $response->getContent(), $matches);

    return collect($matches[1])->map(fn (string $json): mixed => json_decode(trim($json), true));
}

it('serves the list of projects and the case studies under the same slug in both languages', function () {
    $project = Project::factory()->create(['slug' => 'zloty-klos']);

    expect(route('projects.index', absolute: false))->toBe('/realizacje')
        ->and(route('en.projects.index', absolute: false))->toBe('/en/projects')
        ->and(route('projects.show', $project, absolute: false))->toBe('/realizacje/zloty-klos')
        ->and(route('en.projects.show', $project, absolute: false))->toBe('/en/projects/zloty-klos');
});

it('lists the active projects in the order of the panel, without their long copy', function (string $path) {
    Project::factory()->create(['slug' => 'trzeci', 'sort_order' => 3]);
    Project::factory()->create(['slug' => 'pierwszy', 'sort_order' => 1, 'url' => 'pierwszy.pl', 'thumbnail_image' => 'projects/thumbnails/pierwszy.webp']);
    Project::factory()->create(['slug' => 'drugi', 'sort_order' => 2]);
    Project::factory()->inactive()->create(['slug' => 'ukryty', 'sort_order' => 0]);

    $this->get($path)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects')
            ->has('projects', 3)
            ->where('projects.0.slug', 'pierwszy')
            ->where('projects.1.slug', 'drugi')
            ->where('projects.2.slug', 'trzeci')
            ->has('projects.0', fn (Assert $project) => $project
                ->where('url', 'pierwszy.pl')
                ->where('thumbnailUrl', asset('storage/projects/thumbnails/pierwszy.webp'))
                ->hasAll(['id', 'slug', 'title', 'category', 'description', 'fullImageUrl', 'techStack', 'metrics'])
                ->missing('fullDescription')
                ->missing('challenges')
                ->missing('solutions')));
})->with(['/realizacje', '/en/projects']);

it('renders the list without projects', function () {
    $this->get('/realizacje')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('projects')->has('projects', 0));
});

it('renders a case study with the whole project and the next one in the order of the panel', function () {
    Project::factory()->create(['slug' => 'pierwszy', 'sort_order' => 1]);
    Project::factory()->create([
        'slug' => 'drugi',
        'sort_order' => 2,
        'url' => 'drugi.pl',
        'full_description' => 'Pełny opis projektu.',
        'challenges' => [['challenge' => 'Wyzwanie']],
        'solutions' => [['solution' => 'Rozwiązanie']],
    ]);
    Project::factory()->inactive()->create(['slug' => 'ukryty', 'sort_order' => 3]);
    Project::factory()->create(['slug' => 'trzeci', 'sort_order' => 4]);

    $this->get('/realizacje/drugi')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('case-study')
            ->where('project.slug', 'drugi')
            ->where('project.liveUrl', 'https://drugi.pl')
            ->where('project.fullDescription', 'Pełny opis projektu.')
            ->where('project.challenges', ['Wyzwanie'])
            ->where('project.solutions', ['Rozwiązanie'])
            ->where('nextProject.slug', 'trzeci')
            ->missing('nextProject.fullDescription'));

    $this->get('/realizacje/trzeci')
        ->assertInertia(fn (Assert $page) => $page->where('nextProject.slug', 'pierwszy'));
});

it('has no next project when the case study is the only active one', function () {
    Project::factory()->create(['slug' => 'jedyny']);
    Project::factory()->inactive()->create(['slug' => 'ukryty']);

    $this->get('/en/projects/jedyny')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('nextProject', null));
});

it('returns 404 for an inactive project and an unknown slug', function (string $path) {
    Project::factory()->inactive()->create(['slug' => 'ukryty']);

    $this->get($path)->assertNotFound();
})->with(['/realizacje/ukryty', '/en/projects/ukryty', '/realizacje/nie-ma-takiego', '/en/projects/nie-ma-takiego']);

it('shows the English copy of a case study on /en, falling back to the Polish one field by field', function () {
    Project::factory()->create([
        'slug' => 'przetlumaczony',
        'category' => 'Strona firmowa',
        'category_en' => 'Company website',
        'full_description' => 'Pełny opis projektu.',
        'full_description_en' => '   ',
        'challenges' => [['challenge' => 'Wyzwanie']],
        'challenges_en' => [['challenge' => 'A challenge']],
        'solutions' => [['solution' => 'Rozwiązanie']],
        'solutions_en' => null,
    ]);

    $this->get('/en/projects/przetlumaczony')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'en')
            ->where('project.category', 'Company website')
            ->where('project.fullDescription', 'Pełny opis projektu.')
            ->where('project.challenges', ['A challenge'])
            ->where('project.solutions', ['Rozwiązanie']));
});

it('links the case study to its twin in the other language', function () {
    Project::factory()->create(['slug' => 'mebloteka']);

    $this->get('/realizacje/mebloteka')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('alternates', [
            'pl' => url('/realizacje/mebloteka'),
            'en' => url('/en/projects/mebloteka'),
        ]))
        ->assertSee('<link rel="canonical" href="'.url('/realizacje/mebloteka').'">', false)
        ->assertSee('<link rel="alternate" hreflang="pl" href="'.url('/realizacje/mebloteka').'">', false)
        ->assertSee('<link rel="alternate" hreflang="en" href="'.url('/en/projects/mebloteka').'">', false)
        ->assertSee('<link rel="alternate" hreflang="x-default" href="'.url('/realizacje/mebloteka').'">', false)
        ->assertSee('<meta property="og:url" content="'.url('/realizacje/mebloteka').'">', false);

    $this->get('/en/projects/mebloteka')
        ->assertSee('<html lang="en"', false)
        ->assertSee('<link rel="canonical" href="'.url('/en/projects/mebloteka').'">', false);
});

it('renders the SEO tags of the list in each language', function (string $path, string $title, string $description, string $image) {
    $this->get($path)
        ->assertOk()
        ->assertSee("<title>{$title}</title>", false)
        ->assertSee('<meta name="description" content="'.$description.'">', false)
        ->assertSee('<link rel="canonical" href="'.url($path).'">', false)
        ->assertSee('<meta property="og:image" content="'.asset($image).'">', false)
        ->assertDontSee('<meta name="keywords"', false);

    expect(mb_strlen($description))->toBeLessThanOrEqual(155);
})->with([
    'polish' => ['/realizacje', 'Realizacje: strony, sklepy i aplikacje webowe – Leszno | Netizo', 'Zobacz nasze realizacje: strony firmowe, sklepy i aplikacje webowe z opisem wyzwań, rozwiązań i wyników. Wyceń podobny projekt w Netizo.', 'assets/images/og-netizo-2.png'],
    'english' => ['/en/projects', 'Projects: websites, stores and web apps – Leszno, Poland | Netizo', 'See our projects: company websites, online stores and web apps, with the challenges, solutions and results. Get a quote for a similar one.', 'assets/images/og-netizo-en.png'],
]);

it('titles a case study after the project and shares its screenshot', function () {
    Project::factory()->create([
        'slug' => 'flotapro',
        'title' => 'FlotaPro',
        'category' => 'Aplikacja webowa / SaaS',
        'category_en' => 'Web application / SaaS',
        'description' => 'Panel do zarządzania flotą firmową.',
        'thumbnail_image' => 'projects/thumbnails/flotapro.webp',
        'full_image' => 'projects/full/flotapro.webp',
    ]);

    $this->get('/realizacje/flotapro')
        ->assertSee('<title>FlotaPro – Aplikacja webowa / SaaS | Realizacje Netizo</title>', false)
        ->assertSee('<meta name="description" content="Panel do zarządzania flotą firmową.">', false)
        ->assertSee('<meta property="og:image" content="'.asset('storage/projects/thumbnails/flotapro.webp').'">', false)
        ->assertSee('<meta name="twitter:image" content="'.asset('storage/projects/thumbnails/flotapro.webp').'">', false)
        ->assertDontSee('<meta name="keywords"', false);

    $this->get('/en/projects/flotapro')
        ->assertSee('<title>FlotaPro – Web application / SaaS | Netizo case studies</title>', false);
});

it('falls back to the share image and shortens a long description for a case study', function () {
    Project::factory()->create(['slug' => 'dlugi', 'description' => str_repeat('Bardzo długi opis projektu. ', 12)]);

    $response = $this->get('/realizacje/dlugi')
        ->assertSee('<meta property="og:image" content="'.asset('assets/images/og-netizo-2.png').'">', false);

    preg_match('/<meta name="description" content="([^"]*)">/', $response->getContent(), $matches);

    expect(mb_strlen(html_entity_decode($matches[1])))->toBeLessThanOrEqual(155)
        ->and($matches[1])->toEndWith('…');
});

it('describes the project as a CreativeWork made by Netizo, with breadcrumbs', function () {
    Project::factory()->create([
        'slug' => 'flotapro',
        'title' => 'FlotaPro',
        'url' => 'flotapro.app',
        'category' => 'Aplikacja webowa / SaaS',
        'description' => 'Krótki opis.',
        'full_description' => 'Pełny opis.',
        'thumbnail_image' => 'projects/thumbnails/flotapro.webp',
        'full_image' => 'projects/full/flotapro.webp',
        'tech_stack' => ['Laravel', 'React'],
    ]);

    $schemas = portfolioSchemas('/realizacje/flotapro');
    $work = $schemas->firstWhere('@type', 'CreativeWork');
    $breadcrumbs = $schemas->firstWhere('@type', 'BreadcrumbList');

    expect($work)->toMatchArray([
        '@id' => url('/realizacje/flotapro').'#project',
        'name' => 'FlotaPro',
        'abstract' => 'Krótki opis.',
        'description' => 'Pełny opis.',
        'genre' => 'Aplikacja webowa / SaaS',
        'url' => 'https://flotapro.app',
        'mainEntityOfPage' => url('/realizacje/flotapro'),
        'image' => [asset('storage/projects/full/flotapro.webp'), asset('storage/projects/thumbnails/flotapro.webp')],
        'keywords' => 'Laravel, React',
        'inLanguage' => 'pl',
        'creator' => ['@type' => 'Organization', 'name' => 'Netizo', 'url' => url('/')],
    ])
        ->and(array_column($breadcrumbs['itemListElement'], 'item'))->toBe([url('/'), url('/realizacje'), url('/realizacje/flotapro')])
        ->and(array_column($breadcrumbs['itemListElement'], 'name'))->toBe(['Netizo', 'Realizacje', 'FlotaPro']);

    $english = portfolioSchemas('/en/projects/flotapro')->firstWhere('@type', 'BreadcrumbList');

    expect(array_column($english['itemListElement'], 'item'))->toBe([url('/en'), url('/en/projects'), url('/en/projects/flotapro')]);
});

it('lists the case studies as an ItemList of the collection page', function () {
    Project::factory()->create(['slug' => 'drugi', 'title' => 'Drugi', 'sort_order' => 2]);
    Project::factory()->create(['slug' => 'pierwszy', 'title' => 'Pierwszy', 'sort_order' => 1]);
    Project::factory()->inactive()->create(['slug' => 'ukryty']);

    $page = portfolioSchemas('/realizacje')->firstWhere('@type', 'CollectionPage');

    expect($page['url'])->toBe(url('/realizacje'))
        ->and($page['mainEntity']['numberOfItems'])->toBe(2)
        ->and($page['mainEntity']['itemListElement'])->toBe([
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Pierwszy', 'url' => url('/realizacje/pierwszy')],
            ['@type' => 'ListItem', 'position' => 2, 'name' => 'Drugi', 'url' => url('/realizacje/drugi')],
        ]);
});

it('leaves out the generic default JSON-LD on the project pages', function (string $path) {
    Project::factory()->create(['slug' => 'flotapro']);

    $types = portfolioSchemas($path)->pluck('@type')->all();

    expect($types)->not->toContain('WebPage')
        ->and($types)->not->toContain('ProfessionalService');
})->with(['/realizacje', '/realizacje/flotapro']);

it('keeps text typed in the panel inside its JSON-LD script tag', function () {
    Project::factory()->create(['slug' => 'xss', 'title' => 'Projekt</script><script>alert(1)</script>']);

    $this->get('/realizacje/xss')
        ->assertOk()
        ->assertDontSee('</script><script>alert(1)', false);
});

it('gives every script on the case study the nonce of its response', function () {
    Project::factory()->create(['slug' => 'flotapro']);

    $response = $this->get('/realizacje/flotapro')->assertOk();

    preg_match_all('/<script\b[^>]*>/i', (string) $response->getContent(), $matches);
    $scripts = array_values(array_filter($matches[0], fn (string $tag): bool => ! preg_match('#type="application/(ld\+)?json"#', $tag)));

    expect($scripts)->not->toBeEmpty()
        ->each->toContain('nonce="'.scriptNonce($response).'"');
});
