<?php

use App\Models\Project;
use App\Services\StructuredData;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->withoutVite();
});

function llmsTxt(): string
{
    return test()->get('/llms.txt')->assertOk()->getContent();
}

/**
 * The targets of the file's links, in order.
 *
 * @return list<string>
 */
function llmsTxtLinks(string $content): array
{
    preg_match_all('/^- \[(?:[^\]\\\\]|\\\\.)+\]\(([^)\s]+)\)/m', $content, $matches);

    return $matches[1];
}

/**
 * Copy of the pages as the file writes it: on one line, without word joiners, with plain spaces.
 */
function llmsTxtText(string $text): string
{
    return Str::squish(str_replace(["\u{2060}", "\u{00A0}"], ['', ' '], $text));
}

it('is served by the application as plain text kept out of search results', function () {
    expect(public_path('llms.txt'))->not->toBeFile();

    $this->get('/llms.txt')
        ->assertOk()
        ->assertHeader('Content-Type', 'text/plain; charset=utf-8')
        ->assertHeader('X-Robots-Tag', 'noindex')
        ->assertCookieMissing(config('session.cookie'))
        ->assertCookieMissing('XSRF-TOKEN');
});

it('follows the llms.txt format: the name, a summary, then sections of links with Optional last', function () {
    Project::factory()->create();

    $content = llmsTxt();
    $lines = explode("\n", $content);
    $sections = Str::after($content, "\n## ");

    expect($lines[0])->toBe('# '.StructuredData::NAME)
        ->and($lines[1])->toBe('')
        ->and($lines[2])->toStartWith('> ')
        ->and(preg_match_all('/^# /m', $content))->toBe(1)
        ->and(Str::afterLast($content, "\n## "))->toStartWith("Optional\n\n- [")
        ->and($content)->toEndWith(")\n")->not->toEndWith("\n\n");

    foreach (explode("\n", $sections) as $index => $line) {
        expect($line === '' || $index === 0 || str_starts_with($line, '## ') || preg_match('/^- \[.+\]\(\S+\)(: .+)?$/u', $line) === 1)
            ->toBeTrue("Not a heading or a link: {$line}");
    }
});

it('lists every page and the case study of every active project in both languages', function () {
    Project::factory()->create(['slug' => 'zloty-klos', 'sort_order' => 1]);
    Project::factory()->create(['slug' => 'mebloteka', 'sort_order' => 2]);
    Project::factory()->inactive()->create(['slug' => 'ukryty']);

    $links = llmsTxtLinks(llmsTxt());

    expect($links)->toContain(
        url('/').'/', url('/realizacje'), url('/o-nas'), url('/partnerzy'),
        url('/en'), url('/en/projects'), url('/en/about'), url('/en/partners'),
        url('/tworzenie-stron-internetowych'), url('/sklepy-internetowe'), url('/aplikacje-webowe'), url('/aplikacje-mobilne'), url('/automatyzacja-ai'), url('/devops-i-chmura'),
        url('/en/website-development'), url('/en/online-stores'), url('/en/web-applications'), url('/en/mobile-apps'), url('/en/ai-automation'), url('/en/devops-cloud'),
        url('/tworzenie-stron-internetowych/leszno'), url('/en/website-development/leszno'),
        url('/realizacje/zloty-klos'), url('/en/projects/zloty-klos'),
        url('/realizacje/mebloteka'), url('/en/projects/mebloteka'),
        url('/polityka-prywatnosci'), url('/regulamin'), url('/partnerzy/regulamin'),
        url('/en/privacy-policy'), url('/en/terms'), url('/en/partners/terms'),
        url('/sitemap.xml'),
    )
        ->and(array_search(url('/realizacje/zloty-klos'), $links))->toBeLessThan(array_search(url('/realizacje/mebloteka'), $links))
        ->and(implode("\n", $links))->not->toContain('ukryty');
});

it('links only to pages that answer 200 and to sections those pages have', function () {
    Project::factory()->create(['slug' => 'zloty-klos']);

    $sectionIds = file_get_contents(resource_path('js/lib/sections.ts'));
    $links = array_unique(array_filter(llmsTxtLinks(llmsTxt()), fn (string $link): bool => str_starts_with($link, url('/'))));

    foreach ($links as $link) {
        $this->get(parse_url($link, PHP_URL_PATH) ?? '/')->assertOk();

        $fragment = parse_url($link, PHP_URL_FRAGMENT);

        if ($fragment !== null) {
            expect($sectionIds)->toContain("'{$fragment}'");
        }
    }
});

it('answers every question of the FAQs as the pages do, in plain text', function (string $file, string $locale) {
    $content = llmsTxt();

    foreach (trans("{$file}.faq", [], $locale) as $item) {
        expect($content)->toContain('['.llmsTxtText($item['question']).'](')
            ->toContain(': '.llmsTxtText($item['answer'])."\n");
    }

    expect($content)->not->toContain("\u{2060}")->not->toContain("\u{00A0}");
})->with(['home', 'partners'])->with(['pl', 'en']);

