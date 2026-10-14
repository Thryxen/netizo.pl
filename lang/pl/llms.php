<?php

/*
 * Copy of /llms.txt (App\Services\LlmsTxt), the summary of the site for AI agents and assistants. The facts come from
 * where the pages take them (the summary and the FAQ from home.php and partners.php, the projects from the admin panel,
 * the contact and company details from App\Services\StructuredData); this file holds only what links them together.
 * `services` repeats the services section (resources/js/components/home/services-section.tsx; `page` names the service
 * page a service links to, App\Enums\Service) and `anchors` the section ids (resources/js/lib/sections.ts), both checked
 * by LlmsTxtTest; the partner figures match partner-data.ts, the service pages' figures App\Enums\Service.
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
        'service_faq' => ':service: najczęstsze pytania',
        'leszno_faq' => 'Strony internetowe w Lesznie i okolicach: najczęstsze pytania',
        'contact' => 'Kontakt',
    ],

    'pages' => [
        'home' => [
            'name' => 'Strona główna',
            'note' => 'usługi, wybrane realizacje, proces współpracy, panel klienta, najczęstsze pytania z cenami i terminami, formularz kontaktowy i brief projektu.',
        ],
        'websites' => [
            'name' => 'Tworzenie stron internetowych',
            'note' => 'prosta strona (landing page, wizytówka) od 799 zł do 1 499 zł, zwykle w ciągu tygodnia, rozbudowana strona z CMS od 1 799 zł do 2 999 zł, zwykle w ciągu dwóch tygodni; zakres, proces, realizacje i najczęstsze pytania.',
        ],
        'leszno' => [
            'name' => 'Tworzenie stron internetowych w Lesznie i okolicach',
            'note' => 'strony internetowe dla firm z Leszna, Rydzyny, Wschowy, Kościana, Gostynia, Rawicza i okolic: przyjeżdżamy na spotkanie do firmy klienta (bez biura w Lesznie, adres rejestrowy w Kępnie), te same ceny co na stronie usługi (od 799 zł), realizacje z regionu, opinie klientów i najczęstsze pytania.',
        ],
        'stores' => [
            'name' => 'Tworzenie sklepów internetowych',
            'note' => 'mały sklep od 1 299 zł do 4 999 zł, zwykle w ciągu czterech tygodni, duży e-commerce z integracją z magazynem, hurtownią lub ERP od 5 499 zł do 12 999 zł, zwykle w ciągu ośmiu tygodni; płatności, wysyłka, realizacje i najczęstsze pytania.',
        ],
        'apps' => [
            'name' => 'Aplikacje webowe na zamówienie',
            'note' => 'aplikacja webowa od 1 699 zł do 3 999 zł, zwykle w ciągu trzech tygodni, duży system od 4 499 zł, budowany etapami; integracje, bezpieczeństwo, realizacje i najczęstsze pytania.',
        ],
        'mobile' => [
            'name' => 'Aplikacje mobilne na iOS i Android',
            'note' => 'aplikacja mobilna od 999 zł do 3 999 zł, zwykle w ciągu trzech tygodni, rozbudowana aplikacja z własnym backendem od 4 499 zł, budowana etapami; jeden kod na iOS i Android, publikacja w App Store i Google Play, realizacje i najczęstsze pytania.',
        ],
        'ai' => [
            'name' => 'Automatyzacja i wdrożenia AI',
            'note' => 'chatbot albo pojedyncza automatyzacja od 299 zł do 1 499 zł, zwykle w ciągu tygodnia, agent AI zintegrowany z systemami firmy od 1 999 zł do 4 999 zł, zwykle w ciągu trzech tygodni; odpowiedzi na podstawie dokumentów firmy, akceptacje i logi, bezpieczeństwo danych, koszty modeli i najczęstsze pytania.',
        ],
        'devops' => [
            'name' => 'DevOps i chmura dla firm',
            'note' => 'konfiguracja serwera albo chmury z CI/CD i kopiami zapasowymi od 499 zł do 1 499 zł, zwykle w ciągu tygodnia, infrastruktura jako kod i migracja do chmury od 1 999 zł do 4 999 zł, zwykle w ciągu dwóch tygodni; monitoring 24/7, bezpieczeństwo, koszty chmury i najczęstsze pytania.',
        ],
        'projects' => [
            'name' => 'Realizacje',
            'note' => 'wszystkie realizacje, każda z własnym case study: opis projektu, wyzwania, rozwiązania, wyniki i technologie.',
        ],
        'about' => [
            'name' => 'O nas',
            'note' => 'współzałożyciele Damian Idzik i Kamil Nawrot, jak pracujemy (zdalnie w całej Polsce, na miejscu w Lesznie i okolicach), wybrane realizacje i dane firmy.',
        ],
        'partners' => [
            'name' => 'Program partnerski',
            'note' => '15% wartości netto każdej opłaconej faktury poleconego klienta przez 12 miesięcy od jego pierwszego zamówienia, wypłata do 14 dni od opłacenia faktury, bez opłat i limitu poleceń; kalkulator prowizji, zasady i formularz zgłoszenia.',
        ],
    ],

    'services' => [
        ['name' => 'Strony internetowe', 'note' => 'Strony firmowe i landing page, które szybko się ładują i dobrze wypadają w Google.', 'page' => 'websites'],
        ['name' => 'Aplikacje mobilne', 'note' => 'Jeden kod na iOS i Android, pełna wydajność na obu platformach.', 'page' => 'mobile'],
        ['name' => 'AI & Automatyzacja', 'note' => 'Chatboty, integracje z AI i automatyzacja procesów.', 'page' => 'ai'],
        ['name' => 'Aplikacje webowe', 'note' => 'Panele, systemy B2B i platformy SaaS z własnym API i integracjami.', 'page' => 'apps'],
        ['name' => 'DevOps & Cloud', 'note' => 'Infrastruktura jako kod, CI/CD, konteneryzacja i monitoring 24/7.', 'page' => 'devops'],
        ['name' => 'Sklepy internetowe', 'note' => 'Sklepy z płatnościami online, wysyłką i integracją z magazynem lub ERP.', 'page' => 'stores'],
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
        'service_faq' => 'faq',
        'leszno_faq' => 'faq',
        'company' => 'dane-firmy',
    ],
];
