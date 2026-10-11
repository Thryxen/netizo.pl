# GEO: widoczność w wyszukiwarkach AI, netizo.pl (2026-10-11)

Zakres: Google AI Overviews / AI Mode, ChatGPT Search, Perplexity, Bing Copilot (oraz Claude search). Strony: `/`, `/en`, `/partnerzy`, `/en/partners` (cały serwis).
Dane: `raw/home-*.html`, `raw/partners-*.html`, `raw/home-render.json`, `raw/checks.txt`, `raw/file_*`. Moje wyniki pośrednie są w `raw/geo/` (`outline-*.txt` to tekst z nagłówkami wyciągnięty z SSR, `parse-*.json` to wynik `parse_html.py`). Do tego zapytania o markę w zewnętrznych wyszukiwarkach i serwisach (opisane niżej) oraz odczyt kodu repo.

Ograniczenia pomiaru: nie było narzędzi DataForSEO ani GSC, więc brak pomiaru cytowań na żywo w ChatGPT i Perplexity. Bing przez WebFetch zwracał wyniki niezwiązane z zapytaniem (ochrona przed botami), więc wynik jest **niejednoznaczny**. DuckDuckGo pokazał captchę, Mojeek, aleo.com i rejestr.io zwróciły 403. Brave odpowiedział raz, potem zwracał 429. Przez te ograniczenia NIP-u ani wpisu w CEIDG/KRS **nie zweryfikowałem**. Reddit nie był sprawdzany.

---

## Wynik GEO: 55/100

| Wymiar | Waga | Wynik | Uzasadnienie |
|---|---|---|---|
| Cytowalność | 25% | 62 | FAQ z konkretnymi widełkami cen i terminów, zasady programu partnerskiego w `<dl>`. Brak jednak stron usług i case studies pod własnym URL, metryki bez źródeł, szum z animacji i makiet. |
| Czytelność struktury | 20% | 72 | SSR, jeden H1, logiczne H2/H3, pytania FAQ jako H3, listy i `<dl>`. H2 sekcji nie są pytaniami, sekcja „Nasza misja” jest pusta treściowo, są tylko 4 URL-e. |
| Treści multimodalne | 15% | 40 | Zdjęcia i zrzuty projektów są, ale nie ma wideo, tabel (ceny i terminy tylko w prozie) ani infografik z danymi. |
| Autorytet i sygnały marki | 20% | 18 | Brak danych podmiotu (NIP, nazwa prawna, adres, ludzie), polityka prywatności zwraca 404, kolizja nazwy z indyjską agencją Netizo, brak Wikidata i LinkedIn, martwa stara domena, klienci nie podpisują realizacji. |
| Dostępność techniczna | 20% | 78 | SSR (`is_spa=false`), wszystkie boty dostają 200, TTFB ok. 0,1–0,2 s, sitemap, canonical i hreflang. E-mail zaciemnia Cloudflare, case studies są tylko w JSON-ie Inertii, brak llms.txt (znaczenie marginalne). |

Wynik łączny: 0,25·62 + 0,20·72 + 0,15·40 + 0,20·18 + 0,20·78 = **55**.

### Wyniki per platforma (szacunek eksperckiej oceny, bez pomiaru na żywo)

| Platforma | Wynik | Główny czynnik |
|---|---|---|
| Google AI Overviews / AI Mode | 50 | Dostęp (Googlebot) i FAQ są dobre. Słabe jest małe pokrycie zapytań (4 URL-e) i słaba encja, a profilu w Google Business Profile nie da się zweryfikować. |
| ChatGPT Search | 38 | OAI-SearchBot jest dopuszczony, ale ChatGPT mocno korzysta z indeksu Bing i sygnałów marki. Na zapytanie „netizo” dominuje netizo.in. |
| Perplexity | 45 | Lubi konkretne fakty (ceny i terminy w FAQ są tu atutem), ale nie ma podstron tematycznych do zacytowania. |
| Bing Copilot | 38 | Zależy od indeksu Bing i encji. Pomiar wyników Bing był niejednoznaczny. |

---

## Dostęp crawlerów AI (robots.txt)

`public/robots.txt:1-4`: `User-agent: *` / `Allow: /` + `Sitemap`. Nie ma grup per bot ani reguł RSL (`License:`). Testy UA z `raw/checks.txt` dały 200 i identyczne 455 004 B dla każdego bota.

| Bot | Za co odpowiada | Status | Jak ustalono |
|---|---|---|---|
| Googlebot | Google Search **oraz** AI Overviews / AI Mode | Dopuszczony | robots + test UA 200 |
| Google-Extended | Trening Gemini/Vertex, grounding w Gemini/Vertex, trening modeli funkcji gen-AI w Search. **Nie** decyduje o obecności w AI Overviews | Dopuszczony (brak reguły) | robots (to token robots, nie UA) |
| OAI-SearchBot | ChatGPT Search (cytowania) | Dopuszczony | robots + UA 200 |
| GPTBot | Wyłącznie trening modeli OpenAI | Dopuszczony | robots + UA 200 |
| ChatGPT-User | Pobrania na żądanie użytkownika | Dopuszczony (robots) | nie testowano UA |
| Claude-SearchBot | Wyszukiwanie w Claude (cytowania) | Dopuszczony (robots) | nie testowano UA |
| ClaudeBot | Wyłącznie trening Anthropic | Dopuszczony | robots + UA 200 |
| PerplexityBot | Indeks wyszukiwania Perplexity | Dopuszczony | robots + UA 200 |
| Bingbot | Bing, Copilot, częściowo zaplecze ChatGPT Search | Dopuszczony | robots + UA 200 |
| Applebot | Siri / Spotlight / Safari | Dopuszczony | robots + UA 200 |
| Applebot-Extended | Wyłącznie trening Apple Intelligence | Dopuszczony (robots) | token robots |
| CCBot | Common Crawl (korpusy treningowe) | Dopuszczony | robots + UA 200 |
| cohere-ai, Meta-ExternalAgent, Bytespider | Trening | Dopuszczone (robots) | nie testowano UA |

