<?php

/*
 * Server-side copy of the project pages (PortfolioController): the list of projects (/realizacje) and a project's case
 * study (/realizacje/{slug}), their meta tags and JSON-LD. The page copy itself lives in resources/js/components/projects/;
 * the projects come from the admin panel. English twin: lang/en/projects.php (same keys).
 */
return [
    'index' => [
        'title' => 'Realizacje: strony, sklepy i aplikacje webowe – Leszno | Netizo',
        'description' => 'Zobacz nasze realizacje: strony firmowe, sklepy i aplikacje webowe z opisem wyzwań, rozwiązań i wyników. Wyceń podobny projekt w Netizo.',
        'name' => 'Realizacje – Netizo',
        'image' => 'assets/images/og-netizo-2.png',
    ],

    'show' => [
        'title' => ':title – :category | Realizacje Netizo',
        'title_without_category' => ':title | Realizacje Netizo',
    ],

    'breadcrumbs' => [
        'home' => 'Netizo',
        'projects' => 'Realizacje',
    ],
];
