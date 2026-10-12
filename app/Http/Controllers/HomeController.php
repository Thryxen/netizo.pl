<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\PresentsProjects;
use App\Models\Client;
use App\Models\Project;
use App\Services\LocalizedRoutes;
use App\Services\StructuredData;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    use PresentsProjects;

    public function index(): Response
    {
        $projects = Project::active()->ordered()->get();
        $clients = Client::active()->ordered()->get();
        $imageUrl = asset(__('home.seo.image'));
        $title = __('home.seo.title');
        $description = __('home.seo.description');
        $shareDescription = __('home.seo.share_description');
        $pageUrl = LocalizedRoutes::url('home');

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);

        OpenGraph::setTitle($title)
            ->setDescription($shareDescription)
            ->setType('website')
            ->setSiteName('Netizo')
            ->addImage($imageUrl, ['width' => 1200, 'height' => 630]);

        TwitterCard::setTitle($title)
            ->setDescription($shareDescription)
            ->setType('summary_large_image')
            ->setImage($imageUrl);

        $this->localizedSeo('home');

        $faq = $this->faq();

        return Inertia::render('home', [
            'projects' => $projects->map(fn (Project $project): array => $this->projectProps($project))->values()->all(),
            'clients' => $clients->map(fn (Client $client): array => $this->clientProps($client))->values()->all(),
            'faq' => $faq,
        ])->withViewData([
            'structuredData' => StructuredData::document([
                ...StructuredData::page('WebPage', $pageUrl, $title, $description, $imageUrl, properties: [
                    'about' => StructuredData::organizationReference(),
                ]),
                StructuredData::faq($pageUrl, $faq),
            ], StructuredData::organization()),
        ]);
    }

    /**
     * Frequently asked questions in the current language (lang/{pl,en}/home.php) — the single source for the FAQ
     * section and its JSON-LD.
     *
     * @return list<array{question: string, answer: string}>
     */
    private function faq(): array
    {
        return __('home.faq');
    }

    /**
     * @return array{id: int, name: string, url: string|null}
     */
    private function clientProps(Client $client): array
    {
        return [
            'id' => $client->id,
            'name' => $client->name,
            'url' => $this->absoluteUrl($client->url),
        ];
    }
}
