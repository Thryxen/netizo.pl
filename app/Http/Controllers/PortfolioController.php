<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\PresentsProjects;
use App\Models\Project;
use App\Services\LocalizedRoutes;
use App\Services\ProjectShareImage;
use App\Services\StructuredData;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The projects of the admin panel as pages of their own: the list (/realizacje, /en/projects) and a case study per
 * project (/realizacje/{slug}, /en/projects/{slug}; the slug is the same in both languages). Only active projects are
 * shown, in the panel's order; an inactive project's case study is a 404.
 */
class PortfolioController extends Controller
{
    use PresentsProjects;

    /** Props of a project in the list and in the "next project" link: everything but the long copy. */
    private const SUMMARY_FIELDS = ['id', 'slug', 'title', 'url', 'category', 'description', 'thumbnailUrl', 'fullImageUrl', 'techStack', 'metrics'];

    /** Longest meta description of a case study, the limit search results show in full. */
    private const DESCRIPTION_LENGTH = 155;

    /** Longest case study title with the project's type; a longer one drops it (search results cut at about 60). */
    private const TITLE_LENGTH = 60;

    public function __construct(private ProjectShareImage $shareImage) {}

    public function index(): Response
    {
        $projects = Project::active()->ordered()->get();
        $description = __('projects.index.description');
        $imageUrl = asset(__('projects.index.image'));
        $pageUrl = LocalizedRoutes::url('projects.index');

        $this->pageMeta(__('projects.index.title'), $description, $imageUrl, __('projects.index.image_alt'));
        $this->localizedSeo('projects.index');

        return Inertia::render('projects', [
            'projects' => $projects->map(fn (Project $project): array => $this->summary($project))->values()->all(),
        ])->withViewData([
            'structuredData' => StructuredData::document(
                StructuredData::page('CollectionPage', $pageUrl, __('projects.index.name'), $description, $imageUrl, [
                    $this->listCrumb(),
                ], [
                    'mainEntity' => $this->projectList($projects),
                ]),
            ),
        ]);
    }

    public function show(Project $project): Response
    {
        abort_unless($project->is_active, 404);

        $props = $this->projectProps($project);
        $pageUrl = LocalizedRoutes::url('projects.show', ['project' => $project]);
        $title = $this->caseStudyTitle($project->title, $props['category']);
        $description = $this->caseStudyDescription($props['description'] ?: $props['fullDescription']);
        $imageUrl = $this->shareImage->url($project, $props['category'], $pageUrl) ?? asset(__('projects.index.image'));

        $this->pageMeta($title, $description, $imageUrl, __('projects.show.image_alt', ['title' => $project->title]));
        $this->localizedSeo('projects.show', ['project' => $project]);

        $nextProject = $this->nextProject($project);

        return Inertia::render('case-study', [
            'project' => $props,
            'nextProject' => $nextProject === null ? null : $this->summary($nextProject),
        ])->withViewData([
            'structuredData' => StructuredData::document([
                ...StructuredData::page('WebPage', $pageUrl, $title, $description, $imageUrl, [
                    $this->listCrumb(),
                    ['name' => $project->title, 'url' => $pageUrl],
                ], [
                    'mainEntity' => StructuredData::reference($pageUrl, 'project'),
                ]),
                $this->projectSchema($project, $props, $pageUrl),
            ]),
        ]);
    }

    /**
     * Title, description and share image of the page; every share image is 1200 × 630 (the list's static one, or the
     * case study's card drawn by ProjectShareImage).
     */
    private function pageMeta(string $title, string $description, string $imageUrl, string $imageAlt): void
    {
        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);

        OpenGraph::setTitle($title)
            ->setDescription($description)
            ->setType('website')
            ->setSiteName('Netizo')
            ->addImage($imageUrl, ['width' => ProjectShareImage::WIDTH, 'height' => ProjectShareImage::HEIGHT, 'alt' => $imageAlt]);

