<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\PresentsProjects;
use App\Models\Project;
use App\Services\LocalizedRoutes;
use Artesaos\SEOTools\Facades\JsonLdMulti;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    use PresentsProjects;

    /** How many projects the page shows; the rest are on the home page. */
    private const PROJECT_COUNT = 3;

    public function index(): Response
    {
        $title = __('about.seo.title');
        $description = __('about.seo.description');
        $imageUrl = asset(__('about.seo.image'));

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);
        SEOMeta::addKeyword(__('about.seo.keywords'));

        OpenGraph::setTitle($title)
            ->setDescription($description)
            ->setType('website')
            ->setSiteName('Netizo')
            ->addImage($imageUrl, ['width' => 1200, 'height' => 630]);

        TwitterCard::setTitle($title)
            ->setDescription($description)
            ->setType('summary_large_image')
            ->setImage($imageUrl);

        $this->localizedSeo('about');

        JsonLdMulti::setTitle(__('about.seo.name'))
            ->setDescription($description)
            ->setType('AboutPage')
            ->setUrl(LocalizedRoutes::url('about'))
            ->setImage($imageUrl)
            ->addValue('inLanguage', app()->getLocale())
            ->addValue('about', [
                '@type' => 'Organization',
                'name' => 'Netizo',
                'url' => LocalizedRoutes::url('home'),
                'member' => $this->people(),
            ]);

        $projects = Project::active()->ordered()->limit(self::PROJECT_COUNT)->get();

        return Inertia::render('about', [
            'projects' => $projects->map(fn (Project $project): array => Arr::only($this->projectProps($project), [
                'id', 'slug', 'title', 'category', 'description', 'liveUrl', 'thumbnailUrl',
            ]))->values()->all(),
            // Sample copy (story, numbers, testimonials) is a layout preview: never shown outside local development.
            'previewSamples' => app()->isLocal(),
        ]);
    }

    /**
     * The co-owners in the current language (lang/{pl,en}/about.php), as schema.org people.
     *
     * @return list<array{'@type': string, name: string, jobTitle: string}>
     */
    private function people(): array
    {
        return array_map(fn (array $person): array => [
            '@type' => 'Person',
            'name' => $person['name'],
            'jobTitle' => $person['job_title'],
        ], __('about.people'));
    }
}
