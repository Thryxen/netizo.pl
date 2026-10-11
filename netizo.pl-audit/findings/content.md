# Audyt treści (Content Quality, E-E-A-T, AI citation) — https://netizo.pl

Data: 2026-10-11. Zakres: 4 publiczne strony HTML (`/`, `/partnerzy`, `/en`, `/en/partners`). Źródła: `raw/*.html` (SSR), props Inertia (`<script data-page="app">`), repo (`lang/{pl,en}/*.php`, `resources/js/components/**`). Kodu projektu nie zmieniano.

## Metodologia i pomiary

| Strona | Słowa w `<body>` | Słowa w `<main>` | Bez warstw `aria-hidden`/`inert` (makiety UI) | Proza (akapity ≥ 8 słów) |
|---|---|---|---|---|
| `/` (PL) | 2 459 | 2 199 | 1 713 | ~1 001 |
| `/partnerzy` | 1 151 | 893 | 782 | ~702 |
| `/en` | 2 798 | 2 508 | 1 996 | ~1 237 |
| `/en/partners` | 1 377 | 1 090 | 966 | ~900 |

- Minima z tabeli (strona główna 500 słów) są spełnione, ale liczba słów jest zawyżona przez makiety UI (fikcyjny sklep „Sweter Bałtyk 349 zł”, kod `Shop.tsx`, demo panelu z danymi przykładowymi, rozbite litery animacji „W d r o ż o n o w 2 m i n”). Na każdą z 6 usług przypada 1 zdanie (8–12 słów).
- `content_quality.py` (na tekście widocznym, bez makiet): `/` 90, `/partnerzy` 84, `/en` 88, `/en/partners` 82; filler 0, AI-patterns 0. **Uwaga:** listy fraz filler/AI w skrypcie są tylko angielskie, więc dla PL wynik 0 nie jest miarodajny. Przebieg na surowym HTML (flaga `repetitive`) odrzucono, bo zawyżał go markup (48 tys. tokenów).
- Czytelność (własny pomiar na akapitach prozy): PL home: średnio 12,8 słowa/zdanie, 16,8% słów 4+ sylabowych (zawyżone nazwami technologii), **FOG-PL 11,8** (poziom liceum, OK dla B2B); `/partnerzy` FOG-PL 7,8 (łatwy). EN home: Flesch Reading Ease 66,7, FK grade 7,9; `/en/partners` FRE 78,2, FK 5,3. Czytelność jest mocną stroną serwisu.
- `domain_history.py` nie został uruchomiony (brak `timeout` w zsh, potem limit tur), więc nie zweryfikowano historii domeny pod kątem twierdzenia „8 lat doświadczenia”.

## E-E-A-T

| Czynnik | Waga (model skilla) | Ocena | Uzasadnienie |
|---|---|---|---|
| Experience | 20% | 55 | 5 realizacji z żywymi domenami, metryki i opisy wyzwań/rozwiązań. Pełne case studies są jednak tylko w dialogu bez URL, a jedna realizacja (Vetly) nie została uruchomiona. |
| Expertise | 25% | 45 | Konkretny opis procesu (sprinty 2-tyg., prototyp w Figmie, przekierowania 301 przy migracji) i stack. Brak ludzi, ról, nazwisk, kwalifikacji i treści eksperckich. |
| Authoritativeness | 25% | 25 | Brak opinii klientów, ocen Google, Clutch, nagród, publikacji i partnerstw. `sameAs` obejmuje tylko FB/IG/TikTok. |
| Trustworthiness | 30% | 30 | Polityka prywatności i regulamin zwracają 404 przy 5 formularzach i GA4/Clarity. Brak danych podmiotu (nazwa prawna, NIP, adres). E-mail jest ukryty przez Cloudflare. Twierdzenia są nieweryfikowalne lub sprzeczne. |
| **Łącznie (ważone)** | | **38** | |

## Znaleziska

### C1. Brak polityki prywatności i regulaminu przy zbieraniu leadów (404)
- **Ważność:** Critical
- **Dowód:** linki w stopce `/polityka-prywatnosci`, `/regulamin`, `/utrzymanie` zwracają 404 (`raw/checks.txt`). Linki są na każdej z 4 stron, a na EN dodatkowo z `hreflang="pl"`. Serwis ma 5 formularzy (kontakt, brief, oddzwonienie, newsletter, partnerzy), GA4 `G-2L7MT88BQT`, Microsoft Clarity i baner cookies. Dla QRG to podstawowy sygnał Trust (YMYL-adjacent: dane osobowe, rozliczenia prowizji). W Polsce to także wymóg RODO (art. 13) i UŚUDE.
- **Rekomendacja:** opublikować `/polityka-prywatnosci` (administrator, cele, podstawy, odbiorcy: Google, Microsoft, Cloudflare, Discord webhook, okres przechowywania, prawa) i `/regulamin` (także regulamin programu partnerskiego, na który powołuje się `/partnerzy`). Do czasu publikacji usunąć martwe pozycje z `resources/js/lib/site.ts:63-65` i `:69-71`. Pod formularzami dodać klauzulę informacyjną z linkiem.

