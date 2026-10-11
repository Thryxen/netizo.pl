# Pełny audyt SEO — netizo.pl

**Data:** 2026-10-11 · **Zakres:** cały serwis (4 publiczne strony HTML: `/`, `/partnerzy`, `/en`, `/en/partners`) · **Metoda:** crawl + render SSR/Playwright, Lighthouse 13.5 (lab), analiza kodu źródłowego repozytorium, analiza SERP (WebSearch, nie Google), Common Crawl.

**Ograniczenia:** brak danych Google Search Console, CrUX (dane terenowe CWV) i GA4 (brak poświadczeń API), brak Moz/DataForSEO. Wyniki CWV są laboratoryjne. Google SERP i Maps blokowały zapytania (CAPTCHA/consent), więc stan profilu Google Business Profile jest **niezweryfikowany**.

---

## 1. Podsumowanie

### SEO Health Score: **63 / 100**

| Kategoria | Waga | Ocena | Wkład |
|---|---:|---:|---:|
| Technical SEO | 22% | 76 | 16,7 |
| Content Quality | 23% | 48 | 11,0 |
| On-Page SEO | 20% | 57 | 11,4 |
| Schema / dane strukturalne | 10% | 58 | 5,8 |
| Performance (CWV, lab) | 10% | 80 | 8,0 |
| AI Search Readiness (GEO 55 × 60% + Agentic 78 × 40%) | 10% | 64 | 6,4 |
| Images | 5% | 78 | 3,9 |
| **Razem** | | | **63** |

Oceny uzupełniające (poza wzorem, ale istotne dla decyzji): **Local SEO 18**, **SXO (dopasowanie do intencji) 42**, **Sitemap 72**, **Visual/Mobile 82**, **Backlinks — brak danych** (tylko Tier 0).

**Typ biznesu:** agencja interaktywna / software house B2B z Leszna (wielkopolskie), hybryda SAB — lokalnie Leszno i okolice, zdalnie cała Polska; serwis dwujęzyczny PL/EN.

**W skrócie:** technicznie strona jest zrobiona bardzo porządnie (SSR, spójne hreflang/canonical, szybki TTFB, czyste drzewo dostępności, desktop 99–100 w Lighthouse). Problemem nie jest kod, tylko **zaufanie i zasięg tematyczny**: brak polityki prywatności i regulaminu (404), brak danych firmy, opinii i ludzi, tylko 4 adresy URL i zero podstron dopasowanych do fraz, na które firma chce być widoczna. W próbce ~40 wyników dla fraz docelowych netizo.pl nie występuje ani razu.

### Top 5 problemów krytycznych / wysokich

1. **Polityka prywatności, regulamin i „Utrzymanie” zwracają 404** — linkowane ze stopki każdej z 4 stron (12 martwych linków) i z checkboxa zgody w kroku 6 briefu. Serwis zbiera dane z 5 formularzy i używa GA4 + Clarity. Ryzyko prawne (RODO) i poważna luka w zaufaniu (E-E-A-T: Trust). `resources/js/lib/site.ts:63-71`, `resources/js/components/home/brief/brief-steps.tsx:378`.
2. **GA4 i Microsoft Clarity ładują się przed zgodą na cookies** — bez Consent Mode i bez bramkowania przez baner cookies (`resources/views/app.blade.php:14-20`, `:107-112`). Baner nie ma realnego skutku. Dodatkowo osierocony `<noscript>` GTM (`GTM-K8FQP9D5`) bez skryptu GTM.
3. **Brak stron dopasowanych do intencji wyszukiwania** — dla „tworzenie stron internetowych Leszno” 8/9 wyników to dedykowane podstrony miasto + usługa; Netizo ma „Leszno” 0× w title i H1, a nazwy miast tylko w `meta keywords` (78 fraz, ignorowane przez Google). Brak stron usług, cennika, realizacji pod własnym URL i bloga.
4. **Nie wiadomo, kto stoi za firmą** — brak nazwy prawnej, NIP, adresu, osób, „O nas” i opinii; JSON-LD bez telefonu, e-maila, logo i `@id`; e-mail w HTML zaciemniony przez Cloudflare (`[email protected]`). Do tego kolizja nazwy z indyjską agencją **netizo.in**, która dominuje w wynikach dla „netizo”.
5. **Duplikat całego serwisu pod `/index.php`** — `/index.php` i `/index.php/<ścieżka>` zwracają 200 z canonicalem, hreflang i JSON-LD wskazującymi na siebie (`app/Services/LocalizedRoutes.php:67`, `app/Http/Controllers/Controller.php:43`).

