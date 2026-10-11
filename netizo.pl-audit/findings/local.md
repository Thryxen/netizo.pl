# Audyt lokalnego SEO — https://netizo.pl (2026-10-11)

Zakres: NAP, Google Business Profile, cytowania, opinie, strony lokalne, schema lokalne, mapa. Źródła: surowy HTML w `netizo.pl-audit/raw/`, kod w repo, pomiary wykonane 2026-10-11 (curl, render Playwright, Brave Search). Kod projektu nie był modyfikowany.

Wynik zbiorczy: **18/100** (szczegóły w sekcji `## Ocena kategorii`).

## 1. Typ biznesu i branża

- **Typ wykryty na stronie: SAB (service-area business).** Brak widocznego adresu ulicznego, brak Maps embed, brak linku "wskazówki dojazdu". Jedyny sygnał lokalizacji w treści to odpowiedź FAQ "Jesteśmy z Leszna w Wielkopolsce… Z firmami z Leszna i okolic chętnie spotkamy się na miejscu" (`lang/pl/home.php:85-88`). Deklarowana "hybryda" (Leszno + cała Polska) jest więc na stronie niewidoczna: strona komunikuje wyłącznie model zdalny.
- **Branża:** usługi profesjonalne B2B (agencja interaktywna / software house). Nie pasuje do żadnej z sześciu standardowych branż lokalnych (restauracje, zdrowie, prawo, usługi domowe, nieruchomości, motoryzacja). Najbliższy podtyp schema.org: `ProfessionalService` (obecny, poprawny).
- **Proximity:** wg badania Search Atlas ok. 55% wariancji rankingu lokalnego to bliskość wyszukującego do firmy. Dla fraz "agencja interaktywna Leszno" jest to atut, dla "agencja Poznań / Wrocław" jest to ograniczenie, na które strona nie ma wpływu (poza oparciem się na zdalnej ofercie i organicznych stronach usługowych).

## 2. Audyt spójności NAP

| Element | Widoczny HTML (PL/EN) | JSON-LD (`ProfessionalService`) | Meta tagi | Zewnętrzne (zweryfikowane) |
|---|---|---|---|---|
| Nazwa | "Netizo" (logo, stopka ©, `og:site_name`) | "Netizo" | `apple-mobile-web-app-title`: "Netizo.pl" (drobna różnica) | Panorama Firm: "Netizo Kamil Nawrot" (patrz F-08, niezweryfikowane, czy to ta sama firma) |
| Adres | **brak** (ulica, kod pocztowy, miasto poza FAQ) | tylko `addressLocality: Leszno`, `addressRegion: wielkopolskie`, `addressCountry: PL`; **brak `streetAddress` i `postalCode`** | brak | Panorama Firm: ul. Wiosny Ludów 12 lok. 8, 63-600 **Kępno** (niezweryfikowane powiązanie) |
| Telefon | +48 884 343 924, `tel:+48884343924` (stopka, sekcja kontaktu, okno "Zadzwońcie do mnie"), identyczny na wszystkich 4 stronach | **brak `telephone`** | brak | nie znaleziono w żadnym katalogu |
| E-mail | kontakt@netizo.pl (stopka, kontakt, menu mobilne, FAQ partnerów), ale w surowym HTML **zaciemniony przez Cloudflare** (F-07) | **brak `email`** | brak | — |
| NIP / REGON / KRS / forma prawna | **brak** | brak (`taxID`/`vatID`/`legalName`) | brak | Panorama Firm podaje NIP rekordu "Netizo Kamil Nawrot" (nie weryfikowano zgodności z właścicielem strony) |
| Godziny pracy | **brak** (jest tylko obietnica "odpowiadamy w ciągu 24 godzin") | brak `openingHoursSpecification` | brak | — |
| Geo | brak mapy, brak współrzędnych | **brak `geo`** | brak (`geo.position`, `ICBM` nieobecne) | — |

Wniosek: telefon i e-mail są spójne wszędzie, gdzie występują, ale NAP jest **niekompletny** (brak adresu, NIP, godzin), a JSON-LD nie powtarza nawet tego, co jest widoczne (telefon, e-mail). Nie ma sprzeczności wartości, jest luka informacyjna.

## 3. Znaleziska

