<?php

/*
 * Server-side copy of the about page (AboutController): meta tags and the people in its JSON-LD. The page copy itself
 * lives in resources/js/components/about/. English twin: lang/en/about.php (same keys).
 */
return [
    'seo' => [
        'title' => 'O nas: Damian Idzik i Kamil Nawrot – Leszno | Netizo',
        'description' => 'Poznaj Damiana Idzika i Kamila Nawrota z Netizo. Strony, sklepy i aplikacje webowe dla firm z całej Polski, a w Lesznie i okolicach z dojazdem do klienta.',
        'name' => 'O nas – Netizo',
        'image' => 'assets/images/og-netizo-o-nas.png',
    ],

    'people' => [
        ['name' => 'Damian Idzik', 'job_title' => 'Współwłaściciel'],
        ['name' => 'Kamil Nawrot', 'job_title' => 'Współwłaściciel'],
    ],
];
