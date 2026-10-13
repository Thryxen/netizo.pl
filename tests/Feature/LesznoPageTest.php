<?php

use App\Enums\Service;
use App\Models\Project;
use App\Services\StructuredData;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    Storage::fake('public');
});

dataset('leszno pages', [
    'polish' => ['/tworzenie-stron-internetowych/leszno', 'pl'],
    'english' => ['/en/website-development/leszno', 'en'],
]);

/**
 * The Leszno page in the other language.
 */
function lesznoPageTwin(string $path): string
{
    return $path === '/tworzenie-stron-internetowych/leszno' ? '/en/website-development/leszno' : '/tworzenie-stron-internetowych/leszno';
}

it('serves the page under the websites page in both languages', function () {
    expect(route('leszno', absolute: false))->toBe('/tworzenie-stron-internetowych/leszno')
        ->and(route('en.leszno', absolute: false))->toBe('/en/website-development/leszno');
});

it('renders the websites tiers, its own FAQ and the other services', function (string $path, string $locale) {
    $offers = trans('services.websites.offers', [], $locale);
    $brackets = Service::Websites->priceBrackets();

    $this->get($path)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('leszno')
            ->where('locale', $locale)
            ->where('alternates', [
                'pl' => url($locale === 'pl' ? $path : lesznoPageTwin($path)),
                'en' => url($locale === 'en' ? $path : lesznoPageTwin($path)),
            ])
            ->has('offers', 2)
            ->where('offers.0.name', $offers[0]['name'])
            ->where('offers.0.priceFrom', $brackets[0]['from'])
            ->where('offers.0.priceTo', $brackets[0]['to'])
            ->where('offers.1.priceFrom', $brackets[1]['from'])
            ->where('offers.1.priceTo', $brackets[1]['to'])
            ->where('faq', trans('leszno.faq', [], $locale))
            ->has('otherServices', count(Service::cases()) - 1)
            ->where('otherServices', fn ($services) => collect($services)->doesntContain('key', Service::Websites->value)));
})->with('leszno pages');

it('shows up to four active projects from the region, in the order of the panel', function () {
    Project::factory()->local()->create(['slug' => 'drugi', 'sort_order' => 2]);
    Project::factory()->local()->create(['slug' => 'treepropl', 'sort_order' => 1]);
    Project::factory()->local()->inactive()->create(['slug' => 'ukryty', 'sort_order' => 0]);
    Project::factory()->withServices(Service::Websites)->create(['slug' => 'spoza-regionu', 'sort_order' => 3]);
    Project::factory()->local()->create(['slug' => 'trzeci', 'sort_order' => 4]);
    Project::factory()->local()->create(['slug' => 'czwarty', 'sort_order' => 5]);
    Project::factory()->local()->create(['slug' => 'piaty', 'sort_order' => 6]);

    $this->get('/tworzenie-stron-internetowych/leszno')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('projects', 4)
            ->where('projects.0.slug', 'treepropl')
            ->where('projects.1.slug', 'drugi')
            ->where('projects.2.slug', 'trzeci')
            ->where('projects.3.slug', 'czwarty')
            ->has('projects.0', fn (Assert $project) => $project
                ->hasAll(['id', 'slug', 'title', 'url', 'category', 'description', 'thumbnailUrl', 'fullImageUrl', 'techStack', 'metrics'])
                ->missing('fullDescription')));
});

it('shows no projects while none is marked as from the region', function () {
    Project::factory()->withServices(Service::Websites)->create();

    $this->get('/tworzenie-stron-internetowych/leszno')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('projects', 0));
});

it('renders its own title and description within the lengths search results show, with the price it starts at', function (string $path, string $locale) {
    $title = trans('leszno.seo.title', [], $locale);
    $description = trans('leszno.seo.description', [], $locale);
    $price = $locale === 'pl' ? '799 zł' : 'PLN 799';

    $this->get($path)
        ->assertOk()
        ->assertSee('<title>'.e($title).'</title>', false)
        ->assertSee('<meta name="description" content="'.e($description).'">', false);

    expect(mb_strlen($title))->toBeLessThanOrEqual(60)
        ->and(mb_strlen($description))->toBeLessThanOrEqual(155)
        ->and($title)->toContain('Leszno')->toContain($price)
        ->and($description)->toContain('Leszn')->toContain($price);
})->with('leszno pages');

it('links both language versions for search engines and share previews', function (string $path, string $locale) {
    $polish = $locale === 'pl' ? $path : lesznoPageTwin($path);
    $english = $locale === 'en' ? $path : lesznoPageTwin($path);
    $image = trans('leszno.seo.image', [], $locale);

    expect(public_path($image))->toBeFile()
        ->and(getimagesize(public_path($image)))->toMatchArray([0 => 1200, 1 => 630]);

    $this->get($path)
        ->assertOk()
        ->assertSee('<html lang="'.$locale.'" class="">', false)
        ->assertSee('<link rel="canonical" href="'.url($path).'">', false)
        ->assertSee('<link rel="alternate" hreflang="pl" href="'.url($polish).'">', false)
        ->assertSee('<link rel="alternate" hreflang="en" href="'.url($english).'">', false)
        ->assertSee('<link rel="alternate" hreflang="x-default" href="'.url($polish).'">', false)
        ->assertSee('<meta property="og:image" content="'.asset($image).'">', false)
        ->assertSee('<meta property="og:image:alt" content="'.e(trans('leszno.seo.image_alt', [], $locale)).'">', false)
        ->assertSee('<meta name="twitter:image" content="'.asset($image).'">', false);
})->with('leszno pages');

