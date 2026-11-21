<?php

/*
 * Server-side copy of the Metin2 CMS page (Metin2CmsController, /metin2cms): the meta tags and the FAQ, the single
 * source for the page and its JSON-LD. The rest of the page's copy sits next to its components
 * (resources/js/components/metin2cms/). The cache times are the system's defaults (ranking 30 minutes, the signed-in
 * account 60 seconds, the online chart 5 minutes); the page's performance section and hero quote the same.
 * English twin: lang/en/metin2cms.php (same keys).
 * Titles and descriptions for search results use plain spaces.
 */
return [
    'seo' => [
        'title' => 'CMS Metin2 – strona i panel serwera | Netizo',
        'description' => 'Gotowy CMS dla serwera Metin2: strona, panel gracza i panel administratora. Cache na Redisie, zero-downtime deploy, kod na własność i utrzymanie.',
        'name' => 'CMS dla serwera Metin2',
        'breadcrumb' => 'Metin2 CMS',
        'image' => 'assets/images/og-netizo-2.png',
        'image_alt' => 'Netizo – CMS dla serwera Metin2: strona, panel gracza i panel administratora',
    ],

    'faq' => [
        [
            'question' => 'Z jakimi plikami serwera działa CMS?',
            'answer' => 'System jest przygotowany pod strukturę bazy z plików Marty Sama: bazy account, player, common i log. Podpinamy go pod działający serwer bez zmian w grze. Jeśli Twoje pliki mają inne tabele albo dodatkowe systemy, dopasowujemy odczyty przy wdrożeniu.',
        ],
        [
            'question' => 'Czy strona obciąża bazę gry?',
            'answer' => 'W jak najmniejszym stopniu, bo to od bazy zależy płynność gry. Ranking graczy i gildii odświeża się co 30 minut, więc baza gry dostaje dwa zapytania na godzinę bez względu na liczbę odwiedzin. Dane zalogowanego konta trzymamy w cache (Redis) przez 60 sekund, a wykres graczy online doczytuje co 5 minut tylko nowe wiersze logów po kluczu głównym. TTL ustawiamy pod Twój serwer.',
        ],
        [
            'question' => 'Czy dostanę kod źródłowy?',
            'answer' => 'Tak. Po wdrożeniu przekazujemy repozytorium z całym kodem strony i panelu. Kod jest Twoją własnością: możesz go rozwijać z nami, z własnym programistą albo samodzielnie.',
        ],
        [
            'question' => 'Jak wygląda aktualizacja strony na działającym serwerze?',
            'answer' => 'Stosujemy zero-downtime deploy: nowy release budujemy obok działającego i przełączamy ruch atomowo dopiero wtedy, gdy jest gotowy. Nie ma maintenance mode ani wylogowania graczy, a gdyby coś poszło nie tak, robimy rollback do poprzedniej wersji.',
        ],
        [
            'question' => 'Czy mogę zamówić funkcję, której nie ma w standardzie?',
            'answer' => 'Tak. Własne moduły, na przykład itemshop w przeglądarce, Vote4Coins, wiki przedmiotów czy kolejną wersję językową, dopisujemy na zamówienie. Mniejsze zmiany zajmują zwykle kilka dni, bo system jest zbudowany tak, żeby dało się go łatwo rozszerzać.',
        ],
        [
            'question' => 'Jakie płatności obsługuje system?',
            'answer' => 'W standardzie doładowania przez CashBill: BLIK, szybkie przelewy i karty. Pakiety monet, bonusy i promocje czasowe ustawiasz sam w panelu, a każdą wpłatę widzisz razem z jej statusem u operatora. Innego operatora płatności podłączamy na zamówienie.',
        ],
        [
            'question' => 'Kto opiekuje się stroną po starcie?',
            'answer' => 'My. W ramach utrzymania pilnujemy działania strony, robimy backupy, wgrywamy aktualizacje i patche bezpieczeństwa oraz wprowadzamy zmiany, o które poprosisz. Na zgłoszenia odpowiadamy w ciągu 24 godzin.',
        ],
        [
            'question' => 'Ile kosztuje wdrożenie?',
            'answer' => 'Cena zależy od plików serwera, wyglądu strony i modułów na zamówienie. Wycenę przygotowujemy bezpłatnie po krótkiej rozmowie, zwykle w ciągu 24 godzin.',
        ],
    ],
];
