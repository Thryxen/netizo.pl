<?php

/*
 * Server-side copy of the legal pages (LegalPageController): meta tags, share images (made from
 * netizo/og-image/szablon-dokument.html) and the names in their JSON-LD. The documents themselves live in
 * resources/js/components/legal/. English twin: lang/en/legal.php (same keys).
 */
return [
    'privacy' => [
        'title' => 'Polityka prywatności | Netizo',
        'description' => 'Jakie dane zbiera netizo.pl przez formularze, Google Analytics i cookies, komu je przekazujemy, jak długo je trzymamy i jakie masz prawa.',
        'name' => 'Polityka prywatności – Netizo',
        'image' => 'assets/images/og-netizo-polityka-prywatnosci.png',
    ],

    'terms' => [
        'title' => 'Regulamin serwisu | Netizo',
        'description' => 'Zasady korzystania z netizo.pl: formularze, newsletter, program partnerski, wymagania techniczne, reklamacje i prawa konsumenta.',
        'name' => 'Regulamin serwisu – Netizo',
        'image' => 'assets/images/og-netizo-regulamin.png',
    ],
];