### Top 5 szybkich wygranych (≤ 1 h każda)

1. Wyłączyć **Email Address Obfuscation** w Cloudflare (Scrape Shield) — e-mail wróci do HTML dla botów i AI.
2. **301 z netizo.agency → netizo.pl** (dziś Cloudflare 526; linkuje do niej m.in. kanał YouTube).
3. Podmienić `public/sitemap.xml` na gotową, poprawną wersję (`raw/sitemap/sitemap.proposed.xml`) — usuwa 4 adresy z `#` i nieaktualne `lastmod`.
4. Skrócić **meta description** (dziś 171–214 zn., CTA „Bezpłatna wycena!” ucina się w SERP), poprawić **title** (fraza + Leszno, sentence case), usunąć **meta keywords**.
5. Dodać do JSON-LD `telephone`, `email`, `logo`, `@id` i węzeł `WebSite` (gotowy `@graph` w `findings/schema.md`).

> **Poza SEO, ale pilne:** domena **netizo.pl ma datę odnowienia 2026-11-19** (WHOIS, `option: no`) — sprawdzić, czy autoodnawianie u rejestratora jest włączone.

---

## 2. Technical SEO — 76/100

Szczegóły: [`findings/technical.md`](findings/technical.md)

**Co działa:** pełny SSR (treść, title, canonical, JSON-LD identyczne przed i po renderze JS); hreflang pl/en/x-default wzajemny i zgodny z sitemapą; robots.txt poprawny, wszystkie boty (Google, Bing, AI) dostają 200; prawdziwe 404 z `noindex`; `/admin/login` z `noindex`; parametry UTM nie tworzą duplikatów (canonical); TTFB 0,10–0,22 s, HTTP/2 + h3, Brotli; viewport poprawny.

| ID | Ważność | Problem | Gdzie |
|---|---|---|---|
| T-01 | High | `/index.php` i `/index.php/<ścieżka>` → 200 + self-canonical (duplikat serwisu) | `LocalizedRoutes.php:67`, `Controller.php:43`; fix: 301 w Cloudflare/nginx + `URL::forceRootUrl(config('app.url'))` w `AppServiceProvider::boot()` |
| T-02 | High | 3 martwe linki w stopce × 4 strony | `resources/js/lib/site.ts:63-71` |
| T-03 | Medium | Brak HSTS | `app/Http/Middleware/SecurityHeaders.php` lub Cloudflare |
| T-04 | Medium | CSP z `'unsafe-inline' 'unsafe-eval'`; domyślna polityka Trusted Types przepuszcza wszystko | `SecurityHeaders.php:47`, `app.blade.php:5-13` |
| T-05 | Medium | Sitemap: 4/8 wpisów z `#`, ręczny `lastmod` | `public/sitemap.xml:22-44` |
| T-06 | Medium | Assety z hashem cache tylko 4 h (`max-age=14400`), reguły z `.htaccess` nie działają na serwerze | `public/.htaccess:30-54` (nieużywane) → nginx / Cloudflare Cache Rule |
| T-07 | Medium | HTML 455 KB / DOM 2674 el.: ~224 KB to klasy Tailwind, ~101 KB inline SVG (2 logotypy po 16 KB); JSON Inertii tylko 13,7 KB | `site-header.tsx:174`, `site-footer.tsx:56` |
| T-08 | Medium | Cloudflare Email Obfuscation przepisuje SSR HTML | panel Cloudflare |
| T-09 | Low | Zduplikowane `x-content-type-options`/`x-frame-options`, przestarzały `x-xss-protection` | nginx `add_header` + `SecurityHeaders.php:27-28` |
| T-10 | Low | `/en/`, `/partnerzy/` → 200 zamiast 301 (canonical poprawny) | serwer |
| T-11 | Low | `http://www` → `https://www` → apex (2 skoki) | Cloudflare |
| T-13 | Low | `manifest.webmanifest` jako `application/octet-stream` | serwer (MIME) |
| T-15 | Low | Analityka bezwarunkowo + osierocony noscript GTM | `app.blade.php` |
| T-17 | Info | Brak security.txt, IndexNow | `public/` |