it('answers every question of the service FAQs as the service pages do', function (string $service, string $locale) {
    $content = llmsTxt();
    $page = route(($locale === 'pl' ? '' : 'en.')."services.{$service}");

    foreach (trans("services.{$service}.faq", [], $locale) as $item) {
        expect($content)->toContain('['.llmsTxtText($item['question'])."]({$page}#faq): ".llmsTxtText($item['answer'])."\n");
    }
})->with(['websites', 'stores', 'apps', 'mobile', 'ai', 'devops'])->with(['pl', 'en']);

it('answers every question of the Leszno page as the page does', function (string $locale) {
    $content = llmsTxt();
    $page = route(($locale === 'pl' ? '' : 'en.').'leszno');

    foreach (trans('leszno.faq', [], $locale) as $item) {
        expect($content)->toContain('['.llmsTxtText($item['question'])."]({$page}#faq): ".llmsTxtText($item['answer'])."\n");
    }
})->with(['pl', 'en']);

it('links the services that have a page to that page', function (string $locale) {
    $content = llmsTxt();

    foreach (['websites', 'stores', 'apps', 'mobile', 'ai', 'devops'] as $service) {
        $name = trans("services.{$service}.card.name", [], $locale);
        $page = route(($locale === 'pl' ? '' : 'en.')."services.{$service}");

        expect($content)->toContain("- [{$name}]({$page}): ");
    }
})->with(['pl', 'en']);

it('gives the prices and timelines in words an assistant can quote', function () {
    expect(llmsTxt())
        ->toContain('Strona internetowa kosztuje od 799 zł, sklep internetowy od 1 299 zł')
        ->toContain('A website starts at PLN 799, an online store at PLN 1,299')
        ->toContain('Prosta strona albo landing page powstaje zwykle w ciągu tygodnia')
        ->toContain('If the client orders a website for PLN 10,000 net, you get PLN 1,500.');
});

it('describes a case study in the language of its section, falling back to the Polish copy', function () {
    Project::factory()->create([
        'slug' => 'zloty-klos',
        'title' => 'Piekarnia Złoty Kłos',
        'url' => 'zlotyklos.pl',
        'category' => 'Strona firmowa',
        'category_en' => 'Company website',
        'description' => 'Strona piekarni z Leszna z zamówieniami online',
        'description_en' => null,
    ]);

    expect(llmsTxt())
        ->toContain('- [Piekarnia Złoty Kłos]('.url('/realizacje/zloty-klos').'): Strona firmowa. Strona piekarni z Leszna z zamówieniami online. Strona: https://zlotyklos.pl'."\n")
        ->toContain('- [Piekarnia Złoty Kłos]('.url('/en/projects/zloty-klos').'): Company website. Strona piekarni z Leszna z zamówieniami online. Live site: https://zlotyklos.pl'."\n");
});

it('keeps text typed in the admin panel inside its list item', function () {
    Project::factory()->create([
        'slug' => 'sklep-beta',
        'title' => 'Sklep [beta]',
        'url' => 'https://sklep.pl',
        'category' => "Sklep\n## Nagłówek",
        'description' => "Pierwsza linia?\n\n# Druga linia",
        'category_en' => null,
        'description_en' => null,
    ]);

    $content = llmsTxt();

    expect($content)->toContain('- [Sklep \[beta\]]('.url('/realizacje/sklep-beta').'): Sklep ## Nagłówek. Pierwsza linia? # Druga linia. Strona: https://sklep.pl'."\n")
        ->and(preg_match_all('/^#{1,2} /m', $content))->toBe(substr_count($content, "\n## ") + 1);
});

it('lists the services as the services section shows them', function (string $locale) {
    $servicesSection = file_get_contents(resource_path('js/components/home/services-section.tsx'));
    $services = trans('llms.services', [], $locale);

    expect($services)->toHaveCount(preg_match_all("/^ {16}description: '/m", $servicesSection) / 2);

    foreach ($services as $service) {
        expect($servicesSection)->toContain("title: '{$service['name']}'")
            ->toContain("description: '{$service['note']}'");
    }
})->with(['pl', 'en']);

it('gives the contact and company details of the organization', function () {
    $organization = StructuredData::organization();

    expect(llmsTxt())
        ->toContain("{$organization['email']}, telefon {$organization['telephone']}")
        ->toContain("{$organization['email']}, phone {$organization['telephone']}")
        ->toContain("NIP {$organization['taxID']}, REGON {$organization['identifier']['value']}")
        ->toContain($organization['address']['streetAddress'].', '.$organization['address']['postalCode'].' '.$organization['address']['addressLocality']);
});

it('lists the configured social profiles under their names', function () {
    config(['socials' => [
        'facebook' => 'https://www.facebook.com/netizo.agency',
        'instagram' => null,
        'tiktok' => 'https://www.tiktok.com/@netizo.agency',
        'google' => 'https://maps.app.goo.gl/netizo',
    ]]);

    expect(llmsTxt())
        ->toContain("- [Facebook](https://www.facebook.com/netizo.agency)\n")
        ->toContain("- [TikTok](https://www.tiktok.com/@netizo.agency)\n")
        ->toContain("- [Google Business Profile](https://maps.app.goo.gl/netizo)\n")
        ->not->toContain('[Instagram]');
});
