<?php

/**
 * @see https://github.com/artesaos/seotools
 */

return [
    'inertia' => env('SEO_TOOLS_INERTIA', false),
    'meta' => [
        /*
         * The default configurations to be used by the meta generator.
         */
        'defaults' => [
            'title' => false,
            'titleBefore' => false,
            'description' => 'Netizo - Software House tworzący nowoczesne aplikacje webowe, mobilne i systemy enterprise. Od pomysłu do wdrożenia. React, Next.js, Node.js, Laravel. 150+ projektów, 8 lat doświadczenia.',
            'separator' => ' | ',
            'keywords' => [],
            'canonical' => 'full',
            'robots' => 'index, follow',
        ],
        /*
         * Webmaster tags are always added.
         */
        'webmaster_tags' => [
            'google' => null,
            'bing' => null,
            'alexa' => null,
            'pinterest' => null,
            'yandex' => null,
            'norton' => null,
        ],

        'add_notranslate_class' => false,
    ],
    'opengraph' => [
        /*
         * The default configurations to be used by the opengraph generator.
         */
        'defaults' => [
            'title' => 'Netizo | Software House',
            'description' => 'Netizo - Software House tworzący nowoczesne aplikacje webowe, mobilne i systemy enterprise. Od pomysłu do wdrożenia.',
            'url' => null,
            'type' => 'website',
            'site_name' => 'Netizo',
            'images' => [env('APP_URL').'/assets/images/og-netizo-2.png'],
        ],
    ],
    'twitter' => [
        /*
         * The default values to be used by the twitter cards generator.
         */
        'defaults' => [
            'card' => 'summary_large_image',
            'image' => env('APP_URL').'/assets/images/og-netizo-2.png',
        ],
    ],
    'json-ld' => [
        /*
         * The default configurations to be used by the json-ld generator.
         */
        'defaults' => [
            'title' => 'Netizo | Software House',
            'description' => 'Netizo - Software House tworzący nowoczesne aplikacje webowe, mobilne i systemy enterprise. Od pomysłu do wdrożenia.',
            'url' => 'full',
            'type' => 'WebPage',
            'images' => [env('APP_URL').'/assets/images/og-netizo-2.png'],
        ],
    ],
];