Ocena: konfiguracja „wszyscy mają dostęp” jest **dobra dla tej witryny**. To mała, nowa marka z kolizją nazwy (patrz G-01). Obecność w danych treningowych (GPTBot, ClaudeBot, CCBot, Google-Extended) pomaga modelom zapamiętać „Netizo = software house z Leszna”. Ryzyko jest niskie: treści to oferta, nie płatny content.

Zastrzeżenie: test UA wykonano z nieboterskiego IP. Cloudflare (AI Crawl Control, Bot Fight Mode, „Block AI bots”) może inaczej traktować **zweryfikowane** boty. Serwowany robots.txt jest identyczny z repo, więc Cloudflare nie wstrzykuje „managed robots.txt”. Ustawienia trzeba jednak potwierdzić w panelu Cloudflare (Security → Bots / AI Crawl Control) i w logach.

---

## Znaleziska

### G-01. Kolizja nazwy marki z indyjską agencją „Netizo” (netizo.in)
- **Ważność:** High
- **Dowód:**
  - Brave Search na zapytanie `netizo` zwrócił 18 wyników i wszystkie dotyczą netizo.in. To indyjska „Digital Agency for Web, Branding & Performance Marketing”, „Powering growth since 2017” (title i meta description netizo.in, pobrane curl-em). Wśród wyników są jej podstrony, LinkedIn `linkedin.com/company/netizo` (1350 obserwujących, „design-focused creative consultancy”), Instagram `@netizo.in`, ZoomInfo (biuro Velachery, Tamil Nadu, 1–10 pracowników) i RocketReach (founder Gokul G).
  - Blok „People also ask” w Brave odpowiadał: „What is Netizo's official website? → www.netizo.in”.
  - **netizo.pl nie pojawił się w żadnym wyniku.**
  - Inne nazwy kolidujące: `netizo.com` (domena na sprzedaż, przekierowanie na atom.com), szablon PowerPoint „Netizo” (Envato, Creative Market), strona FB „netizo” w kategorii Musician/Band.
  - Ta sama kategoria usług (web design / development) i podobny staż („since 2017” wobec naszego „8 lat doświadczenia”) zwiększają ryzyko, że LLM **połączy obie firmy w jedną encję**. Na pytanie „czym jest Netizo / opinie o Netizo” może wtedy opisać firmę z Indii.
  - Energizo (energizo.pl, klient z branży OZE): ryzyko niskie, inna branża. Na netizo.pl występuje jednak jako realizacja w H3 obok marki, a opis zawiera błąd interpunkcyjny „dla Energizo firmy wspierającej…”, który utrudnia poprawne parsowanie zdania.
- **Rekomendacja:**
  1. Zawsze używaj kwalifikatora w treści, tytułach i bio profili, np. „Netizo, software house z Leszna” albo „Netizo (Leszno, Polska)”. Na stronie nie ma żadnego zdania „Netizo to…” (patrz G-06).
  2. Zbuduj jednoznaczną encję: JSON-LD z `@id`, `legalName`, NIP (`vatID`/`taxID`), pełnym adresem i `sameAs` wyłącznie do własnych profili (patrz G-02). Do tego firmowa strona na LinkedIn (np. `linkedin.com/company/netizo-pl`; adresy `/company/netizo-pl` i `/company/netizo-agency` są dziś wolne, 404) oraz profil w Google Business Profile (Leszno).
  3. Gdy pojawią się 2–3 niezależne źródła (wpisy w katalogach, prasa lokalna, Clutch), dodaj element Wikidata „Netizo (polski software house)” z NIP, adresem i stroną. Dziś `wbsearchentities` dla „Netizo” zwraca pustą listę, a pl.wikipedia też nic nie ma.
  4. Popraw opis realizacji Energizo w panelu (pole `description` projektu): „dla Energizo, firmy wspierającej…”.
  5. Opcjonalnie rozważ zakup `netizo.com` (Brave pokazywał cenę ok. 2754 USD) jako ochronę marki.

### G-02. Brak danych identyfikujących podmiot (NIP, nazwa prawna, adres, ludzie) oraz uboga encja w JSON-LD
- **Ważność:** High
- **Dowód:**
  - W HTML wszystkich 4 stron i w repo (`lang/`, `resources/js/components`, `resources/views`) nie ma NIP, REGON, KRS, nazwy prawnej, ulicy, kodu pocztowego ani nazwisk osób. Stopka zawiera tylko „© 2026 Netizo. Wszelkie prawa zastrzeżone.” i nie ma strony „O nas” ani informacji o zespole.
  - `/polityka-prywatnosci`, `/regulamin` i `/utrzymanie` zwracają 404 (`resources/js/lib/site.ts:60-72`), mimo że strona zbiera leady z 5 formularzy i używa GA4 oraz Clarity. Brak tych stron to też sygnał braku wiarygodności (trust) dla systemów oceniających źródła.
  - JSON-LD `ProfessionalService` (`app/Http/Controllers/HomeController.php:45-67`) ma tylko `name`, `description`, `url`, `image`, adres (`addressLocality: Leszno`, region, kraj), `areaServed`, `knowsLanguage`, `priceRange` i `sameAs` (FB, IG, TikTok). Nie ma w nim `@id`, `legalName`, `vatID`/`taxID`, `telephone`, `email`, `logo`, `streetAddress`, `postalCode`, `geo`, `founder`, `foundingDate` ani `contactPoint`.
  - Encja PL (`url: https://netizo.pl`) i EN (`url: https://netizo.pl/en`) to dwa niepowiązane węzły bez `@id`. `WebPage` na `/partnerzy` nie ma `publisher` ani `isPartOf`. Brak węzła `WebSite`.
  - `meta name="author" content="Netizo"` (`resources/views/app.blade.php:26`) to jedyny sygnał autorstwa.
