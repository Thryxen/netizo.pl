<?php

/*
 * Server-side copy of the Metin2 CMS page (Metin2CmsController, /metin2cms): the meta tags and the FAQ, the single
 * source for the page and its JSON-LD. The rest of the page's copy sits next to its components
 * (resources/js/components/metin2cms/). The cache times are the system's defaults (ranking 30 minutes, the signed-in
 * account 60 seconds, the online chart 5 minutes); the page's performance section and hero quote the same.
 * English twin: lang/en/metin2cms.php (same keys).
 * The title and the description carry what a server owner searches for: CMS Metin2, the server's website, the player
 * panel, a private server. `service_type` and `audience` describe the Service node of the JSON-LD.
 * Titles and descriptions for search results use plain spaces.
 */
return [
    'seo' => [
        'title' => 'CMS Metin2 – strona serwera z panelem gracza | Netizo',
        'description' => 'Gotowy CMS dla prywatnego serwera Metin2: strona z rankingiem, panel gracza, doładowania i panel administratora. Wdrożenie, kod na własność, utrzymanie.',
        'name' => 'CMS dla serwera Metin2',
        'breadcrumb' => 'Metin2 CMS',
        'service_type' => 'CMS dla prywatnych serwerów Metin2',
        'audience' => 'Właściciele i administratorzy prywatnych serwerów Metin2',
        'image' => 'assets/images/og-netizo-metin2cms.jpg',
        'image_alt' => 'Netizo – CMS dla serwera Metin2: strona, panel gracza i panel administratora',
    ],

    'faq' => [
        [
            'question' => 'Z jakimi plikami serwera działa CMS?',
            'answer' => 'System jest przygotowany pod strukturę bazy z plików Marty Sama: bazy account, player, common i log. Podpinamy go pod działający serwer bez zmian w grze. Jeśli Twoje pliki mają inne tabele albo dodatkowe systemy, dopasowujemy odczyty przy wdrożeniu.',
        ],
        [
            'question' => 'Czym ten CMS różni się od darmowych CMS-ów do Metin2?',
            'answer' => 'Darmowy CMS pobierasz i utrzymujesz sam: dopasowanie do plików, poprawki bezpieczeństwa i aktualizacje są po Twojej stronie. U nas dostajesz wdrożenie pod Twoją bazę gry, wygląd zaprojektowany pod serwer i cache, który ogranicza zapytania do bazy. Jeśli chcesz, bierzemy też utrzymanie z zero-downtime deployem. Kod i tak jest Twoją własnością.',
        ],
        [
            'question' => 'Czy strona serwera będzie miała własny wygląd?',
            'answer' => 'Tak. Wygląd projektujemy pod serwer: grafiki, kolory i nagłówek strony. System pod spodem zostaje ten sam, więc panel gracza i panel administratora działają od pierwszego dnia. Przykład zobaczysz w sekcji wdrożeń: stronę Sherkana zaprojektowaliśmy w całości pod ten serwer.',
        ],
        [
            'question' => 'Jakie płatności obsługuje system?',
            'answer' => 'W standardzie doładowania przez jednego operatora płatności, którego sam wybierasz: zwykle BLIK, szybkie przelewy i karty. Pakiety monet, bonusy i promocje czasowe ustawiasz sam w panelu, a każdą wpłatę widzisz razem z jej statusem u operatora. Kolejnego operatora podłączamy na zamówienie.',
        ],
        [
            'question' => 'Czy CMS ma itemshop?',
            'answer' => 'W standardzie są doładowania: gracz kupuje na stronie pakiet monet, a monety trafiają na jego konto. Itemshop w przeglądarce, z listą przedmiotów i zakupem prosto ze strony, dopisujemy jako moduł na zamówienie.',
        ],
        [
            'question' => 'Czy mogę zamówić funkcję, której nie ma w standardzie?',
            'answer' => 'Tak. Własne moduły, na przykład itemshop w przeglądarce, Vote4Coins, wiki przedmiotów czy kolejną wersję językową, dopisujemy na zamówienie. Mniejsze zmiany zajmują zwykle kilka dni, bo system jest zbudowany tak, żeby dało się go łatwo rozszerzać. Nową funkcję dodajesz w panelu klienta jako zadanie w odpowiedniej kategorii: wyceniamy ją, a po Twojej akceptacji zaczynamy.',
        ],
        [
            'question' => 'Czy strona obciąża bazę gry?',
            'answer' => 'W jak najmniejszym stopniu, bo to od bazy zależy płynność gry. Ranking graczy i gildii odświeża się co 30 minut, więc baza gry dostaje dwa zapytania na godzinę bez względu na liczbę odwiedzin. Dane zalogowanego konta trzymamy w cache (Redis) przez 60 sekund, a wykres graczy online doczytuje co 5 minut tylko nowe wiersze logów po kluczu głównym. TTL ustawiamy pod Twój serwer.',
        ],
        [
            'question' => 'Jak system chroni serwer przed botami i multikontami?',
            'answer' => 'Rejestracja ma hCaptcha, potwierdzenie e-mail i limit prób z jednego adresu. Po pięciu nieudanych próbach logowanie blokuje się na minutę, a do wejścia potrzebny jest też PIN. W panelu administratora graf powiązań pokazuje konta ze wspólnym IP i sprzętem, a blokada HWID zamyka dostęp do gry z danego komputera.',
        ],
        [
            'question' => 'Czy dostanę kod źródłowy?',
            'answer' => 'Tak. Po wdrożeniu cały kod strony i panelu pobierasz w panelu klienta Netizo. Kod jest Twoją własnością: możesz go rozwijać z nami, z własnym programistą albo samodzielnie.',
        ],
        [
            'question' => 'Kto opiekuje się stroną po starcie?',
            'answer' => 'To Twoja decyzja. Utrzymanie jest opcją: w jego ramach pilnujemy działania strony, robimy backupy, wgrywamy aktualizacje i patche bezpieczeństwa oraz wprowadzamy zmiany, o które poprosisz, a na zgłoszenia odpowiadamy w ciągu 24 godzin. Błędy i zmiany zgłaszasz w panelu klienta jako zadania i widzisz, na jakim są etapie. Możesz też prowadzić stronę sam albo z własnym programistą, bo kod jest Twój.',
        ],
        [
            'question' => 'Jak wygląda aktualizacja strony na działającym serwerze?',
            'answer' => 'Jeśli utrzymujemy stronę, stosujemy zero-downtime deploy: nowy release budujemy obok działającego i przełączamy ruch atomowo dopiero wtedy, gdy jest gotowy. Nie ma maintenance mode ani wylogowania graczy, a gdyby coś poszło nie tak, robimy rollback do poprzedniej wersji. Bez utrzymania aktualizacje wdrażasz po swojemu: kod jest Twój i pobierasz go w panelu klienta.',
        ],
        [
            'question' => 'Ile kosztuje wdrożenie?',
            'answer' => 'Cena zależy od plików serwera, wyglądu strony i modułów na zamówienie. Wycenę przygotowujemy bezpłatnie po krótkiej rozmowie, zwykle w ciągu 24 godzin.',
        ],
    ],
];
