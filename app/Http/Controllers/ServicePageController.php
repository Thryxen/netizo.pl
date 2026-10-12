<?php

namespace App\Http\Controllers;

use App\Enums\Service;
use App\Http\Controllers\Concerns\PresentsProjects;
use App\Models\Project;
use App\Services\LocalizedRoutes;
use App\Services\StructuredData;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The pages of the services (App\Enums\Service): what a service includes, its tiers with prices "from", how it runs, the
 * projects of the admin panel tagged with it, a guide and the FAQ. The meta tags, the tiers' copy and the FAQ come from
 * lang/{pl,en}/services.php, the prices from the enum; the rest of the page's copy sits next to its components.
 *
 * One action per service rather than a route default: the shared `alternates` are built from the route's parameters,
 * and a default parameter would end up in them as a query string.
 */
class ServicePageController extends Controller
{
    use PresentsProjects;

    /** How many projects a service page shows; the rest are on the list of projects. */
    private const PROJECT_COUNT = 4;

    /** Size of every share image. */
    private const IMAGE_WIDTH = 1200;

    private const IMAGE_HEIGHT = 630;

    public function websites(): Response
    {
        return $this->page(Service::Websites);
    }

    public function stores(): Response
    {
        return $this->page(Service::Stores);
    }

    public function apps(): Response
    {
        return $this->page(Service::Apps);
    }

    public function mobile(): Response
    {
        return $this->page(Service::Mobile);
    }

    public function ai(): Response
    {
        return $this->page(Service::Ai);
    }

    public function devops(): Response
    {
        return $this->page(Service::Devops);
    }

    private function page(Service $service): Response
    {
        $copy = "services.{$service->value}";
        $title = __("{$copy}.seo.title");
        $description = __("{$copy}.seo.description");
        $imageUrl = asset(__("{$copy}.seo.image"));
        $imageAlt = __("{$copy}.seo.image_alt");
        $pageUrl = LocalizedRoutes::url($service->routeName());

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

        $this->localizedSeo($service->routeName());

        $offers = $this->offers($service);
        $faq = $this->faq($service);
        $projects = Project::active()->forService($service)->ordered()->limit(self::PROJECT_COUNT)->get();

        return Inertia::render("services/{$service->value}", [
            'offers' => $offers,
            'faq' => $faq,
            'projects' => $projects->map(fn (Project $project): array => $this->projectSummary($project))->values()->all(),
            'otherServices' => $this->otherServices($service),
        ])->withViewData([
            'structuredData' => StructuredData::document([
                ...StructuredData::page('WebPage', $pageUrl, __("{$copy}.seo.name"), $description, $imageUrl, [
                    ['name' => __("{$copy}.seo.breadcrumb"), 'url' => $pageUrl],
                ], [
                    'mainEntity' => StructuredData::reference($pageUrl, 'service'),
                ]),
                $this->serviceSchema($service, $pageUrl, $description, $offers),
                StructuredData::faq($pageUrl, $faq),
            ]),
        ]);
    }

    /**
     * The service's tiers in the current language with their prices: the copy of each tier and the price bracket at the
     * same position in App\Enums\Service::priceBrackets(). A tier without a timeline in the copy has none (the site
     * states no timeline for it).
     *
     * @return list<array{name: string, description: string, timeline: string|null, includes: list<string>, priceFrom: int, priceTo: int|null}>
     */
    private function offers(Service $service): array
    {
        $brackets = $service->priceBrackets();

        return array_map(fn (array $offer, int $index): array => [
            'name' => $offer['name'],
            'description' => $offer['description'],
            'timeline' => $offer['timeline'] ?? null,
            'includes' => array_values($offer['includes']),
            'priceFrom' => $brackets[$index]['from'],
            'priceTo' => $brackets[$index]['to'],
        ], __("services.{$service->value}.offers"), array_keys($brackets));
    }

    /**
     * The service's questions in the current language: the single source for the page's FAQ and its JSON-LD.
     *
     * @return list<array{question: string, answer: string}>
     */
    private function faq(Service $service): array
    {
        return __("services.{$service->value}.faq");
    }

    /**
     * The other services, each with its name, one sentence, the price it starts at and its page in the current language.
     *
     * @return list<array{key: string, name: string, description: string, priceFrom: int, url: string}>
     */
    private function otherServices(Service $service): array
    {
        return collect(Service::cases())
            ->reject(fn (Service $other): bool => $other === $service)
            ->map(fn (Service $other): array => [
                'key' => $other->value,
                'name' => __("services.{$other->value}.card.name"),
                'description' => __("services.{$other->value}.card.description"),
                'priceFrom' => $other->priceBrackets()[0]['from'],
                'url' => LocalizedRoutes::url($other->routeName()),
            ])
            ->values()
            ->all();
    }

    /**
     * The service itself, the main entity of its page: provided by Netizo where Netizo works, with the price each tier
     * starts at (no maximum: the copy's ceilings are what a price usually stays under, not a cap).
     *
     * @param  list<array{name: string, description: string, priceFrom: int, priceTo: int|null}>  $offers
     * @return array<string, mixed>
     */
    private function serviceSchema(Service $service, string $pageUrl, string $description, array $offers): array
    {
        return [
            '@type' => 'Service',
            '@id' => StructuredData::id($pageUrl, 'service'),
            'name' => __("services.{$service->value}.seo.name"),
            'serviceType' => __("services.{$service->value}.card.name"),
            'description' => $description,
            'url' => $pageUrl,
            'mainEntityOfPage' => StructuredData::reference($pageUrl, 'webpage'),
            'provider' => StructuredData::organizationReference(),
            'areaServed' => StructuredData::areaServed(),
            'offers' => array_map(fn (array $offer): array => [
                '@type' => 'Offer',
                'name' => $offer['name'],
                'description' => $offer['description'],
                'priceSpecification' => [
                    '@type' => 'PriceSpecification',
                    'minPrice' => $offer['priceFrom'],
                    'priceCurrency' => 'PLN',
                ],
            ], $offers),
        ];
    }
}