- **Rekomendacja:** dodaj stronę „O nas / Kontakt” z nazwą prawną, NIP, adresem i osobami (imię, rola, LinkedIn). Opublikuj politykę prywatności i regulamin. Rozbuduj JSON-LD do jednego grafu z `@id`, wspólnego dla PL i EN. Przykład (wartości w nawiasach kwadratowych do uzupełnienia, nie zgadywać):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": "https://netizo.pl/#organization",
      "name": "Netizo",
      "legalName": "[pełna nazwa z CEIDG/KRS]",
      "vatID": "PL[NIP]",
      "taxID": "[NIP]",
      "url": "https://netizo.pl/",
      "logo": "https://netizo.pl/[logo-512.png]",
      "image": "https://netizo.pl/assets/images/og-netizo-2.png",
      "description": "Netizo to software house z Leszna (Wielkopolska): strony WWW, sklepy internetowe, aplikacje webowe i mobilne dla firm z całej Polski.",
      "telephone": "+48884343924",
      "email": "kontakt@netizo.pl",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "[ulica i numer]",
        "postalCode": "[64-1xx]",
        "addressLocality": "Leszno",
        "addressRegion": "wielkopolskie",
        "addressCountry": "PL"
      },
      "areaServed": [{"@type": "City", "name": "Leszno"}, {"@type": "Country", "name": "Polska"}],
      "foundingDate": "[RRRR]",
      "founder": {"@type": "Person", "name": "[imię nazwisko]", "sameAs": ["[LinkedIn osoby]"]},
      "knowsLanguage": ["pl", "en"],
      "sameAs": [
        "https://www.facebook.com/netizo.agency",
        "https://www.instagram.com/netizo.agency",
        "https://www.tiktok.com/@netizo.agency",
        "https://www.youtube.com/@netizo.agency",
        "[https://www.linkedin.com/company/… po założeniu]"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://netizo.pl/#website",
      "url": "https://netizo.pl/",
      "name": "Netizo",
      "inLanguage": ["pl", "en"],
      "publisher": {"@id": "https://netizo.pl/#organization"}
    }
  ]
}
```

  W `PartnerProgramController` dodaj do `WebPage` pola `"isPartOf": {"@id": "https://netizo.pl/#website"}` i `"publisher": {"@id": "https://netizo.pl/#organization"}`. YouTube i LinkedIn wymagają dodania sieci w `config/socials.php:17-20` oraz ikony i nazwy w `resources/js/components/home/social-icon.tsx` (zgodnie z CLAUDE.md).

### G-03. Stara domena netizo.agency zwraca błąd Cloudflare 526 zamiast przekierowania
- **Ważność:** High
- **Dowód:** `http://netizo.agency/` daje 301 na `https://netizo.agency/`, a ten zwraca **526** (nieprawidłowy certyfikat origin). `www.netizo.agency` nie odpowiada (curl exit, kod 000). Kanał YouTube `@netizo.agency` (polski opis: „Netizo Agency to zespół ekspertów… tworzeniu nowoczesnych stron internetowych i aplikacji…”) nadal linkuje do `https://netizo.agency/`. Handle we wszystkich profilach to „netizo.agency”. Wayback: `netizo.agency` zwracał 200 we wrześniu 2024 i 301 w lipcu 2025. Linki i wzmianki z okresu `netizo.agency` trafiają więc w błąd i nie przenoszą sygnałów encji na netizo.pl.
- **Rekomendacja:** w Cloudflare włącz proxy i Universal SSL dla `netizo.agency` i `www.netizo.agency` i dodaj Redirect Rule `301 https://netizo.pl${path}` (z zachowaniem ścieżki). Zmień link w opisie kanału YouTube i bio profili na `https://netizo.pl`.

### G-04. Case studies istnieją tylko w JSON-ie Inertii, nie w DOM i nie pod własnymi URL-ami
- **Ważność:** Medium
- **Dowód:** `data-page` w `home-pl.html` zawiera dla 5 projektów `fullDescription` (279–617 znaków), 4 `challenges` i 4 `solutions`. Żadnego z tych tekstów nie ma w HTML poza JSON-em (sprawdzone dla każdego projektu). Pojawiają się dopiero w oknie po kliknięciu „Zobacz case study projektu …”. Ekstraktory (np. trafilatura w `home-render.json`) i większość crawlerów AI widzą tylko krótki opis karty. Te treści to najlepszy dowód kompetencji (problem → rozwiązanie → wynik), a nie da się ich zacytować ani podlinkować.
- **Rekomendacja:** dodaj podstrony `/realizacje/{slug}` i `/en/projects/{slug}` (SSR, nowa trasa obok `HomeController`) z H1 „{Projekt}: {kategoria}”, sekcjami „Wyzwanie / Rozwiązanie / Efekt”, stackiem, datą wdrożenia i linkiem do strony klienta. Dodaj JSON-LD `CreativeWork` z `creator` wskazującym `@id` organizacji i umieść podstrony w `public/sitemap.xml`. Okno na stronie głównej może linkować do pełnej wersji.