### C2. Brak danych podmiotu i ludzi stojących za firmą
- **Ważność:** High
- **Dowód:** stopka zawiera tylko „© 2026 Netizo. Wszelkie prawa zastrzeżone.” (`resources/js/components/home/site-footer.tsx:121`). Na stronach nie ma nazwy prawnej, formy (JDG/sp. z o.o.), NIP/REGON/KRS, adresu (JSON-LD podaje tylko „Leszno, wielkopolskie”), roku założenia, zespołu ani strony „O nas”. Copy twierdzi „Mamy w zespole projektantów UI/UX” (`lang/pl/home.php:67`), ale nikt nie jest wymieniony z nazwiska. Na całej stronie pojawiają się tylko inicjały „TF”, „JK” w makietach.
- **Rekomendacja:** w stopce dodać dane rejestrowe (nazwa, adres, NIP, ewentualnie KRS). Dodać stronę `/o-nas` z założycielem lub zespołem (zdjęcia, role, LinkedIn, doświadczenie, rok startu, historia marki, w tym ewentualnej poprzedniej Voxbit), a w JSON-LD `founder`, `foundingDate`, `legalName`, `taxID`, `telephone`, `email`, pełny `PostalAddress` (`app/Http/Controllers/HomeController.php:45-61`).

### C3. Sprzeczne lub nieweryfikowalne twierdzenia (150+, 8 lat, 99,9%, 30M+, Vetly)
- **Ważność:** High
- **Dowód:**
  - „150+ zrealizowanych projektów”, „8 lat doświadczenia”, „99,9% dostępności wdrożeń” (`resources/js/components/home/hero.tsx:24-26`), „30M+ zapytań miesięcznie”, „250K+ linii kodu” (`resources/js/components/home/clients-section.tsx:21-22`), powtórzone w meta description i JSON-LD (`lang/pl/home.php:11,13`). Na stronie widać tylko 5 realizacji i 8 nazw klientów, bez opinii, dat i źródła metryk.
  - **Vetly.pl** występuje w „Ostatnie wdrożenia”, opisanych jako „projekty, które zaprojektowaliśmy, zbudowaliśmy i dalej rozwijamy” (`resources/js/components/home/projects-section.tsx:16`), oraz w „Zaufali nam”, z metryką „1000+ weterynarzy w Polsce” i „30 sek. rezerwacja wizyty”. Tymczasem własne case study (props `challenges`/`solutions` z bazy) mówi: „publiczna strona nie jest jeszcze uruchomiona” i „Case study przygotowane na podstawie projektu graficznego i screenshotu przed uruchomieniem produkcji”. To wewnętrzna sprzeczność, którą QRG traktuje jako mylącą.
  - Energizo: metryka „100% — SEO według Google” to wynik Lighthouse, a nie ocena „Google”, więc wprowadza w błąd.
- **Rekomendacja:** każdą liczbę opatrzyć kontekstem: od kiedy liczone, co jest „projektem”, skąd uptime (np. link do status page). Alternatywnie zastąpić liczbami weryfikowalnymi, np. listą realizacji z latami. Vetly przenieść do „Projekty koncepcyjne”, a metryki „1000+ weterynarzy” usunąć albo podać ich źródło. „100% SEO według Google” zmienić na „100/100 Lighthouse SEO”. Dane realizacji poprawia się w panelu `/admin/projects` (kolumny `metrics`, `metrics_en`).

