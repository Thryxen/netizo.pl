# Audyt on-page SEO — https://netizo.pl

Data: 2026-10-11. Zakres: `/`, `/partnerzy`, `/en`, `/en/partners` (HTML SSR z `raw/`). Pomiary: `parse_html.py`, własny parser BeautifulSoup (pełna lista `<a>` z fragmentami, nagłówki H1–H6 w kolejności), szerokość w px (Arial: 20 px dla title, 14 px dla description, przybliżenie SERP desktop), `metadata_template.py`.

## Title i meta description

| Strona | Title | Znaki | px (Arial 20) | Description: znaki / px (Arial 14) | Ucięcie (~920 px) |
|---|---|---|---|---|---|
| `/` | Tworzymy Strony WWW dla Ambitnych Firm \| Netizo | 47 | 468 | 203 / 1309 | po „React, Next.js, Lar…” (143 zn.) |
| `/partnerzy` | Program partnerski: 15% prowizji za polecenie \| Netizo | 54 | 484 | 177 / 1093 | po „…przez 12 miesięcy. B…” |
| `/en` | Websites and Web Apps for Ambitious Companies \| Netizo | 54 | 521 | 214 / 1390 | po „…speed and SEO as standard” |
| `/en/partners` | Partner Program: 15% Commission per Referral \| Netizo | 53 | 501 | 171 / 1072 | po „…No fees ” |

`metadata_template.py` (4 pary): `site_risk: low`, `templated_ratio: 0.0`, `shared_cta_phrases: {}`, brak `templated_metadata`. Flaga `brand_suffix_in_description` na obu stronach partnerskich to **fałszywy alarm**: „Polecaj Netizo firmom…” / „Refer Netizo to companies…” to naturalne zdania, w których marka jest dopełnieniem.

### O1. Meta description za długie, CTA i wyróżniki ucięte w SERP
- **Ważność:** High
- **Dowód:** PL home 203 zn. / 1309 px, EN home 214 zn. / 1390 px. Google pokaże około 140–150 zn. na desktopie i ~105 na mobile, więc „150+ projektów, 8 lat doświadczenia. Bezpłatna wycena!” nie będzie widoczne. Opis zaczyna się od ogólnika „Profesjonalne tworzenie stron…”. Strony partnerskie: 177/171 zn., ucinają „Bez opłat i bez limitu poleceń”.
- **Rekomendacja:** skrócić do ≤ 155 zn. z wyróżnikiem i CTA w pierwszych ~110 zn.
  - `lang/pl/home.php:11`, np. „Strony internetowe, sklepy i aplikacje webowe dla firm z Leszna i całej Polski. Projekt, wdrożenie i opieka. Bezpłatna wycena w 24 h.” (~140 zn.)
  - `lang/en/home.php:10` analogicznie.
  - `lang/pl/partners.php:11` i `lang/en/partners.php:10`: skrócić do ~150 zn.

### O2. Title Case w tytułach wbrew zasadzie sentence case; title PL bez frazy głównej i lokalizacji
- **Ważność:** Medium
- **Dowód:** „Tworzymy **S**trony **WWW** dla **A**mbitnych **F**irm” (`lang/pl/home.php:10`). Wielkie litery w środku polskiego zdania są niepoprawne i sprzeczne z CLAUDE.md („Sentence case copy in both languages”). To samo w EN: „Websites and **W**eb **A**pps for **A**mbitious **C**ompanies” (`lang/en/home.php:9`) i „Partner **P**rogram: 15% **C**ommission per **R**eferral” (`lang/en/partners.php:9`). PL partnerzy są poprawni, więc serwis jest niespójny. Title PL nie zawiera frazy „tworzenie stron internetowych” / „strony internetowe” ani „Leszno”, a „Ambitnych Firm” nie ma wartości wyszukiwawczej. Te same tytuły trafiają do `og:title` i `twitter:title`.
- **Rekomendacja:**
  - PL: „Strony internetowe i aplikacje webowe dla firm – Leszno | Netizo” (64 zn., ~569 px).
  - EN: „Websites and web apps for growing companies | Netizo” (52 zn.).
  - EN partnerzy: „Partner program: 15% commission per referral | Netizo”.
  - Testy, które sprawdzają tytuł (np. `HomePageTest`, `PartnerProgramPageTest`), zaktualizować razem z copy.

