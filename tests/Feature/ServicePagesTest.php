<?php

use App\Enums\Service;
use App\Models\Project;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    Storage::fake('public');
});

/**
 * Every service page: its path, the service and the language.
 *
 * @var array<string, array{0: string, 1: Service, 2: string}>
 */
$servicePages = [
    'websites' => ['/tworzenie-stron-internetowych', Service::Websites, 'pl'],
    'english websites' => ['/en/website-development', Service::Websites, 'en'],
    'stores' => ['/sklepy-internetowe', Service::Stores, 'pl'],
    'english stores' => ['/en/online-stores', Service::Stores, 'en'],
    'apps' => ['/aplikacje-webowe', Service::Apps, 'pl'],
    'english apps' => ['/en/web-applications', Service::Apps, 'en'],
    'mobile' => ['/aplikacje-mobilne', Service::Mobile, 'pl'],
    'english mobile' => ['/en/mobile-apps', Service::Mobile, 'en'],
    'ai' => ['/automatyzacja-ai', Service::Ai, 'pl'],
    'english ai' => ['/en/ai-automation', Service::Ai, 'en'],
    'devops' => ['/devops-i-chmura', Service::Devops, 'pl'],
    'english devops' => ['/en/devops-cloud', Service::Devops, 'en'],
];

dataset('service pages', $servicePages);

/**
 * The page of the service in the other language.
 */
function servicePageTwin(string $path): string
{
    return [
        '/tworzenie-stron-internetowych' => '/en/website-development',
        '/en/website-development' => '/tworzenie-stron-internetowych',
        '/sklepy-internetowe' => '/en/online-stores',
        '/en/online-stores' => '/sklepy-internetowe',
        '/aplikacje-webowe' => '/en/web-applications',
        '/en/web-applications' => '/aplikacje-webowe',
        '/aplikacje-mobilne' => '/en/mobile-apps',
        '/en/mobile-apps' => '/aplikacje-mobilne',
        '/automatyzacja-ai' => '/en/ai-automation',
        '/en/ai-automation' => '/automatyzacja-ai',
        '/devops-i-chmura' => '/en/devops-cloud',
        '/en/devops-cloud' => '/devops-i-chmura',
    ][$path];
}

/**
 * An amount in złoty as the FAQ writes it in Polish: no-break spaces inside the amount and before the unit ("1 299 zł").
 */
function polishFaqAmount(int $amount): string
{
    return str_replace(' ', "\u{00A0}", number_format($amount, 0, ',', ' '))."\u{00A0}zł";
}

/**
 * An amount in złoty as the page's copy writes it: "1 000 zł" in Polish, "PLN 1,000" in English.
 */
function servicePrice(int $amount, string $locale): string
{
    return $locale === 'pl' ? number_format($amount, 0, ',', ' ').' zł' : 'PLN '.number_format($amount);
}

it('serves the service pages at their addresses in both languages', function () {
    expect(route('services.websites', absolute: false))->toBe('/tworzenie-stron-internetowych')
        ->and(route('en.services.websites', absolute: false))->toBe('/en/website-development')
        ->and(route('services.stores', absolute: false))->toBe('/sklepy-internetowe')
        ->and(route('en.services.stores', absolute: false))->toBe('/en/online-stores')
        ->and(route('services.apps', absolute: false))->toBe('/aplikacje-webowe')
        ->and(route('en.services.apps', absolute: false))->toBe('/en/web-applications')
        ->and(route('services.mobile', absolute: false))->toBe('/aplikacje-mobilne')
        ->and(route('en.services.mobile', absolute: false))->toBe('/en/mobile-apps')
        ->and(route('services.ai', absolute: false))->toBe('/automatyzacja-ai')
        ->and(route('en.services.ai', absolute: false))->toBe('/en/ai-automation')
        ->and(route('services.devops', absolute: false))->toBe('/devops-i-chmura')
        ->and(route('en.services.devops', absolute: false))->toBe('/en/devops-cloud');
});

