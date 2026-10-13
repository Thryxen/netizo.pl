<?php

namespace App\Http\Controllers;

use App\Enums\Service;
use App\Http\Controllers\Concerns\PresentsProjects;
use App\Http\Controllers\Concerns\PresentsServices;
use App\Models\Project;
use App\Services\LocalizedRoutes;
use App\Services\StructuredData;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The Leszno page (/tworzenie-stron-internetowych/leszno, /en/website-development/leszno): websites for businesses in
 * and around Leszno, written as the area we travel to, not an office. The towns, the meeting at the client's company,
 * the websites page's tiers and prices, the panel's projects for clients from the region, the testimonials and a local
 * FAQ. One page for the whole area: the towns around Leszno are its sections, not pages of their own.
 */
class LesznoController extends Controller
{
    use PresentsProjects;
    use PresentsServices;

    /** How many projects from the region the page shows; the rest are on the list of projects. */
    private const PROJECT_COUNT = 4;

    /** Size of the share image. */
    private const IMAGE_WIDTH = 1200;

    private const IMAGE_HEIGHT = 630;

    public function index(): Response
    {
        $title = __('leszno.seo.title');
        $description = __('leszno.seo.description');
        $imageUrl = asset(__('leszno.seo.image'));
        $imageAlt = __('leszno.seo.image_alt');
        $pageUrl = LocalizedRoutes::url('leszno');

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);

        OpenGraph::setTitle($title)
            ->setDescription($description)
            ->setType('website')
            ->setSiteName('Netizo')
            ->addImage($imageUrl, ['width' => self::IMAGE_WIDTH, 'height' => self::IMAGE_HEIGHT, 'alt' => $imageAlt]);

        TwitterCard::setTitle($title)
            ->setDescription($description)
            ->setType('summary_large_image')
            ->setImage($imageUrl)
            ->addValue('image:alt', $imageAlt);

        $this->localizedSeo('leszno');

        $offers = $this->offers(Service::Websites);
        $faq = $this->faq();
        $projects = Project::active()->local()->ordered()->limit(self::PROJECT_COUNT)->get();

        return Inertia::render('leszno', [
            'offers' => $offers,
            'faq' => $faq,
            'projects' => $projects->map(fn (Project $project): array => $this->projectSummary($project))->values()->all(),
            'otherServices' => $this->otherServices(Service::Websites),
        ])->withViewData([
            'structuredData' => StructuredData::document([
                ...StructuredData::page('WebPage', $pageUrl, __('leszno.seo.name'), $description, $imageUrl, [
                    ['name' => __('services.websites.seo.breadcrumb'), 'url' => LocalizedRoutes::url(Service::Websites->routeName())],
                    ['name' => __('leszno.seo.breadcrumb'), 'url' => $pageUrl],
                ], [
                    'mainEntity' => StructuredData::reference($pageUrl, 'service'),
                ]),
                $this->serviceSchema($pageUrl, $description, $offers),
                StructuredData::faq($pageUrl, $faq),
            ]),
        ]);
    }

    /**
     * The page's questions in the current language: the single source for its FAQ and its JSON-LD.
     *
     * @return list<array{question: string, answer: string}>
     */
    private function faq(): array
    {
        return __('leszno.faq');
    }

    /**
     * Website development in the meeting area, the main entity of the page: provided by Netizo in the towns it travels
     * to, with the websites page's tiers. No address: Netizo has no office there.
     *
     * @param  list<array{name: string, description: string, priceFrom: int, priceTo: int|null}>  $offers
     * @return array<string, mixed>
     */
    private function serviceSchema(string $pageUrl, string $description, array $offers): array
    {
        return [
            '@type' => 'Service',
            '@id' => StructuredData::id($pageUrl, 'service'),
            'name' => __('leszno.seo.name'),
            'serviceType' => __('leszno.seo.service_type'),
            'description' => $description,
            'url' => $pageUrl,
            'mainEntityOfPage' => StructuredData::reference($pageUrl, 'webpage'),
            'provider' => StructuredData::organizationReference(),
            'areaServed' => StructuredData::meetingArea(),
            'offers' => $this->offerSchema($offers),
        ];
    }
}
