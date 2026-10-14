<?php

use App\Models\Client;
use App\Models\Project;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

/**
 * @param  array<string, mixed>  $attributes
 */
function createHomePageProject(array $attributes = []): Project
{
    static $sequence = 0;
    $sequence++;

    return Project::query()->create([
        'slug' => "projekt-{$sequence}",
        'sort_order' => $sequence,
        'is_active' => true,
        'title' => "Projekt {$sequence}",
        'url' => "projekt-{$sequence}.pl",
        'category' => 'Strona firmowa',
        'description' => 'Krótki opis projektu.',
        'full_description' => 'Pełny opis projektu.',
        'thumbnail_image' => null,
        'full_image' => null,
        'tech_stack' => ['Laravel', 'React'],
        'metrics' => [['value' => '+40%', 'label' => 'konwersji']],
        'challenges' => ['Wyzwanie'],
        'solutions' => ['Rozwiązanie'],
        ...$attributes,
    ]);
}

it('renders the home page as an Inertia response', function () {
    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('projects', 0)
            ->has('clients', 0)
            ->has('faq', 11, fn (Assert $item) => $item
                ->whereType('question', 'string')
                ->whereType('answer', 'string'))
        );
});

it('passes only active projects ordered by sort order with camelCase keys', function () {
    createHomePageProject(['slug' => 'trzeci', 'sort_order' => 30]);
    createHomePageProject([
        'slug' => 'pierwszy',
        'sort_order' => 10,
        'url' => 'treepro.pl',
        'thumbnail_image' => 'projects/thumbnails/treepro.webp',
        'full_image' => 'projects/full/treepro.webp',
    ]);
    createHomePageProject(['slug' => 'ukryty', 'sort_order' => 0, 'is_active' => false]);
    createHomePageProject(['slug' => 'drugi', 'sort_order' => 20, 'url' => 'http://example.com']);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('projects', 3)
            ->where('projects.0.slug', 'pierwszy')
            ->where('projects.1.slug', 'drugi')
            ->where('projects.2.slug', 'trzeci')
            ->has('projects.0', fn (Assert $project) => $project
                ->where('url', 'treepro.pl')
                ->where('liveUrl', 'https://treepro.pl')
                ->where('thumbnailUrl', asset('storage/projects/thumbnails/treepro.webp'))
                ->where('fullImageUrl', asset('storage/projects/full/treepro.webp'))
                ->where('fullDescription', 'Pełny opis projektu.')
                ->where('techStack', ['Laravel', 'React'])
                ->where('metrics', [['value' => '+40%', 'label' => 'konwersji']])
                ->where('challenges', ['Wyzwanie'])
                ->where('solutions', ['Rozwiązanie'])
                ->hasAll(['id', 'title', 'category', 'description'])
                ->missing('full_description')
                ->missing('tech_stack')
                ->missing('thumbnail_image')
                ->etc())
            ->where('projects.1.liveUrl', 'http://example.com')
            ->where('projects.2.thumbnailUrl', null)
            ->where('projects.2.fullImageUrl', null)
        );
});

it('coerces empty project lists to arrays', function () {
    createHomePageProject(['tech_stack' => [], 'metrics' => [], 'challenges' => [], 'solutions' => []]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('projects.0.techStack', [])
            ->where('projects.0.metrics', [])
            ->where('projects.0.challenges', [])
            ->where('projects.0.solutions', [])
        );
});

it('passes only active clients ordered by sort order', function () {
    Client::query()->create(['name' => 'Drugi', 'url' => 'https://drugi.pl', 'sort_order' => 2, 'is_active' => true]);
    Client::query()->create(['name' => 'Pierwszy', 'url' => 'pierwszy.pl', 'sort_order' => 1, 'is_active' => true]);
    Client::query()->create(['name' => 'Ukryty', 'url' => null, 'sort_order' => 0, 'is_active' => false]);
    Client::query()->create(['name' => 'Bez strony', 'url' => null, 'sort_order' => 3, 'is_active' => true]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('clients', 3)
            ->where('clients.0.name', 'Pierwszy')
            ->where('clients.0.url', 'https://pierwszy.pl')
            ->where('clients.1.name', 'Drugi')
            ->where('clients.1.url', 'https://drugi.pl')
            ->where('clients.2.name', 'Bez strony')
            ->where('clients.2.url', null)
        );
});