### F-01 [Critical] Brak weryfikowalnego profilu Google Business Profile i zero sygnałów GBP na stronie
**Dowód:**
- Na żadnej z 4 stron nie ma iframe Google Maps (jedyny iframe to GTM noscript), linku do `maps.google`/`g.page`/`goo.gl/maps`, przycisku "Zostaw opinię", `hasMap` w schema ani wzmianki o profilu Google.
- Weryfikacja istnienia GBP **nie powiodła się technicznie**: Google SERP zwrócił CAPTCHA ("nietypowy ruch"), Google Maps przekierował na `consent.google.com`. **Status profilu "Netizo Leszno" (istnienie, kategorie, opinie, status weryfikacji): NIEZWERYFIKOWANY.**
- Wskazówka pośrednia (słaba, Brave ≠ Google): zapytanie "Netizo Leszno agencja interaktywna" w Brave pokazuje blok map z VDY Agencja Interaktywna, o2 group, Agencja Reklamowa BAW. Netizo nie ma w tym bloku i nie ma go na pierwszych ~25 wynikach organicznych (poniżej pozycje konkurentów).
- OpenStreetMap Nominatim dla "Netizo Leszno": 0 wyników.

**Rekomendacja:** sprawdzić ręcznie w Google Maps (zalogowane konto właściciela, `business.google.com`), czy profil istnieje. Jeśli nie, założyć go jako SAB (adres ukryty, obszar obsługi) albo z adresem biura/coworkingu, jeśli ma być widoczny. Główna kategoria jest czynnikiem #1 rankingu lokalnego (Whitespark 2026, wynik 193), a zła kategoria czynnikiem negatywnym #1 (176): dobrać ją po analizie kategorii konkurentów z Leszna (kandydaci do sprawdzenia w panelu: "Agencja internetowa" / "Projektant stron internetowych" / "Firma programistyczna"; dokładne polskie nazwy zweryfikować w interfejsie GBP). Dodatkowe kategorie: 2-3 pasujące do usług. Uzupełnić: usługi z opisami, produkty (pakiety), opis ~750 znaków, zdjęcia (zespół, biuro/praca, realizacje), posty co 1-2 tygodnie, link do strony usług. Po założeniu dodać link GBP do `config/socials.php`/JSON-LD (`sameAs`, `hasMap`) i do stopki.

### F-02 [High] Niepełny NAP na stronie: brak adresu, kodu pocztowego, NIP/REGON, godzin
**Dowód:** `site.ts:8-14` zawiera tylko e-mail i telefon; stopka (`site-footer.tsx:81-95`) i sekcja kontaktu (`contact-section.tsx:106-127`) pokazują wyłącznie e-mail i telefon. Wyszukanie w tekście widocznym wszystkich 4 stron: `NIP`, `REGON`, `ul.`, `64-`, `siedzib`, `administrator`, godziny otwarcia — 0 trafień. "Leszno" występuje 1 raz w widocznym tekście PL (FAQ) i 1 raz w EN.
**Rekomendacja:**
1. Zdecydować o modelu: (a) SAB z ukrytym adresem: pokazać przynajmniej "Leszno, woj. wielkopolskie" + kod pocztowy + NIP/REGON/formę prawną w stopce i na podstronie kontaktowej; (b) adres publiczny (biuro, coworking): pełny adres + mapa.
2. Dodać do stopki (`site-footer.tsx`) blok "Dane firmy": pełna nazwa (zgodna z CEIDG/KRS), miejscowość, NIP, REGON, godziny kontaktu.
3. Dodać sekcję/podstronę `/kontakt` (patrz F-04) z NAP, godzinami, formą spotkań ("w Lesznie i okolicach — po wcześniejszym umówieniu"), linkiem do GBP.
4. Wymogi informacyjne usługodawcy (ustawa o świadczeniu usług drogą elektroniczną, art. 5; RODO art. 13 dla 5 formularzy) wymagają danych identyfikujących administratora. To rekomendacja do potwierdzenia przez prawnika, ale jednocześnie najprostsze źródło spójnego NAP.

### F-03 [High] Dane lokalne w JSON-LD są szczątkowe (`HomeController.php:44-67`)
**Dowód (z `home-pl.html`, `home-en.html`):** `@type: ProfessionalService` (poprawny podtyp `LocalBusiness`), `name`, `description`, `url`, `image` (to plik OG 1200x630, nie logo), `address` {addressLocality, addressRegion, addressCountry}, `areaServed` {Country: Polska}, `knowsLanguage`, `priceRange: "$$"`, `sameAs` (FB, IG, TikTok). Walidacja względem wymagań Google dla LocalBusiness:

| Właściwość | Status |
|---|---|
| `name` | jest |
| `address` | **niepełny**: brak `streetAddress`, `postalCode` |
| `telephone` | **brak** (a telefon jest widoczny na stronie) |
| `geo` (5 miejsc po przecinku) | **brak** |
| `openingHoursSpecification` | **brak** |
| `url` | jest |
| `logo` | **brak** (jest `image` = grafika OG) |
| `email`, `contactPoint` | brak |
| `@id` (stały identyfikator encji) | brak |
| `areaServed` jako lista miast | **tylko Country** |
| `legalName`, `taxID`/`vatID`, `foundingDate` | brak |
| `hasOfferCatalog`/`makesOffer` (usługi) | brak |
| `aggregateRating`/`review` | brak (poprawnie: nie ma opinii do pokazania, patrz F-06) |

Dla porównania: klient-case study "Treepro.pl / Local SEO" (curl 2026-10-11) ma kompletniejsze `LocalBusiness`: telefony, adres z ulicą i kodem, `geo`, godziny, `areaServed` (3 województwa). Własna encja Netizo jest słabsza niż wizytówka pokazywanego klienta. (Uwaga poboczna dla klienta: w jego JSON-LD `url` jest pustym stringiem, `geo` ma 2 miejsca po przecinku, a `sitemap.xml` zawiera 1 URL.)

**Rekomendacja:** rozbudować blok w `HomeController.php:45-67` (analogicznie na stronie EN). Wzór z placeholderami; dane uzupełnić faktycznymi wartościami, niczego nie zgadywać:

```php
JsonLdMulti::setTitle('Netizo')
    ->setType('ProfessionalService')
    ->addValue('@id', 'https://netizo.pl/#organization')
    ->addValue('legalName', '<PEŁNA NAZWA Z CEIDG/KRS>')
    ->addValue('telephone', '+48884343924')
    ->addValue('email', 'kontakt@netizo.pl')
    ->addValue('logo', asset('assets/images/<logo>.png'))
    ->addValue('address', [
        '@type' => 'PostalAddress',
        'streetAddress' => '<ULICA NR>',      // pominąć, jeśli adres ma zostać ukryty (SAB)
        'postalCode' => '<KOD>',
        'addressLocality' => 'Leszno',
        'addressRegion' => 'wielkopolskie',
        'addressCountry' => 'PL',
    ])
    ->addValue('geo', ['@type' => 'GeoCoordinates', 'latitude' => 00.00000, 'longitude' => 00.00000]) // tylko przy publicznym adresie
    ->addValue('openingHoursSpecification', [[ '@type' => 'OpeningHoursSpecification', 'dayOfWeek' => [...], 'opens' => '09:00', 'closes' => '17:00' ]])
    ->addValue('areaServed', [
        ['@type' => 'City', 'name' => 'Leszno'],
        ['@type' => 'City', 'name' => 'Rawicz'],
        ['@type' => 'City', 'name' => 'Kościan'],
        ['@type' => 'City', 'name' => 'Gostyń'],
        ['@type' => 'AdministrativeArea', 'name' => 'Wielkopolskie'],
        ['@type' => 'Country', 'name' => 'Polska'],
    ])
    ->addValue('hasOfferCatalog', [...]);   // strony WWW, sklepy, aplikacje webowe, utrzymanie
```

Dla SAB z ukrytym adresem zamiast `geo` użyć `areaServed` typu `GeoCircle` (`geoMidpoint` + `geoRadius` w metrach wokół Leszna), żeby nie ujawniać adresu domowego. Miasta w `areaServed` powinny odpowiadać faktycznie obsługiwanym (patrz F-05), a `sameAs` miast (Wikipedia/Wikidata) są opcjonalne. Dodać `sameAs`: GBP, LinkedIn, Clutch (po założeniu profili). `priceRange: "$$"` (`HomeController.php:61`) jest bezużyteczny dla B2B; zamienić na zakres z FAQ (np. "od 1 000 zł") albo usunąć.

