<?php

/*
 * Server-side copy of the service pages (ServicePageController): meta tags, the card shown on the other service pages
 * and in llms.txt, the tiers and the FAQ, the single source for the page, its JSON-LD and llms.txt. The tiers' prices
 * are numbers, so they live in App\Enums\Service::priceBrackets() (the home page FAQ's ranges), in the order of `offers`.
 * The rest of the page's copy sits next to its components (resources/js/components/services/*-copy.ts).
 * English twin: lang/en/services.php (same keys).
 * Ranges keep together: a word joiner (U+2060) after the dash, a no-break space (U+00A0) before the unit and inside
 * amounts. Titles and descriptions for search results use plain spaces.
 */
return [
    'websites' => [
        'seo' => [
            'title' => 'Tworzenie stron internetowych od 799 zł – Leszno | Netizo',
            'description' => 'Zamów stronę internetową dla firmy od 799 zł. Projekt w Figmie, wersja mobilna, SEO i szybkość w standardzie. Prosta strona zwykle w ciągu tygodnia.',
            'name' => 'Tworzenie stron internetowych',
            'breadcrumb' => 'Strony internetowe',
            'image' => 'assets/images/og-netizo-tworzenie-stron-internetowych.jpg',
            'image_alt' => 'Tworzenie stron internetowych od 799 zł – Netizo',
        ],

        'card' => [
            'name' => 'Strony internetowe',
            'description' => 'Strony firmowe i landing page z projektem w Figmie, SEO i szybkością w standardzie.',
        ],

        'offers' => [
            [
                'name' => 'Prosta strona',
                'description' => 'Landing page albo strona wizytówka: jedna lub kilka podstron, które przedstawiają firmę i zbierają zapytania.',
                'timeline' => 'Zwykle do tygodnia',
                'includes' => [
                    'Projekt graficzny i klikalny prototyp w Figmie',
                    'Wersja na telefony, tablety i komputery',
                    'Formularz kontaktowy z powiadomieniem na e-mail',
                    'Szybkie ładowanie i podstawy SEO: tytuły, opisy, dane strukturalne i mapa witryny',
                    'Pomoc z domeną, hostingiem i pocztą firmową',
                ],
            ],
            [
                'name' => 'Rozbudowana strona',
                'description' => 'Strona firmowa z wieloma podstronami i treściami, które zmieniasz sam: ofertą, blogiem, galerią albo rezerwacjami.',
                'timeline' => 'Zwykle do dwóch tygodni',
                'includes' => [
                    'Wszystko z prostej strony',
                    'System do zarządzania treścią (CMS) i pokaz, jak z niego korzystać',
                    'Blog, aktualności albo katalog oferty',
                    'Wersje językowe, jeśli ich potrzebujesz',
                    'Integracje, np. rezerwacje online, płatności albo CRM',
                    'Przekierowania starych adresów przy przebudowie strony',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'Ile kosztuje strona internetowa dla firmy?',
                'answer' => "Prosta strona, czyli landing page albo strona wizytówka, kosztuje od 799\u{00A0}zł do 1\u{00A0}499\u{00A0}zł, a rozbudowana strona z CMS, blogiem albo rezerwacjami od 1\u{00A0}799\u{00A0}zł do 2\u{00A0}999\u{00A0}zł. Cenę podnoszą przede wszystkim liczba podstron, integracje i funkcje, które trzeba zaprojektować od zera. Dokładną wycenę dostajesz bezpłatnie po briefie.",
            ],
            [
                'question' => 'Ile trwa stworzenie strony internetowej?',
                'answer' => 'Prosta strona albo landing page powstaje zwykle w ciągu tygodnia, a rozbudowana strona firmowa w ciągu dwóch tygodni. Najczęściej na termin wpływają treści i zdjęcia, dlatego ustalamy je na samym początku. Dokładny termin podajemy po briefie, razem z wyceną.',
            ],
            [
                'question' => 'Co muszę przygotować przed rozpoczęciem?',
                'answer' => 'Wystarczy, że opowiesz o firmie i o klientach, do których chcesz trafić. Pomagają logo, zdjęcia, przykłady stron, które Ci się podobają, i dostęp do obecnej domeny. Jeśli nie masz jeszcze tekstów, pomożemy ułożyć ich plan na każdą podstronę.',
            ],
            [
                'question' => 'Na czym budujecie strony: WordPress czy własny kod?',
                'answer' => 'Technologię dobieramy do strony. Strony firmowe i landing page budujemy najczęściej na Next.js, Astro albo Laravelu z Reactem, a treści edytujesz w prostym CMS. Dzięki temu strona szybko się ładuje i nie zależy od wtyczek, które trzeba stale aktualizować. Jeśli zależy Ci na konkretnym systemie, napisz o tym w briefie.',
            ],
            [
                'question' => 'Czy strona będzie dobrze wyglądać na telefonie?',
                'answer' => 'Tak. Każdą stronę projektujemy najpierw na telefon, a potem rozszerzamy na tablety i komputery. Obie wersje widzisz w prototypie w Figmie, zanim zaczniemy programować, a przed publikacją sprawdzamy stronę na prawdziwych urządzeniach.',
            ],
            [
                'question' => 'Czy pomożecie z pozycjonowaniem strony w Google?',
                'answer' => 'Każdą stronę budujemy z myślą o wyszukiwarce: szybkie ładowanie, poprawna struktura nagłówków, tytuły i opisy do wyników wyszukiwania, dane strukturalne i mapa witryny. Konkretnej pozycji nikt uczciwie nie zagwarantuje, bo zależy też od konkurencji i treści, ale dostajesz solidne podstawy do pozycjonowania, także lokalnego. Przy przebudowie przekierowujemy stare adresy na nowe.',
            ],
            [
                'question' => 'Co dzieje się po publikacji strony?',
                'answer' => 'Pokazujemy, jak zmieniać treści w CMS, jeśli go masz, a większe zmiany zgłaszasz jako zadania w panelu klienta. Możemy też zostać z Tobą na stałe: dbamy o hosting, aktualizacje bezpieczeństwa, kopie zapasowe i monitoring, a co miesiąc dostajesz rozliczenie z rozpisanymi godzinami.',
            ],
        ],
    ],

    'stores' => [
        'seo' => [
            'title' => 'Sklepy internetowe dla firm od 1 299 zł – Leszno | Netizo',
            'description' => 'Zamów sklep internetowy od 1 299 zł. Płatności online, wysyłka, integracja z magazynem lub ERP i szybkie strony produktów. Bezpłatna wycena po briefie.',
            'name' => 'Tworzenie sklepów internetowych',
            'breadcrumb' => 'Sklepy internetowe',
            'image' => 'assets/images/og-netizo-sklepy-internetowe.jpg',
            'image_alt' => 'Sklepy internetowe od 1 299 zł – Netizo',
        ],

        'card' => [
            'name' => 'Sklepy internetowe',
            'description' => 'Sklepy z płatnościami online, wysyłką i integracją z magazynem, od małego sklepu po B2B.',
        ],

        'offers' => [
            [
                'name' => 'Mały sklep',
                'description' => 'Sklep dla firmy, która zaczyna sprzedawać online: katalog produktów, koszyk, płatności, wysyłka i panel do obsługi zamówień.',
                'timeline' => 'Zwykle do czterech tygodni',
                'includes' => [
                    'Projekt sklepu i klikalny prototyp w Figmie',
                    'Katalog produktów z wariantami, np. rozmiarem albo kolorem',
                    'Płatności online: BLIK, karty i szybkie przelewy',
                    'Wysyłka kurierem i do paczkomatów, z kosztem liczonym w koszyku',
                    'Panel zamówień, stanów magazynowych i kodów rabatowych',
                    'Szybkie strony produktów i podstawy SEO',
                ],
            ],
            [
                'name' => 'Duży e-commerce',
                'description' => 'Sklep z dużym katalogiem albo sprzedażą B2B, połączony z magazynem, hurtownią lub systemem ERP, z indywidualnymi cenami.',
                'timeline' => 'Zwykle do ośmiu tygodni',
                'includes' => [
                    'Wszystko z małego sklepu',
                    'Integracja z magazynem, hurtownią albo ERP, np. Comarch ERP Optima',
                    'Indywidualne cenniki, limity kupieckie i konta firmowe (B2B)',
                    'Wyszukiwarka z filtrami i podpowiedziami',
                    'Szybki frontend headless, np. w Next.js',
                    'Przeniesienie produktów i klientów ze starego sklepu',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'Ile kosztuje sklep internetowy?',
                'answer' => "Mały sklep kosztuje od 1\u{00A0}299\u{00A0}zł, zwykle do 4\u{00A0}999\u{00A0}zł, a duży e-commerce z integracjami z magazynem, hurtownią albo ERP 5\u{00A0}499–\u{2060}12\u{00A0}999\u{00A0}zł. Na cenę wpływają przede wszystkim liczba produktów i wariantów, integracje i to, czy sprzedajesz też firmom (B2B). Dokładną wycenę dostajesz bezpłatnie po briefie.",
            ],
            [
                'question' => 'Czy robicie sklepy na Shopify albo WooCommerce?',
                'answer' => 'Tak, jeśli to najlepsza droga dla Twojej sprzedaży: przy mniejszym katalogu gotowa platforma bywa najszybszym startem. Gdy potrzebujesz indywidualnych cen, integracji z ERP albo bardzo szybkiego frontendu, budujemy sklep na własnym kodzie, także w modelu headless. Doradzimy po briefie.',
            ],
            [
                'question' => 'Jakie płatności i formy wysyłki możecie podłączyć?',
                'answer' => 'Podłączamy płatności online przez bramki takie jak Przelewy24 albo Stripe, czyli BLIK, karty i szybkie przelewy, a także płatność przy odbiorze. Wysyłkę konfigurujemy u kurierów i w paczkomatach, z kosztem liczonym w koszyku i etykietami nadania z panelu.',
            ],
            [
                'question' => 'Czy połączycie sklep z magazynem, hurtownią albo ERP?',
                'answer' => 'Tak. Synchronizujemy stany i ceny z hurtownią albo magazynem, a zamówienia z systemem ERP lub księgowym, np. Comarch ERP Optima. Dzięki temu nie przepisujesz danych ręcznie, a klient widzi aktualną dostępność.',
            ],
            [
                'question' => 'Czy przeniesiecie produkty i klientów ze starego sklepu?',
                'answer' => 'Tak. Przenosimy produkty, zdjęcia, kategorie i konta klientów, a stare adresy produktów przekierowujemy na nowe, żeby nie stracić ruchu z Google ani linków z innych stron.',
            ],
            [
                'question' => 'Jak szybko będzie działał sklep?',
                'answer' => 'Szybkość planujemy od początku: lekkie strony produktów, zoptymalizowane zdjęcia i pamięć podręczna. Przy dużym katalogu budujemy frontend headless, który szybko ładuje się także na telefonie. To ważne, bo każda sekunda czekania zniechęca część klientów.',
            ],
            [
                'question' => 'Czy sam dodam produkty i obsłużę zamówienia?',
                'answer' => 'Tak. W panelu sklepu dodajesz produkty i warianty, zmieniasz ceny i stany, tworzysz kody rabatowe i obsługujesz zamówienia od płatności po wysyłkę. Na start pokazujemy, jak z niego korzystać, a większe zmiany zgłaszasz jako zadania w panelu klienta.',
            ],
        ],
    ],

    'apps' => [
        'seo' => [
            'title' => 'Aplikacje webowe na zamówienie od 1 699 zł | Netizo',
            'description' => 'Zamów aplikację webową od 1 699 zł: panel, system B2B lub platformę SaaS z integracjami. Zwykle do trzech tygodni. Bezpłatna wycena.',
            'name' => 'Aplikacje webowe na zamówienie',
            'breadcrumb' => 'Aplikacje webowe',
            'image' => 'assets/images/og-netizo-aplikacje-webowe.jpg',
            'image_alt' => 'Aplikacje webowe na zamówienie od 1 699 zł – Netizo',
        ],

        'card' => [
            'name' => 'Aplikacje webowe',
            'description' => 'Panele, systemy B2B i platformy SaaS z integracjami i rolami użytkowników.',
        ],

        'offers' => [
            [
                'name' => 'Aplikacja webowa',
                'description' => 'Panel, system wewnętrzny albo portal dla klientów, który porządkuje jeden proces w firmie, np. zamówienia, rezerwacje albo flotę.',
                'timeline' => 'Zwykle do trzech tygodni',
                'includes' => [
                    'Analiza procesu i spisany zakres prac',
                    'Projekt interfejsu i klikalny prototyp w Figmie',
                    'Logowanie, role i uprawnienia użytkowników',
                    'Panel administracyjny, raporty i eksport danych',
                    'Integracje przez API, np. z księgowością albo płatnościami',
                    'Demo na wersji testowej co dwa tygodnie',
                ],
            ],
            [
                'name' => 'Duży system',
                'description' => 'Platforma dla wielu grup użytkowników, z subskrypcjami, integracjami z ERP albo dużym ruchem, rozwijana etapami.',
                'timeline' => 'Po analizie, etapami',
                'includes' => [
                    'Wszystko z aplikacji webowej',
                    'Dane na żywo i architektura pod duży ruch',
                    'Subskrypcje i płatności cykliczne',
                    'Integracje z ERP, CRM i systemami partnerów',
                    'Infrastruktura w chmurze, CI/CD i monitoring',
                    'Rozwój w kolejnych etapach i opieka po wdrożeniu',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'Ile kosztuje aplikacja webowa?',
                'answer' => "Aplikacja webowa kosztuje od 1\u{00A0}699\u{00A0}zł, zwykle do 3\u{00A0}999\u{00A0}zł, a duże systemy z wieloma grupami użytkowników i integracjami od 4\u{00A0}499\u{00A0}zł. Cena zależy od liczby ekranów i ról, integracji i wymagań co do bezpieczeństwa i obciążenia. Większe systemy dzielimy na etapy, żeby pierwsza wersja szybko trafiła do użytkowników. Wycena po briefie jest bezpłatna.",
            ],
            [
                'question' => 'Ile trwa stworzenie aplikacji webowej?',
                'answer' => 'Typowa aplikacja webowa powstaje zwykle w ciągu trzech tygodni. Pracujemy w dwutygodniowych sprintach i po każdym pokazujemy postępy na wersji testowej, więc działające fragmenty widzisz od pierwszych dni. Termin dużego systemu ustalamy po analizie, etapami.',
            ],
            [
                'question' => 'Czym aplikacja webowa różni się od strony internetowej?',
                'answer' => 'Strona internetowa przede wszystkim przedstawia firmę i zbiera zapytania. Aplikacja webowa wykonuje pracę: użytkownicy logują się do niej, mają swoje role i dane, a system liczy, wysyła, synchronizuje i raportuje. Działa w przeglądarce, więc nikt nie musi niczego instalować.',
            ],
            [
                'question' => 'Czy połączycie aplikację z naszymi systemami?',
                'answer' => 'Tak. Integrujemy aplikacje przez API z systemami ERP i księgowymi, bramkami płatności, CRM, kalendarzami i bramkami SMS, a gdy system nie ma API, szukamy innej drogi, np. wymiany plików. Łączymy się np. z Comarch ERP Optima, Google Calendar czy bramkami SMS, takimi jak SMSAPI.',
            ],
            [
                'question' => 'Jak dbacie o bezpieczeństwo danych?',
                'answer' => 'Role i uprawnienia projektujemy od pierwszego dnia, połączenia są szyfrowane, robimy kopie zapasowe i monitorujemy działanie aplikacji. Logowanie może mieć drugi składnik, np. jednorazowy kod z e-maila, a do danych mają dostęp tylko osoby, które ich potrzebują.',
            ],
            [
                'question' => 'Czy aplikacja zadziała na telefonie?',
                'answer' => 'Tak. Aplikacje webowe projektujemy tak, żeby wygodnie działały na komputerze, tablecie i telefonie. Jeśli potrzebujesz też aplikacji w App Store i Google Play, możemy zbudować ją na tym samym backendzie.',
            ],
            [
                'question' => 'Co dzieje się po wdrożeniu aplikacji?',
                'answer' => 'Zostajemy z Tobą: monitorujemy działanie, aktualizujemy zależności i rozwijamy aplikację o kolejne funkcje. Zadania i poprawki zgłaszasz w panelu klienta, a przy stałej współpracy co miesiąc dostajesz rozliczenie z rozpisanymi godzinami.',
            ],
        ],
    ],

    'mobile' => [
        'seo' => [
            'title' => 'Aplikacje mobilne na iOS i Android od 999 zł | Netizo',
            'description' => 'Zamów aplikację mobilną na iOS i Android od 999 zł. Jeden kod na obie platformy, projekt w Figmie i publikacja w App Store i Google Play.',
            'name' => 'Aplikacje mobilne na iOS i Android',
            'breadcrumb' => 'Aplikacje mobilne',
            'image' => 'assets/images/og-netizo-aplikacje-mobilne.jpg',
            'image_alt' => 'Aplikacje mobilne na iOS i Android od 999 zł – Netizo',
        ],

        'card' => [
            'name' => 'Aplikacje mobilne',
            'description' => 'Aplikacje na iOS i Android z jednego kodu, z publikacją w App Store i Google Play.',
        ],

        'offers' => [
            [
                'name' => 'Aplikacja mobilna',
                'description' => 'Aplikacja na iOS i Android z jedną główną funkcją, np. zamówieniami, rezerwacjami albo programem lojalnościowym, połączona z Twoim systemem.',
                'timeline' => 'Zwykle do trzech tygodni',
                'includes' => [
                    'Projekt ekranów i klikalny prototyp w Figmie',
                    'Jeden kod na iOS i Android (React Native albo Flutter)',
                    'Logowanie i konta użytkowników',
                    'Powiadomienia push',
                    'Panel do zarządzania treściami i użytkownikami',
                    'Publikacja w App Store i Google Play',
                ],
            ],
            [
                'name' => 'Rozbudowana aplikacja',
                'description' => 'Aplikacja z własnym backendem, płatnościami, wieloma rolami albo trybem offline, rozwijana etapami razem z wersją webową.',
                'timeline' => 'Po briefie, etapami',
                'includes' => [
                    'Wszystko z aplikacji mobilnej',
                    'Własny backend i API, wspólne z wersją webową',
                    'Płatności i subskrypcje',
                    'Tryb offline i synchronizacja danych',
                    'Integracje z ERP, CRM i systemami partnerów',
                    'Analityka, raporty błędów i rozwój po publikacji',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'Ile kosztuje aplikacja mobilna?',
                'answer' => "Aplikacja mobilna na iOS i Android kosztuje od 999\u{00A0}zł, zwykle do 3\u{00A0}999\u{00A0}zł, a rozbudowana aplikacja z własnym backendem, płatnościami i wieloma rolami od 4\u{00A0}499\u{00A0}zł. Cena zależy od liczby ekranów, funkcji i integracji. Większe aplikacje dzielimy na etapy, żeby pierwsza wersja szybko trafiła do użytkowników. Wycena po briefie jest bezpłatna.",
            ],
            [
                'question' => 'Czy aplikacja będzie działać na iPhonie i na Androidzie?',
                'answer' => 'Tak. Budujemy aplikacje z jednego kodu w React Native albo Flutterze, więc działają na iOS i Androidzie z pełną wydajnością na obu platformach. Jeden kod to krótsza praca i łatwiejszy rozwój, a gdy jakaś funkcja wymaga kodu natywnego, dopisujemy go.',
            ],
            [
                'question' => 'Ile trwa stworzenie aplikacji mobilnej?',
                'answer' => 'Aplikacja mobilna powstaje zwykle w ciągu trzech tygodni, a rozbudowaną budujemy etapami i jej termin podajemy po briefie, bo zależy od liczby ekranów i integracji. Pracujemy w dwutygodniowych sprintach i po każdym dostajesz testową wersję aplikacji do zainstalowania na telefonie, więc postępy widzisz od pierwszych tygodni. W planie uwzględniamy też czas na weryfikację w sklepach Apple i Google.',
            ],
            [
                'question' => 'Czy zajmiecie się publikacją w App Store i Google Play?',
                'answer' => 'Tak. Przygotowujemy opisy, zrzuty ekranu i wymagane informacje o prywatności, wysyłamy aplikację do weryfikacji i poprawiamy to, o co poproszą Apple albo Google. Najlepiej, żeby aplikacja była publikowana na koncie dewelopera Twojej firmy: wtedy wpis w sklepie i opinie należą do Ciebie.',
            ],
            [
                'question' => 'Aplikacja mobilna czy aplikacja webowa?',
                'answer' => 'Aplikacja mobilna ma sens, gdy klienci korzystają z niej często albo potrzebujesz powiadomień push, aparatu, lokalizacji lub pracy bez internetu. Jeśli użytkownicy zaglądają rzadko albo pracują głównie przy komputerze, wystarczy aplikacja webowa. Często budujemy obie na wspólnym backendzie.',
            ],
            [
                'question' => 'Czy aplikacja połączy się z naszym systemem?',
                'answer' => 'Tak. Łączymy aplikacje przez API z systemami ERP, CRM, płatnościami i kalendarzami, a jeśli trzeba, budujemy backend i panel administracyjny od zera. Wtedy ta sama logika obsługuje aplikację mobilną i wersję webową.',
            ],
            [
                'question' => 'Co dzieje się po publikacji aplikacji?',
                'answer' => 'Zostajemy z Tobą: aktualizujemy aplikację pod nowe wersje iOS i Androida, monitorujemy błędy i rozwijamy ją o kolejne funkcje. Zadania zgłaszasz w panelu klienta, a przy stałej współpracy co miesiąc dostajesz rozliczenie z rozpisanymi godzinami.',
            ],
        ],
    ],

    'ai' => [
        'seo' => [
            'title' => 'Automatyzacja i wdrożenia AI od 299 zł – Leszno | Netizo',
            'description' => 'Zamów automatyzację albo wdrożenie AI od 299 zł: chatbot na danych firmy, obieg dokumentów i integracje z CRM. Bezpłatna wycena po briefie.',
            'name' => 'Automatyzacja i wdrożenia AI',
            'breadcrumb' => 'AI & Automatyzacja',
            'image' => 'assets/images/og-netizo-automatyzacja-ai.jpg',
            'image_alt' => 'Automatyzacja i wdrożenia AI od 299 zł – Netizo',
        ],

        'card' => [
            'name' => 'AI & Automatyzacja',
            'description' => 'Chatboty na danych firmy, odczytywanie dokumentów i automatyzacje połączone z CRM i ERP.',
        ],

        'offers' => [
            [
                'name' => 'Chatbot albo automatyzacja',
                'description' => 'Jeden proces zautomatyzowany od początku do końca, np. odpowiedzi na powtarzalne pytania klientów, odczytywanie faktur albo przepisywanie zgłoszeń do CRM.',
                'timeline' => 'Zwykle do tygodnia',
                'includes' => [
                    'Analiza procesu i wybór tego, co AI zrobi dobrze',
                    'Chatbot odpowiadający na podstawie Twoich dokumentów i oferty',
                    'Integracja z jednym systemem, np. CRM, pocztą albo arkuszem',
                    'Przekazanie sprawy człowiekowi, gdy AI nie zna odpowiedzi',
                    'Panel z historią rozmów i wykonanych zadań',
                    'Testy na prawdziwych przykładach przed uruchomieniem',
                ],
            ],
            [
                'name' => 'Agent AI z integracjami',
                'description' => 'System, który obsługuje kilka kroków procesu: czyta dokumenty i wiadomości, podejmuje proste decyzje według Twoich reguł i zapisuje wyniki w systemach firmy.',
                'timeline' => 'Zwykle do trzech tygodni',
                'includes' => [
                    'Wszystko z pojedynczej automatyzacji',
                    'Integracje z ERP, CRM, pocztą i bazą dokumentów',
                    'Agenci wykonujący kolejne kroki procesu',
                    'Reguły, akceptacje i log każdej decyzji',
                    'Dobór modelu i kontrola kosztów jego użycia',
                    'Monitoring jakości i rozwój po wdrożeniu',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'Ile kosztuje wdrożenie AI albo automatyzacji?',
                'answer' => "Pojedyncza automatyzacja albo chatbot kosztuje od 299\u{00A0}zł, zwykle do 1\u{00A0}499\u{00A0}zł, a agent AI zintegrowany z kilkoma systemami firmy 1\u{00A0}999–\u{2060}4\u{00A0}999\u{00A0}zł. Do tego dochodzi koszt korzystania z modeli AI, który zależy od liczby zapytań; szacujemy go przed wdrożeniem. Wycena po briefie jest bezpłatna.",
            ],
            [
                'question' => 'Co da się zautomatyzować?',
                'answer' => 'Najlepiej powtarzalne zadania z jasnymi zasadami: odpowiadanie na częste pytania klientów, odczytywanie faktur i zamówień, przepisywanie danych między systemami, sortowanie wiadomości i przygotowywanie raportów. Zaczynamy od rozmowy o tym, co dziś zabiera Twojemu zespołowi najwięcej czasu.',
            ],
            [
                'question' => 'Czy AI może się pomylić?',
                'answer' => 'Tak, dlatego budujemy automatyzacje z zabezpieczeniami: AI odpowiada na podstawie Twoich dokumentów, przy niepewności przekazuje sprawę człowiekowi, a ważne decyzje czekają na akceptację. Każdą akcję zapisujemy w logu, więc łatwo sprawdzić, co się stało i dlaczego.',
            ],
            [
                'question' => 'Co z danymi firmy i klientów?',
                'answer' => 'Przed wdrożeniem ustalamy, jakie dane trafiają do modelu, i przekazujemy tylko te potrzebne do zadania. Wybieramy usługi, które nie trenują modeli na przesyłanych danych, a klucze i dostępy trzymamy w zaszyfrowanym sejfie. Jeśli dane nie mogą opuścić firmy, rozważamy model uruchomiony na Twoim serwerze.',
            ],
            [
                'question' => 'Z jakich modeli AI korzystacie?',
                'answer' => 'Model dobieramy do zadania: do rozmów i dłuższych tekstów modele OpenAI, Anthropic albo Google, do prostszych zadań mniejsze i tańsze, a przy wrażliwych danych modele open source uruchamiane lokalnie. Dzięki temu nie przepłacasz za moc, której zadanie nie potrzebuje.',
            ],
            [
                'question' => 'Ile trwa wdrożenie?',
                'answer' => 'Pojedyncza automatyzacja albo chatbot powstaje zwykle w ciągu tygodnia, a agent AI z integracjami w ciągu trzech tygodni. Zaczynamy od jednego procesu i pokazujemy działającą wersję testową na Twoich przykładach, a kolejne automatyzacje dokładamy etapami, kiedy pierwsza już przynosi efekty. Dokładny termin podajemy po analizie procesu.',
            ],
            [
                'question' => 'Czy połączycie AI z naszymi systemami?',
                'answer' => 'Tak. Łączymy automatyzacje przez API z CRM, ERP, pocztą, kalendarzami i bazami dokumentów, a wyniki zapisujemy tam, gdzie Twój zespół już pracuje. Żeby zacząć, nie trzeba zmieniać narzędzi.',
            ],
        ],
    ],

    'devops' => [
        'seo' => [
            'title' => 'DevOps i chmura dla firm od 499 zł – Leszno | Netizo',
            'description' => 'Zamów konfigurację DevOps od 499 zł: serwer albo chmura, CI/CD, kopie zapasowe i monitoring 24/7. Wdrożenia bez przestojów. Bezpłatna wycena.',
            'name' => 'DevOps i chmura dla firm',
            'breadcrumb' => 'DevOps & Cloud',
            'image' => 'assets/images/og-netizo-devops-i-chmura.jpg',
            'image_alt' => 'DevOps i chmura dla firm od 499 zł – Netizo',
        ],

        'card' => [
            'name' => 'DevOps & Cloud',
            'description' => 'Serwery i chmura, CI/CD, kopie zapasowe i monitoring, żeby wdrożenia były szybkie i bezpieczne.',
        ],

        'offers' => [
            [
                'name' => 'Konfiguracja i CI/CD',
                'description' => 'Serwer albo konto w chmurze ustawione od podstaw, automatyczne testy i wdrożenia z repozytorium, kopie zapasowe i monitoring dostępności.',
                'timeline' => 'Zwykle do tygodnia',
                'includes' => [
                    'Audyt obecnego serwera albo hostingu',
                    'Konfiguracja serwera lub chmury (AWS, GCP, Vercel)',
                    'CI/CD: testy i wdrożenie po każdej zmianie w repozytorium',
                    'Certyfikat SSL, firewall i aktualizacje bezpieczeństwa',
                    'Automatyczne kopie zapasowe z testem odtworzenia',
                    'Monitoring dostępności z powiadomieniami',
                ],
            ],
            [
                'name' => 'Infrastruktura jako kod',
                'description' => 'Infrastruktura opisana w kodzie, kontenery i środowiska testowe, migracja do chmury bez przestojów i monitoring całego systemu.',
                'timeline' => 'Zwykle do dwóch tygodni',
                'includes' => [
                    'Wszystko z konfiguracji i CI/CD',
                    'Infrastruktura jako kod (Terraform) i kontenery (Docker)',
                    'Kubernetes, gdy system tego wymaga',
                    'Migracja do chmury bez przestojów',
                    'Środowisko testowe dla każdej zmiany',
                    'Monitoring, logi i alerty 24/7',
                ],
            ],
        ],

        'faq' => [
            [
                'question' => 'Ile kosztuje DevOps i chmura?',
                'answer' => "Konfiguracja serwera albo chmury z CI/CD i kopiami zapasowymi kosztuje od 499\u{00A0}zł, zwykle do 1\u{00A0}499\u{00A0}zł, a infrastruktura jako kod z migracją do chmury i monitoringiem całego systemu 1\u{00A0}999–\u{2060}4\u{00A0}999\u{00A0}zł. Do tego dochodzi miesięczny koszt serwerów albo chmury, który szacujemy z góry. Wycena po briefie jest bezpłatna.",
            ],
            [
                'question' => 'Czy przeniesiecie stronę albo aplikację bez przerwy w działaniu?',
                'answer' => 'Tak. Migrację planujemy tak, żeby nowe środowisko działało równolegle ze starym, a domenę przełączamy dopiero po testach. Jeśli coś pójdzie nie tak, wracamy do poprzedniej wersji.',
            ],
            [
                'question' => 'Z jakich chmur korzystacie?',
                'answer' => 'Najczęściej z AWS, Google Cloud i Vercel, a przy prostszych projektach z dobrze skonfigurowanego serwera VPS. Rozwiązanie dobieramy do ruchu, wymagań i budżetu, a nie odwrotnie.',
            ],
            [
                'question' => 'Czy zajmiecie się serwerem, którego nie budowaliście?',
                'answer' => 'Tak. Zaczynamy od audytu: sprawdzamy konfigurację, kopie zapasowe, aktualizacje i bezpieczeństwo, a potem porządkujemy to, co jest ryzykiem. Nie trzeba przenosić systemu, żeby z nami współpracować.',
            ],
            [
                'question' => 'Jak działa monitoring 24/7?',
                'answer' => 'Automatyczne testy co kilka minut sprawdzają, czy strona i aplikacja działają i jak szybko odpowiadają. Gdy coś przestaje działać, dostajemy alert i reagujemy, a o incydentach informujemy Cię w panelu klienta.',
            ],
            [
                'question' => 'Ile kosztuje utrzymanie serwera albo chmury?',
                'answer' => 'To zależy od ruchu i usług, z których korzysta system. Zanim cokolwiek uruchomimy, pokazujemy szacunek miesięcznych kosztów i podpowiadamy, gdzie można oszczędzić, np. na rozmiarze serwerów albo usługach, których nie potrzebujesz.',
            ],
            [
                'question' => 'Czy zapewniacie opiekę po wdrożeniu?',
                'answer' => 'Tak. Aktualizujemy systemy, pilnujemy kopii zapasowych i reagujemy na alerty, a zadania zgłaszasz w panelu klienta. Przy stałej współpracy co miesiąc dostajesz rozliczenie z rozpisanymi godzinami.',
            ],
        ],
    ],
];
