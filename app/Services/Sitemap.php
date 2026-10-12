<?php

namespace App\Services;

use App\Http\Controllers\LegalPageController;
use App\Models\Client;
use App\Models\Project;
use Carbon\CarbonImmutable;
use DateTimeInterface;

/**
 * The indexable pages of the public site for sitemap.xml: one entry per page and language, with the hreflang alternates
 * of App\Services\LocalizedRoutes (the same ones the pages put in their <head>) and the date of their last change.
 */
class Sitemap
{
    /**
     * Polish route names of the pages without parameters (the English twin `en.<name>` comes from LocalizedRoutes), with
     * the day their copy or layout last changed. Bump a date with a change that matters to a reader, not with a deploy.
     *
     * @var array<string, string>
     */
    private const PAGES = [
        'home' => '2026-10-12',
        'projects.index' => '2026-10-12',
        'about' => '2026-10-12',
        'partners' => '2026-10-12',
        'partners.terms' => LegalPageController::PARTNER_TERMS_EFFECTIVE_DATE,
        'privacy' => LegalPageController::PRIVACY_EFFECTIVE_DATE,
        'terms' => LegalPageController::TERMS_EFFECTIVE_DATE,
    ];

    /** The day the case study layout last changed; a project's own edits in the panel count too. */
    private const CASE_STUDY_DATE = '2026-10-12';

    /**
     * @return list<array{loc: string, lastmod: string, alternates: array<string, string>}>
     */
    public function entries(): array
    {
        $projects = Project::active()->ordered()->get();
        $projectsChangedAt = $projects->max('updated_at');
        $entries = [];

        foreach (self::PAGES as $name => $date) {
            $dataChangedAt = match ($name) {
                'home' => [$projectsChangedAt, Client::active()->max('updated_at')],
                'projects.index', 'about' => [$projectsChangedAt],
                default => [],
            };

            $entries = [...$entries, ...$this->pageEntries($name, [], $this->latest($date, ...$dataChangedAt))];
        }

        foreach ($projects as $project) {
            $entries = [...$entries, ...$this->pageEntries('projects.show', ['project' => $project], $this->latest(self::CASE_STUDY_DATE, $project->updated_at))];
        }

        return $entries;
    }

    /**
     * An entry for the page in each language, each listing all of them as alternates (Polish as x-default).
     *
     * @param  array<string, mixed>  $parameters
     * @return list<array{loc: string, lastmod: string, alternates: array<string, string>}>
     */
    private function pageEntries(string $name, array $parameters, string $lastmod): array
    {
        $alternates = LocalizedRoutes::alternates($name, $parameters);

        if ($alternates === []) {
            return [['loc' => route($name, $parameters), 'lastmod' => $lastmod, 'alternates' => []]];
        }

        $alternates['x-default'] = $alternates[LocalizedRoutes::DEFAULT_LOCALE];

        return array_map(fn (string $locale): array => [
            'loc' => $alternates[$locale],
            'lastmod' => $lastmod,
            'alternates' => $alternates,
        ], LocalizedRoutes::LOCALES);
    }

    /**
     * The latest of the page's own date and the changes of the panel data it shows, as YYYY-MM-DD.
     */
    private function latest(string $date, DateTimeInterface|string|null ...$dataChangedAt): string
    {
        return collect([$date, ...$dataChangedAt])
            ->filter()
            ->map(fn (DateTimeInterface|string $value): CarbonImmutable => CarbonImmutable::parse($value))
            ->max()
            ->toDateString();
    }
}
