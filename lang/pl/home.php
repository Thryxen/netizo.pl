<?php

/*
 * Server-side copy of the home page (HomeController): meta tags and the FAQ, the single source for the FAQ section and
 * its JSON-LD. English twin: lang/en/home.php (same keys).
 * Ranges keep together: a word joiner (U+2060) after the dash, a no-break space (U+00A0) before the unit.
 */
return [
    'seo' => [
        'title' => 'Strony internetowe i aplikacje webowe dla firm – Leszno | Netizo',
        'description' => 'Zamów bezpłatną wycenę strony internetowej lub aplikacji. Szybkość i SEO w standardzie, 150+ projektów i 8 lat doświadczenia zespołu. Leszno i cała Polska.',
        'share_description' => 'Profesjonalne strony internetowe i aplikacje webowe. Nowoczesny design, szybkość, SEO. 150+ projektów zespołu. Bezpłatna wycena!',
        'organization_description' => 'Netizo tworzy strony internetowe i aplikacje webowe dla firm z Leszna i całej Polski. Netizo założyli w 2023 roku Damian Idzik i Kamil Nawrot. Nowoczesny design, szybkość i SEO w standardzie.',
        'country' => 'Polska',
        'image' => 'assets/images/og-netizo-2.png',
    ],

    'faq' => [
        [
            'question' => 'Ile kosztuje strona internetowa lub aplikacja?',
            'answer' => "Strona internetowa kosztuje od 799\u{00A0}zł, sklep internetowy od 1\u{00A0}299\u{00A0}zł, aplikacja webowa od 1\u{00A0}699\u{00A0}zł, aplikacja mobilna od 999\u{00A0}zł, automatyzacja z AI od 299\u{00A0}zł, a DevOps i chmura od 499\u{00A0}zł. Ostateczna cena zależy od zakresu, a dokładną wycenę dostajesz bezpłatnie po briefie.",
        ],
        [
            'question' => 'Ile trwa stworzenie strony lub aplikacji?',
            'answer' => "Prosta strona albo landing page powstaje zwykle w ciągu tygodnia, rozbudowana strona firmowa w ciągu dwóch tygodni, a aplikacja webowa w 2–\u{2060}4\u{00A0}miesiące. Dokładny termin ustalamy po briefie, gdy znamy zakres prac.",
        ],
        [
            'question' => 'Czy strona będzie widoczna w Google?',
            'answer' => 'Tak. Każdą stronę budujemy z myślą o wyszukiwarce: szybkie ładowanie, poprawna struktura nagłówków, tytuły i opisy do wyników wyszukiwania, dane strukturalne i mapa witryny. Konkretnej pozycji nikt uczciwie nie zagwarantuje, bo zależy ona też od konkurencji i treści, ale dostajesz solidne podstawy do pozycjonowania, także lokalnego.',
        ],
        [
            'question' => 'Czy mogę samodzielnie zmieniać treści na stronie?',
            'answer' => 'Tak. Jeśli chcesz to robić we własnym zakresie, dodajemy prosty system do zarządzania treścią (CMS): zmienisz w nim teksty, zdjęcia i wpisy, a my pokażemy, jak z niego korzystać. Większe zmiany zgłaszasz nam jako zadanie w panelu klienta.',
        ],
        [
            'question' => 'Czy zaprojektujecie wygląd strony, jeśli nie mam projektu?',
            'answer' => 'Tak. Mamy w zespole projektantów UI/UX: zaprojektujemy wygląd od zera albo oprzemy się na Twoich szkicach, logo i identyfikacji wizualnej. Zanim zaczniemy programować, dostajesz projekt i klikalny prototyp w Figmie do przejrzenia i akceptacji.',
        ],
        [
            'question' => 'Czy możecie odświeżyć moją obecną stronę, zamiast budować nową?',
            'answer' => 'Tak. Zaczynamy od przeglądu obecnej strony: co działa, co ją spowalnia i co zniechęca klientów. Potem proponujemy odświeżenie wyglądu i treści albo przebudowę, jeśli stara technologia ogranicza rozwój. Przy przebudowie przekierowujemy stare adresy na nowe, żeby ograniczyć ryzyko spadków w Google.',
        ],
        [
            'question' => 'Czy zajmiecie się domeną, hostingiem i pocztą firmową?',
            'answer' => 'Tak. Pomagamy wybrać i skonfigurować domenę, hosting i firmową pocztę albo pracujemy na tym, co już masz. Dostępy trzymasz w zaszyfrowanym sejfie w panelu klienta, a zanim minie termin odnowienia domeny lub hostingu, dostajesz tam przypomnienie.',
        ],
        [
            'question' => 'Czy zapewniacie opiekę nad stroną po wdrożeniu?',
            'answer' => 'Tak. Po publikacji zostajemy z Tobą: dbamy o hosting, aktualizacje bezpieczeństwa, kopie zapasowe, monitoring i dalszy rozwój strony. Poprawki zgłaszasz jako zadania w panelu klienta, a przy stałej współpracy co miesiąc dostajesz rozliczenie z rozpisanymi godzinami.',
        ],
        [
            'question' => 'Czy mogę zobaczyć postępy w trakcie pracy?',
            'answer' => 'Tak. Od początku współpracy masz dostęp do panelu klienta: widzisz zadania i etap każdego z nich, czas pracy i dokumenty, a z zespołem piszesz na czacie. Co dwa tygodnie pokazujemy postępy na wersji testowej.',
        ],
        [
            'question' => 'Czy pracujecie z firmami z całej Polski?',
            'answer' => 'Tak. Większość projektów prowadzimy zdalnie: rozmawiamy na wideorozmowach i przez telefon, a postępy widzisz w panelu klienta. Z firmami z Leszna i okolic, m.in. z Rydzyny, Wschowy, Kościana, Gostynia i Rawicza, możemy też spotkać się osobiście: przyjeżdżamy do Ciebie. Nie mamy biura dla klientów, a Kępno to adres rejestrowy firmy.',
        ],
        [
            'question' => 'Jakie technologie wykorzystujecie?',
            'answer' => 'Technologie dobieramy do potrzeb projektu. Najczęściej pracujemy na takim zestawie: interfejs – React, Next.js, Vue.js i Tailwind CSS; serwer – Node.js, Go, Laravel i Python; bazy danych – PostgreSQL, MongoDB i Redis; chmura – AWS, GCP i Vercel.',
        ],
    ],
];
