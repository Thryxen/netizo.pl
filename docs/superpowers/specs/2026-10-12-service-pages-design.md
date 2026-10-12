# Strony usług: strony internetowe, sklepy internetowe, aplikacje webowe

Data: 2026-10-12

## Cel

Trzy strony usług w dwóch językach, każda z około 800+ słowami treści (bez FAQ), cenami „od”, realizacjami z panelu i FAQ, w stylu reszty serwisu, z inspiracjami z shadcnstudio.com i tailark.com. Kafelki usług na stronie głównej prowadzą do tych stron. Zdjęcia na stronach są generowane przez codex-image w stylu istniejącej serii.

| Usługa | PL | EN | Trasy |
|---|---|---|---|
| Strony internetowe | `/tworzenie-stron-internetowych` | `/en/website-development` | `services.websites`, `en.services.websites` |
| Sklepy internetowe | `/sklepy-internetowe` | `/en/online-stores` | `services.stores`, `en.services.stores` |
| Aplikacje webowe | `/aplikacje-webowe` | `/en/web-applications` | `services.apps`, `en.services.apps` |

## Decyzje (ustalone z użytkownikiem)

- Ceny „od” pochodzą z istniejącego FAQ i briefu (bez nowego cennika), dwa progi na stronę:
  - strony: prosta strona (landing page, wizytówka) od 1 000 zł (zwykle do 5 000 zł, 2–3 tygodnie), rozbudowana strona od 5 000 zł (zwykle do 15 000 zł, 4–6 tygodni);
  - sklepy: mały sklep od 5 000 zł (zwykle do 15 000 zł), duży e-commerce od 15 000 zł (zwykle do 50 000 zł); bez terminów, bo serwis ich nigdzie nie podaje;
  - aplikacje: aplikacja webowa od 15 000 zł (zwykle do 50 000 zł, 2–4 miesiące), duży system od 50 000 zł.
- Bento na stronie głównej: kafelek 2×2 staje się „Stronami internetowymi”, „Systemy backend” „Aplikacjami webowymi”, „E-commerce” „Sklepami internetowymi”; cały kafelek jest linkiem do strony usługi. Mobile, AI i DevOps zostają bez linków.
- Realizacje na stronie usługi wybiera pole „Usługi” w formularzu projektu w panelu (projekt może mieć kilka usług).
- Użytkownik prosi o pracę bez dalszych pytań do skończenia kodu: brak bramek przeglądu, zmiany zostają niezacommitowane.

## Strona (frontend)

Jeden szablon (`components/services/service-page.tsx`), trzy strony Inertia (`pages/services/websites.tsx`, `stores.tsx`, `apps.tsx`), żeby chunk każdej strony niósł tylko jej treść, scenę i makiety. Układ jak na innych stronach w ramie (szyny, nity, linie sekcji, wspólne krawędzie siatek), monochromatyczny, kolor tylko ze zdjęć; bez etykiet nad nagłówkami, bez strzałek w przyciskach, zdania wielką literą tylko na początku.

Sekcje, od góry:

1. Nagłówek: `SubpageHeader` z nazwą usługi, linkami do sekcji (Zakres, Cennik, Realizacje, FAQ) i przyciskiem wyceny prowadzącym do `#kontakt` / `#contact` na tej samej stronie.
2. Hero (jak u partnerów i w „O nas”): okruszki (Netizo › usługa), H1 wchodzący linia po linii (`SplitLines`), lead, przyciski „Wyceń …” i „Zobacz cennik”, telefon i obszar działania; po prawej scena na nowym zdjęciu z codex-image z chipami usługi w pętli (tylko w widoku). Pod spodem pasek czterech faktów (ceny, terminy, wycena 0 zł) na wspólnych krawędziach.
3. Zakres („Co dostajesz w standardzie”): siatka 3×2 (2×3, 1×6) komórek na wspólnych krawędziach, w każdej mała statyczna makieta interfejsu (wzorzec z tailark), tytuł i dwa zdania.
4. Cennik: skala cen (pasek 1 000 → 5 000 → 15 000 zł itd., odcinki progów, wypełnia się raz w widoku; najechanie lub fokus na próg podświetla jego odcinek) nad dwiema kolumnami progów: nazwa, „od X zł”, „zwykle do Y zł”, dla kogo, termin, lista zakresu, przycisk wyceny. Pod spodem uwaga: ceny orientacyjne, dokładna wycena bezpłatnie po briefie.
5. Proces: cztery etapy na szynie z numerami (to jest sekwencja), z czasem trwania tam, gdzie serwis go podaje.
6. Realizacje: aktywne projekty z daną usługą, w kolejności panelu, maksymalnie 4, w kartach jak na `/realizacje` (okno ze zrzutem, nazwa jako link do case study, metryki); link do wszystkich realizacji. Bez projektów sekcja znika (zostaje link w treści).
7. Poradnik: dłuższy tekst (3–4 śródtytuły H3) po prawej, po lewej przyklejony H2 ze wstępem i drugim zdjęciem z codex-image; kluczowe frazy wyróżnione kolorem tekstu na tle wyciszonego akapitu (wzorzec z tailark).
8. FAQ: obramowane pole z pionowym podziałem: po lewej nagłówek, lead i „Napisz do nas”, po prawej akordeon (odpowiedzi w HTML z SSR, jak na innych stronach).
9. Inne usługi: dwie komórki z nazwą, jednym zdaniem i ceną „od”, linki do pozostałych stron usług.
10. Kontakt: ta sama sekcja co na stronie głównej (brief i szybka wiadomość), brief z zaznaczonym typem projektu usługi; okno „zadzwońcie do mnie” ładowane jak na stronie głównej.
11. Stopka serwisu z nową kolumną „Usługi”.