it('renders the FAQ JSON-LD and SEO tags in the root view', function () {
    $response = $this->get('/')->assertOk();

    $response
        ->assertSee('<script type="application/ld+json">', false)
        ->assertSee('"@type":"FAQPage"', false)
        ->assertSee('"name":"Ile kosztuje strona internetowa lub aplikacja?"', false)
        ->assertSee('"name":"Czy strona będzie widoczna w Google?"', false)
        ->assertSee('<title>Strony internetowe i aplikacje webowe dla firm – Leszno | Netizo</title>', false)
        ->assertSee('<script data-page="app" type="application/json">', false)
        ->assertSee('<div id="app"', false)
        ->assertDontSee('livewire', false);

    $faqSchema = jsonLdGraph($response)->firstWhere('@type', 'FAQPage');

    expect($faqSchema)->not->toBeNull()
        ->and($faqSchema['isPartOf'])->toBe(['@id' => url('/').'/#webpage'])
        ->and($faqSchema['mainEntity'])->toHaveCount(11)
        ->and(collect($faqSchema['mainEntity'])->pluck('name'))->toContain('Czy strona będzie widoczna w Google?')
        ->and($faqSchema['mainEntity'][0]['acceptedAnswer']['@type'])->toBe('Answer');
});

it('renders a search result description that opens with the call to action and no meta keywords', function (string $path, string $description) {
    $this->get($path)
        ->assertOk()
        ->assertSee('<meta name="description" content="'.$description.'">', false)
        ->assertDontSee('<meta name="keywords"', false);

    expect(mb_strlen($description))->toBeLessThanOrEqual(155);
})->with([
    'polish' => ['/', 'Zamów bezpłatną wycenę strony internetowej lub aplikacji. Szybkość i SEO w standardzie, 150+ projektów i 8 lat doświadczenia zespołu. Leszno i cała Polska.'],
    'english' => ['/en', 'Get a free quote for a website or web app. Speed and SEO as standard, 150+ projects and 8 years of team experience. Across Poland, meetings around Leszno.'],
]);