it('renders the page of the service with its tiers, FAQ and the other services', function (string $path, Service $service, string $locale) {
    $offers = trans("services.{$service->value}.offers", [], $locale);
    $brackets = $service->priceBrackets();
    $others = array_values(array_filter(Service::cases(), fn (Service $other): bool => $other !== $service));

    $this->get($path)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component("services/{$service->value}")
            ->where('locale', $locale)
            ->where('alternates', [
                'pl' => url($locale === 'pl' ? $path : servicePageTwin($path)),
                'en' => url($locale === 'en' ? $path : servicePageTwin($path)),
            ])
            ->has('offers', 2)
            ->where('offers.0.name', $offers[0]['name'])
            ->where('offers.0.priceFrom', $brackets[0]['from'])
            ->where('offers.0.priceTo', $brackets[0]['to'])
            ->where('offers.1.name', $offers[1]['name'])
            ->where('offers.1.priceFrom', $brackets[1]['from'])
            ->where('offers.1.priceTo', $brackets[1]['to'])
            ->where('offers.0.includes', $offers[0]['includes'])
            ->where('faq', trans("services.{$service->value}.faq", [], $locale))
            ->has('faq', fn (Assert $faq) => $faq->each(fn (Assert $item) => $item->whereType('question', 'string')->whereType('answer', 'string')))
            ->has('otherServices', count(Service::cases()) - 1)
            ->where('otherServices.0.key', $others[0]->value)
            ->where('otherServices.0.name', trans("services.{$others[0]->value}.card.name", [], $locale))
            ->where('otherServices.0.priceFrom', $others[0]->priceBrackets()[0]['from'])
            ->where('otherServices.0.url', route(($locale === 'pl' ? '' : 'en.').$others[0]->routeName()))
            ->where('otherServices.1.key', $others[1]->value)
            ->missing('clients'));
})->with('service pages');

it('gives every tier a description and what it includes, and a timeline only where the site states one', function (string $path, Service $service, string $locale) {
    $offers = $this->get($path)->viewData('page')['props']['offers'];

    foreach ($offers as $offer) {
        expect($offer['description'])->toBeString()->not->toBeEmpty()
            ->and($offer['includes'])->not->toBeEmpty()
            ->and($offer['timeline'] === null || is_string($offer['timeline']))->toBeTrue();
    }

    expect(array_column($offers, 'timeline'))->toBe([
        trans("services.{$service->value}.offers.0.timeline", [], $locale),
        trans("services.{$service->value}.offers.1.timeline", [], $locale),
    ]);
})->with('service pages');

it('shows up to four active projects tagged with the service, in the order of the panel', function () {
    Project::factory()->withServices(Service::Stores)->create(['slug' => 'drugi', 'sort_order' => 2]);
    Project::factory()->withServices(Service::Websites, Service::Stores)->create(['slug' => 'pierwszy', 'sort_order' => 1]);
    Project::factory()->withServices(Service::Stores)->inactive()->create(['slug' => 'ukryty', 'sort_order' => 0]);
    Project::factory()->withServices(Service::Apps)->create(['slug' => 'aplikacja', 'sort_order' => 3]);
    Project::factory()->create(['slug' => 'bez-uslug', 'sort_order' => 4, 'services' => null]);
    Project::factory()->withServices(Service::Stores)->create(['slug' => 'trzeci', 'sort_order' => 5]);
    Project::factory()->withServices(Service::Stores)->create(['slug' => 'czwarty', 'sort_order' => 6]);
    Project::factory()->withServices(Service::Stores)->create(['slug' => 'piaty', 'sort_order' => 7]);

    $this->get('/sklepy-internetowe')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('projects', 4)
            ->where('projects.0.slug', 'pierwszy')
            ->where('projects.1.slug', 'drugi')
            ->where('projects.2.slug', 'trzeci')
            ->where('projects.3.slug', 'czwarty')
            ->has('projects.0', fn (Assert $project) => $project
                ->hasAll(['id', 'slug', 'title', 'url', 'category', 'description', 'thumbnailUrl', 'fullImageUrl', 'techStack', 'metrics'])
                ->missing('fullDescription')
                ->missing('challenges')));

    $this->get('/aplikacje-webowe')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('projects', 1)->where('projects.0.slug', 'aplikacja'));
});