Ruch: wejście hero jak na innych podstronach, pętla chipów na zdjęciu, jednorazowe wypełnienie skali cen. Bez JS, w SSR i przy ograniczonym ruchu strona pokazuje stan końcowy.

Kotwice (`lib/sections.ts`, `serviceSections`): PL `zakres`, `cennik`, `proces`, `realizacje`, `poradnik`, `faq`; EN `whats-included`, `pricing`, `process`, `projects`, `guide`, `faq`; kontakt jak na stronie głównej (`kontakt` / `contact`).

Treść: około 1 300–1 500 słów na stronę. Fakty tylko z tego, co serwis już podaje: ceny i terminy z FAQ i briefu, proces (brief, prototyp w Figmie, sprinty z demo co dwa tygodnie, wdrożenie), panel klienta, SEO w standardzie, CMS, opieka po wdrożeniu, technologie z FAQ, realizacje z panelu. Angielski: amerykańska pisownia, te same fakty i liczby.

Zdjęcia (codex-image, 3:2, 1536 × 1024, styl serii: szałwiowe ściany, jasny dąb, rośliny, ciepłe światło, bez twarzy), w `PHOTOS` i z wariantami `warianty.cjs`:

- `websites-studio` (hero: lada małej pracowni z laptopem, spokojna ściana po prawej na chipy), `websites-prototype` (poradnik: dłonie nad makietami i prototypem);
- `stores-packing` (hero: stół do pakowania w pracowni ceramiki), `stores-product-shoot` (poradnik: sesja zdjęć produktu);
- `apps-office` (hero: biuro hurtowni z panelem na monitorze), `apps-warehouse` (poradnik: tablet między regałami magazynu).

Obrazy OG (1200 × 630, JPEG, bo ze zdjęciem): nowy szablon `netizo/og-image/szablon-usluga.html` w `generuj.cjs`, sześć plików (PL i EN dla każdej usługi).

Strona główna: tytuły, opisy i tagi trzech kafelków, link na całym kafelku (tytuł jako link z nakładką, jak karty realizacji) i widoczny dopisek „Zobacz ofertę”. Stopka: kolumna „Usługi”. Menu mobilne: linki do usług.

## Backend

- Enum `App\Enums\Service` (`Websites` = `websites`, `Stores` = `stores`, `Apps` = `apps`): nazwa trasy (`services.{value}`), typ projektu w briefie (`website`, `ecommerce`, `webapp`), etykieta w panelu.
- `ServicePageController@show`, trasy z `->defaults('service', …)`; meta (SEOTools), `localizedSeo()`, `Inertia::render('services/{value}', [...])` z propsami: `offers`, `faq`, `projects` (aktywne, `forService()`, kolejność panelu, limit 4, przez `PresentsProjects`), `otherServices` (nazwa, opis, cena od, URL).
- `lang/{pl,en}/services.php`: dla każdej usługi `seo` (title ≤ 60, description ≤ 155, name, breadcrumb, image, image_alt), `offers` (nazwa, opis, cena od, cena do lub null, termin lub null, zakres), `faq`, `card` (nazwa i zdanie do „Innych usług” i llms.txt). Plik w `TranslationParityTest`.
- JSON-LD: `WebPage` (`mainEntity` → usługa) z okruszkami, `Service` (`@id` `{url}#service`, `provider` Netizo, `areaServed` jak w organizacji, `offers`: `Offer` z `PriceSpecification` `minPrice` i `priceCurrency` PLN), `FAQPage`; `StructuredData::areaServed()` wydzielone z `organization()`.
- Sitemap: trzy trasy w `Sitemap::PAGES` z datą 2026-10-12, `lastmod` z projektów.
- llms.txt: strony usług na liście stron, „Usługi” linkują do stron usług tam, gdzie są, FAQ każdej usługi w całości.
- Panel: migracja `services` (JSON, nullable) w `projects`, cast `array`, scope `forService()`; `SaveProjectRequest` (`services` tablica, wartości enumu, bez powtórzeń), pola wyboru w formularzu (zakładka „Podstawowe”), seeder z przypisaniami. IndexNow: zmiana publicznego projektu zgłasza też strony usług, na których jest przed zmianą i po niej.
- Lokalnie: migracja i przypisanie usług istniejącym projektom (tylko kolumna `services`).