        TwitterCard::setTitle($title)
            ->setDescription($description)
            ->setType('summary_large_image')
            ->setImage($imageUrl)
            ->addValue('image:alt', $imageAlt);
    }

    /**
     * "FlotaPro – Aplikacja webowa / SaaS | Netizo", or the short form while that would not fit search results
     * ("Piekarnia Złoty Kłos – realizacja Netizo"), and for a project without a type.
     */
    private function caseStudyTitle(string $title, string $category): string
    {
        $full = __('projects.show.title', ['title' => $title, 'category' => $category]);

        return $category === '' || mb_strlen($full) > self::TITLE_LENGTH ? __('projects.show.title_short', ['title' => $title]) : $full;
    }

    /**
     * The project's short description, with "Zobacz, jak to zrobiliśmy." after it while that fits 155 characters; a
     * longer description is cut there.
     */
    private function caseStudyDescription(string $description): string
    {
        $description = Str::squish($description);
        $withSuffix = trim($description.' '.__('projects.show.description_suffix'));

        if (mb_strlen($withSuffix) <= self::DESCRIPTION_LENGTH) {
            return $withSuffix;
        }

        return Str::limit($description, self::DESCRIPTION_LENGTH - 1, '…');
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Project $project): array
    {
        return Arr::only($this->projectProps($project), self::SUMMARY_FIELDS);
    }

    /**
     * The project after this one in the panel's order, wrapping around to the first; null when it is the only one.
     */
    private function nextProject(Project $project): ?Project
    {
        $projects = Project::active()->ordered()->get()->values();
        $position = $projects->search(fn (Project $candidate): bool => $candidate->is($project));

        if ($projects->count() < 2 || $position === false) {
            return null;
        }

        return $projects[($position + 1) % $projects->count()];
    }

    /**
     * The case studies as the ItemList the list's CollectionPage is about (Google's summary-page format: each item is
     * the URL of its own page).
     *
     * @param  Collection<int, Project>  $projects
     * @return array<string, mixed>
     */
    private function projectList(Collection $projects): array
    {
        return [
            '@type' => 'ItemList',
            'numberOfItems' => $projects->count(),
            'itemListElement' => $projects->values()->map(fn (Project $project, int $index): array => [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $project->title,
                'url' => LocalizedRoutes::url('projects.show', ['project' => $project]),
            ])->all(),
        ];
    }

    /**
     * The project itself (the website or app Netizo built) as a CreativeWork: its `url` is the live site, the case study
     * at `$pageUrl` is the page it is the main entity of.
     *
     * @param  array<string, mixed>  $props  The page's props of the project (current language).
     * @return array<string, mixed>
     */
    private function projectSchema(Project $project, array $props, string $pageUrl): array
    {
        return array_filter([
            '@type' => 'CreativeWork',
            '@id' => StructuredData::id($pageUrl, 'project'),
            'name' => $project->title,
            'abstract' => $props['description'] ?: null,
            'description' => $props['fullDescription'] ?: $props['description'] ?: null,
            'genre' => $props['category'] ?: null,
            'url' => $props['liveUrl'] ?: null,
            'mainEntityOfPage' => StructuredData::reference($pageUrl, 'webpage'),
            'image' => array_values(array_filter([$props['fullImageUrl'], $props['thumbnailUrl']])) ?: null,
            'keywords' => $props['techStack'] === [] ? null : implode(', ', $props['techStack']),
            'inLanguage' => app()->getLocale(),
            'creator' => StructuredData::organizationReference(),
            'dateModified' => $project->updated_at?->toDateString(),
        ], fn (mixed $value): bool => $value !== null);
    }

    /**
     * The list of projects as a crumb of the breadcrumb trail (Netizo → Realizacje → a case study).
     *
     * @return array{name: string, url: string}
     */
    private function listCrumb(): array
    {
        return ['name' => __('projects.index.breadcrumb'), 'url' => LocalizedRoutes::url('projects.index')];
    }
}
