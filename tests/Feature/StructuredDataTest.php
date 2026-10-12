<?php

use App\Models\Project;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->withoutVite();
    Storage::fake('public');
    Project::factory()->create(['slug' => 'flotapro']);
});

$publicPages = [
    'home' => ['/', 'pl'],
    'english home' => ['/en', 'en'],
    'websites' => ['/tworzenie-stron-internetowych', 'pl'],
    'english websites' => ['/en/website-development', 'en'],
    'stores' => ['/sklepy-internetowe', 'pl'],
    'english stores' => ['/en/online-stores', 'en'],
    'apps' => ['/aplikacje-webowe', 'pl'],
    'english apps' => ['/en/web-applications', 'en'],
    'mobile' => ['/aplikacje-mobilne', 'pl'],
    'english mobile' => ['/en/mobile-apps', 'en'],
    'ai' => ['/automatyzacja-ai', 'pl'],
    'english ai' => ['/en/ai-automation', 'en'],
    'devops' => ['/devops-i-chmura', 'pl'],
    'english devops' => ['/en/devops-cloud', 'en'],
    'partners' => ['/partnerzy', 'pl'],
    'english partners' => ['/en/partners', 'en'],
    'about' => ['/o-nas', 'pl'],
    'english about' => ['/en/about', 'en'],
    'projects' => ['/realizacje', 'pl'],
    'english projects' => ['/en/projects', 'en'],
    'case study' => ['/realizacje/flotapro', 'pl'],
    'english case study' => ['/en/projects/flotapro', 'en'],
    'privacy policy' => ['/polityka-prywatnosci', 'pl'],
    'english privacy policy' => ['/en/privacy-policy', 'en'],
    'terms' => ['/regulamin', 'pl'],
    'english terms' => ['/en/terms', 'en'],
    'partner terms' => ['/partnerzy/regulamin', 'pl'],
    'english partner terms' => ['/en/partners/terms', 'en'],
];

dataset('public pages', $publicPages);
dataset('pages below the home page', array_diff_key($publicPages, array_flip(['home', 'english home'])));

/**
 * Every `{"@id": …}` link in a JSON-LD value, at any depth.
 *
 * @return list<string>
 */
function jsonLdReferences(mixed $value): array
{
    if (! is_array($value)) {
        return [];
    }

    if (array_keys($value) === ['@id']) {
        return [$value['@id']];
    }

    return array_merge([], ...array_map(jsonLdReferences(...), array_values($value)));
}

/**
 * The @id of every node in a JSON-LD value (a node has properties besides its @id), at any depth.
 *
 * @return list<string>
 */
function jsonLdNodeIds(mixed $value): array
{
    if (! is_array($value)) {
        return [];
    }

    $ids = isset($value['@id']) && count($value) > 1 ? [$value['@id']] : [];

    return array_merge($ids, ...array_map(jsonLdNodeIds(...), array_values($value)));
}

it('names the same organization and website on every public page, and links the page to both', function (string $path, string $locale) {
    $graph = jsonLdGraph($this->get($path));
    $organization = $graph->first();
    $pageUrl = $path === '/' ? url('/').'/' : url($path);
    $page = $graph->firstWhere('@id', $pageUrl.'#webpage');

    expect($organization['@id'])->toBe(url('/').'/#organization')
        ->and($organization['name'])->toBe('Netizo')
        ->and($organization['url'])->toBe(url('/').'/')
        ->and($organization['logo']['url'])->toBe(asset('images/icons/icon-512.png'))
        ->and($graph->get(1)['@type'])->toBe('WebSite')
        ->and($graph->get(1)['@id'])->toBe(url('/').'/#website')
        ->and($page)->not->toBeNull()
        ->and($page['url'])->toBe($pageUrl)
        ->and($page['inLanguage'])->toBe($locale)
        ->and($page['isPartOf'])->toBe(['@id' => url('/').'/#website'])
        ->and($page['publisher'])->toBe(['@id' => url('/').'/#organization'])
        ->and($page['primaryImageOfPage']['width'])->toBe(1200)
        ->and($page['primaryImageOfPage']['height'])->toBe(630);
})->with('public pages');

it('links only to nodes of the same page, each described once', function (string $path, string $locale) {
    $graph = jsonLdGraph($this->get($path))->all();
    $ids = jsonLdNodeIds($graph);

    expect($ids)->toBe(array_values(array_unique($ids)))
        ->and(array_diff(jsonLdReferences($graph), $ids))->toBeEmpty();
})->with('public pages');

it('puts every page below the home page of its language in the breadcrumbs', function (string $path, string $locale) {
    $breadcrumbs = jsonLdGraph($this->get($path))->firstWhere('@type', 'BreadcrumbList');
    $crumbs = $breadcrumbs['itemListElement'];

    expect($crumbs[0])->toBe([
        '@type' => 'ListItem',
        'position' => 1,
        'name' => 'Netizo',
        'item' => $locale === 'pl' ? url('/').'/' : url('/en'),
    ])
        ->and(end($crumbs)['item'])->toBe(url($path))
        ->and(array_column($crumbs, 'position'))->toBe(range(1, count($crumbs)));
})->with('pages below the home page');
