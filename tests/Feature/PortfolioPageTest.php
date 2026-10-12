<?php

use App\Models\Project;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Facade;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    Storage::fake('public');
});

/**
 * Put a screenshot on the (fake) public disk, as the panel stores it.
 */
function storeProjectScreenshot(string $path, int $width = 1024, int $height = 1536): string
{
    Storage::disk('public')->put($path, UploadedFile::fake()->image('screenshot.jpg', $width, $height)->getContent());

    return $path;
}

/**
 * The og:image URL of a page. SEOTools keeps its tags in singletons, which a test's earlier requests would have filled
 * (every real request starts empty), so they are dropped first.
 */
function ogImageOf(string $path): string
{
    foreach (['seotools.metatags', 'seotools.opengraph', 'seotools.twitter', 'seotools.json-ld', 'seotools.json-ld-multi', 'seotools'] as $binding) {
        app()->forgetInstance($binding);
    }

    Facade::clearResolvedInstances();

    preg_match('/<meta property="og:image" content="([^"]+)">/', test()->get($path)->assertOk()->getContent(), $matches);

    return $matches[1] ?? '';
}

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
    'polish' => ['/realizacje', 'Realizacje: strony, sklepy i aplikacje webowe – Leszno | Netizo', 'Zobacz nasze realizacje: strony firmowe, sklepy i aplikacje webowe z opisem wyzwań, rozwiązań i wyników. Wyceń podobny projekt w Netizo.', 'assets/images/og-netizo-realizacje.jpg'],
    'english' => ['/en/projects', 'Projects: websites, stores and web apps – Leszno, Poland | Netizo', 'See our projects: company websites, online stores and web apps, with the challenges, solutions and results. Get a quote for a similar one.', 'assets/images/og-netizo-projects-en.jpg'],
]);

it('ships the list\'s 1200x630 share images under the size link previews accept', function (string $file) {
    $imagePath = public_path("assets/images/{$file}");

    expect($imagePath)->toBeFile()
        ->and(array_slice(getimagesize($imagePath), 0, 2))->toBe([1200, 630])
        ->and(getimagesize($imagePath)['mime'])->toBe('image/jpeg')
        ->and(filesize($imagePath))->toBeLessThan(300 * 1024);
})->with(['og-netizo-realizacje.jpg', 'og-netizo-projects-en.jpg']);

it('describes the share image of the list and of a case study', function () {
    Project::factory()->create(['slug' => 'flotapro', 'title' => 'FlotaPro']);

    $this->get('/realizacje')
        ->assertSee('<meta property="og:image:width" content="1200">', false)
        ->assertSee('<meta property="og:image:height" content="630">', false)
        ->assertSee('<meta property="og:image:alt" content="Realizacje Netizo: strony, sklepy i aplikacje webowe">', false)
        ->assertSee('<meta name="twitter:image:alt" content="Realizacje Netizo: strony, sklepy i aplikacje webowe">', false);

    $this->get('/en/projects/flotapro')
        ->assertSee('<meta property="og:image:alt" content="FlotaPro: a Netizo case study">', false)
        ->assertSee('<meta property="og:image:width" content="1200">', false);
});

it('titles a case study after the project and its type, with a call to see it after the description', function () {
    Project::factory()->create([
        'slug' => 'flotapro',
        'title' => 'FlotaPro',
        'category' => 'Aplikacja webowa / SaaS',
        'category_en' => 'Web application / SaaS',
        'description' => 'Panel do zarządzania flotą firmową.',
        'description_en' => 'A fleet management panel.',
    ]);

    $this->get('/realizacje/flotapro')
        ->assertSee('<title>FlotaPro – Aplikacja webowa / SaaS | Netizo</title>', false)
        ->assertSee('<meta name="description" content="Panel do zarządzania flotą firmową. Zobacz, jak to zrobiliśmy.">', false)
        ->assertDontSee('<meta name="keywords"', false);

    $this->get('/en/projects/flotapro')
        ->assertSee('<title>FlotaPro – Web application / SaaS | Netizo</title>', false)
        ->assertSee('<meta name="description" content="A fleet management panel. See how we built it.">', false);
});

it('drops the project type from a title that would not fit search results', function () {
    Project::factory()->create(['slug' => 'zloty-klos', 'title' => 'Piekarnia Złoty Kłos', 'category' => 'Strona firmowa / Zamówienia online', 'category_en' => null]);
    Project::factory()->create(['slug' => 'bez-rodzaju', 'title' => 'Bez rodzaju', 'category' => '']);

    $this->get('/realizacje/zloty-klos')->assertSee('<title>Piekarnia Złoty Kłos – realizacja Netizo</title>', false);
    $this->get('/en/projects/zloty-klos')->assertSee('<title>Piekarnia Złoty Kłos – Netizo case study</title>', false);
    $this->get('/realizacje/bez-rodzaju')->assertSee('<title>Bez rodzaju – realizacja Netizo</title>', false);
});

it('shares a case study as a 1200x630 card drawn from its screenshot, one per language', function () {
    $project = Project::factory()->create([
        'slug' => 'flotapro',
        'title' => 'FlotaPro',
        'thumbnail_image' => storeProjectScreenshot('projects/thumbnails/flotapro.webp', 1600, 1000),
        'full_image' => storeProjectScreenshot('projects/full/flotapro.webp'),
    ]);

    $polish = ogImageOf('/realizacje/flotapro');
    $english = ogImageOf('/en/projects/flotapro');

    expect($polish)->toStartWith(asset("storage/projects/share/{$project->id}-pl-"))->toEndWith('.jpg')
        ->and($english)->toStartWith(asset("storage/projects/share/{$project->id}-en-"))
        ->and(ogImageOf('/realizacje/flotapro'))->toBe($polish);

    $file = Storage::disk('public')->path(str_replace(asset('storage').'/', '', $polish));

    expect(array_slice(getimagesize($file), 0, 2))->toBe([1200, 630])
        ->and(getimagesize($file)['mime'])->toBe('image/jpeg')
        ->and(filesize($file))->toBeLessThan(300 * 1024);

    $this->get('/realizacje/flotapro')
        ->assertSee('<meta name="twitter:image" content="'.$polish.'">', false);
});

it('draws a new card under a new name when the project changes, and removes the old one', function () {
    $project = Project::factory()->create([
        'slug' => 'flotapro',
        'title' => 'FlotaPro',
        'thumbnail_image' => storeProjectScreenshot('projects/thumbnails/flotapro.webp', 1600, 1000),
    ]);

    $before = ogImageOf('/realizacje/flotapro');
    $project->update(['title' => 'FlotaPro 2']);
    $after = ogImageOf('/realizacje/flotapro');

    expect($after)->not->toBe($before)
        ->and(Storage::disk('public')->files('projects/share'))->toBe([str_replace(asset('storage').'/', '', $after)]);
});

it('falls back to the list\'s share image and shortens a long description for a case study', function () {
    Project::factory()->create(['slug' => 'dlugi', 'description' => str_repeat('Bardzo długi opis projektu. ', 12)]);
    Project::factory()->create(['slug' => 'bez-pliku', 'thumbnail_image' => 'projects/thumbnails/missing.webp']);

    expect(ogImageOf('/realizacje/bez-pliku'))->toBe(asset('assets/images/og-netizo-realizacje.jpg'))
        ->and(ogImageOf('/en/projects/bez-pliku'))->toBe(asset('assets/images/og-netizo-projects-en.jpg'));

    $response = $this->get('/realizacje/dlugi')
        ->assertSee('<meta property="og:image" content="'.asset('assets/images/og-netizo-realizacje.jpg').'">', false);

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
