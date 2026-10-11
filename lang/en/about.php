<?php

/*
 * Server-side copy of the about page (AboutController): meta tags and the people in its JSON-LD. The page copy itself
 * lives in resources/js/components/about/. Polish twin: lang/pl/about.php (same keys).
 */
return [
    'seo' => [
        'title' => 'About us: Damian Idzik and Kamil Nawrot | Netizo',
        'description' => 'Netizo is Damian Idzik and Kamil Nawrot. Websites, online stores and web apps for companies across Poland, with on-site meetings around Leszno.',
        'name' => 'About Netizo',
        'image' => 'assets/images/og-netizo-about-en.png',
        'keywords' => [
            'about us', 'netizo', 'Damian Idzik', 'Kamil Nawrot', 'software house', 'web development',
        ],
    ],

    'people' => [
        ['name' => 'Damian Idzik', 'job_title' => 'Co-owner'],
        ['name' => 'Kamil Nawrot', 'job_title' => 'Co-owner'],
    ],
];
