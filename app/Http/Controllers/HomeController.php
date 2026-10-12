<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\PresentsProjects;
use App\Models\Client;
use App\Models\Project;
use App\Services\LocalizedRoutes;
use App\Services\SocialProfiles;
use Artesaos\SEOTools\Facades\JsonLdMulti;
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
        $shareDescription = __('home.seo.share_description');

        SEOMeta::setTitle($title);
        SEOMeta::setDescription(__('home.seo.description'));

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

        // JSON-LD Structured Data - Organization (SEO::generate() renders the JsonLdMulti instance, not JsonLd).
        // A service-area business with no office: the address is the registered business address (the footer shows
        // the same details, `company` in resources/js/lib/site.ts); work is remote across Poland, and around Leszno
        // Netizo travels to the client.
        JsonLdMulti::setTitle('Netizo')
            ->setDescription(__('home.seo.organization_description'))
            ->setType('ProfessionalService')
            ->setUrl(LocalizedRoutes::url('home'))
            ->setImage($imageUrl)
            ->addValue('address', [
                '@type' => 'PostalAddress',
                'streetAddress' => 'ul. Wiosny Ludów 12 lok. 8',
                'postalCode' => '63-600',
                'addressLocality' => 'Kępno',
                'addressRegion' => 'wielkopolskie',
                'addressCountry' => 'PL',
            ])
            ->addValue('telephone', '+48884343924')
            ->addValue('email', 'kontakt@netizo.pl')
            ->addValue('taxID', '6192060508')
            ->addValue('identifier', [
                '@type' => 'PropertyValue',
                'propertyID' => 'REGON',
                'value' => '527974955',
            ])
            ->addValue('areaServed', [
                ['@type' => 'Country', 'name' => __('home.seo.country')],
                ['@type' => 'City', 'name' => 'Leszno'],
                ['@type' => 'City', 'name' => 'Rydzyna'],
                ['@type' => 'City', 'name' => 'Wschowa'],
                ['@type' => 'City', 'name' => 'Kościan'],
                ['@type' => 'City', 'name' => 'Gostyń'],
                ['@type' => 'City', 'name' => 'Rawicz'],
            ])
            ->addValue('knowsLanguage', LocalizedRoutes::LOCALES)
            ->addValue('priceRange', '$$');

        $socialProfileUrls = SocialProfiles::urls();

        if ($socialProfileUrls !== []) {
            JsonLdMulti::addValue('sameAs', $socialProfileUrls);
        }

        $faq = $this->faq();

        return Inertia::render('home', [
            'projects' => $projects->map(fn (Project $project): array => $this->projectProps($project))->values()->all(),
            'clients' => $clients->map(fn (Client $client): array => $this->clientProps($client))->values()->all(),
            'faq' => $faq,
        ])->withViewData([
            'faqSchema' => $this->faqSchema($faq),
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