### G-05. Za mało URL-i do cytowania: brak stron usług, strony lokalnej i treści poradnikowych
- **Ważność:** Medium
- **Dowód:** serwis ma 4 strony HTML. Sześć usług (aplikacje webowe, mobilne, AI i automatyzacja, backend, DevOps, e-commerce) opisano po jednym zdaniu (8–14 słów) w kafelkach bento. Zapytania typu „ile kosztuje sklep internetowy”, „software house Leszno” czy „aplikacja mobilna Flutter cena” nie mają dopasowanej strony docelowej. Meta keywords z ok. 90 frazami miast (`lang/pl/home.php:16-45`) Google i silniki AI ignorują, a lista miast bez treści przypomina doorway.
- **Rekomendacja:** dodaj 4–6 stron usług (np. `/strony-internetowe`, `/sklepy-internetowe`, `/aplikacje-webowe`, `/aplikacje-mobilne`, `/automatyzacja-ai`). Każda powinna zaczynać się od 40–60-słowowej bezpośredniej odpowiedzi („Ile kosztuje…? Zwykle X–Y zł netto, Z tygodni”), mieć tabelę cen i terminów, proces, 2–3 realizacje i FAQ. Dodaj stronę lokalną „Strony internetowe Leszno” z realnymi danymi (adres, spotkania na miejscu, klienci z regionu). Usuń `SEOMeta::addKeyword` (`HomeController.php:29`) albo ogranicz listę do kilku fraz.

### G-06. Brak zdania definiującego encję („Netizo to…”) w treści widocznej
- **Ważność:** Medium
- **Dowód:** w tekście widocznym (`raw/geo/outline-home-pl.txt`) słowo „Netizo” występuje tylko w: „Netizo 85% Twoje 15%” (pasek prowizji), „Netizo teraz Cześć! W czym możemy pomóc?” (makieta czatu) i „© 2026 Netizo”. Lead hero („Strony, aplikacje webowe i mobilne oraz systemy dla firm…”) nie zawiera nazwy marki ani lokalizacji. „Leszno” pada tylko w jednej odpowiedzi FAQ. Sekcja „Nasza misja” („Chcemy, żeby następna generacja produktów cyfrowych była szybsza…”) nie zawiera żadnego faktu nadającego się do cytowania.
- **Rekomendacja:** dodaj w hero lub w misji (`resources/js/components/home/hero.tsx`, sekcja misji) jedno zdanie-definicję w obu językach, np. „Netizo to software house z Leszna (Wielkopolska). Projektujemy, programujemy i utrzymujemy strony WWW, sklepy i aplikacje dla firm z całej Polski.” / „Netizo is a software house based in Leszno, Poland…”. Przepisz „Naszą misję” na fakty: od kiedy działacie, ile osób, jakie specjalizacje.

### G-07. Metryki marketingowe bez źródła i kontekstu
- **Ważność:** Medium
- **Dowód:**
  - Liczby bez źródła i kontekstu: „150+ zrealizowanych projektów”, „8 lat doświadczenia” (`hero.tsx:24-26`, `lang/pl/home.php:11-13`, `lang/en/home.php:12`), „99,9% dostępności wdrożeń”, „30M+ zapytań miesięcznie obsługują nasze systemy”, „250K+ linii kodu w produkcji” (`clients-section.tsx:21-22`) oraz metryka realizacji Energizo „100% SEO według Google”.
  - Strona pokazuje 5 realizacji i 8 klientów w marquee.
  - Domena netizo.pl jest zarejestrowana od 2023-11-19 (WHOIS), a pierwsze zrzuty w Wayback pochodzą z 2024 r. Bez daty założenia czy opisu zespołu „8 lat” jest nieweryfikowalne i może zostać pominięte albo, co gorsze, połączone z „since 2017” firmy netizo.in.
- **Rekomendacja:** doprecyzuj w obu językach, np. „8 lat doświadczenia zespołu (od 20XX)”. Dla „99,9%” wskaż źródło (np. publiczna strona statusu z monitoringu). „100% SEO według Google” zastąp „Lighthouse SEO 100”. Liczbę projektów poprzyj listą lub podstronami realizacji (G-04).

### G-08. Szum w tekście ekstrahowanym: podwójne liczby z CountUp i dane z makiet UI
- **Ważność:** Medium
- **Dowód:**
  - `resources/js/components/motion/count-up.tsx:131-138` renderuje w SSR wartość końcową i, w osobnym spanie z `aria-hidden`, wartość startową. Ekstraktory, które nie respektują `aria-hidden`, czytają więc „150+120+ zrealizowanych projektów”, „99,9%99,0% dostępności wdrożeń”, „30M+0M+ zapytań”, „250K+0K+ linii kodu” (tak wychodzi w `raw/geo/parse-home-pl.json` i `outline-home-pl.txt`). Strona partnerska ma analogicznie „Twoja prowizja 8 250 zł8 250 zł”.
  - Makiety w bento, procesie i panelu umieszczają w tekście fikcyjne dane. Te zdania wyglądają jak fakty o Netizo i model może je zacytować:
    - „Twoja stawka 150,00 zł/h netto”, „Razem w miesiącu 12 h 30 min 1 875,00 zł netto” (oznaczenie „Dane przykładowe.” jest tylko pod panelem),
    - „Wysyłka kosztuje 39 zł, dostawa w 2–3 dni robocze”,
    - „Sweter Bałtyk 349 zł”, „Sprzedaż dziś 12 480,00 zł”,
    - „Prowizja partnerska Netizo +1 800 zł / ANNA15”.
  - Lista klientów w marquee jest w DOM 3 razy (24 `<li>`).