### O3. Meta keywords: upychanie 78 fraz z 18 miejscowościami
- **Ważność:** Medium
- **Dowód:** `/` ma `<meta name="keywords">` o długości 1 455 zn. i 78 frazach (w briefie oszacowano ~90): 18 miejscowości (Leszno, Poznań, Wrocław, Kalisz, Głogów, Rawicz, Kościan, Gostyń, Śrem, Góra, Wschowa, Rydzyna, Osieczna, Bojanowo, Poniec, Krobia, Jutrosin, Miejska Górka) × „programista X” / „tworzenie stron X” / „strony internetowe X” (`lang/pl/home.php:16-45`). Druga, podobna lista jest w domyślnych ustawieniach `config/seotools.php` (`meta.defaults.keywords`, ok. l. 18–45). Google ignoruje ten tag. Bing traktował nadmiarowe keywords jako sygnał niskiej jakości. Lista jest też publicznie widoczna dla konkurencji, a żadna z tych miejscowości nie występuje w treści strony.
- **Rekomendacja:** usunąć `SEOMeta::addKeyword(...)` (`app/Http/Controllers/HomeController.php:29`) i listy keywords w obu plikach `lang/*/home.php`, `lang/*/partners.php` oraz w `config/seotools.php`. Zasięg lokalny opisać treścią, czyli jedną stroną lokalną i `areaServed` w JSON-LD (lista realnie obsługiwanych miast).

## Nagłówki H1–H6

Wszystkie 4 strony mają **dokładnie jeden H1** (`#hero-heading`) i poprawną hierarchię H1 → H2 → H3 bez przeskoków poziomów. H4–H6 nie występują.

| Strona | H1 | H2 (sekcje treści) | H3 |
|---|---|---|---|
| `/` | Tworzymy strony WWW dla ambitnych. | Co dla Ciebie zbudujemy · Ostatnie wdrożenia · Nasza misja · Zaufali nam · Jak pracujemy · Twój projekt w jednym panelu · Częste pytania · Poleć nas i zyskaj 15% · Newsletter raz w miesiącu · Rozpocznij współpracę (+ stopka: Informacje, Kontakt, Obserwuj nas; baner: Korzystamy z plików cookie) | 6 usług, 5 realizacji, 4 etapy, 6 funkcji panelu, 11 pytań FAQ, krok briefu, „Wolisz porozmawiać?” |
| `/partnerzy` | Polecasz nas, dostajesz 15% od każdego zamówienia. | Jak to działa · Policz swoją prowizję · Dla kogo jest program · Zasady programu · Częste pytania · Dołącz do programu (+ stopka, baner) | 4 kroki, kalkulator, 6 grup odbiorców, 9 pytań FAQ |
| `/en` | We build websites for the ambitious. | lustrzane do PL | lustrzane |
| `/en/partners` | Refer us, earn 15% of every order. | lustrzane do PL („Common questions”) | lustrzane |

Uwaga: `parse_html.py` zwraca H1 jako „Tworzymystrony WWWdla ambitnych.”, bo skleja spany. W surowym HTML spacje między liniami `SplitLines` są, więc to artefakt narzędzia, nie błąd strony.

### O4. Nagłówki sekcji bez fraz wyszukiwanych; Title Case w H3
- **Ważność:** Medium
- **Dowód:** H2 mają charakter brandowy i nie niosą tematu: „Co dla Ciebie zbudujemy”, „Ostatnie wdrożenia”, „Zaufali nam”, „Jak pracujemy”. Fraz „strony internetowe”, „sklep internetowy”, „aplikacje webowe”, „Leszno” nie ma w żadnym H2. H3 „AI & Automatyzacja”, „DevOps & Cloud” (`resources/js/components/home/services-section.tsx:42,52`) są w Title Case z ampersandem. W stopce 3 generyczne H2 i H2 banera cookies poza `<main>` (drobne, ok. dla dostępności).
- **Rekomendacja:** zachować ton, ale dopisać temat, np. „Co dla Ciebie zbudujemy: strony, sklepy i aplikacje” (`services-section.tsx:28`), „Realizacje: ostatnie wdrożenia” (`projects-section.tsx:15`). H3 zmienić na „AI i automatyzacja”, „DevOps i chmura”. H1 może zostać, ale lead pod nim (`hero.tsx:49`) warto wzbogacić o „strony internetowe… z Leszna dla firm z całej Polski”.

## Linkowanie wewnętrzne