---

## 3. Content Quality — 48/100

Szczegóły: [`findings/content.md`](findings/content.md)

E-E-A-T (ważone 38/100): Experience 55 · Expertise 45 · Authoritativeness 25 · Trust 30. AI citation readiness 58. Czytelność dobra (FOG-PL 11,8 strona główna, 7,8 partnerzy; EN Flesch 66,7/78,2), brak lania wody.

**Co działa:** konkretne, uczciwe FAQ (widełki cen 1–5 / 5–15 / 15–50 tys. zł, terminy), kompletna i unikalna strona partnerska (warunki, kalkulator, przykład liczbowy), pełne tłumaczenie EN.

| ID | Ważność | Problem |
|---|---|---|
| C1 | Critical | Polityka prywatności / regulamin 404 przy 5 formularzach i analityce |
| C2 | High | Brak danych podmiotu, zespołu, „O nas” — stopka to tylko „© Netizo” (`site-footer.tsx:121`) |
| C3 | High | Twierdzenia nieweryfikowalne lub sprzeczne: „150+ projektów” przy 5 pokazanych realizacjach; „8 lat doświadczenia” przy domenie od 2023-11-19; Vetly z metryką „1000+ weterynarzy w Polsce”, a case study mówi, że „publiczna strona nie jest jeszcze uruchomiona”; „100% SEO według Google” to w rzeczywistości wynik Lighthouse (`hero.tsx:24-26`, `clients-section.tsx:21-22`, `lang/pl/home.php:11-13`) |
| C4 | High | Każda z 6 usług to jedno zdanie (`services-section.tsx:32-58`); brak podstron usług, strony lokalnej, realizacji, bloga |
| C5 | High | Pełne case studies (wyzwania, rozwiązania, PL/EN) istnieją tylko w dialogu i w JSON propsów — bez własnych URL (`projects-section.tsx:20-21`, `HomeController.php:94-115`), choć model `Project` ma `slug` |
| C6 | High | Brak opinii klientów i dowodu społecznego (sekcja klientów to same logotypy) |
| C6b | High | Portfolio linkuje do **temar-mt.pl, który jest domyślną stroną hostingu** („Strona domyślna”) — realizacja wygląda na nieistniejącą |
| C7 | Medium | E-mail zaciemniony przez Cloudflare |
| C8 | Medium | `CountUp` renderuje w SSR obie wartości — tekst dla crawlerów: „150+ 120+ zrealizowanych projektów”, „99,9% 99,0%”, „30M+ 0M+” (`components/motion/count-up.tsx:74-77`); dane z makiet UI (np. „Twoja stawka 150,00 zł/h netto”) czytelne jak fakty |
| C9–C11 | Low | Drobne rozbieżności PL/EN, Title Case i anglicyzmy, brak sygnałów świeżości |

---

## 4. On-Page SEO — 57/100

Szczegóły: [`findings/onpage.md`](findings/onpage.md)

**Co działa:** dokładnie jeden H1 na każdej stronie, logiczna hierarchia H2/H3, unikalne title (47–54 zn.) i opisy, OG image per język, canonical/hreflang poprawne, `metadata_template`: ryzyko szablonowości niskie.