it('describes the page under the websites page, the service where we travel with its prices and the FAQ in the JSON-LD', function (string $path, string $locale) {
    $response = $this->get($path);
    $graph = jsonLdGraph($response);
    $pageUrl = url($path);
    $homeUrl = $locale === 'pl' ? url('/').'/' : url('/en');
    $websitesUrl = url($locale === 'pl' ? '/tworzenie-stron-internetowych' : '/en/website-development');
    $serviceNode = $graph->firstWhere('@type', 'Service');
    $faqNode = $graph->firstWhere('@type', 'FAQPage');
    $faq = $response->viewData('page')['props']['faq'];

    expect($graph->firstWhere('@type', 'WebPage')['mainEntity'])->toBe(['@id' => "{$pageUrl}#service"])
        ->and($graph->firstWhere('@type', 'BreadcrumbList')['itemListElement'])->toBe([
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Netizo', 'item' => $homeUrl],
            ['@type' => 'ListItem', 'position' => 2, 'name' => trans('services.websites.seo.breadcrumb', [], $locale), 'item' => $websitesUrl],
            ['@type' => 'ListItem', 'position' => 3, 'name' => trans('leszno.seo.breadcrumb', [], $locale), 'item' => $pageUrl],
        ])
        ->and($serviceNode['name'])->toBe(trans('leszno.seo.name', [], $locale))
        ->and($serviceNode['provider'])->toBe(['@id' => url('/').'/#organization'])
        ->and(array_column($serviceNode['areaServed'], 'name'))->toBe(StructuredData::MEETING_TOWNS)
        ->and(array_map(fn (array $offer): int => $offer['priceSpecification']['minPrice'], $serviceNode['offers']))
        ->toBe(array_column(Service::Websites->priceBrackets(), 'from'))
        ->and(collect($faqNode['mainEntity'])->pluck('name')->all())->toBe(array_column($faq, 'question'))
        ->and(collect($faqNode['mainEntity'])->pluck('acceptedAnswer.text')->all())->toBe(array_column($faq, 'answer'));
})->with('leszno pages');

it('names no address in Leszno: Netizo has no office there and Kępno is its registered address', function (string $path) {
    $graph = jsonLdGraph($this->get($path));

    expect(json_encode($graph->all()))->not->toContain('PostalAddress')
        ->and($graph->firstWhere('@type', 'ProfessionalService'))->toBeNull()
        ->and(trans('leszno.faq.1.answer', [], 'pl'))->toContain('Kępno')
        ->and(trans('leszno.faq.1.answer', [], 'en'))->toContain('Kępno');
})->with('leszno pages');

it('quotes the websites page prices in its FAQ', function () {
    [$simple, $larger] = Service::Websites->priceBrackets();
    $polish = fn (int $amount): string => str_replace(' ', "\u{00A0}", number_format($amount, 0, ',', ' '))."\u{00A0}zł";
    $english = fn (int $amount): string => "PLN\u{00A0}".number_format($amount);

    expect(trans('leszno.faq.2.answer', [], 'pl'))
        ->toContain($polish($simple['from']), $polish($simple['to']), $polish($larger['from']), $polish($larger['to']))
        ->and(trans('leszno.faq.2.answer', [], 'en'))
        ->toContain($english($simple['from']), $english($simple['to']), $english($larger['from']), $english($larger['to']));
});

it('names the towns we travel to in its FAQ, as the meeting area does', function (string $locale) {
    foreach (StructuredData::MEETING_TOWNS as $town) {
        expect(trans('leszno.seo.description', [], $locale).' '.trans('leszno.faq.0.answer', [], $locale))->toContain($town === 'Leszno' ? 'Leszn' : mb_substr($town, 0, 5));
    }
})->with(['pl', 'en']);

it('keeps the meeting towns of the JSON-LD and of the about page map the same', function () {
    $aboutData = file_get_contents(resource_path('js/components/about/about-data.ts'));

    preg_match_all("/\\{ name: '([^']+)', lat:/u", $aboutData, $matches);

    expect($matches[1])->toBe(StructuredData::MEETING_TOWNS);
});

it('is linked from the footer of every page and from the service pages', function () {
    $footer = file_get_contents(resource_path('js/components/home/site-footer.tsx'));
    $hero = file_get_contents(resource_path('js/components/services/service-hero.tsx'));

    expect($footer)->toContain('pageUrls.leszno')
        ->and($hero)->toContain('pageUrls.leszno');
});
