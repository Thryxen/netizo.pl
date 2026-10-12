<?php

namespace App\Services;

use App\Enums\Service;
use App\Http\Controllers\Concerns\PresentsProjects;
use App\Models\Project;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Support\Traits\Localizable;

/**
 * /llms.txt (https://llmstxt.org): Netizo in Markdown for AI agents and assistants. The Polish sections come first, then
 * the same ones in English, then `Optional` (the legal documents, the sitemap, the social profiles). Every fact comes
 * from the source the pages use (the FAQ in lang/, the projects of the panel, the organization of StructuredData), so
 * the file says what the pages say; lang/{pl,en}/llms.php holds only the names and notes that link them together.
 */
class LlmsTxt
{
    use Localizable;
    use PresentsProjects;

    /**
     * The pages listed under `Strony` / `Pages`: the copy key in lang/{pl,en}/llms.php → the Polish route name.
     *
     * @var array<string, string>
     */
    private const PAGES = [
        'home' => 'home',
        'websites' => 'services.websites',
        'stores' => 'services.stores',
        'apps' => 'services.apps',
        'mobile' => 'services.mobile',
        'ai' => 'services.ai',
        'devops' => 'services.devops',
        'projects' => 'projects.index',
        'about' => 'about',
        'partners' => 'partners',
    ];

    /**
     * The legal documents: the copy key in lang/{pl,en}/llms.php and lang/{pl,en}/legal.php → the Polish route name.
     *
     * @var array<string, string>
     */
    private const DOCUMENTS = [
        'privacy' => 'privacy',
        'terms' => 'terms',
        'partner_terms' => 'partners.terms',
    ];

    /**
     * Names of the networks of config/socials.php, as the footer shows them (`socialNetworkNames` in lib/site.ts).
     *
     * @var array<string, string>
     */
    private const NETWORK_NAMES = [
        'facebook' => 'Facebook',
        'instagram' => 'Instagram',
        'tiktok' => 'TikTok',
        'youtube' => 'YouTube',
        'linkedin' => 'LinkedIn',
        'discord' => 'Discord',
        'google' => 'Google Business Profile',
    ];

    public function render(): string
    {
        $projects = Project::active()->ordered()->get();
        $homes = ['polish' => StructuredData::normalizedUrl(route('home')), 'english' => route('en.home')];

        $summaries = $this->inEachLocale(fn (): string => '> '.$this->text(__('home.seo.organization_description')));
        $intros = $this->inEachLocale(fn (): string => $this->text(__('llms.intro', $homes)));

        $lines = ['# '.StructuredData::NAME, '', implode("\n>\n", $summaries), ''];

        foreach ($intros as $intro) {
            $lines = [...$lines, $intro, ''];
        }

        $sections = [
            ...array_merge(...$this->inEachLocale(fn (): array => $this->sections($projects))),
            ['heading' => 'Optional', 'links' => $this->optionalLinks()],
        ];

        foreach ($sections as $section) {
            if ($section['links'] !== []) {
                $lines = [...$lines, "## {$section['heading']}", '', ...$section['links'], ''];
            }
        }

        return implode("\n", $lines);
    }

    /**
     * The sections in the current language: the pages, the services, the case studies, the FAQs (home, partner programme,
     * each service) and the contact.
     *
     * @param  Collection<int, Project>  $projects
     * @return list<array{heading: string, links: list<string>}>
     */
    private function sections(Collection $projects): array
    {
        $home = StructuredData::normalizedUrl(LocalizedRoutes::url('home'));
        $organization = StructuredData::organization();
        $address = $organization['address'];

        return [
            [
                'heading' => __('llms.headings.pages'),
                'links' => array_map(
                    fn (string $key, string $route): string => $this->link(__("llms.pages.{$key}.name"), StructuredData::normalizedUrl(LocalizedRoutes::url($route)), __("llms.pages.{$key}.note")),
                    array_keys(self::PAGES),
                    self::PAGES,
                ),
            ],
            [
                'heading' => __('llms.headings.services'),
                'links' => array_map(
                    fn (array $service): string => $this->link($service['name'], $this->serviceUrl($service, $home), $service['note']),
                    __('llms.services'),
                ),
            ],
            [
                'heading' => __('llms.headings.projects'),
                'links' => $projects->map(fn (Project $project): string => $this->projectLink($project))->values()->all(),
            ],
            [
                'heading' => __('llms.headings.faq'),
                'links' => $this->faqLinks(__('home.faq'), $this->anchored($home, 'faq')),
            ],
            [
                'heading' => __('llms.headings.partner_faq'),
                'links' => $this->faqLinks(__('partners.faq'), $this->anchored(LocalizedRoutes::url('partners'), 'partner_faq')),
            ],
            ...array_map(fn (Service $service): array => [
                'heading' => __('llms.headings.service_faq', ['service' => __("services.{$service->value}.card.name")]),
                'links' => $this->faqLinks(__("services.{$service->value}.faq"), $this->anchored(LocalizedRoutes::url($service->routeName()), 'service_faq')),
            ], Service::cases()),
            [
                'heading' => __('llms.headings.contact'),
                'links' => [
                    $this->link(__('llms.contact.form.name'), $this->anchored($home, 'contact'), __('llms.contact.form.note', [
                        'email' => $organization['email'],
                        'telephone' => $organization['telephone'],
                    ])),
                    $this->link(__('llms.contact.company.name'), $this->anchored(LocalizedRoutes::url('about'), 'company'), __('llms.contact.company.note', [
                        'tax_id' => $organization['taxID'],
                        'regon' => $organization['identifier']['value'],
                        'address' => "{$address['streetAddress']}, {$address['postalCode']} {$address['addressLocality']}",
                    ])),
                ],
            ],
        ];
    }