it('describes Netizo in full in the JSON-LD of the home page', function () {
    config(['socials' => ['facebook' => null, 'instagram' => '', 'tiktok' => null, 'youtube' => null, 'linkedin' => null, 'discord' => null, 'google' => null]]);

    $graph = jsonLdGraph($this->get('/'));
    $organization = $graph->firstWhere('@type', 'ProfessionalService');
    $logo = [
        '@type' => 'ImageObject',
        '@id' => url('/').'/#logo',
        'url' => asset('images/icons/icon-512.png'),
        'contentUrl' => asset('images/icons/icon-512.png'),
        'width' => 512,
        'height' => 512,
        'caption' => 'Netizo',
    ];

    expect($organization)->not->toBeNull()
        ->and($organization['@id'])->toBe(url('/').'/#organization')
        ->and($organization['name'])->toBe('Netizo')
        ->and($organization['alternateName'])->toBe('Netizo.pl')
        ->and($organization['url'])->toBe(url('/').'/')
        ->and($organization['description'])->toContain('Netizo założyli w 2023 roku Damian Idzik i Kamil Nawrot.')
        ->and($organization['description'])->not->toContain('150+')
        ->and($organization)->not->toHaveKeys(['sameAs', 'hasMap'])
        ->and($organization['logo'])->toBe($logo)
        ->and($organization['image'])->toBe(['@id' => url('/').'/#logo'])
        ->and($organization['address'])->toBe([
            '@type' => 'PostalAddress',
            'streetAddress' => 'ul. Wiosny Ludów 12 lok. 8',
            'postalCode' => '63-600',
            'addressLocality' => 'Kępno',
            'addressRegion' => 'wielkopolskie',
            'addressCountry' => 'PL',
        ])
        ->and($organization['telephone'])->toBe('+48884343924')
        ->and($organization['email'])->toBe('kontakt@netizo.pl')
        ->and($organization['contactPoint'])->toBe([
            '@type' => 'ContactPoint',
            'contactType' => 'customer service',
            'email' => 'kontakt@netizo.pl',
            'telephone' => '+48884343924',
            'availableLanguage' => ['pl', 'en'],
        ])
        ->and($organization['taxID'])->toBe('6192060508')
        ->and($organization['identifier'])->toBe(['@type' => 'PropertyValue', 'propertyID' => 'REGON', 'value' => '527974955'])
        ->and($organization['areaServed'])->toBe([
            ['@type' => 'Country', 'name' => 'Polska'],
            ['@type' => 'City', 'name' => 'Leszno'],
            ['@type' => 'City', 'name' => 'Rydzyna'],
            ['@type' => 'City', 'name' => 'Wschowa'],
            ['@type' => 'City', 'name' => 'Kościan'],
            ['@type' => 'City', 'name' => 'Gostyń'],
            ['@type' => 'City', 'name' => 'Rawicz'],
        ])
        ->and($organization['priceRange'])->toBe('$$');
});

it('describes the home page as a page of the website about Netizo, with its share image', function () {
    $graph = jsonLdGraph($this->get('/'));
    $webPage = $graph->firstWhere('@type', 'WebPage');

    expect($graph->firstWhere('@type', 'WebSite'))->toBe([
        '@type' => 'WebSite',
        '@id' => url('/').'/#website',
        'url' => url('/').'/',
        'name' => 'Netizo',
        'alternateName' => 'Netizo.pl',
        'inLanguage' => ['pl', 'en'],
        'publisher' => ['@id' => url('/').'/#organization'],
    ])
        ->and($webPage['@id'])->toBe(url('/').'/#webpage')
        ->and($webPage['url'])->toBe(url('/').'/')
        ->and($webPage['name'])->toBe('Strony internetowe i aplikacje webowe dla firm – Leszno | Netizo')
        ->and($webPage['inLanguage'])->toBe('pl')
        ->and($webPage['isPartOf'])->toBe(['@id' => url('/').'/#website'])
        ->and($webPage['about'])->toBe(['@id' => url('/').'/#organization'])
        ->and($webPage['primaryImageOfPage']['url'])->toBe(asset('assets/images/og-netizo-2.png'))
        ->and($webPage['primaryImageOfPage']['width'])->toBe(1200)
        ->and($webPage['primaryImageOfPage']['height'])->toBe(630)
        ->and($webPage)->not->toHaveKey('breadcrumb')
        ->and($graph->firstWhere('@type', 'BreadcrumbList'))->toBeNull();
});

it('lists the configured profiles as sameAs and the Google Business Profile as the map', function (string $path) {
    config(['socials' => [
        'facebook' => 'https://www.facebook.com/netizo',
        'instagram' => null,
        'tiktok' => 'https://www.tiktok.com/@netizo',
        'youtube' => 'https://www.youtube.com/@netizo',
        'linkedin' => 'https://www.linkedin.com/company/netizo',
        'discord' => 'https://discord.gg/netizo',
        'google' => 'https://www.google.com/maps?cid=123',
    ]]);

    $organization = jsonLdGraph($this->get($path))->firstWhere('@type', 'ProfessionalService');

    expect($organization['sameAs'])->toBe([
        'https://www.facebook.com/netizo',
        'https://www.tiktok.com/@netizo',
        'https://www.youtube.com/@netizo',
        'https://www.linkedin.com/company/netizo',
        'https://discord.gg/netizo',
        'https://www.google.com/maps?cid=123',
    ])
        ->and($organization['hasMap'])->toBe('https://www.google.com/maps?cid=123');
})->with(['polish' => '/', 'english' => '/en']);