| ID | Ważność | Problem | Gdzie |
|---|---|---|---|
| O1 | High | Meta description 171–214 zn. (PL home 203 zn. / 1309 px) — ucina się po „React, Next.js, Lar…” | `lang/pl/home.php:11`, `lang/en/home.php:10`, `lang/{pl,en}/partners.php` |
| O5 | High | 12 martwych linków w stopce; w EN z `hreflang="pl"` do nieistniejących stron | `site.ts:63-71` |
| O2 | Medium | Title Case w tytułach (wbrew zasadzie sentence case z `CLAUDE.md`); title PL bez „strony internetowe” i „Leszno”. Propozycja: „Strony internetowe i aplikacje webowe dla firm – Leszno \| Netizo” | `lang/pl/home.php:10`, `lang/en/home.php:9`, `lang/en/partners.php:9` |
| O3 | Medium | Meta keywords: 78 fraz, 1455 zn., 18 miejscowości × 3 warianty — do usunięcia | `lang/pl/home.php:16-45`, `config/seotools.php`, `HomeController.php:29` |
| O4 | Medium | H2 bez fraz tematycznych („Co dla Ciebie zbudujemy”, „Ostatnie wdrożenia”); H3 w Title Case („AI & Automatyzacja”) | `services-section.tsx:28,42,52`, `projects-section.tsx:15` |
| O6 | Medium | Nawigacja wyłącznie z kotwic `#`; strona partnerska linkuje do głównej tylko logotypem | `lib/sections.ts` |
| O7 | Low | Zaśmiecone anchory („English en English”, „Dołącz Dołącz do programu”) | `external-link.tsx:15-24`, `language-switcher.tsx` |
| O8 | Info | `noreferrer` na linkach do stron klientów; marquee klientów 3× w DOM | `clients-section.tsx:115` |

---

## 5. Schema / dane strukturalne — 58/100

Szczegóły i gotowe bloki `@graph` (PL/EN, home/partnerzy): [`findings/schema.md`](findings/schema.md)

**Co działa:** 8 bloków JSON-LD, wszystkie poprawne, w SSR, z bezwzględnymi URL; FAQ z jednego źródła (`lang/*`) 1:1 z treścią; `sameAs` tylko z realnych profili; brak sfabrykowanych ocen.

| ID | Ważność | Problem |
|---|---|---|
| S-01 | High | `ProfessionalService` bez `telephone`, `email`, `logo`, `contactPoint` — choć dane są na stronie (`HomeController.php:45-61`) |
| S-02 | Medium | Brak `@id`/`@graph`; encja rozdwojona PL/EN (`url` `/` vs `/en`) |
| S-03 | Medium | Brak węzła `WebSite` |
| S-04 | Medium | `WebPage` partnerów bez `isPartOf`/`publisher`/`BreadcrumbList`; test `PartnerProgramPageTest.php:78` wymusza brak organizacji |
| S-05 | Medium | Usługi i portfolio nieodzwierciedlone (`OfferCatalog`/`Service`, `CreativeWork`) |
| S-06 | Info | **FAQPage nie daje już rich results w Google** — według changelogu Google funkcja wycofana dla wszystkich witryn od 7.05.2026 (sprawdzone przez agenta 2026-10-11). Zostawić, nie rozbudowywać. |
| S-07–S-09 | Low | Znaki U+2060/NBSP w tekście JSON-LD (`Controller.php:28`); `priceRange: "$$"`; nieaktualne domyślne JSON-LD w `config/seotools.php:84-95` |

Właściwości `geo`, `openingHoursSpecification` i `aggregateRating` — **nie dodawać**, dopóki adres, godziny i realne opinie nie są widoczne na stronie.

---

## 6. Performance (CWV, lab) — 80/100

Szczegóły: [`findings/performance.md`](findings/performance.md) · surowe raporty: `raw/lighthouse/lh13.5-*.json`

