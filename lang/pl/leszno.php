<?php

/*
 * Server-side copy of the Leszno page (LesznoController, /tworzenie-stron-internetowych/leszno): the meta tags and the
 * FAQ, the single source for the page, its JSON-LD and llms.txt. A service area, not an office: the page names the
 * towns we travel to (StructuredData::MEETING_TOWNS) and never an address in Leszno; Kępno is the registered address.
 * The prices are those of the websites page (App\Enums\Service::Websites, lang/pl/services.php), the rest of the page's
 * copy sits next to its components (resources/js/components/leszno/).
 * English twin: lang/en/leszno.php (same keys).
 * Ranges keep together: a no-break space (U+00A0) before the unit and inside amounts. Titles and descriptions for
 * search results use plain spaces.
 */
return [
    'seo' => [
        'title' => 'Tworzenie stron internetowych Leszno – od 799 zł | Netizo',
        'description' => 'Strony internetowe dla firm z Leszna i okolic od 799 zł. Przyjeżdżamy do Ciebie: Rydzyna, Wschowa, Kościan, Gostyń, Rawicz. Bezpłatna wycena.',
        'name' => 'Tworzenie stron internetowych w Lesznie i okolicach',
        'breadcrumb' => 'Leszno i okolice',
        'service_type' => 'Tworzenie stron internetowych',
        'image' => 'assets/images/og-netizo-tworzenie-stron-internetowych-leszno.jpg',
        'image_alt' => 'Tworzenie stron internetowych w Lesznie i okolicach od 799 zł – Netizo',
    ],

    'faq' => [
        [
            'question' => 'Czy przyjeżdżacie do firm z Leszna i okolic?',
            'answer' => 'Tak. Do firm z Leszna, Rydzyny, Wschowy, Kościana, Gostynia, Rawicza i okolicznych miejscowości przyjeżdżamy na spotkanie: siadamy przy laptopie w Twojej firmie i omawiamy stronę na żywo. Z firmami spoza tego obszaru pracujemy zdalnie, na wideorozmowach i przez telefon.',
        ],
        [
            'question' => 'Czy macie biuro w Lesznie?',
            'answer' => 'Nie. Nie mamy biura dla klientów, więc to my przyjeżdżamy do Ciebie: do biura, sklepu, warsztatu albo gabinetu. Kępno to adres rejestrowy firmy.',
        ],
        [
            'question' => 'Ile kosztuje strona internetowa dla firmy z Leszna?',
            'answer' => "Prosta strona, czyli landing page albo strona wizytówka, kosztuje od 799\u{00A0}zł do 1\u{00A0}499\u{00A0}zł, a rozbudowana strona z CMS, blogiem albo rezerwacjami od 1\u{00A0}799\u{00A0}zł do 2\u{00A0}999\u{00A0}zł. Cenę podnoszą przede wszystkim liczba podstron, integracje i funkcje, które trzeba zaprojektować od zera. Dokładną wycenę dostajesz bezpłatnie po spotkaniu albo po briefie.",
        ],
        [
            'question' => 'Ile trwa zrobienie strony?',
            'answer' => 'Prosta strona albo landing page powstaje zwykle w ciągu tygodnia, a rozbudowana strona firmowa w ciągu dwóch tygodni. Najczęściej na termin wpływają treści i zdjęcia, dlatego ustalamy je już na pierwszym spotkaniu. Dokładny termin podajemy razem z wyceną.',
        ],
        [
            'question' => 'Czy muszę spotkać się z wami osobiście?',
            'answer' => 'Nie. Spotkanie u Ciebie to możliwość, nie obowiązek. Jeśli wolisz, całą stronę zrobimy zdalnie: rozmawiamy przez telefon i na wideorozmowach, prototyp oglądasz na swoim telefonie i komputerze, a postępy widzisz w panelu klienta.',
        ],
        [
            'question' => 'Czy strona pomoże mi docierać do klientów z okolicy przez Google?',
            'answer' => 'Każdą stronę budujemy z myślą o wyszukiwarce: szybkie ładowanie, poprawne nagłówki, tytuły i opisy do wyników wyszukiwania, dane strukturalne i mapa witryny. Przy firmie lokalnej strona mówi też wprost, gdzie działasz i do jakich miejscowości dojeżdżasz. Konkretnej pozycji nikt uczciwie nie zagwarantuje, ale dostajesz solidne podstawy do pozycjonowania lokalnego.',
        ],
        [
            'question' => 'Co przygotować na pierwsze spotkanie?',
            'answer' => 'Wystarczy, że opowiesz o firmie i o klientach, do których chcesz trafić. Pomagają logo, zdjęcia firmy i realizacji, przykłady stron, które Ci się podobają, i dostęp do obecnej domeny, jeśli ją masz. Jeśli nie masz jeszcze tekstów, ułożymy ich plan razem.',
        ],
    ],
];