it('shows no projects on the page of a service no project is tagged with', function () {
    Project::factory()->withServices(Service::Apps)->create();

    $this->get('/tworzenie-stron-internetowych')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('projects', 0));
});

it('shows the English copy of a project on the English page, falling back to the Polish one', function () {
    Project::factory()->withServices(Service::Apps)->create([
        'slug' => 'flotapro',
        'category' => 'Aplikacja webowa',
        'category_en' => 'Web application',
        'description' => 'Panel floty',
        'description_en' => null,
    ]);

    $this->get('/en/web-applications')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('projects.0.category', 'Web application')
            ->where('projects.0.description', 'Panel floty'));
});

it('renders its own title and description within the lengths search results show, with the price it starts at', function (string $path, Service $service, string $locale) {
    $title = trans("services.{$service->value}.seo.title", [], $locale);
    $description = trans("services.{$service->value}.seo.description", [], $locale);

    $this->get($path)
        ->assertOk()
        ->assertSee('<title>'.e($title).'</title>', false)
        ->assertSee('<meta name="description" content="'.e($description).'">', false)
        ->assertDontSee('<meta name="keywords"', false);

    expect(mb_strlen($title))->toBeLessThanOrEqual(60)
        ->and(mb_strlen($description))->toBeLessThanOrEqual(155)
        ->and($title)->toContain(servicePrice($service->priceBrackets()[0]['from'], $locale))
        ->and($description)->toContain(servicePrice($service->priceBrackets()[0]['from'], $locale));
})->with('service pages');

it('links both language versions for search engines and share previews', function (string $path, Service $service, string $locale) {
    $polish = $locale === 'pl' ? $path : servicePageTwin($path);
    $english = $locale === 'en' ? $path : servicePageTwin($path);
    $imageUrl = asset(trans("services.{$service->value}.seo.image", [], $locale));

    $this->get($path)
        ->assertOk()
        ->assertSee('<html lang="'.$locale.'" class="">', false)
        ->assertSee('<link rel="canonical" href="'.url($path).'">', false)
        ->assertSee('<link rel="alternate" hreflang="pl" href="'.url($polish).'">', false)
        ->assertSee('<link rel="alternate" hreflang="en" href="'.url($english).'">', false)
        ->assertSee('<link rel="alternate" hreflang="x-default" href="'.url($polish).'">', false)
        ->assertSee('<meta property="og:url" content="'.url($path).'">', false)
        ->assertSee('<meta property="og:locale" content="'.($locale === 'pl' ? 'pl_PL' : 'en_US').'">', false)
        ->assertSee('<meta property="og:image" content="'.$imageUrl.'">', false)
        ->assertSee('<meta property="og:image:width" content="1200">', false)
        ->assertSee('<meta property="og:image:height" content="630">', false)
        ->assertSee('<meta property="og:image:alt" content="'.e(trans("services.{$service->value}.seo.image_alt", [], $locale)).'">', false)
        ->assertSee('<meta name="twitter:image" content="'.$imageUrl.'">', false)
        ->assertDontSee('og-netizo-2.png', false);
})->with('service pages');