it('names the same organization and website on the polish and the english home page', function () {
    $polish = jsonLdGraph($this->get('/'));
    $english = jsonLdGraph($this->get('/en'));

    expect($english->firstWhere('@type', 'ProfessionalService')['@id'])->toBe($polish->firstWhere('@type', 'ProfessionalService')['@id'])
        ->and($english->firstWhere('@type', 'ProfessionalService')['url'])->toBe(url('/').'/')
        ->and($english->firstWhere('@type', 'ProfessionalService')['logo'])->toBe($polish->firstWhere('@type', 'ProfessionalService')['logo'])
        ->and($english->firstWhere('@type', 'WebSite'))->toBe($polish->firstWhere('@type', 'WebSite'))
        ->and($english->firstWhere('@type', 'WebPage')['@id'])->toBe(url('/en').'#webpage');
});

it('shares the configured social profiles in config order without the empty ones', function (string $path) {
    config(['socials' => [
        'facebook' => 'https://www.facebook.com/netizo',
        'instagram' => '',
        'tiktok' => 'https://www.tiktok.com/@netizo',
        'youtube' => null,
        'linkedin' => 'https://www.linkedin.com/company/netizo',
        'discord' => null,
        'google' => 'https://www.google.com/maps?cid=123',
    ]]);

    $this->get($path)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('socials', [
            ['network' => 'facebook', 'url' => 'https://www.facebook.com/netizo'],
            ['network' => 'tiktok', 'url' => 'https://www.tiktok.com/@netizo'],
            ['network' => 'linkedin', 'url' => 'https://www.linkedin.com/company/netizo'],
            ['network' => 'google', 'url' => 'https://www.google.com/maps?cid=123'],
        ]));
})->with(['polish' => '/', 'english' => '/en']);

it('shares no social profiles when none is configured', function () {
    config(['socials' => ['facebook' => null, 'instagram' => null, 'tiktok' => null, 'youtube' => null, 'linkedin' => null, 'discord' => null, 'google' => null]]);

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('socials', []));
});

it('points the share image tags at a 1200x630 file under the size link previews accept', function () {
    $response = $this->get('/')->assertOk();
    $imageUrl = asset('assets/images/og-netizo-2.png');
    $imagePath = public_path('assets/images/og-netizo-2.png');

    $response
        ->assertSee('<meta property="og:image" content="'.$imageUrl.'">', false)
        ->assertSee('<meta property="og:image:width" content="1200">', false)
        ->assertSee('<meta property="og:image:height" content="630">', false)
        ->assertSee('<meta name="twitter:image" content="'.$imageUrl.'">', false);

    expect($imagePath)->toBeFile()
        ->and(array_slice(getimagesize($imagePath), 0, 2))->toBe([1200, 630])
        ->and(getimagesize($imagePath)['mime'])->toBe('image/png')
        ->and(filesize($imagePath))->toBeLessThan(300 * 1024)
        ->and(public_path('assets/images/og-image.jpg'))->not->toBeFile();
});

it('sets the dark class on the root element from the appearance cookie', function () {
    $this->withUnencryptedCookie('appearance', 'dark')
        ->get('/')
        ->assertOk()
        ->assertSee('<html lang="pl" class="dark">', false)
        ->assertSee('<meta name="theme-color" content="#0a0a0a">', false);

    $this->withUnencryptedCookie('appearance', 'nonsense')
        ->get('/')
        ->assertOk()
        ->assertSee('<html lang="pl" class="">', false);
});

