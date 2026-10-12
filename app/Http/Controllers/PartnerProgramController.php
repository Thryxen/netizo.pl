<?php

namespace App\Http\Controllers;

use App\Services\LocalizedRoutes;
use App\Services\StructuredData;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Inertia\Inertia;
use Inertia\Response;

class PartnerProgramController extends Controller
{
    public function index(): Response
    {
        $title = __('partners.seo.title');
        $description = __('partners.seo.description');
        $imageUrl = asset(__('partners.seo.image'));

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);

        OpenGraph::setTitle($title)
            ->setDescription($description)
            ->setType('website')
            ->setSiteName('Netizo')
            ->addImage($imageUrl, ['width' => 1200, 'height' => 630]);

        TwitterCard::setTitle($title)
            ->setDescription($description)
            ->setType('summary_large_image')
            ->setImage($imageUrl);

        $this->localizedSeo('partners');

        $faq = $this->faq();
        $pageUrl = LocalizedRoutes::url('partners');

        return Inertia::render('partners', [
            'faq' => $faq,
        ])->withViewData([
            'structuredData' => StructuredData::document([
                ...StructuredData::page('WebPage', $pageUrl, __('partners.seo.name'), $description, $imageUrl, [
                    ['name' => __('partners.seo.breadcrumb'), 'url' => $pageUrl],
                ]),
                StructuredData::faq($pageUrl, $faq),
            ]),
        ]);
    }

    /**
     * Questions about the partner programme in the current language (lang/{pl,en}/partners.php) — the single source
     * for the page's FAQ and its JSON-LD.
     *
     * @return list<array{question: string, answer: string}>
     */
    private function faq(): array
    {
        return __('partners.faq');
    }
}