- **Rekomendacja:**
  - W `count-up.tsx` nie renderuj tekstu w `data-count-current` podczas SSR. Ustawiaj go dopiero w efekcie (`useEffect`) albo pokazuj przez CSS `content: attr(data-from)`.
  - Kontenery makiet oznacz `data-nosnippet` (Google stosuje kontrolę podglądu także w AI Overviews / AI Mode) i `aria-hidden="true"`, jeśli są czysto dekoracyjne. Dodaj etykietę „przykład” przy każdej scenie z kwotami.
  - Duplikaty marquee renderuj tylko po hydratacji albo z `aria-hidden` i `data-nosnippet`.

### G-09. Adres e-mail niewidoczny dla crawlerów bez JS (Cloudflare Email Obfuscation)
- **Ważność:** Medium
- **Dowód:** na wszystkich 4 stronach adres jest zamieniony na `/cdn-cgi/l/email-protection#…` i w HTML widać tekst „[email protected]”. Zdekodowany adres to `kontakt@netizo.pl`. Crawlery AI nie wykonują JS Cloudflare, więc widzą „[email protected]”. E-maila nie ma też w JSON-LD, więc dane kontaktowe (NAP+E) są niekompletne.
- **Rekomendacja:** wyłącz Email Address Obfuscation (Cloudflare → Scrape Shield) albo wyłącz ją regułą Configuration Rule dla `netizo.pl/*`. Dodaj `email` i `telephone` do JSON-LD (G-02).

### G-10. Słaba obecność marki poza witryną (YouTube, LinkedIn, Reddit, katalogi, klienci)
- **Ważność:** Medium
- **Dowód:**
  - **YouTube:** kanał `youtube.com/@netizo.agency` (ID `UCfe2xFKlAyn5l8Fx9FA3uWg`) ma polski opis Netizo, ale w HTML kanału nie znalazłem żadnych `videoId` (prawdopodobnie brak filmów; niezweryfikowane po zalogowaniu). Kanał nie jest w `sameAs` i linkuje do martwej `netizo.agency`. Handle `@netizo` należy do innego, pustego kanału.
  - **LinkedIn:** nie ma strony firmy. `company/netizo` należy do netizo.in.
  - **Wikipedia i Wikidata:** brak wpisów.
  - **Strony klientów:** treepro.pl, energizo.pl, nakazdaokazje.pl, leasingodreki.pl, krainamt2.pl i temar-mt.pl mają w HTML strony głównej **0 wystąpień „netizo”**, czyli nie ma podpisów „Realizacja: Netizo”.
  - **Facebook i Instagram:** nie dało się zweryfikować automatycznie (FB zwraca 400 dla curl, IG ładuje się przez JS). TikTok `@netizo.agency` odpowiada 200.
  - **Reddit:** nie sprawdzano.
  - Wzmianki na YouTube mają najwyższą znaną korelację z cytowaniami w AI (ok. 0,74), a Domain Rating tylko ok. 0,27.
- **Rekomendacja:**
  1. Poproś klientów o podpis w stopce „Strona: Netizo” z linkiem do `https://netizo.pl` (najtańszy i najsilniejszy sygnał lokalny).
  2. Opublikuj 3–5 krótkich filmów na `@netizo.agency` (omówienie case study, „ile kosztuje strona w 2026”) z linkiem do netizo.pl i dodaj kanał do `sameAs`.
  3. Załóż firmową stronę na LinkedIn i profile w Google Business Profile, Clutch, GoodFirms, Sortlist i Oferteo z identycznymi danymi NAP.
  4. Postaraj się o 1–2 wzmianki w lokalnych mediach (Leszno).

### G-11. llms.txt: brak (znaczenie niskie)
- **Ważność:** Low
- **Dowód:** `/llms.txt` i `/llms-full.txt` zwracają 404 (`raw/file_llms_txt`). Nie ma też RSL 1.0 (brak `License:` w robots.txt i `/license.xml`), co dla agencji nie jest potrzebne.
- **Ocena realistyczna:** Google oficjalnie nie używa llms.txt (AI Overviews i AI Mode opierają się na zwykłym indeksie). OpenAI, Anthropic i Perplexity nie potwierdzają, że plik wpływa na cytowania. Korzyść ograniczona: agenci, narzędzia IDE i asystenci pobierający stronę na żądanie dostają zwięzłe, poprawne fakty (ceny, terminy, kontakt, rozróżnienie od netizo.in). Koszt to ok. 30 minut i jeden statyczny plik `public/llms.txt`. Warto, ale po G-01–G-09.
- **Rekomendacja:** dodaj `public/llms.txt` w wersji poniżej (serwowany jako `text/plain; charset=utf-8`) i aktualizuj go przy zmianie cen lub oferty.