it('uses a single light theme color for the light appearance', function () {
    $this->withUnencryptedCookie('appearance', 'light')
        ->get('/')
        ->assertOk()
        ->assertSee('<html lang="pl" class="">', false)
        ->assertSee('<meta name="theme-color" content="#ffffff">', false)
        ->assertDontSee('prefers-color-scheme', false);
});

it('re-issues a valid appearance cookie from the server', function () {
    $response = $this->withUnencryptedCookie('appearance', 'dark')->get('/')->assertOk();

    $cookie = collect($response->headers->getCookies())->first(fn ($cookie): bool => $cookie->getName() === 'appearance');

    expect($cookie)->not->toBeNull()
        ->and($cookie->getValue())->toBe('dark')
        ->and($cookie->isHttpOnly())->toBeFalse()
        ->and($cookie->getPath())->toBe('/')
        ->and($cookie->getSameSite())->toBe('lax')
        ->and($cookie->getExpiresTime())->toBeGreaterThan(now()->addDays(364)->getTimestamp());

    $response->assertSee('if (!true) {', false);
});

it('sets no appearance cookie for a visitor who never chose one', function (?string $cookie) {
    $request = $cookie === null ? $this : $this->withUnencryptedCookie('appearance', $cookie);

    $response = $request->get('/')->assertOk();

    expect(collect($response->headers->getCookies())->map->getName())->not->toContain('appearance');

    $response->assertSee('if (!false) {', false);
})->with([
    'no cookie' => [null],
    'legacy system value' => ['system'],
]);

it('is light by default, whatever the operating system prefers', function (?string $cookie) {
    $request = $cookie === null ? $this : $this->withUnencryptedCookie('appearance', $cookie);

    $request->get('/')
        ->assertOk()
        ->assertSee('<html lang="pl" class="">', false)
        ->assertSee('<meta name="theme-color" content="#ffffff">', false)
        ->assertSee('var dark = false;', false)
        ->assertDontSee('prefers-color-scheme', false);
})->with([
    'no cookie' => [null],
    'legacy system value' => ['system'],
]);

it('serves the english home page at /en with the english FAQ', function () {
    expect(route('en.home', absolute: false))->toBe('/en');

    $polishFaq = $this->get('/')->viewData('page')['props']['faq'];

    $this->get('/en')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->where('locale', 'en')
            ->where('alternates', ['pl' => url('/'), 'en' => url('/en')])
            ->has('faq', count($polishFaq), fn (Assert $item) => $item
                ->whereType('question', 'string')
                ->whereType('answer', 'string'))
            ->where('faq.0.question', 'How much does a website or an app cost?'));
});

it('shares the language and the page in both languages with the polish home page', function () {
    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('locale', 'pl')
            ->where('alternates', ['pl' => url('/'), 'en' => url('/en')]));
});

it('links both home pages to each other for search engines and share previews', function (string $path, string $language, string $ogLocale, string $ogAlternate) {
    $this->get($path)
        ->assertOk()
        ->assertSee('<html lang="'.$language.'" class="">', false)
        ->assertSee('<link rel="canonical" href="'.url($path).'">', false)
        ->assertSee('<link rel="alternate" hreflang="pl" href="'.url('/').'">', false)
        ->assertSee('<link rel="alternate" hreflang="en" href="'.url('/en').'">', false)
        ->assertSee('<link rel="alternate" hreflang="x-default" href="'.url('/').'">', false)
        ->assertSee('<meta property="og:url" content="'.url($path).'">', false)
        ->assertSee('<meta property="og:locale" content="'.$ogLocale.'">', false)
        ->assertSee('<meta property="og:locale:alternate" content="'.$ogAlternate.'">', false);
})->with([
    'polish' => ['/', 'pl', 'pl_PL', 'en_US'],
    'english' => ['/en', 'en', 'en_US', 'pl_PL'],
]);