### F-04 [High] Brak stron lokalnych i usługowych; "Leszno" występuje tylko w meta keywords
**Dowód:** serwis ma 4 publiczne URL-e (home, partnerzy, EN x2). Meta keywords strony głównej zawierają **78 fraz, z czego 60 geograficznych** (18 miejscowości: Leszno, Poznań, Wrocław, Kalisz, Głogów, Rawicz, Kościan, Gostyń, Śrem, Góra, Wschowa, Rydzyna, Osieczna, Bojanowo, Poniec, Krobia, Jutrosin, Miejska Górka; `lang/pl/home.php:16-45`, wstrzykiwane w `HomeController.php:29`). `<title>`, `<h1>` ("Tworzymy strony WWW dla ambitnych.") i meta description nie zawierają żadnego sygnału lokalnego. Google od 2009 r. ignoruje meta keywords, więc te 60 fraz nie daje żadnej widoczności lokalnej, a długa lista miejscowości to klasyczny sygnał keyword stuffingu dla innych systemów.
Benchmark konkurencji (wyniki Brave, 2026-10-11, pozycje ~5-25 dla "agencja interaktywna Leszno"): SeoHeroes, SEOSEM24, M16, Alte Media, Shade Media, Candyweb, Webtom, adStone, Kompozycja, ComputerSoft, Agitacja, VDY, Oferteo. **Każdy ma dedykowaną podstronę z miastem w URL i tytule.** Netizo nie ma żadnej strony, która mogłaby się rankować na te frazy. Zgodnie z danymi Whitespark 2026 dedykowane strony usług są czynnikiem #1 lokalnego rankingu organicznego i #2 widoczności w AI.
**Rekomendacja:** (1) usunąć `SEOMeta::addKeyword(...)` (`HomeController.php:29`) i tablicę `keywords` (`lang/pl/home.php:16-45`, odpowiednio EN i `partners.php`); (2) wdrożyć model stron z F-05; (3) naprawić martwe linki stopki (`site.ts:60-73`), bo `/utrzymanie` mogłaby być pierwszą stroną usługową.

