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
        'image' => 'assets/images/og-netizo-realizacje.jpg',
        'image_alt' => 'Realizacje Netizo: strony, sklepy i aplikacje webowe',
    ],

    // A case study's title: with the project's type while it fits search results (60 characters), else the short one.
    'show' => [
        'title' => ':title – :category | Netizo',
        'title_short' => ':title – realizacja Netizo',
        'description_suffix' => 'Zobacz, jak to zrobiliśmy.',
        'image_alt' => ':title: realizacja Netizo',
    ],

    // The case study's share image (App\Services\ProjectShareImage): the label in its top right cell.
    'share' => [
        'label' => 'Realizacja',
    ],

    'breadcrumbs' => [
        'home' => 'Netizo',
        'projects' => 'Realizacje',
    ],
];