### C4. Luki tematyczne: brak podstron usług, lokalizacji, realizacji i bloga
- **Ważność:** High
- **Dowód:** serwis to w praktyce 1 strona usługowa na język. Usługi mają po 1 zdaniu (`resources/js/components/home/services-section.tsx:32-58`), np. „E-commerce: Sklepy internetowe i marketplace’y z integracją płatności i fulfillmentu.”. Pod frazy „tworzenie stron internetowych Leszno”, „sklep internetowy dla firmy”, „aplikacje webowe na zamówienie”, „cennik stron internetowych” nie istnieje żaden dedykowany URL. „Leszno” pada w treści tylko w FAQ (`lang/pl/home.php:86-87`) i w JSON-LD. Słowa kluczowe z 18 miejscowościami są wyłącznie w meta keywords. Newsletter obiecuje „case studies” i „praktyczne porady” (`resources/js/components/home/newsletter-section.tsx:16`), ale w serwisie nie ma żadnego wpisu.
- **Rekomendacja (kolejność):**
  1. `/realizacje` + `/realizacje/{slug}`, bo treści już są w bazie (C5).
  2. `/strony-internetowe`, `/sklepy-internetowe`, `/aplikacje-webowe`, `/aplikacje-mobilne`, każda ≥ 800 słów: zakres, proces, widełki cen z FAQ, czas, technologie, powiązane realizacje, FAQ usługi.
  3. `/utrzymanie`, która jest już linkowana ze stopki.
  4. Jedna rzetelna strona lokalna `/strony-internetowe-leszno` (500–600 słów, spotkania na miejscu, klienci z regionu, dojazd). **Nie** tworzyć 18 stron miast z listy keywords: bez realnej obecności byłyby to doorway pages.
  5. `/blog` z poradnikami opartymi na danych firmy, np. „Ile kosztuje strona internetowa w 2026” (rozwinięcie FAQ), „Migracja strony bez spadków w Google”.

### C5. Case studies istnieją, ale są niewidoczne dla wyszukiwarek (tylko dialog + JSON props)
- **Ważność:** High
- **Dowód:** pełne opisy (`fullDescription` 34–87 słów, 4 wyzwania + 4 rozwiązania na projekt, PL i EN) są tylko w `<script data-page="app" type="application/json">` i w dialogu otwieranym przyciskiem „Zobacz case study” (`resources/js/components/home/projects-section.tsx:20-21`, `case-study-dialog.tsx`). Nie mają URL, H1, title ani możliwości linkowania czy cytowania. Widoczny tekst karty to 1–2 zdania.
- **Rekomendacja:** wygenerować podstrony `/realizacje/{slug}` i `/en/projects/{slug}` z `Project` (`slug` już istnieje, `HomeController::projectProps()` w `app/Http/Controllers/HomeController.php:94-115`). Na każdej: klient, branża, rok, zakres, stack, wyzwania i rozwiązania, wyniki z kontekstem, cytat klienta, zrzuty, link do wdrożenia. Dialog może zostać jako szybki podgląd z linkiem do pełnej strony. Opisy rozbudować do 300–600 słów.

### C6. Brak opinii klientów i dowodu społecznego
- **Ważność:** High
- **Dowód:** sekcja „Zaufali nam” to same nazwy domen (2 z 8 bez linku: `vetly.pl`, `lavaforyou.is`). Brak cytatów klientów, ocen Google Business Profile i profili Clutch/GoodFirms.
- **Rekomendacja:** dodać 3–6 opinii z imieniem, nazwiskiem, firmą i zdjęciem (za zgodą) przy realizacjach i na stronie głównej, link do wizytówki Google i wpisy w katalogach branżowych. Opinie oznaczać `Review` tylko na stronach realizacji, nie jako self-serving `AggregateRating` na Organization.

### C7. E-mail niewidoczny dla crawlerów bez JS (Cloudflare Email Obfuscation)
- **Ważność:** Medium
- **Dowód:** w HTML SSR adres ma postać `[email protected]` z `href="/cdn-cgi/l/email-protection#…"` (`data-cfemail`) i jest dekodowany skryptem `email-decode.min.js`. GPTBot, ClaudeBot i PerplexityBot (bez renderowania) nie widzą e-maila. JSON-LD też nie zawiera `email` ani `telephone`. Źródło w repo jest poprawne (`resources/js/lib/site.ts:9`), problem robi Cloudflare.
- **Rekomendacja:** wyłączyć Scrape Shield → Email Address Obfuscation dla netizo.pl (albo regułą Configuration Rule) i dodać `email` + `telephone` do JSON-LD organizacji.

### C8. Treść-makieta rozmywa sygnał tematyczny i myli parsery tekstu
- **Ważność:** Medium
- **Dowód:** około 300 słów makiet ma `aria-hidden` (OK). Bez tego atrybutu w tekście zostają: demo panelu („Dodaj task”, „1 875,00 zł netto”, „Twoja stawka 150,00 zł /h”, rozbite litery „Z m i e ń z d j ę c i e…”) oraz scena FAQ („Ile trwa zrobienie strony firmowej? Zwykle 4–6 tygodni.”). Liczniki `CountUp` renderują w SSR obie warstwy, przez co parser tekstu widzi „**150+ 120+** zrealizowanych projektów”, „99,9% 99,0%”, „30M+ 0M+”, „250K+ 0K+” (`resources/js/components/motion/count-up.tsx:74-77`, `hero.tsx:24-26`). `render_page.py`/trafilatura wyciągnął ze strony głównej tylko 6 335 znaków, głównie z sekcji realizacji.
- **Rekomendacja:** warstwę „bieżącą” `CountUp` renderować dopiero po hydracji (w SSR tylko wartość końcowa) albo oznaczyć `data-nosnippet`. Demo panelu i scenę FAQ owinąć w `aria-hidden` lub `data-nosnippet`. Rozbijanie liter animacji robić w CSS/`::before` zamiast osobnych węzłów tekstu.