it('describes the page, its breadcrumbs, the service with its prices and the FAQ in the JSON-LD', function (string $path, Service $service, string $locale) {
    $response = $this->get($path);
    $graph = jsonLdGraph($response);
    $pageUrl = url($path);
    $homeUrl = $locale === 'pl' ? url('/').'/' : url('/en');
    $webPage = $graph->firstWhere('@type', 'WebPage');
    $serviceNode = $graph->firstWhere('@type', 'Service');
    $faqNode = $graph->firstWhere('@type', 'FAQPage');
    $faq = $response->viewData('page')['props']['faq'];

    expect($webPage['@id'])->toBe("{$pageUrl}#webpage")
        ->and($webPage['name'])->toBe(trans("services.{$service->value}.seo.name", [], $locale))
        ->and($webPage['inLanguage'])->toBe($locale)
        ->and($webPage['mainEntity'])->toBe(['@id' => "{$pageUrl}#service"])
        ->and($graph->firstWhere('@type', 'BreadcrumbList')['itemListElement'])->toBe([
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Netizo', 'item' => $homeUrl],
            ['@type' => 'ListItem', 'position' => 2, 'name' => trans("services.{$service->value}.seo.breadcrumb", [], $locale), 'item' => $pageUrl],
        ])
        ->and(array_keys($serviceNode))->toBe(['@type', '@id', 'name', 'serviceType', 'description', 'url', 'mainEntityOfPage', 'provider', 'areaServed', 'offers'])
        ->and($serviceNode['@id'])->toBe("{$pageUrl}#service")
        ->and($serviceNode['provider'])->toBe(['@id' => url('/').'/#organization'])
        ->and($serviceNode['url'])->toBe($pageUrl)
        ->and($serviceNode['areaServed'])->not->toBeEmpty()
        ->and(array_column($serviceNode['offers'], 'name'))->toBe(array_column(trans("services.{$service->value}.offers", [], $locale), 'name'))
        ->and(array_map(fn (array $offer): array => $offer['priceSpecification'], $serviceNode['offers']))->toBe(array_map(
            fn (array $bracket): array => ['@type' => 'PriceSpecification', 'minPrice' => $bracket['from'], 'priceCurrency' => 'PLN'],
            $service->priceBrackets(),
        ))
        ->and($faqNode['isPartOf'])->toBe(['@id' => "{$pageUrl}#webpage"])
        ->and(collect($faqNode['mainEntity'])->pluck('name')->all())->toBe(array_column($faq, 'question'))
        ->and(collect($faqNode['mainEntity'])->pluck('acceptedAnswer.text')->all())->toBe(array_column($faq, 'answer'))
        ->and($graph->firstWhere('@type', 'ProfessionalService'))->toBeNull();
})->with('service pages');

it('starts every service at its price, the same as the home page FAQ quotes', function (Service $service, int $from, string $polish, string $english) {
    expect($service->priceBrackets()[0]['from'])->toBe($from)
        ->and(trans('home.faq.0.answer', [], 'pl'))->toContain($polish)
        ->and(trans('home.faq.0.answer', [], 'en'))->toContain($english)
        ->and(trans("services.{$service->value}.faq.0.answer", [], 'pl'))->toContain('od '.polishFaqAmount($from))
        ->and(trans("services.{$service->value}.faq.0.answer", [], 'en'))->toContain("PLN\u{00A0}".number_format($from));
})->with([
    'websites' => [Service::Websites, 799, "Strona internetowa kosztuje od 799\u{00A0}zł", "A website starts at PLN\u{00A0}799"],
    'stores' => [Service::Stores, 1299, "sklep internetowy od 1\u{00A0}299\u{00A0}zł", "an online store at PLN\u{00A0}1,299"],
    'apps' => [Service::Apps, 1699, "aplikacja webowa od 1\u{00A0}699\u{00A0}zł", "a web application at PLN\u{00A0}1,699"],
    'mobile' => [Service::Mobile, 999, "aplikacja mobilna od 999\u{00A0}zł", "a mobile app at PLN\u{00A0}999"],
    'ai' => [Service::Ai, 299, "automatyzacja z AI od 299\u{00A0}zł", "an AI automation at PLN\u{00A0}299"],
    'devops' => [Service::Devops, 499, "DevOps i chmura od 499\u{00A0}zł", "DevOps and cloud work at PLN\u{00A0}499"],
]);