| Strona / urządzenie | Score | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| `/` mobile (mediana z 3) | 81 | 2,07 s | **4,54 s** ❌ | 140 ms | 0 |
| `/` desktop | 99 | 0,47–0,52 s | 0,85–0,92 s | 0 | 0 |
| `/partnerzy` mobile | 89–92 | 1,80–2,28 s | 2,94–3,68 s ⚠️ | 43–54 ms | 0 |
| `/partnerzy` desktop | 100 | 0,44 s | 0,62 s | 0 | 0 |

Lighthouse 13.5, symulowany throttling (Moto G Power, 1,6 Mb/s, CPU ×4). INP nie jest mierzalny w labie — TBT jako proxy: PASS. **Brak danych CrUX** — wynik terenowy może być inny (obserwowany, nieprzepustowany LCP ≈ 0,3 s).

| ID | Ważność | Problem | Gdzie |
|---|---|---|---|
| P-01 | High | LCP mobile 3,9–4,5 s na `/` — rywalizacja o pasmo/CPU: 509 KB JS (1,5 MB raw), 24 pliki, 45 żądań, ~1 MB | — |
| P-02 | Medium | Statyki tylko 4 h cache, bez `immutable` (513 KiB do zyskania przy powtórnej wizycie) | nginx / Cloudflare |
| P-03 | Medium | ~20 `modulepreload` (nagłówek `Link` + `<head>`) także dla chunków briefu i dialogów; 57% `app-*.js` nieużywane przy starcie | `pages/home.tsx`, `brief/`, `case-study-dialog.tsx:153` — lazy load |
| P-04 | Medium | gtag (181 KB), Clarity (26 KB, long task 155 ms), cookie-consent (23 KB) przed zgodą i w ścieżce krytycznej | `app.blade.php:14-20`, `:91`, `:107-109` |
| P-05 | Medium | Brak małych wariantów zdjęć — 768w do slotów 64–270 px (298 KiB nadmiaru) | `lib/photos.ts:54` |
| P-06 | Medium | HTML/DOM (patrz T-07) | — |
| P-07–P-10 | Low | HTML `no-cache` + `Set-Cookie`; CSS render-blocking (27 KB br); Geist Mono bez preload; MIME manifestu | — |

---

## 7. Images — 78/100

Szczegóły: [`findings/images.md`](findings/images.md)

**Co działa:** WebP wszędzie, komplet `alt`, `width`/`height`, `srcset`/`sizes`, obraz LCP z `loading="eager"` + `fetchpriority="high"`, CLS 0, lekkie OG (50–82 KB, 1200×630).

| ID | Ważność | Problem | Gdzie |
|---|---|---|---|
| I-01 | Medium | Brak wariantów < 768w (298 KiB nadmiaru na mobile) | `lib/photos.ts:54`, `live-build/shop-window.tsx:160,182` |
| I-02 | Medium | Screenshoty projektów: pełnostronicowe 1920×4267–7002 px, 1,33 MB w 5 plikach, jakość 95, „miniatura” prawie tak ciężka jak pełny obraz | `ImageOptimizer.php:21` (`$quality = 95`), `:29-32`; `Admin/ProjectController.php:26-27`; `project-frame.tsx:49` |
| I-03 | Low | `width`/`height` screenshotów (1600×1000) ≠ rzeczywiste wymiary | `project-frame.tsx:106-118` |
| I-04 | Low | Brak AVIF; ciężkie 768w (`contact-desk-768` 90 KB) | — |
| I-05 | Low | Nieużywane `hero-studio*.webp` (154 KB) | `public/assets/images/photos/` |

---

## 8. AI Search Readiness — 64/100

### GEO (cytowalność, encja) — 55/100 · [`findings/geo.md`](findings/geo.md)

Cytowalność 62 · Struktura 72 · Multimodalność 40 · Autorytet/marka 18 · Dostęp techniczny 78. Szacunki platform: Google AIO/AI Mode 50, Perplexity 45, ChatGPT Search 38, Copilot 38.

