<?php

namespace App\Http\Controllers;

use App\Services\LocalizedRoutes;
use App\Services\StructuredData;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The Metin2 CMS page (/metin2cms, /en/metin2cms): the ready-made system for Metin2 private servers (the server's
 * website, the player panel and the admin panel), shown on its first deployment, Sherkan. The screenshots and the clip
 * on the page come from a local copy of that deployment filled with invented data.
 */
class Metin2CmsController extends Controller
{
    /** Size of the share image. */
    private const IMAGE_WIDTH = 1200;

    private const IMAGE_HEIGHT = 630;

    public function index(): Response
    {
        $title = __('metin2cms.seo.title');
        $description = __('metin2cms.seo.description');
        $imageUrl = asset(__('metin2cms.seo.image'));
        $imageAlt = __('metin2cms.seo.image_alt');
        $pageUrl = LocalizedRoutes::url('metin2cms');

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

        $this->localizedSeo('metin2cms');

        $faq = $this->faq();

        return Inertia::render('metin2cms', [
            'faq' => $faq,
        ])->withViewData([
            'structuredData' => StructuredData::document([
                ...StructuredData::page('WebPage', $pageUrl, __('metin2cms.seo.name'), $description, $imageUrl, [
                    ['name' => __('metin2cms.seo.breadcrumb'), 'url' => $pageUrl],
                ], [
                    'mainEntity' => StructuredData::reference($pageUrl, 'service'),
                ]),
                $this->serviceSchema($pageUrl, $description),
                StructuredData::faq($pageUrl, $faq),
            ]),
        ]);
    }

    /**
     * The system as a Service node: what it is, who provides it and who it is for. It names no price (the deployment is
     * quoted per server) and no area (it is deployed remotely).
     *
     * @return array<string, mixed>
     */
    private function serviceSchema(string $pageUrl, string $description): array
    {
        return [
            '@type' => 'Service',
            '@id' => StructuredData::id($pageUrl, 'service'),
            'name' => __('metin2cms.seo.name'),
            'serviceType' => __('metin2cms.seo.service_type'),
            'description' => $description,
            'url' => $pageUrl,
            'mainEntityOfPage' => StructuredData::reference($pageUrl, 'webpage'),
            'provider' => StructuredData::organizationReference(),
            'audience' => ['@type' => 'Audience', 'audienceType' => __('metin2cms.seo.audience')],
        ];
    }

    /**
     * The page's questions in the current language: the single source for its FAQ and its JSON-LD.
     *
     * @return list<array{question: string, answer: string}>
     */
    private function faq(): array
    {
        return __('metin2cms.faq');
    }
}