### G-12. robots.txt: brak udokumentowanej decyzji wobec botów AI
- **Ważność:** Info
- **Dowód:** `public/robots.txt:1-4` to jedna grupa `*`. Zachowanie jest dobre (wszystko dopuszczone), ale bez komentarza nie wiadomo, czy to świadoma decyzja.
- **Rekomendacja:** zostaw dostęp dla wszystkich i dodaj komentarz z datą decyzji. **Nie** dodawaj grup per bot z `Allow`: bot z własną grupą ignoruje grupę `*`, co przy przyszłych regułach `Disallow` łatwo prowadzi do błędów. Jeśli kiedyś zapadnie decyzja o rezygnacji z treningu, blokuj tylko tokeny treningowe (`GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`, `Applebot-Extended`, `cohere-ai`). Nigdy nie blokuj `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Googlebot`, `Bingbot` ani `Applebot`. Potwierdź też w panelu Cloudflare, że AI Crawl Control nie blokuje zweryfikowanych botów.

```
# Netizo: wyszukiwarki i crawlery AI (wyszukiwanie i trening) mają pełny dostęp. Decyzja świadoma, 2026-10.
User-agent: *
Allow: /

Sitemap: https://netizo.pl/sitemap.xml
```

### G-13. Odsyłacze do innych obszarów audytu (wpływ na GEO)
- **Ważność:** Low
- `public/sitemap.xml` zawiera 4 adresy z fragmentem (`/#stack` (nieistniejący), `/#projekty`, `/#faq`, `/#kontakt`). Usuń je, bo fragmenty nie są osobnymi dokumentami.
- `/index.php` zwraca 200 z własnym canonical (duplikat). Ustaw 301 na `/`.
- Domena netizo.pl ma termin odnowienia **2026-11-19** (WHOIS). Upewnij się, że autoodnawianie jest włączone; utrata domeny wyzerowałaby całą encję.

---

## Co działa dobrze

- **SSR z pełną treścią w HTML** (`is_spa=false`): H1, sekcje, FAQ i zasady programu są widoczne bez JS. Strony ładują się szybko (TTFB ok. 0,1–0,2 s), a każdy bot dostaje 200.
- **FAQ z konkretami do cytowania**, spójnie w HTML i JSON-LD `FAQPage` (11 pytań na stronie głównej, 9 na partnerskiej, w PL i EN):
  - ceny: „Prosta strona kosztuje zwykle 1–5 tys. zł, rozbudowana strona lub mały sklep 5–15 tys. zł, aplikacja webowa 15–50 tys. zł, duże systemy od 50 tys. zł”,
  - terminy: „Landing page 2–3 tygodnie, strona firmowa 4–6 tygodni, aplikacja webowa 2–4 miesiące”.
  Odpowiedzi mają 30–60 słów, zaczynają się od „Tak.” lub „Nie.”, są samodzielne i nie wymagają kontekstu. Pytania są w H3 i w formie pytań.
- **Strona partnerska** jest wzorcowo ekstrahowalna: `<dl>` z 8 parami warunków (15% netto, 12 miesięcy, wypłata do 14 dni, rozliczenie, limit) i liczbowy przykład (10 000 zł → 1 500 zł).
- **Dwujęzyczność wykonana poprawnie:** canonical, hreflang pl/en/x-default, `inLanguage` w schema, osobne OG. Wersja EN ma tę samą treść faktograficzną, co zwiększa szansę na cytowania w zapytaniach anglojęzycznych.
- **Proces opisany wynikami** („Dostajesz: brief i zakres prac do akceptacji”, „klikalny prototyp”, „demo co 2 tygodnie”) to dobre, samodzielne pasaże.
- **Spójna nazwa „Netizo”** w title, `og:site_name`, schema i stopce oraz spójny handle `netizo.agency` na FB, IG, TikTok i YouTube.

---

## Proponowany `public/llms.txt` (PL + EN, wyłącznie na podstawie treści strony)

Celowo pominąłem metryki bez źródła (150+, 8 lat, 99,9%, 30M+), dopóki nie zostaną doprecyzowane (G-07). Uwaga do przeglądu przed publikacją: w FAQ ceny nie mają dopisku netto/brutto, więc w pliku też go nie ma.

