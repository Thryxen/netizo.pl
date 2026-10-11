<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Project;
use Illuminate\Support\Str;

/**
 * A project as page props for the public pages (home, about): the English site shows each `_en` column, falling back
 * to the Polish one field by field while it is empty.
 */
trait PresentsProjects
{
    /**
     * @return array{id: int, slug: string, title: string, url: string, liveUrl: string, category: string, description: string, fullDescription: string, thumbnailUrl: string|null, fullImageUrl: string|null, techStack: list<string>, metrics: list<array{value: string, label: string}>, challenges: list<string>, solutions: list<string>}
     */
    protected function projectProps(Project $project): array
    {
        $url = (string) $project->url;
        $metrics = $this->metricList($this->translated($project, 'metrics'));

        return [
            'id' => $project->id,
            'slug' => $project->slug,
            'title' => $project->title,
            'url' => $url,
            'liveUrl' => $this->absoluteUrl($url) ?? '',
            'category' => (string) $this->translated($project, 'category'),
            'description' => (string) $this->translated($project, 'description'),
            'fullDescription' => (string) $this->translated($project, 'full_description'),
            'thumbnailUrl' => $project->thumbnail_image ? asset('storage/'.$project->thumbnail_image) : null,
            'fullImageUrl' => $project->full_image ? asset('storage/'.$project->full_image) : null,
            'techStack' => $this->stringList($project->tech_stack),
            'metrics' => $metrics,
            'challenges' => $this->stringList($this->translated($project, 'challenges')),
            'solutions' => $this->stringList($this->translated($project, 'solutions')),
        ];
    }

    /**
     * A project column in the current language: on the English site its `_en` twin, unless that one is empty (the
     * Polish copy is shown until the English one is filled in the panel).
     */
    protected function translated(Project $project, string $column): mixed
    {
        if (app()->getLocale() === 'pl') {
            return $project->{$column};
        }

        $value = $project->{"{$column}_en"};
        $isEmpty = is_array($value) ? $this->stringList($value) === [] && $this->metricList($value) === [] : trim((string) $value) === '';

        return $isEmpty ? $project->{$column} : $value;
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    protected function metricList(mixed $value): array
    {
        return collect(is_array($value) ? $value : [])
            ->filter(fn (mixed $metric): bool => is_array($metric) && (filled($metric['value'] ?? null) || filled($metric['label'] ?? null)))
            ->map(fn (array $metric): array => [
                'value' => (string) ($metric['value'] ?? ''),
                'label' => (string) ($metric['label'] ?? ''),
            ])
            ->values()
            ->all();
    }

    /**
     * Prefix a bare domain with https:// so it is safe to use as an external link.
     */
    protected function absoluteUrl(?string $url): ?string
    {
        $url = trim((string) $url);

        if ($url === '') {
            return null;
        }

        return Str::startsWith(Str::lower($url), ['https://', 'http://']) ? $url : 'https://'.$url;
    }

    /**
     * Coerce a JSON array cast (which may be null, or hold repeater rows like ['challenge' => '…']) into a list of strings.
     *
     * @return list<string>
     */
    protected function stringList(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return collect($value)
            ->map(fn (mixed $item): mixed => is_array($item) ? collect($item)->first(fn (mixed $field): bool => is_scalar($field)) : $item)
            ->filter(fn (mixed $item): bool => is_scalar($item) && trim((string) $item) !== '')
            ->map(fn (mixed $item): string => (string) $item)
            ->values()
            ->all();
    }
}
