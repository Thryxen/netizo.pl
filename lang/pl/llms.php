<?php

/*
 * Copy of /llms.txt (App\Services\LlmsTxt), the summary of the site for AI agents and assistants. The facts come from
 * where the pages take them (the summary and the FAQ from home.php and partners.php, the projects from the admin panel,
 * the contact and company details from App\Services\StructuredData); this file holds only what links them together.
 * `services` repeats the services section (resources/js/components/home/services-section.tsx) and `anchors` the section
 * ids (resources/js/lib/sections.ts), both checked by LlmsTxtTest; the partner figures match partner-data.ts.
 * English twin: lang/en/llms.php (same keys).
 */
return [
    'intro' => 'Witryna jest dwujęzyczna: polska wersja jest pod :polish, angielska pod :english. Najpierw są sekcje po polsku, potem te same po angielsku. To Netizo (netizo.pl, Polska) nie jest powiązane z indyjską agencją o tej samej nazwie (netizo.in).',

    'headings' => [
        'pages' => 'Strony',
        'services' => 'Usługi',
        'projects' => 'Realizacje',
        'faq' => 'Najczęstsze pytania',
        'partner_faq' => 'Program partnerski: najczęstsze pytania',
        'contact' => 'Kontakt',
    ],

    'pages' => [
        'home' => [
            'name' => 'Strona główna',
            'note' => 'usługi, wybrane realizacje, proces współpracy, panel klienta, najczęstsze pytania z cenami i terminami, formularz kontaktowy i brief projektu.',
        ],
        'projects' => [
            'name' => 'Realizacje',
            'note' => 'wszystkie realizacje, każda z własnym case study: opis projektu, wyzwania, rozwiązania, wyniki i technologie.',
        ],
        'about' => [
            'name' => 'O nas',
            'note' => 'współwłaściciele Damian Idzik i Kamil Nawrot, jak pracujemy (zdalnie w całej Polsce, na miejscu w Lesznie i okolicach), wybrane realizacje i dane firmy.',
        ],
        'partners' => [
            'name' => 'Program partnerski',
            'note' => '15% wartości netto każdej opłaconej faktury poleconego klienta przez 12 miesięcy od jego pierwszego zamówienia, wypłata do 14 dni od opłacenia faktury, bez opłat i limitu poleceń; kalkulator prowizji, zasady i formularz zgłoszenia.',
        ],
    ],

    'services' => [
        ['name' => 'Aplikacje webowe', 'note' => 'Nowoczesne aplikacje SPA i SSR, od prostych landing page po złożone platformy SaaS.'],
        ['name' => 'Aplikacje mobilne', 'note' => 'Jeden kod na iOS i Android, pełna wydajność na obu platformach.'],
        ['name' => 'AI & Automatyzacja', 'note' => 'Chatboty, integracje z AI i automatyzacja procesów.'],
        ['name' => 'Systemy backend', 'note' => 'Skalowalne API i mikroserwisy gotowe na wysokie obciążenia.'],
        ['name' => 'DevOps & Cloud', 'note' => 'Infrastruktura jako kod, CI/CD, konteneryzacja i monitoring 24/7.'],
        ['name' => 'E-commerce', 'note' => 'Sklepy internetowe i marketplace’y z integracją płatności i fulfillmentu.'],
    ],

    'live_site' => 'Strona: :url',

    'contact' => [
        'form' => [
            'name' => 'Formularz kontaktowy i brief projektu',
            'note' => 'e-mail :email, telefon :telephone. Odpowiadamy w ciągu 24 godzin, a wycena jest bezpłatna.',
        ],
        'company' => [
            'name' => 'Dane firmy',
            'note' => 'Netizo, NIP :tax_id, REGON :regon, adres rejestrowy: :address (bez biura dla klientów).',
        ],
    ],

    'documents' => [
        'privacy' => 'Polityka prywatności',
        'terms' => 'Regulamin serwisu',
        'partner_terms' => 'Regulamin programu partnerskiego',
    ],

    'anchors' => [
        'services' => 'uslugi',
        'faq' => 'faq',
        'contact' => 'kontakt',
        'partner_faq' => 'faq',
        'company' => 'dane-firmy',
    ],
];
