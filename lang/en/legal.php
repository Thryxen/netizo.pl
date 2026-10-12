<?php

/*
 * Server-side copy of the legal pages (LegalPageController): meta tags, share images (made from
 * netizo/og-image/szablon-dokument.html) and the names in their JSON-LD. The documents themselves live in
 * resources/js/components/legal/. Polish twin: lang/pl/legal.php (same keys).
 */
return [
    'privacy' => [
        'title' => 'Privacy policy | Netizo',
        'description' => 'What data netizo.pl collects through forms, Google Analytics and cookies, who receives it, how long we keep it and your rights.',
        'name' => 'Privacy policy – Netizo',
        'breadcrumb' => 'Privacy policy',
        'image' => 'assets/images/og-netizo-privacy-policy-en.png',
    ],

    'terms' => [
        'title' => 'Terms of service | Netizo',
        'description' => 'How you can use netizo.pl: the forms, the newsletter, the partner program, technical requirements, complaints and consumer rights.',
        'name' => 'Terms of service – Netizo',
        'breadcrumb' => 'Terms of service',
        'image' => 'assets/images/og-netizo-terms-en.png',
    ],

    'partner_terms' => [
        'title' => 'Partner program terms | Netizo',
        'description' => 'The terms of the Netizo partner program: who can refer clients, when the 15% commission is due, how and when we pay it and how to leave.',
        'name' => 'Partner program terms – Netizo',
        'breadcrumb' => 'Terms',
        'image' => 'assets/images/og-netizo-partner-terms-en.png',
    ],
];