```markdown
# Netizo

> Netizo to agencja / software house z Leszna (województwo wielkopolskie, Polska), która projektuje, programuje i utrzymuje strony WWW, sklepy internetowe, aplikacje webowe i mobilne oraz systemy dla firm z całej Polski. Nie mylić z firmą Netizo z Indii (netizo.in): oficjalna strona polskiego Netizo to https://netizo.pl.

Witryna jest dwujęzyczna: polska wersja pod https://netizo.pl/, angielska pod https://netizo.pl/en. Większość współpracy odbywa się online (rozmowy wideo i panel klienta). Z firmami z Leszna i okolic Netizo spotyka się na miejscu. Odpowiedź na zapytanie w ciągu 24 godzin, wycena i konsultacja bezpłatne.

## Oferta

- [Usługi](https://netizo.pl/#uslugi): aplikacje webowe (SPA i SSR, od landing page po platformy SaaS; React, Next.js, Vue.js, TypeScript), aplikacje mobilne (jeden kod na iOS i Android; React Native, Flutter), AI i automatyzacja (chatboty, integracje z AI, automatyzacja procesów), systemy backend (API i mikroserwisy; Node.js, Python, Go, GraphQL), DevOps i chmura (infrastruktura jako kod, CI/CD, konteneryzacja, monitoring 24/7; AWS, Docker, Kubernetes, Terraform), e-commerce (sklepy i marketplace'y z integracją płatności i fulfillmentu; Shopify, WooCommerce, Stripe, headless).
- [Ceny i terminy (FAQ)](https://netizo.pl/#faq): prosta strona zwykle 1–5 tys. zł, rozbudowana strona lub mały sklep 5–15 tys. zł, aplikacja webowa 15–50 tys. zł, duże systemy od 50 tys. zł. Landing page powstaje zwykle w 2–3 tygodnie, strona firmowa w 4–6 tygodni, aplikacja webowa w 2–4 miesiące. Dokładna wycena i termin po bezpłatnym briefie.
- [Proces](https://netizo.pl/#proces): 1) odkrywanie: brief i zakres prac do akceptacji; 2) projektowanie: wygląd i klikalny prototyp (Figma) przed programowaniem; 3) rozwój: dwutygodniowe sprinty, demo na wersji testowej co sprint; 4) wdrożenie: publikacja, monitoring i panel klienta.
- Opieka po wdrożeniu: hosting, aktualizacje bezpieczeństwa, kopie zapasowe, monitoring i rozwój strony; przy stałej współpracy comiesięczne rozliczenie z rozpisanymi godzinami. Na życzenie CMS do samodzielnej edycji treści. Przy przebudowie przekierowanie starych adresów na nowe.
- Technologie: interfejs: React, Next.js, Vue.js, Tailwind CSS; serwer: Node.js, Go, Laravel, Python; bazy danych: PostgreSQL, MongoDB, Redis; chmura: AWS, GCP, Vercel.

## Panel klienta

- [Panel klienta](https://panel-klienta.netizo.pl): zgłaszanie poprawek jako zadania, status prac (Do zrobienia / W trakcie / Gotowe), czas pracy i koszt każdego zadania, dokumenty projektu z historią wersji, faktury w PDF, zaszyfrowany sejf dostępów do hostingu i domeny, przypomnienia o odnowieniu domeny i hostingu, czat z zespołem, logowanie hasłem i jednorazowym kodem z e-maila.

## Realizacje

- [Wybrane wdrożenia](https://netizo.pl/#projekty)
- Treepro.pl: strona firmowa / Local SEO dla firmy zajmującej się wycinką drzew, wynajmem podnośników i pracami ogrodowymi w zachodniej Polsce (74 miejscowości w zasięgu, 7 usług, 3 województwa).
- Vetly.pl: platforma rezerwacji wizyt u weterynarza online (Laravel, Inertia.js, React).
- energizo.pl: strona dla Energizo, firmy doradzającej w wyborze rozwiązań OZE, z kalkulatorem oszczędności i galerią realizacji (Laravel, Filament, Livewire, Tailwind CSS).
- nakazdaokazje.pl: sklep internetowy z prezentami i dekoracjami, z konfiguratorem bukietów, płatnościami HotPay i wysyłką InPost lub odbiorem osobistym.
- KrainaMT2.pl: portal dla polskiej społeczności Metin2 z newsami, bazą serwerów i narzędziami dla graczy.

## Program partnerski

- [Program partnerski](https://netizo.pl/partnerzy): polecający dostaje 15% wartości netto każdej faktury opłaconej przez poleconego klienta przez 12 miesięcy od jego pierwszego zamówienia (projekt, rozbudowa, opieka techniczna). Wypłata przelewem najpóźniej 14 dni po opłaceniu faktury. Udział bezpłatny, bez limitu poleceń, z całej Polski. Klient płaci tyle samo co bez polecenia. Liczą się nowe firmy, z którymi Netizo nie rozmawiało o współpracy w ostatnich 12 miesiącach. Rozliczenie na fakturę (firma) albo na podstawie umowy (osoba prywatna). Przykład: zamówienie za 10 000 zł netto daje 1 500 zł prowizji.

## Kontakt

- E-mail: kontakt@netizo.pl
- Telefon: +48 884 343 924
- [Formularz kontaktowy i brief projektu](https://netizo.pl/#kontakt)
- Siedziba: Leszno, wielkopolskie, Polska.

## English

> Netizo is a web agency / software house based in Leszno, western Poland. It designs, builds and maintains websites, online stores, web and mobile applications and business systems for companies from all over Poland and from abroad, in Polish or English.

- [Home page (EN)](https://netizo.pl/en): services, recent launches, process, FAQ and contact.
- [Prices and timelines (FAQ)](https://netizo.pl/en#faq): a simple website usually costs PLN 1,000–5,000, a larger website or a small online store PLN 5,000–15,000, a web application PLN 15,000–50,000, and large systems start at PLN 50,000. A landing page usually takes 2–3 weeks, a company website 4–6 weeks, a web application 2–4 months. Free quote after the brief.
- [Partner program (EN)](https://netizo.pl/en/partners): 15% (net) of every invoice a referred client pays for 12 months from their first order, paid within 14 days of the invoice being paid. Free to join, no referral limit, same price for the client.
- Contact: kontakt@netizo.pl, +48 884 343 924, [contact form](https://netizo.pl/en#contact).

## Optional

- [Facebook](https://www.facebook.com/netizo.agency)
- [Instagram](https://www.instagram.com/netizo.agency)
- [TikTok](https://www.tiktok.com/@netizo.agency)
```

Uwagi wdrożeniowe:
- Plik umieść w `public/llms.txt` (statyczny, jak `robots.txt`).
- Nie linkuj `/regulamin`, `/polityka-prywatnosci` ani `/utrzymanie`, dopóki zwracają 404.
- Po publikacji stron usług i realizacji (G-04, G-05) dodaj je do sekcji „Oferta” i „Realizacje”.
- Kotwice EN: `#faq` i `#contact`, zgodnie z `lib/sections.ts`.

---

## Top 5 zmian o największym wpływie

