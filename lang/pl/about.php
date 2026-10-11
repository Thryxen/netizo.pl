<?php

/*
 * Server-side copy of the about page (AboutController): meta tags and the people in its JSON-LD. The page copy itself
 * lives in resources/js/components/about/. English twin: lang/en/about.php (same keys).
 */
return [
    'seo' => [
        'title' => 'O nas: Damian Idzik i Kamil Nawrot | Netizo',
        'description' => 'Netizo tworzą Damian Idzik i Kamil Nawrot. Strony, sklepy i aplikacje webowe dla firm z całej Polski, a w Lesznie i okolicach z dojazdem do klienta.',
        'name' => 'O nas – Netizo',
        'image' => 'assets/images/og-netizo-o-nas.png',
        'keywords' => [
            'o nas', 'netizo', 'Damian Idzik', 'Kamil Nawrot', 'software house', 'tworzenie stron internetowych',
        ],
    ],

    'people' => [
        ['name' => 'Damian Idzik', 'job_title' => 'Współwłaściciel'],
        ['name' => 'Kamil Nawrot', 'job_title' => 'Współwłaściciel'],
    ],
];