### F-05 [High] Strategia stron lokalnych: ryzyko doorway pages i bezpieczny model
**Ocena ryzyka:** tworzenie ~18 podstron miast (np. "Tworzenie stron Rawicz", "Programista Miejska Górka") z tym samym szablonem i podmienioną nazwą miejscowości to dokładnie wzorzec doorway pages z wytycznych Google (spam policies) oraz sygnał dla Helpful Content. Netizo nie ma w tych miastach ani biura, ani (z tego co widać na stronie) lokalnych klientów, więc brakuje podstaw do unikalnej treści. Test zamiany ("swap test"): jeśli po podmianie nazwy miasta strona czyta się tak samo, jest doorway. Dla miejscowości pokroju Krobia, Jutrosin, Poniec nie da się go przejść uczciwie.
**Proponowany model (warstwowy, od najbezpieczniejszego):**
1. **Warstwa 1: strony usług ogólnopolskich (priorytet #1).** `/uslugi/strony-internetowe`, `/uslugi/sklepy-internetowe`, `/uslugi/aplikacje-webowe`, `/uslugi/utrzymanie` (zastępuje dziś martwe `/utrzymanie`), z unikalną treścią: zakres, ceny/widełki z FAQ, proces, case studies, FAQ per usługa. Każda z fragmentem "Leszno i okolice" w treści i `areaServed` w schema `Service`.
2. **Warstwa 2: jedna strona-hub dla realnej lokalizacji.** `/strony-internetowe-leszno` (lub `/agencja-interaktywna-leszno`): realne dane (NAP, godziny, mapa/link GBP, zespół, możliwość spotkania), lokalni klienci i realizacje z regionu, opinie, dojazd/spotkania, linki do usług. To jedyna strona, która ma prawo używać nazwy miasta w tytule i H1.
3. **Warstwa 3: strony regionalne tylko tam, gdzie jest dowód.** Maksymalnie 3-5 na start (np. Rawicz, Kościan, Gostyń, Poznań), każda wyłącznie jeśli spełnia: ≥60-70% treści unikalnej, minimum jedna prawdziwa realizacja/klient z tego miasta lub regionu, lokalne dane (branże, specyfika rynku, konkretne ustalenia o spotkaniach), opinia, własne FAQ. Pozostałe miejscowości (Krobia, Jutrosin, Poniec, Miejska Górka…) obsłużyć wyłącznie jako lista tekstowa "Obsługujemy też…" na stronie-hubie, bez osobnych URL.
4. **Duże miasta (Poznań, Wrocław, Kalisz, Głogów)** nie sugerować lokalnego biura: strony typu "Realizacje dla firm z Poznania" oparte na realnych projektach i pracy zdalnej, nie "agencja interaktywna Poznań" bez obecności. Wysoka konkurencja i zasada proximity ograniczają efekt.
5. Linkowanie wewnętrzne: hub ↔ usługi ↔ case studies ↔ regionalne, w nawigacji (obecnie brak podstron), canonical self-referencing, wpis do `public/sitemap.xml` (statyczny; usunąć też adresy z fragmentami `#`).
6. Case studies jako osobne URL-e (dziś tylko dialog, `case-study-dialog.tsx`): m.in. Treepro ("74 miejscowości w zasięgu", wprost projekt "Local SEO") to najmocniejszy, już istniejący dowód kompetencji lokalnych, bez własnego URL i bez schema.

### F-06 [High] Brak opinii i dowodów społecznych na stronie; opinie Google niezweryfikowane
**Dowód:** w widocznym tekście i danych Inertia (`props`) 0 trafień na "opini", "recenz", "testimon"; sekcja "Zaufali nam" to wyłącznie logotypy/nazwy 8 klientów (treepro.pl, vetly.pl, leasingodreki.pl, krainamt2.pl, lavaforyou.is, temar-mt.pl, energizo.pl, nakazdaokazje.pl). Brak `aggregateRating`/`Review` w JSON-LD. Panorama Firm: rekord "Netizo Kamil Nawrot" ma 0 opinii. Opinie Google, Oferteo, Clutch, Sortlist, GoodFirms: **niezweryfikowane** (blokady, patrz sekcja ograniczeń). Tempo zdobywania opinii (velocity) i odsetek odpowiedzi: nie do oceny.
Uwaga: statystyki "150+ projektów, 8 lat doświadczenia" są w opisie, ale bez źródła; nie zastępują opinii.
**Rekomendacja:**
1. Po założeniu GBP (F-01) poprosić 8-10 obecnych klientów o opinie Google (krótki link `g.page/r/…`), cel: stały rytm 2-4 opinii miesięcznie. Zdarzały się spadki rankingu po przerwie w opiniach (studium przypadku Sterling Sky 2025, 18 dni; to ilustracja, nie próg), więc liczy się regularność.
2. Dodać 3-5 prawdziwych cytatów z imieniem, firmą, zdjęciem/logo i linkiem do realizacji jako treść strony.
3. Nie dodawać własnego `aggregateRating` do `ProfessionalService` bez niezależnego źródła: Google ignoruje "self-serving reviews" dla LocalBusiness/Organization, a fałszywe lub niepodparte oceny grożą działaniem ręcznym. Poprawnie, że ich dziś nie ma.
4. Założyć profile B2B z opiniami (Clutch, GoodFirms, Sortlist, Oferteo) i odpowiadać na każdą opinię.

### F-07 [Medium] E-mail zaciemniony przez Cloudflare Email Obfuscation; widoczny dla botów jako "[email protected]"
**Dowód:** w `home-pl.html` 2 wystąpienia `data-cfemail` oraz 2 linki `/cdn-cgi/l/email-protection#…`; tekst linku w SSR HTML to `[email&#160;protected]`, np. `<span class="__cf_email__" data-cfemail="066d…">[email protected]</span>` (stopka) oraz `href="/cdn-cgi/l/email-protection#d4bf…"` (sekcja kontaktu). Dotyczy też `partners-pl.html`/`partners-en.html`. Crawlery i agenci AI bez wykonania JS (a część z nich nie wykonuje) widzą "[email protected]" zamiast adresu, a `mailto:` nie jest czystym linkiem. Źródło w kodzie: `site.ts:9`, użycia w `site-footer.tsx:85`, `contact-section.tsx:112`, `site-header.tsx:309`. Cloudflare modyfikuje wynikowy HTML, więc to ustawienie w panelu, nie błąd Laravela.
**Rekomendacja:** wyłączyć "Email Address Obfuscation" w Cloudflare (Scrape Shield) dla domeny albo wykluczyć ścieżki regułą; dodatkowo powtórzyć adres w JSON-LD (`email`), by NAP był czytelny w danych strukturalnych.

### F-08 [Medium] Cytowania: brak obecności w testowanych katalogach, rekord-imiennik w Kępnie, niejednoznaczność nazwy marki
**Dowód (2026-10-11):**
- **pkt.pl:** brak wyników dla "netizo" (po dodaniu lokalizacji Leszno wyszukiwarka sama poprawia na "netico").
- **firmy.net:** brak wyników.
- **Panorama Firm:** 1 rekord "**Netizo Kamil Nawrot**", ul. Wiosny Ludów 12 lok. 8, 63-600 **Kępno**, kategoria "Brak klasyfikacji", 0 opinii, brak telefonu/www/e-mail, z numerem NIP (rekord wygenerowany z rejestru). **Nie ustalono, czy to ten sam podmiot co netizo.pl.** Jeśli tak: adres rejestrowy (Kępno) jest sprzeczny z "Leszno" w JSON-LD i FAQ, więc NAP trzeba ujednolicić (albo uzasadnić na stronie). Jeśli nie: to imiennik, a cytowania/rekordy będą się mieszać.
- **Aleo, Clutch, GoodFirms, Sortlist (wyszukiwarki):** HTTP 403. Bezpośrednie adresy `clutch.co/profile/netizo` i `sortlist.pl/agency/netizo`: 404 (sugeruje brak profili pod tymi slugami, ale nie jest to dowód wyczerpujący). **Status: niezweryfikowany.**
- **Oferteo:** w wynikach dla "agencja interaktywna Leszno" listing zawiera inne firmy z Leszna (m.in. Netsolution); Netizo w wynikach nie wystąpiło.
- **Profile społecznościowe:** Instagram istnieje (bio: "Tworzymy strony WWW dla ambitnych. Zbudujmy to razem, od pomysłu do wdrożenia. Opieka techniczna, SEO i optymalizacja…", w widocznej części brak adresu/Leszna). Facebook `facebook.com/netizo.agency` i TikTok: niezweryfikowane (ściana cookies / render JS). Linki są w stopce i w `sameAs`.
- **Niejednoznaczność marki:** zapytania "netizo.pl" i `"Netizo" Leszno` w Brave zwróciły głównie `netizo.in` (agencja cyfrowa z Indii, "since 2017"), szablony PowerPoint Netizo (Envato, Creative Market), domenę netizo.com na sprzedaż; **żadnej strony z domeny netizo.pl w indeksie Brave** (zapytanie `site:netizo.pl`: "zbyt mało dopasowań"). To dane z Brave, nie z Google, więc nie dowodzą nieindeksowania w Google, ale wskazują na słabą rozpoznawalność encji.
**Rekomendacja:** (1) sprawdzić w CEIDG/KRS dane firmy, ustalić jedną nazwę prawną i jeden adres, potem zgodnie z nimi uzupełniać wszystkie katalogi; (2) przejąć/zaktualizować rekord Panorama Firm (kategoria "Strony internetowe / Agencje interaktywne", telefon, www, opis); (3) założyć lub przejąć: GBP, Bing Places, Apple Business Connect, pkt.pl, Aleo (przejęcie profilu z CEIDG), Oferteo (konkurenci z Leszna mają tu oceny), Clutch/GoodFirms/Sortlist (B2B zdalnie, po zebraniu min. 3 opinii), LinkedIn Company, Facebook z kategorią i adresem; (4) w każdym używać dokładnie tej samej nazwy, adresu i numeru; (5) odróżniać markę od netizo.in przez `legalName`, "Netizo Leszno", `sameAs` i spójne profile.

### F-09 [Medium] Brak mapy, linku do profilu GBP i informacji o dojeździe/spotkaniach
**Dowód:** 0 iframe Maps i 0 linków do map na 4 stronach (`raw/*.html`). Brak `hasMap` w schema. Kontakt (`contact-section.tsx`) to formularze + e-mail + telefon.
**Rekomendacja:** po założeniu GBP dodać w kontakcie przycisk "Zobacz w Google Maps" / "Zostaw opinię" oraz `hasMap` w JSON-LD. Jeśli adres ma pozostać ukryty (SAB), nie osadzać mapy z pinezką, tylko zaznaczyć "Spotykamy się w Lesznie i okolicach" i opisać obszar tekstowo. Jeśli biuro jest publiczne, osadzić mapę leniwie (`loading="lazy"`), uwzględniając CSP (`SecurityHeaders`: dopisać `frame-src` dla `www.google.com`).

### F-10 [Medium] Mało sygnałów lokalnych w treści strony głównej
**Dowód:** poza jednym pytaniem FAQ brak wzmianek o Lesznie/regionie w hero, usługach, stopce, tytule, H1, description. Pozytyw: sam FAQ ("Czy pracujecie tylko z firmami z Leszna?") jest dobrą, naturalną odpowiedzią. W FAQ o widoczności w Google jest też zdanie o "pozycjonowaniu, także lokalnym" (`lang/pl/home.php:59`), a oferta lokalnych usług SEO nie ma żadnej strony.
**Rekomendacja:** (1) w stopce dodać "Netizo, Leszno, wielkopolskie" jako element NAP; (2) w opisie meta/`organization_description` dodać frazę "z Leszna" (`lang/pl/home.php:11,13`) bez zmiany pozycjonowania ogólnopolskiego; (3) nagłówek sekcji FAQ lub kontaktu z odniesieniem do regionu; (4) ewentualnie H2 z "Leszno i okolice" w sekcji kontaktu z krótkim opisem spotkań na miejscu.

### F-11 [Low] Drobne braki w `ProfessionalService` i `sameAs`
**Dowód:** `image` wskazuje na grafikę OG zamiast logo; `sameAs` obejmuje FB/IG/TikTok (Discord nie jest ustawiony w produkcji), brak LinkedIn, GBP, katalogów; strona partnerów ma tylko `WebPage` (`PartnerProgramController.php:36-41`) bez odwołania `publisher`/`about` do encji organizacji.
**Rekomendacja:** po ustaleniu `@id` (F-03) dodać `publisher: {"@id": "https://netizo.pl/#organization"}` do `WebPage` strony partnerów i `WebSite` z tym samym wydawcą.

### F-12 [Low] Linki zewnętrzne i autorytet lokalny
**Dowód:** strona linkuje na zewnątrz do 6 stron klientów (treepro.pl, temar-mt.pl, nakazdaokazje.pl, leasingodreki.pl, krainamt2.pl, energizo.pl). Linki przychodzące i lokalne wzmianki nie były oceniane w tym module (patrz moduł backlinków); w Brave nie znaleziono żadnej strony wskazującej na netizo.pl w testowanych zapytaniach (ograniczona próba, jednego indeksu).
**Rekomendacja:** (1) poprosić klientów z regionu o "stopkę wykonawcy" z linkiem brandowym ("Netizo", nie "strony internetowe Leszno" — dokładne dopasowanie kotwicy w stopkach to ryzyko linków nienaturalnych); (2) lokalne źródła: izba gospodarcza/stowarzyszenia przedsiębiorców w regionie, lokalne portale i media z Leszna, katalogi (F-08), wypowiedzi eksperckie; (3) wzmianki w media o realizacjach regionalnych.

### F-13 [Info] Czynniki poza zasięgiem i zakres weryfikacji
- Bliskość (proximity) i konkurencja (ok. 12 agencji z Leszna z dedykowanymi stronami) są stałymi, na które strona nie ma wpływu.
- Przy braku GBP i opinii "local pack" jest dla Netizo praktycznie niedostępny, więc najszybszy zysk jest w F-01 i F-04.

## 4. Lista kontrolna GBP (wykryte vs brakujące)

| Element | Status na stronie / w audycie |
|---|---|
| Profil GBP istnieje | **niezweryfikowane** (CAPTCHA Google, consent Maps) |
| Link do GBP na stronie / w `sameAs` | brak |
| Maps embed | brak |
| Główna kategoria / kategorie dodatkowe | niezweryfikowane |
| Opinie Google (liczba, ocena, tempo, odpowiedzi) | niezweryfikowane |
| Zdjęcia, posty, Q&A, usługi w profilu | niezweryfikowane |
| Spójność NAP strona ↔ GBP | niemożliwa do oceny (brak adresu na stronie) |
| Przycisk "Zostaw opinię" | brak |
| UTM na linku strony w GBP | niezweryfikowane |

## 5. Zdrowie opinii (snapshot)

Ocena, liczba, velocity, odsetek odpowiedzi: **brak danych publicznych / niezweryfikowane**. Na stronie: 0 opinii, 0 cytatów, 0 `aggregateRating`. Panorama Firm: 0 opinii (rekord Kępno).

## 6. Top 10 działań (priorytety)

1. **[Critical]** Zweryfikować/założyć i w pełni uzupełnić GBP (SAB), dobrać główną kategorię po analizie konkurencji z Leszna (F-01).
2. **[High]** Uzupełnić NAP na stronie: pełna nazwa prawna, miejscowość, kod, NIP/REGON, godziny; stopka + `/kontakt` (F-02).
3. **[High]** Rozbudować JSON-LD `ProfessionalService`: `@id`, `telephone`, `email`, `logo`, pełny `address`, godziny, `areaServed` jako lista miast/GeoCircle, `legalName`, `hasOfferCatalog` (F-03).
4. **[High]** Naprawić 404 w stopce i dodać strony usług (`/uslugi/...`, `/utrzymanie`, `/regulamin`, `/polityka-prywatnosci`) (F-04).
5. **[High]** Wdrożyć model stron lokalnych: hub Leszno + 3-5 stron regionalnych z dowodami; nie tworzyć 18 podstron miast (F-05).
6. **[High]** Zebrać opinie Google od klientów i dodać 3-5 prawdziwych cytatów na stronie (F-06).
7. **[Medium]** Wyłączyć Cloudflare Email Address Obfuscation (F-07).
8. **[Medium]** Rozstrzygnąć rekord "Netizo Kamil Nawrot" (Kępno), ujednolicić dane i założyć profile w katalogach: Panorama Firm, pkt.pl, Aleo, Oferteo, Bing Places, Apple Business Connect, Clutch/GoodFirms/Sortlist (F-08).
9. **[Medium]** Dodać link do GBP/mapy ("Zostaw opinię", `hasMap`) i sygnały lokalne w tytule/description/stopce (F-09, F-10).
10. **[Low]** Usunąć meta keywords (60 fraz miejscowości), poprawić `priceRange`, `image`→`logo`, `sameAs`, `publisher` na stronie partnerów (F-04, F-11).

## 7. Co działa dobrze

- Telefon i e-mail spójne na wszystkich 4 stronach, telefon jako klikalny `tel:+48884343924`, w stopce, w kontakcie i w oknie "Zadzwońcie do mnie".
- Poprawny podtyp schema (`ProfessionalService`), `addressLocality: Leszno`, `addressRegion`, `areaServed` (Polska), `knowsLanguage`, `sameAs` zgodne ze stopką; brak fałszywego `aggregateRating`.
- Uczciwa, naturalna komunikacja modelu hybrydowego w FAQ (Leszno i okolice na miejscu, reszta zdalnie).
- Treść w SSR (widoczna dla botów bez JS), hreflang PL/EN, canonical, szybkie TTFB.
- Case study "Treepro.pl / Local SEO" jako wiarygodny dowód kompetencji w SEO lokalnym (do rozwinięcia na osobny URL).
- Obietnica czasu odpowiedzi (24 h) widoczna w hero, FAQ i formularzu.

## 8. Ograniczenia (czego nie dało się ocenić)

- **Google SERP:** CAPTCHA (automatyczny ruch). **Google Maps:** przekierowanie na `consent.google.com`. Brak dostępu do GBP API, GSC, DataForSEO, BrightLocal/Whitespark. Nie oceniono pozycji w local pack, opinii Google, kategorii GBP, zdjęć, postów, Q&A.
- **Brave Search** (jedyne działające źródło wyszukiwania) po 5 zapytaniach włączył limit (CAPTCHA); to inny indeks niż Google. Obserwacje z Brave (brak netizo.pl, obecność netizo.in) traktować jako wskazówki.
- **Aleo, Clutch, GoodFirms, Sortlist:** HTTP 403 dla wyszukiwarek; profile niezweryfikowane. **Facebook:** ściana cookies, profil niezweryfikowany. **TikTok:** niezweryfikowany.
- Powiązanie rekordu "Netizo Kamil Nawrot" (Kępno) z właścicielem netizo.pl: **nieustalone**.
- Linki przychodzące i autorytet domeny: poza zakresem tego modułu.
- Nie sprawdzano fizycznego miejsca/zespołu, godzin pracy, wymogów prawnych (wymaga weryfikacji prawnej).

## Ocena kategorii

| Wymiar | Waga | Ocena (0-100) | Punkty |
|---|---|---|---|
| Sygnały GBP | 25% | 10 | 2,5 |
| Opinie i reputacja | 20% | 5 | 1,0 |
| Lokalne on-page SEO | 20% | 30 | 6,0 |
| Spójność NAP i cytowania | 15% | 25 | 3,75 |
| Lokalne dane strukturalne | 10% | 30 | 3,0 |
| Lokalne linki i autorytet | 10% | 15 | 1,5 |
| **Razem** | | | **≈ 18 / 100** |

**Ocena kategorii: 18/100.** Strona ma poprawne podstawy (telefon, e-mail, typ `ProfessionalService`, wzmianka o Lesznie w FAQ), ale praktycznie nie ma warstwy lokalnej: brak adresu, NIP, godzin, mapy, opinii, stron lokalnych i usługowych oraz niezweryfikowany GBP, a 60 fraz z miastami w ignorowanym przez Google meta keywords nie zastępuje żadnej realnej strony lokalnej.
