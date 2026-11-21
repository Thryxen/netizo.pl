<?php

use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

dataset('metin2 cms pages', [
    'polish' => ['/metin2cms', 'pl'],
    'english' => ['/en/metin2cms', 'en'],
]);

it('renders the page with its FAQ in both languages', function (string $path, string $locale) {
    $this->get($path)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('metin2cms')
            ->where('locale', $locale)
            ->where('alternates', ['pl' => url('/metin2cms'), 'en' => url('/en/metin2cms')])
            ->where('faq', trans('metin2cms.faq', [], $locale)));
})->with('metin2 cms pages');

it('keeps the title and description within what search results show', function (string $path, string $locale) {
    $title = trans('metin2cms.seo.title', [], $locale);
    $description = trans('metin2cms.seo.description', [], $locale);

    expect(mb_strlen($title))->toBeLessThanOrEqual(60)
        ->and(mb_strlen($description))->toBeLessThanOrEqual(155);

    $image = trans('metin2cms.seo.image', [], $locale);

    expect(public_path($image))->toBeFile();

    $this->get($path)
        ->assertSee('<title>'.e($title).'</title>', false)
        ->assertSee('<link rel="canonical" href="'.url($path).'">', false)
        ->assertSee('<meta property="og:image" content="'.asset($image).'">', false);
})->with('metin2 cms pages');

it('describes the page and its questions in one JSON-LD graph', function (string $path, string $locale) {
    preg_match('#<script type="application/ld\+json"[^>]*>(.+?)</script>#s', $this->get($path)->getContent(), $match);
    $nodes = collect(json_decode($match[1], true)['@graph']);
    $faq = $nodes->firstWhere('@type', 'FAQPage');

    $page = $nodes->firstWhere('@type', 'WebPage');
    $service = $nodes->firstWhere('@type', 'Service');

    expect($page['name'])->toBe(trans('metin2cms.seo.name', [], $locale))
        ->and($page['mainEntity']['@id'])->toBe($service['@id'])
        ->and($service['serviceType'])->toBe(trans('metin2cms.seo.service_type', [], $locale))
        ->and($service['provider']['@id'])->toBe($nodes->firstWhere('@type', 'Organization')['@id'])
        ->and($faq['mainEntity'])->toHaveCount(count(trans('metin2cms.faq', [], $locale)));
})->with('metin2 cms pages');

it('names what a server owner searches for in the title and the description', function (string $locale, array $phrases) {
    $meta = trans('metin2cms.seo.title', [], $locale).' '.trans('metin2cms.seo.description', [], $locale);

    foreach ($phrases as $phrase) {
        expect($meta)->toContain($phrase);
    }
})->with([
    'polish' => ['pl', ['CMS Metin2', 'strona serwera', 'panel gracza', 'prywatnego serwera Metin2']],
    'english' => ['en', ['Metin2 CMS', 'private server', 'player panel', 'website']],
]);

it('has the same questions in both languages', function () {
    expect(count(trans('metin2cms.faq', [], 'en')))->toBe(count(trans('metin2cms.faq', [], 'pl')));
});