| ID | Ważność | Problem |
|---|---|---|
| G-01 | High | **Kolizja nazwy z netizo.in** (indyjska agencja web, od 2017, LinkedIn `company/netizo`) — w Brave 18/18 wyników „netizo” dotyczy netizo.in; „od 2017” + „8 lat” zwiększa ryzyko sklejenia encji przez modele |
| G-02 | High | Brak danych podmiotu (NIP, nazwa prawna, adres, ludzie) i uboga encja JSON-LD |
| G-03 | High | **netizo.agency → Cloudflare 526** zamiast 301 (linkuje do niej YouTube `@netizo.agency`, handle profili to „netizo.agency”) |
| G-04/05 | Medium | Case studies tylko w JSON Inertii; tylko 4 URL do cytowania |
| G-06 | Medium | Brak zdania-definicji „Netizo to agencja … z Leszna” w treści widocznej |
| G-07/08 | Medium | Metryki bez źródła; szum w tekście (CountUp, makiety, marquee ×3) |
| G-10 | Medium | Słaba obecność poza witryną: brak strony LinkedIn, Wikidata, katalogów; YouTube pusty i poza `sameAs` |
| G-11/12 | Low | Brak llms.txt (znaczenie niskie; gotowy PL+EN w `geo.md`); robots.txt bez udokumentowanej polityki wobec botów AI (obecne „Allow all” jest dobrą decyzją dla tej marki) |

### Agentic Browsing — 78/100 · [`findings/agentic.md`](findings/agentic.md)

Lighthouse Agentic Browsing **2/2** (mobile i desktop; N/A: llms.txt, ARD, WebMCP). Agent-UX 100, 0 nienazwanych kontrolek na 4 stronach × 2 viewporty.

| Ważność | Problem | Gdzie |
|---|---|---|
| High | Checkbox zgody w briefie linkuje do `/polityka-prywatnosci` (404) | `brief-steps.tsx:378` |
| Medium | Natywne inputy kart/chipów mają 1×1 px (`sr-only`) — agenci (Playwright `check()`) nie mogą ich zaznaczyć | `brief/choices.tsx:44-58` (klasa w l. 55) → `absolute inset-0 size-full opacity-0 cursor-pointer` |
| Low | Formularze `noValidate`, wymagalność tylko `aria-required`; grupy wymagane bez sygnału | `quick-contact-form.tsx:190,205,230`, `choices.tsx:128-137`, `partner-application-form.tsx:218-242` |
| Low | Linki w stopce 20 px wysokości na desktopie (< 24 px WCAG 2.2) | `site-footer.tsx` |
| Info | Brak WebMCP, `Content-Signal`, `/.well-known/*`, Markdown na `Accept: text/markdown` | — |

---

## 9. Visual / mobile — 82/100 (uzupełniająco)

Szczegóły i lista zrzutów: [`findings/visual.md`](findings/visual.md) · `screenshots/` (desktop 1440×900, mobile 390×844 @2x, dark, 320/768/1024 px, z banerem cookies i bez)

**Co działa:** brak poziomego scrolla od 320 do 1920 px; CLS ≈ 0; kontrast WCAG spełniony (light 394/396, dark 395/396 węzłów — wyjątki dekoracyjne); przełącznik języka widoczny na każdej szerokości; brak interstitiali; FAB oddzwonienia nie koliduje z banerem; `/partnerzy` ma najmocniejszy pierwszy ekran (15%, przykład 18 000 zł → 2 700 zł, CTA od razu).