it('keeps the second tier and the usual ceilings of the tiers', function () {
    expect(Service::Websites->priceBrackets())->toBe([['from' => 799, 'to' => 1499], ['from' => 1799, 'to' => 2999]])
        ->and(Service::Stores->priceBrackets())->toBe([['from' => 1299, 'to' => 4999], ['from' => 5499, 'to' => 12999]])
        ->and(Service::Apps->priceBrackets())->toBe([['from' => 1699, 'to' => 3999], ['from' => 4499, 'to' => null]])
        ->and(Service::Mobile->priceBrackets())->toBe([['from' => 999, 'to' => 3999], ['from' => 4499, 'to' => null]])
        ->and(Service::Ai->priceBrackets())->toBe([['from' => 299, 'to' => 1499], ['from' => 1999, 'to' => 4999]])
        ->and(Service::Devops->priceBrackets())->toBe([['from' => 499, 'to' => 1499], ['from' => 1999, 'to' => 4999]]);
});

it('ships a 1200x630 JPEG share image under the size link previews accept', function (string $path, Service $service, string $locale) {
    $imagePath = public_path(trans("services.{$service->value}.seo.image", [], $locale));

    expect($imagePath)->toBeFile()
        ->and(array_slice(getimagesize($imagePath), 0, 2))->toBe([1200, 630])
        ->and(getimagesize($imagePath)['mime'])->toBe('image/jpeg')
        ->and(filesize($imagePath))->toBeLessThan(300 * 1024);
})->with('service pages');

it('describes what we integrate as what we can do, not as projects the panel may not show', function (string $phrase) {
    $copy = collect(['pl', 'en'])
        ->flatMap(fn (string $locale): array => collect(Service::cases())->flatMap(fn (Service $service): array => array_column(trans("services.{$service->value}.faq", [], $locale), 'answer'))->all())
        ->push(...array_map(fn (string $path): string => file_get_contents($path), glob(resource_path('js/components/services/*-copy.ts'))))
        ->implode("\n");

    expect($copy)->not->toContain($phrase);
})->with([
    'pl projects as evidence' => 'W realizacjach znajdziesz',
    'en projects as evidence' => 'Our projects include',
    'pl case studies as evidence' => 'W case studies podajemy',
    'en case studies as evidence' => 'Our case studies give',
]);

it('gives the website tiers their ranges and timelines, the same as the home FAQ', function () {
    expect(trans('services.websites.offers.0.timeline', [], 'pl'))->toBe('Zwykle do tygodnia')
        ->and(trans('services.websites.offers.1.timeline', [], 'pl'))->toBe('Zwykle do dwóch tygodni')
        ->and(trans('services.websites.offers.0.timeline', [], 'en'))->toBe('Usually up to a week')
        ->and(trans('services.websites.offers.1.timeline', [], 'en'))->toBe('Usually up to two weeks')
        ->and(trans('services.websites.faq.0.answer', [], 'pl'))->toContain("od 799\u{00A0}zł do 1\u{00A0}499\u{00A0}zł")->toContain("od 1\u{00A0}799\u{00A0}zł do 2\u{00A0}999\u{00A0}zł")
        ->and(trans('services.websites.faq.0.answer', [], 'en'))->toContain("PLN\u{00A0}799 to PLN\u{00A0}1,499")->toContain("PLN\u{00A0}1,799 to PLN\u{00A0}2,999")
        ->and(trans('services.websites.faq.1.answer', [], 'pl'))->toContain('w ciągu tygodnia')->toContain('w ciągu dwóch tygodni')
        ->and(trans('services.websites.faq.1.answer', [], 'en'))->toContain('within a week')->toContain('within two weeks')
        ->and(trans('home.faq.1.answer', [], 'pl'))->toContain('w ciągu tygodnia')->toContain('w ciągu dwóch tygodni')->not->toContain('tygodnie,')
        ->and(trans('home.faq.1.answer', [], 'en'))->toContain('within a week')->toContain('within two weeks');
});