### C9. Duplikacja PL/EN: poprawne wersje językowe, drobne rozbieżności twierdzeń
- **Ważność:** Low
- **Dowód:** EN to pełne tłumaczenie z hreflang (nie duplikat). Kolumny `_en` projektów są wypełnione, a na stronach EN nie ma polskich słów poza nazwą marki „Na Każdą Okazję”. Rozbieżności:
  - FAQ PL „Czy pracujecie tylko z firmami z Leszna?” (z całej Polski) vs EN „Do you work with clients outside Poland?” („and from abroad… in Polish or English”) (`lang/en/home.php`, pytanie 10). CLAUDE.md wymaga tych samych twierdzeń.
  - EN `/en/partners` ma H2 „Common questions”, a `/en` „Frequently asked questions” (`resources/js/components/partners/partner-faq-section.tsx:21`, `home/faq-section.tsx:18`).
  - Przykłady cen: pasek na home „sklep internetowy za 18 000 zł” vs kalkulator „Sklep internetowy 15 000 zł” vs FAQ „mały sklep 5–15 tys. zł”.
- **Rekomendacja:** ujednolicić twierdzenie o klientach zagranicznych (albo dodać je w PL), nazwę sekcji FAQ i przykładowe kwoty (`resources/js/components/partners/partner-data.ts`, `home/partner-cta-section.tsx`).

### C10. Poprawność językowa i styl treści z bazy
- **Ważność:** Low
- **Dowód:**
  - „Nowoczesna witryna dla Energizo firmy wspierającej…” (brak przecinka po „Energizo”).
  - Kategorie w Title Case: „Landing Page” (PL), H3 usług „AI & Automatyzacja”, „DevOps & Cloud” (`resources/js/components/home/services-section.tsx:42,52`) wbrew zasadzie sentence case.
  - Anglicyzmy: „Dodaj task”, „Pet care”, „Local SEO”, „fulfillmentu”.
  - Misja jest ogólnikowa: „Chcemy, żeby następna generacja produktów cyfrowych była szybsza” (`resources/js/components/home/mission-section.tsx:9`), bez konkretu.
- **Rekomendacja:** poprawić opisy w panelu (`/admin/projects`). „AI i automatyzacja”, „DevOps i chmura”, „Landing page”. Misję przepisać na konkret (dla kogo, jaki problem, czym się różnicie).

### C11. Brak sygnałów świeżości
- **Ważność:** Low
- **Dowód:** brak dat realizacji, „ostatnia aktualizacja”, wpisów i `dateModified`. `render_page.py` zwrócił `publication_date: 2026-01-01` (prawdopodobnie heurystyka z roku w copyright). Sitemap `lastmod` 2026-10-09 dla stron, a dla adresów z fragmentem 2025-12-05.
- **Rekomendacja:** podawać rok i miesiąc wdrożenia przy realizacjach, a na przyszłych podstronach `datePublished`/`dateModified`.

## AI citation readiness

**Ocena: 58/100**
- **Plusy:** SSR (pełna treść w HTML), boty AI dopuszczone w robots.txt. FAQ zawiera samodzielne, cytowalne pasaże z liczbami: „Prosta strona kosztuje zwykle 1–5 tys. zł, rozbudowana strona lub mały sklep 5–15 tys. zł, aplikacja webowa 15–50 tys. zł…”, „Landing page… 2–3 tygodnie, strona firmowa 4–6 tygodni, aplikacja webowa 2–4 miesiące”. Warunki partnerskie są precyzyjne (15% netto, 12 mies., 14 dni, przykład 10 000 zł → 1 500 zł). `FAQPage` JSON-LD jest zgodny z widoczną treścią.
- **Minusy:** brak faktów o encji (kto, od kiedy, nazwa prawna, adres, zespół), co AI potrzebuje do rekomendacji „agencja w Lesznie”. Brak adresowalnych case studies i llms.txt (ustalone w briefie). E-mail jest ukryty (C7), a w tekście są podwójne liczby (C8). Odpowiedzi FAQ w JSON-LD zawierają niewidoczny znak U+2060 (word joiner) w zakresach „1–⁠5”. Jest celowy w HTML, ale w JSON-LD warto go usuwać (`app/Http/Controllers/Controller.php:17-32`, `lang/pl/home.php:51-55`).
- **Rekomendacja:** dodać blok „Netizo w liczbach / o firmie” z 3–5 zdaniami faktów: rok założenia, miasto, liczba osób, specjalizacje, przykładowi klienci. Rozbudować JSON-LD Organization i opublikować strony realizacji.