| Ważność | Problem | Gdzie |
|---|---|---|
| Medium | Baner cookies na mobile: 236 px (28% ekranu 390×844); na 375×667 zasłania część CTA „Wyceń projekt”, na 360×640 i 320×640 CTA prawie całkiem; brak linku do polityki prywatności w banerze | `resources/views/vendor/cookie-consent/cookies.blade.php` (`.cookies__alert` od l. 148, media query od l. 506) — kompaktowy baner ~120–140 px |
| Medium | Brak numeru telefonu i lokalizacji w pierwszym ekranie — ikona słuchawki i FAB otwierają formularz oddzwonienia, nie `tel:` | `site-header.tsx:205-213`, `callback-fab.tsx:29`; dodać „Leszno, cała Polska” + `tel:+48884343924` pod CTA w `hero.tsx:110-120` |
| Medium | Martwe linki prawne widoczne w stopce i menu mobilnym | `site.ts:63-71` |
| Low | Cele dotykowe < 44 px: przyciski banera (36 px), zakładki formularza (38 px), linki marquee (40 px) | `clients-section.tsx:117` (`py-2` → `py-3`) |
| Low | W menu mobilnym CTA „Wyceń projekt” poza ekranem (widać 6 px); w nagłówku na telefonie CTA ukryte | `site-header.tsx:219`, `:253`, `:304` — przykleić CTA do dołu panelu |
| Low | Bardzo długa strona na mobile (~20 700 px, ~24 ekrany; 5 kart projektów ≈ 5000 px) | — |
| Low | 122 widoczne węzły tekstu < 12 px w makietach UI bez `aria-hidden` | `components/home/panel/`, `live-build/`, `bento/` |

---

## 10. Backlinks — brak danych do oceny liczbowej

Szczegóły: [`findings/backlinks.md`](findings/backlinks.md)

Dostępny był tylko Tier 0 (Common Crawl + crawler weryfikacyjny); 0 z 7 czynników Backlink Health Score ma źródło danych, więc **ocena 0–100 nie jest podana** (byłaby zgadywaniem). To, co dało się zmierzyć, wypada słabo:

- **Common Crawl (I kw. 2026):** netizo.pl, voxbit.pl, netizo.agency ani domeny klientów nie występują w grafie (skan ręczny 120 mln wierszy; domena jest młoda — pierwszy commit repo 2026-06-15).
- **Stopki klientów linkują do starej marki:** 5/5 działających stron (treepro.pl, nakazdaokazje.pl, leasingodreki.pl, krainamt2.pl, energizo.pl) ma ponadstronowy link „Strona stworzona przez” → **voxbit.pl** (dofollow), a 0/6 linkuje bezpośrednio do netizo.pl. voxbit.pl przekierowuje 301 na stronę główną netizo.pl, więc moc linków nie przepada, ale anchor/marka są stare, a treepro.pl i leasingodreki.pl hotlinkują `voxbit.pl/assets/images/logo.svg`, które dziś przekierowuje na HTML (logo prawdopodobnie się nie wyświetla).
- **temar-mt.pl to domyślna strona hostingu** („Strona domyślna”), a netizo.pl pokazuje ją jako realizację i linkuje do niej — problem zaufania (potwierdzone 2026-10-11).
- `panel-klienta.netizo.pl/login` ma `index, follow` — powinien mieć `noindex`.

**Rekomendacje:** podmienić stopki klientów na „Realizacja: Netizo” → `https://netizo.pl` (bez `nofollow`, z lokalnym plikiem logo); ukryć temar-mt.pl do czasu wdrożenia; podłączyć GSC „Linki” + Bing Webmaster Tools (+ Moz free) dla danych o domenach linkujących; profile Clutch / Sortlist / GoodFirms z opiniami; lokalne portale i instytucje w Lesznie; zapis o linku w stopce w umowach; w programie partnerskim linki z prowizją oznaczać `rel="sponsored"`. Unikać kupowania linków i PBN.

---

## 11. Local SEO — 18/100 (uzupełniająco)

Szczegóły: [`findings/local.md`](findings/local.md)

| Wymiar | Ocena |
|---|---:|
| Sygnały GBP | 10 |
| Opinie i reputacja | 5 |
| Lokalne on-page | 30 |
| NAP i cytowania | 25 |
| Lokalne schema | 30 |
| Lokalne linki | 15 |