## Testy

- Nowy `ServicePagesTest`: komponent, propsy, filtr i kolejność realizacji (tylko aktywne, z usługą, limit), meta i ich długości, canonical i hreflang, JSON-LD (Service z ofertami i cenami z pliku językowego, FAQPage z tych samych pytań co strona, okruszki), obrazy OG 1200 × 630 poniżej 300 KB, wersje EN.
- Aktualizacje: `SitemapTest`, `StructuredDataTest`, `LlmsTxtTest`, `TranslationParityTest`, `IndexNowTest`, `SecurityHeadersTest`, `PhotoVariantsTest` (jeśli wymaga), testy panelu projektów.
- Weryfikacja: `npm run types`, `vendor/bin/pint --dirty`, cały zestaw Pest, `npm run build`, zrzuty ekranu (desktop i telefon, jasny i ciemny motyw).

## Poza zakresem

Strona zbiorcza `/uslugi`, strony dla Mobile/AI/DevOps, menu rozwijane w nagłówku, nowy cennik, zmiany w case studies.

## Zmiana w trakcie (prośba użytkownika)

Czwarta strona usługi: aplikacje mobilne na iOS i Android, `/aplikacje-mobilne` ↔ `/en/mobile-apps` (`services.mobile`, `Service::Mobile`). Ceny jak aplikacje webowe (przedział „Aplikacja” z briefu: od 15 000 zł, duża aplikacja od 50 000 zł), bez terminów (serwis ich nie podaje). Zdjęcia `mobile-cafe` (hero) i `mobile-testing` (poradnik), obrazy OG `og-netizo-aplikacje-mobilne.jpg` i `og-netizo-mobile-apps-en.jpg`; kafelek „Aplikacje mobilne” w bento prowadzi do tej strony.

Piąta strona usługi (prośba użytkownika): AI & Automatyzacja, `/automatyzacja-ai` ↔ `/en/ai-automation` (`services.ai`, `Service::Ai`), zdjęcia `ai-office` i `ai-process`, obrazy OG `og-netizo-automatyzacja-ai.jpg` i `og-netizo-ai-automation-en.jpg`; kafelek „AI & Automatyzacja” w bento prowadzi do tej strony.

Nowe ceny „od” (prośba użytkownika): strony internetowe 799 zł, aplikacje mobilne 999 zł, sklepy internetowe 1 299 zł, aplikacje webowe 1 699 zł, AI & Automatyzacja 299 zł. To ceny pierwszego progu; drugi próg i górne granice („zwykle do…”) zostają jak wcześniej. Odpowiedź o cenach w FAQ strony głównej podaje te same pięć cen.

Szósta strona usługi (prośba użytkownika): DevOps & Cloud, `/devops-i-chmura` ↔ `/en/devops-cloud` (`services.devops`, `Service::Devops`), cena od 499 zł (przyjęta przez wykonawcę, użytkownik jej nie podał; drugi próg od 5 000 zł, granice 5 000 / 15 000 zł), zdjęcia `devops-desk` i `devops-architecture`, obrazy OG `og-netizo-devops-i-chmura.jpg` i `og-netizo-devops-cloud-en.jpg`; wszystkie kafelki bento prowadzą teraz do stron usług.

Nowe ceny i terminy stron internetowych (prośba użytkownika): prosta strona od 799 zł do 1 499 zł, zwykle do tygodnia; rozbudowana strona od 1 799 zł do 2 999 zł, zwykle do dwóch tygodni. Te same liczby w tierach, hero, procesie, FAQ usługi, FAQ strony głównej (z czatem FAQ), llms.txt i opisie meta; skala w cenniku pokazuje górną kwotę pierwszego progu, bo drugi zaczyna się wyżej (przerwa 1 499 → 1 799 zł). Zakres „Rozbudowanej strony” bez zmian.