Linki `<a>` na stronę: `/` 48 (13 fragmentów #), `/partnerzy` 27 (12 fragmentów), `/en` 48, `/en/partners` 27.

### O5. Linki do 404 w stopce na każdej stronie
- **Ważność:** High
- **Dowód:** `/utrzymanie`, `/regulamin`, `/polityka-prywatnosci` dają 3 martwe linki × 4 strony = 12 wystąpień. Na EN oznaczone „pl (in Polish)” + `hreflang="pl"`, czyli kierują do nieistniejącej strony polskiej. Źródło: `resources/js/lib/site.ts:63-65` (PL) i `:69-71` (EN).
- **Rekomendacja:** utworzyć strony (patrz content C1/C4) albo do tego czasu usunąć pozycje z `infoLinks`.

### O6. Płaska architektura: nawigacja to same kotwice, brak stron docelowych dla linkowania
- **Ważność:** Medium
- **Dowód:** menu strony głównej to `#uslugi`, `#projekty`, `#proces`, `#faq`, `#kontakt` (EN: `#services`…). Jedyne linki do innych URL to `/partnerzy` („Zostań partnerem”, „Program partnerski”), przełącznik języka i 404 ze stopki. Logo na stronie głównej ma `href="#"` (2×). Strona partnerska linkuje do `/` wyłącznie logotypem (`aria-label="Netizo – strona główna"`, bez tekstu), a jej menu też składa się z kotwic. `public/sitemap.xml` zawiera 4 adresy z fragmentem (`/#stack`, `/#projekty`, `/#faq`, `/#kontakt`; `#stack` nie istnieje). Google traktuje je jako `/`, więc nic nie wnoszą.
- **Rekomendacja:** po utworzeniu podstron usług i realizacji dodać je do menu jako prawdziwe URL (np. „Usługi” → `/strony-internetowe`… lub `/uslugi`) i linkować kontekstowo z kafli usług (CTA „Rozpocznij” → „Więcej o sklepach internetowych”) i kart realizacji („Zobacz case study” → `/realizacje/{slug}`). Na `/partnerzy` dodać tekstowy link do strony głównej, np. w stopce „Strona główna” albo w treści „zobacz nasze realizacje”. Z sitemap usunąć adresy z `#`.

### O7. Anchor texty zanieczyszczone tekstami pomocniczymi
- **Ważność:** Low
- **Dowód:** przełącznik języka ma anchor „English en English” / „Polski pl Polski” (3 warianty responsywne w jednym `<a>`). CTA partnerskie: „Dołącz Dołącz do programu” / „Join Join the program”. Linki zewnętrzne: „treepro.pl (otwiera się w nowej karcie)”, bo `sr-only` jest w anchorze (`resources/js/components/home/external-link.tsx:15-24`). Dla dostępności to poprawne, dla SEO drobny szum.
- **Rekomendacja:** warianty niewyświetlane oznaczać `aria-hidden` i zostawić jeden pełny tekst albo użyć `aria-label` z jedną nazwą. Akceptowalne bez zmian.

## Linki zewnętrzne (realizacje klientów)

### O8. Linki do klientów: poprawne `rel`, ale `noreferrer` ukrywa Netizo przed klientami; duplikaty z marquee
- **Ważność:** Info
- **Dowód:** treepro.pl, leasingodreki.pl, krainamt2.pl, temar-mt.pl, energizo.pl, nakazdaokazje.pl mają po 3 linki (18 łącznie, kopie marquee są `aria-hidden` + `inert`). Wszystkie mają `target="_blank" rel="noopener noreferrer"`, bez `nofollow`. Dla linków redakcyjnych do portfolio to właściwe. `vetly.pl` i `lavaforyou.is` są bez linku (`url: null`). Karty realizacji (H3) nie linkują do wdrożeń w treści, domena jest tylko w podglądzie i dialogu. `noreferrer` sprawia, że klienci nie widzą ruchu z netizo.pl w swojej analityce.
- **Rekomendacja:** dla klientów rozważyć `rel="noopener"` (bez `noreferrer`), jak przy panelu klienta (`resources/js/components/home/clients-section.tsx:115`). Zadbać o link zwrotny „Realizacja: Netizo” w stopkach stron klientów (temat do działu backlinków). Na przyszłych stronach realizacji dawać link opisowy, np. „Zobacz wdrożenie treepro.pl”.

## Obrazy

### O9. Atrybuty alt
- **Ważność:** Info
- **Dowód:** na `/` 22 `<img>`, z czego 17 ma `alt=""`. Są to dekoracyjne zdjęcia scen (backdrop, shop, mission, contact), więc puste alt jest poprawne. 5 zrzutów realizacji ma opisowe alt („Zrzut ekranu strony Treepro.pl”). Na `/partnerzy` 2 zdjęcia z `alt=""`. Nazwy plików realizacji to ULID (`01KWVJR4J217JBZ7JR3Q8YXB2R.webp`).
- **Rekomendacja:** w `App\Services\ImageOptimizer` dodać slug projektu do nazwy pliku (np. `treepro-pl-01KWVJ….webp`). Alt zrzutów może opisywać zawartość („Strona główna Treepro.pl z ofertą wycinki drzew”).

## Spójność PL/EN i metadanych

### O10. Rozbieżności copy i metadanych między wersjami
- **Ważność:** Low
- **Dowód:**
  - EN: H2 FAQ „Frequently asked questions” (`/en`) vs „Common questions” (`/en/partners`, `resources/js/components/partners/partner-faq-section.tsx:21`).
  - Title Case tylko w części tytułów (O2).
  - EN FAQ 10 zawiera twierdzenie „from abroad… in Polish or English”, którego nie ma w PL.
  - `og:description` home to skrócona wersja (`share_description`, 120/97 zn.), a na partnerach jest identyczna z meta (OK).
  - Canonical, hreflang (pl/en/x-default) i `og:locale`/`og:locale:alternate` są poprawne i wzajemne na wszystkich 4 stronach.
  - JSON-LD FAQ zawiera U+2060 w zakresach liczbowych (`app/Http/Controllers/Controller.php:17-32`).
- **Rekomendacja:** ujednolicić nazwę sekcji FAQ, wyrównać twierdzenia. W `faqSchema()` usuwać `\u{2060}` z tekstu odpowiedzi.

## Co działa dobrze
- Jeden H1 na stronę, logiczna hierarchia H2/H3, nagłówki z `id` i `aria-labelledby`, FAQ jako H3 z pełnymi pytaniami.
- Długość tytułów 47–54 zn. (468–521 px) mieści się w limicie. Każda strona ma unikalny title, description i OG image. Brak szablonowych metadanych (`templated_ratio 0.0`).
- Poprawne canonical (bez slasha, `utm` → kanoniczny), wzajemne hreflang z `x-default`, `<html lang>` zgodny z wersją.
- `FAQPage` JSON-LD 1:1 z widoczną treścią (jedno źródło w `lang/*/home.php`, `lang/*/partners.php`).
- Linki zewnętrzne z `noopener`, informacja o nowej karcie dla czytników ekranu, decorative `alt=""`.

## Ocena kategorii

**On-Page SEO: 57/100.** Fundamenty techniczne on-page są solidne: jeden H1, poprawna hierarchia, unikalne tytuły, canonical i hreflang. Punkty tracą 12 martwych linków w stopce, za długie opisy z uciętym CTA, Title Case i brak frazy głównej i lokalizacji w title, upychanie 78 fraz w meta keywords oraz płaska architektura linkowania z samych kotwic.

```json
{
  "category": "On-Page SEO",
  "score": 57,
  "metadata_template": {"site_risk": "low", "templated_ratio": 0.0, "shared_cta_phrases": {}, "note": "brand_suffix_in_description na /partnerzy i /en/partners = false positive"},
  "findings": [
    {"id": "O1", "severity": "high", "title": "Meta description 171–214 zn., CTA ucięte", "files": ["lang/pl/home.php:11", "lang/en/home.php:10", "lang/pl/partners.php:11", "lang/en/partners.php:10"]},
    {"id": "O5", "severity": "high", "title": "3 linki do 404 w stopce na 4 stronach", "files": ["resources/js/lib/site.ts:63-65", "resources/js/lib/site.ts:69-71"]},
    {"id": "O2", "severity": "medium", "title": "Title Case w title, brak frazy głównej i Leszna", "files": ["lang/pl/home.php:10", "lang/en/home.php:9", "lang/en/partners.php:9"]},
    {"id": "O3", "severity": "medium", "title": "Meta keywords: 78 fraz, 18 miejscowości", "files": ["lang/pl/home.php:16-45", "config/seotools.php", "app/Http/Controllers/HomeController.php:29"]},
    {"id": "O4", "severity": "medium", "title": "H2 bez fraz tematycznych, Title Case w H3", "files": ["resources/js/components/home/services-section.tsx:28,42,52", "resources/js/components/home/projects-section.tsx:15"]},
    {"id": "O6", "severity": "medium", "title": "Nawigacja z samych kotwic, fragmenty w sitemap", "files": ["resources/js/lib/sections.ts", "public/sitemap.xml"]},
    {"id": "O7", "severity": "low", "title": "Zanieczyszczone anchor texty", "files": ["resources/js/components/home/external-link.tsx:15-24", "resources/js/components/home/language-switcher.tsx"]},
    {"id": "O8", "severity": "info", "title": "noreferrer na linkach do klientów, duplikaty marquee", "files": ["resources/js/components/home/clients-section.tsx:115"]},
    {"id": "O9", "severity": "info", "title": "Alt i nazwy plików zrzutów realizacji", "files": ["app/Services/ImageOptimizer.php"]},
    {"id": "O10", "severity": "low", "title": "Rozbieżności PL/EN, U+2060 w JSON-LD", "files": ["resources/js/components/partners/partner-faq-section.tsx:21", "app/Http/Controllers/Controller.php:17-32"]}
  ]
}
```