- **F-01 Critical:** profil Google Business Profile **niezweryfikowany** (CAPTCHA); na stronie zero sygnałów GBP (mapa, link do profilu, „zostaw opinię”). W bloku map Brave dla „agencja interaktywna Leszno” Netizo nie występuje.
- **F-02 High:** NAP niepełny — telefon `+48 884 343 924` i e-mail spójne, ale brak ulicy, kodu, NIP/REGON, formy prawnej, godzin.
- **F-03 High:** `ProfessionalService` tylko z `addressLocality`/`Region`/`Country`; `areaServed` = Polska (bez miast).
- **F-04/F-05 High:** brak stron lokalnych. **Nie tworzyć 18 stron miast** z listy keywords (wzorzec doorway pages). Bezpieczny model: strony usług ogólnopolskich + **jedna strona-hub Leszno** + 3–5 stron regionalnych tylko tam, gdzie są realne dowody (realizacja, opinia, unikalna treść).
- **F-06 High:** zero opinii na stronie.
- **F-08 Medium:** w Panorama Firm jest rekord „Netizo” z innym miastem (Kępno) — niezweryfikowane, czy to ten sam podmiot; jeśli tak, adres jest sprzeczny z „Leszno” w JSON-LD. Brak wpisów w pkt.pl, firmy.net; Clutch/GoodFirms/Sortlist/Aleo niezweryfikowane (403).

---

## 12. SXO — dopasowanie do intencji — 42/100 (uzupełniająco)

Szczegóły, makiety stron i drzewo URL: [`findings/sxo.md`](findings/sxo.md)

| Fraza | Typ strony w SERP | Netizo | Ważność |
|---|---|---|---|
| tworzenie stron internetowych Leszno | 8/9 podstrony miasto + usługa (~1700 słów, „Leszno” w title 8/8, ceny 7/8) | brak strony; „Leszno” 3× w treści | Critical |
| agencja interaktywna Leszno | 7/9 lokalne strony usług + Oferteo | brak | Critical |
| ile kosztuje strona internetowa | 9/9 artykuły i cenniki | 1 pytanie w FAQ | Critical |
| aplikacje webowe dla firm | 7/9 treści edukacyjne/hybrydowe | kafelek ~12 słów | High |
| software house Poznań | 6/9 katalogi i rankingi | brak obecności | High |
| program partnerski / prowizja za polecenie | landing z warunkami | `/partnerzy` — **dopasowane** (brak publicznego regulaminu) | OK |

Persony: właściciel firmy z Leszna 49 · startup 53 · marketing manager 57 · partner polecający 80. Najsłabszy wymiar u wszystkich: **zaufanie** (śr. 10/25).

---

## 13. Sitemap — 72/100 (uzupełniająco)

Szczegóły i gotowy plik: [`findings/sitemap.md`](findings/sitemap.md), `raw/sitemap/sitemap.proposed.xml`

- S-01 Medium: 4/8 wpisów z `#` (`/#stack` nie istnieje; w EN tylko `#faq`).
- S-02 Medium: `lastmod` 2025-12-05 z czasów marki Voxbit obok 2026-10-09 dla tego samego dokumentu.
- S-03 Medium: strony prawne do dodania po ich utworzeniu.
- S-04 Low: plik statyczny — rozważyć generowanie z `LocalizedRoutes::alternates()` (szkic w raporcie).
- S-05–S-07 Low/Info: `<loc>` ze slashem vs canonical bez; kolejność elementów niezgodna z XSD; `priority`/`changefreq` ignorowane.

---

## 14. Plan działań

Pełny, priorytetyzowany plan z szacunkiem nakładu: [`ACTION-PLAN.md`](ACTION-PLAN.md).

## 15. Artefakty

- `findings/*.md` — raporty specjalistów (technical, content, onpage, schema, performance, images, geo, agentic, local, sxo, sitemap, visual, backlinks)
- `screenshots/` — zrzuty desktop/mobile/dark, z banerem cookies i bez
- `raw/` — HTML i nagłówki, render, Lighthouse JSON, dane SERP, robots/sitemap, `BRIEF.md`
- `audit-data.json` — dane strukturalne do generatora raportu PDF
