<?php

/*
 * Server-side copy of the about page (AboutController): meta tags and the people in its JSON-LD. The page copy itself
 * lives in resources/js/components/about/. Polish twin: lang/pl/about.php (same keys).
 */
return [
    'seo' => [
        'title' => 'About us: Damian Idzik, Kamil Nawrot – Leszno, Poland | Netizo',
        'description' => 'Meet Damian Idzik and Kamil Nawrot of Netizo. Websites, online stores and web apps for companies across Poland, with on-site meetings around Leszno.',
        'name' => 'About Netizo',
        'breadcrumb' => 'About us',
        'image' => 'assets/images/og-netizo-about-en.png',
    ],

    'people' => [
        ['name' => 'Damian Idzik', 'job_title' => 'Co-founder'],
        ['name' => 'Kamil Nawrot', 'job_title' => 'Co-founder'],
    ],
];