| # | Zmiana | Znaleziska | Wysiłek | Wpływ |
|---|---|---|---|---|
| 1 | Dane podmiotu + graf JSON-LD z `@id`, NIP, adresem, kontaktem i `sameAs`; strona „O nas / Kontakt”; polityka prywatności i regulamin | G-02, G-06, G-09 | 0,5–1 dzień (plus teksty prawne) | Wysoki: rozróżnienie encji, zaufanie |
| 2 | Oddzielenie od netizo.in: zdanie-definicja z „Leszno”, LinkedIn firmy, Google Business Profile, katalogi, później Wikidata | G-01, G-10 | 1–2 dni + ciągłe działania | Wysoki: poprawne odpowiedzi na „Netizo” |
| 3 | 301 z `netizo.agency` (+www) na `netizo.pl` i poprawa linków w profilach | G-03 | 30 min (Cloudflare) | Średnio-wysoki: odzyskanie sygnałów |
| 4 | Podstrony realizacji i 4–6 stron usług z bezpośrednimi odpowiedziami i tabelami cen/terminów | G-04, G-05 | 3–5 dni | Wysoki: więcej URL-i do cytowania |
| 5 | Czystość ekstrakcji: CountUp bez wartości startowej w SSR, `data-nosnippet` na makietach, wyłączenie Email Obfuscation, doprecyzowanie metryk | G-07, G-08, G-09 | 2–4 h | Średni: mniej halucynacji i sprzecznych liczb |

Następnie: llms.txt (G-11, 30 min), komentarz w robots.txt i kontrola Cloudflare AI Crawl Control (G-12, 15 min), podpisy „Realizacja: Netizo” u klientów i filmy na YouTube (G-10).

---

## Dane strukturalne do `audit-data.json` (kategoria: AI Search Readiness)

```json
{
  "category": "AI Search Readiness",
  "subcategory": "GEO",
  "score": 55,
  "dimensions": {"citability": 62, "structural_readability": 72, "multimodal": 40, "authority_brand": 18, "technical_accessibility": 78},
  "platform_scores": {"google_aio": 50, "chatgpt_search": 38, "perplexity": 45, "bing_copilot": 38},
  "ai_crawlers": {"robots_txt": "User-agent: * Allow: /", "all_tested_status": 200, "blocked": [], "rsl": "absent"},
  "llms_txt": "missing",
  "findings": [
    {"id": "G-01", "severity": "High", "title": "Kolizja nazwy marki z Netizo (netizo.in, Indie)", "file": null},
    {"id": "G-02", "severity": "High", "title": "Brak NIP/nazwy prawnej/adresu/ludzi; uboga encja JSON-LD; polityka prywatności 404", "file": "app/Http/Controllers/HomeController.php:45-67; resources/js/lib/site.ts:60-72"},
    {"id": "G-03", "severity": "High", "title": "netizo.agency zwraca Cloudflare 526 zamiast 301 na netizo.pl", "file": null},
    {"id": "G-04", "severity": "Medium", "title": "Case studies tylko w JSON Inertii, bez własnych URL", "file": "app/Http/Controllers/HomeController.php:94-115"},
    {"id": "G-05", "severity": "Medium", "title": "Tylko 4 URL-e; brak stron usług/lokalnych; 90 meta keywords z miastami", "file": "lang/pl/home.php:16-45; app/Http/Controllers/HomeController.php:29"},
    {"id": "G-06", "severity": "Medium", "title": "Brak zdania definiującego encję w treści widocznej", "file": "resources/js/components/home/hero.tsx"},
    {"id": "G-07", "severity": "Medium", "title": "Metryki bez źródła (150+, 8 lat, 99,9%, 30M+, 250K+)", "file": "resources/js/components/home/hero.tsx:24-26; resources/js/components/home/clients-section.tsx:21-22; lang/pl/home.php:11-13"},
    {"id": "G-08", "severity": "Medium", "title": "Szum ekstrakcji: podwójne liczby CountUp, dane z makiet", "file": "resources/js/components/motion/count-up.tsx:131-138"},
    {"id": "G-09", "severity": "Medium", "title": "E-mail zaciemniony przez Cloudflare ([email protected])", "file": null},
    {"id": "G-10", "severity": "Medium", "title": "Słaba obecność poza witryną: YouTube bez filmów i poza sameAs, brak LinkedIn/Wikidata, klienci bez podpisów", "file": "config/socials.php:17-20"},
    {"id": "G-11", "severity": "Low", "title": "Brak llms.txt (gotowa propozycja)", "file": "public/llms.txt"},
    {"id": "G-12", "severity": "Info", "title": "robots.txt bez udokumentowanej decyzji wobec botów AI", "file": "public/robots.txt:1-4"},
    {"id": "G-13", "severity": "Low", "title": "Fragmenty w sitemap, duplikat /index.php, odnowienie domeny 2026-11-19", "file": "public/sitemap.xml"}
  ]
}
```

---

## Ocena kategorii

**55/100.** Strona jest technicznie dobrze przygotowana dla crawlerów AI (SSR, pełny dostęp botów, FAQ z konkretnymi cenami i terminami), ale encja „Netizo” jest prawie niezidentyfikowana: brakuje NIP, adresu, ludzi i polityki prywatności, w wynikach dominuje indyjska netizo.in, a stara domena netizo.agency zwraca błąd. Do tego są tylko 4 URL-e do cytowania, więc w praktyce silniki AI nie mają ani pewności, o kogo chodzi, ani wielu stron, które mogłyby przywołać.
