<?php

namespace App\Http\Controllers;

use App\Services\LocalizedRoutes;
use Artesaos\SEOTools\Facades\JsonLdMulti;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;

abstract class Controller
{
    /**
     * Build the FAQPage JSON-LD document from a page's FAQ items (the root view renders it as `faqSchema`).
     *
     * @param  list<array{question: string, answer: string}>  $faq
     * @return array<string, mixed>
     */
    protected function faqSchema(array $faq): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'inLanguage' => app()->getLocale(),
            'mainEntity' => array_map(fn (array $item): array => [
                '@type' => 'Question',
                'name' => $item['question'],
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text' => $item['answer'],
                ],
            ], $faq),
        ];
    }

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

    /**
     * Leave out the SEOTools JSON-LD (its config default is a generic WebPage) on a page that passes its own documents
     * as `schemas` to the root view instead: text typed in the admin panel goes there, and the view encodes it with
     * JSON_HEX_TAG, so it cannot end the script tag.
     */
    protected function withoutDefaultJsonLd(): void
    {
        JsonLdMulti::setType('')
            ->setTitle('')
            ->setDescription('')
            ->setUrl(false)
            ->setImages([]);
    }
}