    /**
     * Where a service of the services section leads: its own page when it has one (`page`, an App\Enums\Service value),
     * else the services section of the home page.
     *
     * @param  array{name: string, note: string, page?: string}  $service
     */
    private function serviceUrl(array $service, string $home): string
    {
        $page = Service::tryFrom($service['page'] ?? '');

        return $page === null ? $this->anchored($home, 'services') : LocalizedRoutes::url($page->routeName());
    }

    /**
     * A project's case study in the current language: its type, its short description and the live site.
     */
    private function projectLink(Project $project): string
    {
        $liveUrl = $this->absoluteUrl($project->url);

        $note = collect([
            $this->sentence((string) $this->translated($project, 'category')),
            $this->sentence((string) $this->translated($project, 'description')),
            $liveUrl === null ? '' : __('llms.live_site', ['url' => $liveUrl]),
        ])->filter()->implode(' ');

        return $this->link($project->title, LocalizedRoutes::url('projects.show', ['project' => $project]), $note);
    }

    /**
     * Each question of a FAQ as a link to the FAQ, with its answer as the note.
     *
     * @param  list<array{question: string, answer: string}>  $faq
     * @return list<string>
     */
    private function faqLinks(array $faq, string $url): array
    {
        return array_map(fn (array $item): string => $this->link($item['question'], $url, $item['answer']), $faq);
    }

    /**
     * The legal documents in each language, the sitemap and the social profiles.
     *
     * @return list<string>
     */
    private function optionalLinks(): array
    {
        $documents = $this->inEachLocale(fn (): array => array_map(
            fn (string $key, string $route): string => $this->link(__("llms.documents.{$key}"), LocalizedRoutes::url($route), __("legal.{$key}.description")),
            array_keys(self::DOCUMENTS),
            self::DOCUMENTS,
        ));

        $profiles = array_map(
            fn (array $profile): string => $this->link(self::NETWORK_NAMES[$profile['network']] ?? Str::headline($profile['network']), $profile['url']),
            SocialProfiles::all(),
        );

        return [...array_merge(...$documents), $this->link('sitemap.xml', route('sitemap')), ...$profiles];
    }

    /**
     * A list item: the link, and after a colon what it says.
     */
    private function link(string $name, string $url, ?string $note = null): string
    {
        $label = str_replace(['\\', '[', ']'], ['\\\\', '\\[', '\\]'], $this->text($name));
        $note = $this->text((string) $note);

        return "- [{$label}]({$url})".($note === '' ? '' : ": {$note}");
    }

    /**
     * The section `$section` (a key of `anchors` in lang/{pl,en}/llms.php) of the page `$url` in the current language.
     */
    private function anchored(string $url, string $section): string
    {
        return $url.'#'.__("llms.anchors.{$section}");
    }

    /**
     * The value of `$callback` in each language, Polish first.
     *
     * @template TValue
     *
     * @param  callable(): TValue  $callback
     * @return list<TValue>
     */
    private function inEachLocale(callable $callback): array
    {
        return array_map(fn (string $locale): mixed => $this->withLocale($locale, $callback), LocalizedRoutes::LOCALES);
    }

    /**
     * Text from the admin panel as a sentence: on one line, with a full stop when it has no closing punctuation.
     */
    private function sentence(string $text): string
    {
        $text = $this->text($text);

        return $text === '' || preg_match('/[.!?…]$/u', $text) === 1 ? $text : "{$text}.";
    }

    /**
     * Text on one line, without the typesetting of the pages: no word joiners in ranges, plain spaces for no-break ones.
     */
    private function text(string $text): string
    {
        return Str::squish(str_replace(["\u{2060}", "\u{00A0}"], ['', ' '], $text));
    }
}