it('renders the english SEO tags, share image and JSON-LD on /en', function () {
    $response = $this->get('/en')->assertOk();
    $imageUrl = asset('assets/images/og-netizo-en.png');

    $response
        ->assertSee('<title>Websites and web apps for businesses – Leszno, Poland | Netizo</title>', false)
        ->assertSee('<meta property="og:image" content="'.$imageUrl.'">', false)
        ->assertSee('<meta name="twitter:image" content="'.$imageUrl.'">', false)
        ->assertDontSee('Strony internetowe i aplikacje webowe dla firm – Leszno', false)
        ->assertDontSee('og-netizo-2.png', false);

    $graph = jsonLdGraph($response);
    $faqSchema = $graph->firstWhere('@type', 'FAQPage');
    $organization = $graph->firstWhere('@type', 'ProfessionalService');
    $webPage = $graph->firstWhere('@type', 'WebPage');

    expect($faqSchema['inLanguage'])->toBe('en')
        ->and($faqSchema['isPartOf'])->toBe(['@id' => url('/en').'#webpage'])
        ->and(collect($faqSchema['mainEntity'])->pluck('name')->all())->toBe(array_column($response->viewData('page')['props']['faq'], 'question'))
        ->and($webPage['url'])->toBe(url('/en'))
        ->and($webPage['inLanguage'])->toBe('en')
        ->and($webPage['primaryImageOfPage']['url'])->toBe($imageUrl)
        ->and($organization['url'])->toBe(url('/').'/')
        ->and($organization['description'])->toBe(__('home.seo.organization_description', locale: 'en'))
        ->and($organization['areaServed'][0])->toBe(['@type' => 'Country', 'name' => 'Poland'])
        ->and($organization['address']['addressLocality'])->toBe('Kępno')
        ->and($organization['knowsLanguage'])->toBe(['pl', 'en']);

    expect(public_path('assets/images/og-netizo-en.png'))->toBeFile()
        ->and(array_slice(getimagesize(public_path('assets/images/og-netizo-en.png')), 0, 2))->toBe([1200, 630])
        ->and(filesize(public_path('assets/images/og-netizo-en.png')))->toBeLessThan(300 * 1024);
});

it('shows the english copy of a project on /en and falls back to polish field by field', function () {
    createHomePageProject([
        'slug' => 'przetlumaczony',
        'title' => 'Złoty Kłos',
        'category_en' => 'Company website',
        'description_en' => 'Short project description.',
        'full_description_en' => '   ',
        'metrics_en' => [['value' => '+40%', 'label' => 'conversion rate']],
        'challenges_en' => [['challenge' => 'A challenge']],
        'solutions_en' => null,
    ]);

    $this->get('/en')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('projects.0.category', 'Company website')
            ->where('projects.0.description', 'Short project description.')
            ->where('projects.0.fullDescription', 'Pełny opis projektu.')
            ->where('projects.0.metrics', [['value' => '+40%', 'label' => 'conversion rate']])
            ->where('projects.0.challenges', ['A challenge'])
            ->where('projects.0.solutions', ['Rozwiązanie'])
            ->where('projects.0.title', 'Złoty Kłos')
            ->where('projects.0.techStack', ['Laravel', 'React']));

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('projects.0.category', 'Strona firmowa')
            ->where('projects.0.description', 'Krótki opis projektu.')
            ->where('projects.0.metrics', [['value' => '+40%', 'label' => 'konwersji']])
            ->where('projects.0.challenges', ['Wyzwanie']));
});

it('shows the polish copy on /en for a project without an english one', function () {
    createHomePageProject();

    $this->get('/en')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('projects.0.category', 'Strona firmowa')
            ->where('projects.0.description', 'Krótki opis projektu.')
            ->where('projects.0.fullDescription', 'Pełny opis projektu.')
            ->where('projects.0.metrics', [['value' => '+40%', 'label' => 'konwersji']])
            ->where('projects.0.challenges', ['Wyzwanie'])
            ->where('projects.0.solutions', ['Rozwiązanie']));
});
