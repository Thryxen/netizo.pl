<?php

namespace App\Http\Controllers;

use App\Services\LocalizedRoutes;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;

abstract class Controller
{
    /**
     * Link the page `$name` (a Polish route name such as `home`) to its twin in the other language: the canonical URL
     * in the current language, hreflang alternates for every language (Polish as x-default) and the Open Graph locale.
     *
     * @param  array<string, mixed>  $parameters  Route parameters, the same in every language (a project's slug).
     */
    protected function localizedSeo(string $name, array $parameters = []): void
    {
        $locale = app()->getLocale();
        $urls = LocalizedRoutes::alternates($name, $parameters);

        SEOMeta::setCanonical($urls[$locale]);

        foreach ($urls as $alternateLocale => $url) {
            SEOMeta::addAlternateLanguage($alternateLocale, $url);
        }

        SEOMeta::addAlternateLanguage('x-default', $urls[LocalizedRoutes::DEFAULT_LOCALE]);

        OpenGraph::setUrl($urls[$locale])
            ->addProperty('locale', LocalizedRoutes::OG_LOCALES[$locale]);

        foreach (array_diff(LocalizedRoutes::LOCALES, [$locale]) as $alternateLocale) {
            OpenGraph::addProperty('locale:alternate', LocalizedRoutes::OG_LOCALES[$alternateLocale]);
        }
    }
}