## Co działa dobrze
- Konkretne, uczciwe FAQ z widełkami cen i czasu oraz zastrzeżeniem „Konkretnej pozycji nikt uczciwie nie zagwarantuje” (`lang/pl/home.php:59`). To dobry sygnał Trust i dobry materiał do cytowania przez AI.
- Bardzo dobra czytelność (FOG-PL 7,8–11,8, krótkie zdania, druga osoba, brak lania wody i fraz typowych dla AI).
- Opis procesu z artefaktami („Dostajesz: brief i zakres prac do akceptacji”, demo co 2 tygodnie) i panel klienta jako wyróżnik sygnalizują doświadczenie.
- Strona partnerska jest kompletna i przejrzysta: zasady, kalkulator, FAQ, przykład liczbowy. Treść jest unikalna, nie szablonowa.
- Pełna, poprawna wersja EN z hreflang i przetłumaczonymi realizacjami.

## Ocena kategorii

**Content Quality: 48/100.** Copy jest dobrze napisane, czytelne i konkretne w FAQ, ale serwis to w praktyce jedna strona usługowa bez podstron usług, realizacji i bloga. E-E-A-T jest słabe (38/100): brak polityki prywatności, danych firmy, ludzi i opinii, a twierdzenia są nieweryfikowalne lub sprzeczne (Vetly).

```json
{
  "category": "Content Quality",
  "score": 48,
  "eeat": {"experience": 55, "expertise": 45, "authoritativeness": 25, "trustworthiness": 30, "weighted": 38},
  "ai_citation_readiness": 58,
  "readability": {"home_pl_fog_pl": 11.8, "partners_pl_fog_pl": 7.8, "home_en_flesch": 66.7, "partners_en_flesch": 78.2},
  "word_counts_main": {"home_pl": 2199, "partners_pl": 893, "home_en": 2508, "partners_en": 1090},
  "findings": [
    {"id": "C1", "severity": "critical", "title": "Polityka prywatności i regulamin 404 przy 5 formularzach i analityce", "files": ["resources/js/lib/site.ts:63-71"]},
    {"id": "C2", "severity": "high", "title": "Brak danych podmiotu, zespołu i strony O nas", "files": ["resources/js/components/home/site-footer.tsx:121", "app/Http/Controllers/HomeController.php:45-61"]},
    {"id": "C3", "severity": "high", "title": "Nieweryfikowalne i sprzeczne twierdzenia (150+, 99,9%, 30M+, Vetly, 100% SEO)", "files": ["resources/js/components/home/hero.tsx:24-26", "resources/js/components/home/clients-section.tsx:21-22", "lang/pl/home.php:11-13"]},
    {"id": "C4", "severity": "high", "title": "Brak podstron usług, lokalizacji, realizacji i bloga", "files": ["resources/js/components/home/services-section.tsx:32-58"]},
    {"id": "C5", "severity": "high", "title": "Case studies tylko w dialogu, bez URL", "files": ["resources/js/components/home/projects-section.tsx:20-21", "app/Http/Controllers/HomeController.php:94-115"]},
    {"id": "C6", "severity": "high", "title": "Brak opinii klientów i dowodu społecznego", "files": []},
    {"id": "C7", "severity": "medium", "title": "E-mail ukryty przez Cloudflare Email Obfuscation", "files": ["resources/js/lib/site.ts:9"]},
    {"id": "C8", "severity": "medium", "title": "Makiety UI i podwójne liczby CountUp w tekście SSR", "files": ["resources/js/components/motion/count-up.tsx:74-77"]},
    {"id": "C9", "severity": "low", "title": "Drobne rozbieżności twierdzeń PL/EN", "files": ["lang/en/home.php", "resources/js/components/partners/partner-faq-section.tsx:21"]},
    {"id": "C10", "severity": "low", "title": "Interpunkcja, Title Case i anglicyzmy w treściach", "files": ["resources/js/components/home/services-section.tsx:42,52", "resources/js/components/home/mission-section.tsx:9"]},
    {"id": "C11", "severity": "low", "title": "Brak sygnałów świeżości", "files": []}
  ]
}
```
