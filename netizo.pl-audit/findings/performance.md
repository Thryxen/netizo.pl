# Audyt wydajności (Core Web Vitals) — https://netizo.pl (2026-10-11)

## Metodologia i ograniczenia

- **To są dane laboratoryjne.** Brak danych terenowych CrUX (brak klucza Google API; strona prawdopodobnie ma też zbyt mały ruch na raport CrUX). Nie da się więc wyliczyć 75. percentyla z prawdziwych użytkowników; poniższe statusy CWV są orientacyjne.
- PageSpeed Insights API: `pagespeed_check.py` zwrócił błąd, a bezpośrednie wywołanie API dało HTTP 429 (wyczerpany dzienny limit współdzielonego projektu bez klucza, "Queries per day"). Zamiast tego uruchomiono lokalnie **Lighthouse 13.5.0** (CLI przez `npx`, Node 22.22.3) w **Chrome for Testing 156.0.8078.4** (`--headless=new`), throttling domyślny `simulate` (mobile: Moto G Power 2022, RTT 150 ms, 1,6 Mb/s, CPU x4; desktop: preset `desktop`). Host: Mac arm64 (benchmarkIndex ~4400, szybki, więc wyniki CPU są raczej optymistyczne).
- Liczba przebiegów: `/` mobile x3, `/` desktop x2, `/partnerzy` mobile x2, `/partnerzy` desktop x1. Wersje EN (`/en`, `/en/partners`) nie były mierzone Lighthouse'em (HTML o takiej samej strukturze i rozmiarze: 453 KB / 179 KB).
- Wcześniejsze logi `raw/lighthouse/*.log` były puste (uruchomienie bez `CHROME_PATH`); pomiary poniżej je zastępują. Surowe JSON-y skopiowano do `raw/lighthouse/lh13.5-*.json`.
- INP nie jest mierzalny w labie; jako proxy służy TBT.

## Zmierzone metryki (lab)

### Strona główna `/`

| Przebieg | Score | FCP | LCP | TBT | CLS | Speed Index | TTI |
|---|---|---|---|---|---|---|---|
| mobile #1 | 84 | 2,07 s | 3,94 s | 140 ms | 0 | 2,46 s | 5,84 s |
| mobile #2 | 81 | 2,08 s | 4,55 s | 130 ms | 0 | 2,54 s | 5,68 s |
| mobile #3 | 81 | 2,00 s | 4,54 s | 146 ms | 0 | 2,36 s | 5,90 s |
| **mobile mediana** | **81** | **2,07 s** | **4,54 s** | **140 ms** | **0** | **2,46 s** | **5,84 s** |
| desktop #1 | 99 | 0,47 s | 0,85 s | 0 ms | 0 | 0,88 s | 0,85 s |
| desktop #2 | 99 | 0,52 s | 0,92 s | 0 ms | 0,001 | 1,00 s | 0,92 s |

### Strona `/partnerzy`

| Przebieg | Score | FCP | LCP | TBT | CLS | Speed Index | TTI |
|---|---|---|---|---|---|---|---|
| mobile #1 | 89 | 1,80 s | 3,68 s | 54 ms | 0 | 1,81 s | 5,28 s |
| mobile #2 | 92 | 2,28 s | 2,94 s | 43 ms | 0 | 2,31 s | 5,10 s |
| desktop #1 | 100 | 0,44 s | 0,62 s | 0 ms | 0 | 0,52 s | 0,62 s |

### TTFB i LCP w podziale na fazy (obserwowane, bez symulowanego throttlingu)

| Strona | TTFB | Resource load delay | Resource load duration | Element render delay | LCP obserwowane | Element LCP |
|---|---|---|---|---|---|---|
| `/` mobile | 124-152 ms | 8-22 ms | 65-96 ms | 80-96 ms | 0,29-0,37 s | `backdrop-workshop-768.webp` (26 KB) |
| `/` desktop | 130-133 ms | 6-7 ms | 89-148 ms | 88-94 ms | 0,32-0,38 s | to samo |
| `/partnerzy` mobile | 126-128 ms | 6-7 ms | 111-165 ms | 42-63 ms | 0,31-0,34 s | `partner-referral-768.webp` |

TTFB HTML z `curl`: 0,13-0,16 s (HTTP/2, Cloudflare WAW, `cf-cache-status: DYNAMIC`), Lighthouse "server response" 96 ms. Poniżej progu 0,8 s z dużym zapasem.

### Status Core Web Vitals (lab, brak CrUX)

| Metryka | `/` mobile | `/` desktop | `/partnerzy` mobile | `/partnerzy` desktop |
|---|---|---|---|---|
| LCP | **FAIL** (mediana 4,54 s; >4,0 s = poor, 2 z 3 przebiegów) | PASS (0,9 s) | Needs improvement (2,9-3,7 s) | PASS (0,6 s) |
| INP (proxy: TBT) | PASS-proxy (TBT 130-146 ms < 200 ms) | PASS-proxy (0 ms) | PASS-proxy (43-54 ms) | PASS-proxy (0 ms) |
| CLS | PASS (0) | PASS (0-0,001) | PASS (0) | PASS (0) |

Ważne zastrzeżenie dotyczące LCP mobile: **zmierzony (obserwowany) LCP to ok. 0,3 s, a symulowany Lantern-em 3,9-4,5 s**. Różnica wynika z symulowanego łącza 1,6 Mb/s i CPU x4: na takim łączu ~509 KB skryptów (transfer), 4 eager-owe zdjęcia sklepu (267 KB przy 768w) i fonty rywalizują o pasmo z obrazem LCP (26 KB). To hipoteza wynikająca z wykresu zależności i priorytetów żądań (nie została zweryfikowana eksperymentem A/B). Realny użytkownik na LTE/5G będzie bliżej wartości obserwowanych. Bez CrUX nie wiadomo, który obraz jest bliższy prawdy.

## Anatomia ładowania strony głównej (mobile, przebieg #1)

- 45 żądań, **1039 KiB** transferu (desktop: 48 żądań, 1872 KiB, bo wybiera większe warianty zdjęć).
- Według typu (transfer): Script 24 plików / 509 KB (1,51 MB po rozpakowaniu), Image 7 / 367 KB, Font 4 / 85 KB, Stylesheet 1 / 27 KB (159 KB raw), Document 65 KB (455 KB raw).
- Największe pliki: `gtag/js` 181 KB, `app-CpHfl-vG.js` 115 KB (359 KB raw), `shop-hero-768.webp` 84 KB, `shop-hat-768.webp` 80 KB, dokument 65 KB, `shop-scarf-768.webp` 60 KB, `home-vzcWfEv6.js` 56 KB (188 KB raw), `shop-sweater-768.webp` 45 KB, `use-in-page-anchors-BJRGl7vJ.js` 34 KB.
- Praca głównego wątku (4x CPU): 2,9 s łącznie (Script Evaluation 974 ms, Style & Layout 556 ms, Rendering 176 ms); 7 long tasków (największe: Clarity 155 ms, parsowanie dokumentu 117 ms, `app-*.js` 84 ms, gtag 60+58 ms); forced reflow 37 ms + 82 ms w skryptach inline dokumentu (do sprawdzenia, czy to cookie consent / Clarity / skrypt motywu).
- DOM: **2667 elementów**, głębokość 30, max 32 dzieci (powyżej zalecanych ~1500).
- Lighthouse "est. savings": image-delivery **298 KiB**, cache **513 KiB** (powtórne wizyty), unused JS **137 KiB** (gtag 75 KB, `app-*.js` 65 KB = 57% nieużywane przy ładowaniu), render-blocking CSS 130 ms. Best-practices 100.

### Skład HTML (455 KB raw, 57 KB br, 72 KB gzip)

Hipoteza z briefu (inline JSON `data-page` Inertia) **nie potwierdza się**: `<script data-page="app">` ma tylko **13,3 KB** (3%). Rzeczywiste składniki `home-pl.html`:

| Składnik | Rozmiar | Udział |
|---|---|---|
| atrybuty `class="..."` (2152 sztuk, klasy Tailwind) | ~222 KB | **49%** |
| inline `<svg>` (145 sztuk; w tym dwa loga po ~16 KB: headery desktop/mobile) | ~101 KB | 22% |
| atrybuty `d="..."` ścieżek SVG (303) | ~50 KB (w SVG powyżej) | |
| atrybuty `style=""` (232) | ~7 KB | 1,5% |
| faktyczny tekst | ~19,5 KB | 4% |
| `data-page` JSON | 13,3 KB | 3% |
| head | 13,2 KB | 3% |

Partnerzy: 179 KB raw, **28 KB br**. Kompresja Brotli działa (Cloudflare `content-encoding: br`), więc koszt sieciowy jest umiarkowany (57 KB); realny koszt to parsowanie/DOM (2742 tagów) i długie zadanie parsera dokumentu (117 ms + 54 ms przy x4 CPU).

## Znaleziska

### P-01 [High] LCP mobile (lab) poza progiem "good": 3,9-4,5 s na `/`, 2,9-3,7 s na `/partnerzy`

- **Dowód:** 3 przebiegi Lighthouse mobile na `/`: 3,94 / 4,55 / 4,54 s; `/partnerzy`: 3,68 / 2,94 s. Obserwowany LCP ~0,3 s, więc problem to konkurencja o pasmo/CPU na wolnym łączu, a nie TTFB (96-152 ms) ani odkrywanie obrazu: LCP `<img>` ma `loading="eager"`, `fetchpriority="high"`, jest w HTML (`lcp-discovery-insight`: wszystkie 3 testy zaliczone).
- **Główne obciążenia konkurujące z obrazem LCP:** ~20 modulepreload + 509 KB JS (P-03), 4 eager-owe obrazy sklepu w zbyt dużym wariancie (P-05), skrypty 3rd party (P-04), CSS blokujący renderowanie (P-08).
- **Rekomendacja:** wdrożyć P-03, P-04, P-05 (łącznie szacunkowo -500 do -700 KB w ścieżce krytycznej na mobile); po zmianach powtórzyć pomiar Lighthouse mobile i docelowo zebrać CrUX (RUM, np. `web-vitals` do GA4).

### P-02 [Medium] Brak długiego cache dla zasobów z hashem (`/build/assets/*`, `/assets/images/*`, `/storage/*`)

- **Dowód:** `curl -I`: `app-CpHfl-vG.js`, `app-CFZq5pi_.css`, woff2, zdjęcia, screenshoty projektów, `og-netizo-2.png`, `favicon.ico` zwracają `cache-control: max-age=14400` (4 h; to domyślne "Browser Cache TTL" Cloudflare, bez `immutable`). Pliki Vite mają hash w nazwie, więc mogłyby mieć rok. Lighthouse `cache-insight`: 513 KiB do zaoszczędzenia przy powtórnej wizycie.
- **Rekomendacja:** dla `/build/assets/*` ustawić `Cache-Control: public, max-age=31536000, immutable` (na serwerze origin: nginx `location /build/ { add_header Cache-Control "public, max-age=31536000, immutable"; }` lub Apache/`public/.htaccess`; w Cloudflare ustawić "Browser Cache TTL: Respect Existing Headers"). Dla `/assets/images/photos/*` i `/storage/projects/*` (nazwy ULID, pliki niezmienne po wgraniu — `ImageOptimizer.php:34`) też można użyć 1 roku; dla `/assets/images/og-*.png` zostawić krócej lub zmieniać nazwę przy zmianie (tak już jest wg CLAUDE.md).

### P-03 [Medium] Duży pakiet JS na wejściu: 509 KB transferu / 1,5 MB raw, ~20 modulepreload, 57% `app-*.js` nieużywane przy starcie

- **Dowód:** nagłówek `Link` i `<head>` strony głównej zawierają po 20 `modulepreload` (`app`, `home`, `alert`, `use-in-page-anchors`, `index`, `sheet`, `label`, `i18n`, `brief-options`, `checkbox`, `textarea`, `tabs`, `check`, `globe`, `plus`, `chevron-up`, `theme-toggle`, `select`, `badge` + CSS); te same linki są zduplikowane w nagłówku HTTP i w HTML. W puli są chunki formularzy/dialogów niewidocznych na starcie (`brief-options`, `select`, `tabs`, `checkbox`, `textarea`, `sheet`). Lighthouse: unused JS `app-CpHfl-vG.js` 65 KB (57%), bootup `home-*.js` 1137 ms CPU (x4), `use-in-page-anchors` 34 KB. Brak własnej konfiguracji chunków w `vite.config.ts` (nie znaleziono `manualChunks`/`build`).
- **Rekomendacja:** załadować leniwie (`React.lazy` + `Suspense`/dynamiczny `import()`) elementy niewidoczne na starcie: dialog zamówienia oddzwonienia i kreator briefu (`resources/js/components/home/brief/`), `case-study-dialog.tsx`, formularze kontaktu/newslettera pod linią zgięcia (kod złożony w `resources/js/pages/home.tsx`); Inertia v3 + Vite generuje wtedy osobne chunki bez wpisu w `modulepreload`. Sprawdzić `npx vite-bundle-visualizer` co siedzi w `app-*.js` (359 KB raw: React, Inertia, motion, Radix). Zostawić w preloadzie tylko `app`, `home` i bezpośrednie zależności.

### P-04 [Medium] Skrypty zewnętrzne ładowane przed zgodą i w ścieżce krytycznej: gtag (181 KB), Clarity (26 KB + long task 155 ms), cookie-consent (23 KB)

- **Dowód:** `resources/views/app.blade.php:14` (`<script async src=".../gtag/js?id=G-2L7MT88BQT">` w `<head>`), `:17-20` (`gtag('config', ...)`), `:107-109` (Clarity, ładowany w `<body>`), `:91` (`@cookieconsentscripts`, `/cookie-consent/script?id=...` 23 KB). Lighthouse (4x CPU): Clarity bootup 262 ms (scripting 234 ms), long task 155 ms, wątek główny 57 ms; GTM 121 ms bootup, 2 long taski po ~60 ms; `gtag/js` 41% nieużywany (75 KB). Zapytanie `g/collect` idzie z `npa=1`/`gcd=13l3l3l2l1l1` (consent mode "denied" domyślnie), ale sam plik 181 KB pobiera się mimo to.
- **Rekomendacja:** (1) ładować gtag i Clarity dopiero po zgodzie analitycznej lub po `requestIdleCallback`/zdarzeniu `load` (wstrzykiwane z poziomu callbacku cookie banner, zachowując Trusted Types policy `gtm`/`clarity` z CSP); (2) rozważyć rezygnację z jednego z narzędzi (GA4 + Clarity razem to ~230 KB i ~0,4 s CPU x4); (3) `@cookieconsentscripts` już jest `defer`, zostawić.

### P-05 [Medium] Brak małych wariantów zdjęć: 768w pobierane do slotów 64-270 px (298 KiB do oszczędzenia)

- **Dowód:** `image-delivery-insight`: **298 KiB**. Przykład: `shop-hero-768.webp` (83 KB) w slocie 159x106 px na mobile: 79 KB nadmiarowe (rozmiar) + 23 KB (kompresja). Cztery obrazy `shop-*` w hero są `eager` (+ `<link rel="preload" as="image">` z React w body) i ważą łącznie 267 KB (83+80+59+45 KB) na mobile. `srcSet` tworzy tylko `-768` i natywny wariant: `resources/js/lib/photos.ts:54`. Sloty: hero 270 px/40vw (`resources/js/components/home/live-build/shop-window.tsx:160`), karty produktów 190 px/28vw (`:182`).
- **Rekomendacja:** wygenerować warianty 320w i 480w (dla `shop-*`, `bento-*`, `backdrop-*`), rozszerzyć `srcSet` w `photos.ts:54` (`-320.webp 320w, -480.webp 480w, -768.webp 768w, native`), obniżyć jakość WebP dla produktów (23 KB do oszczędzenia samą kompresją). Szacunek: -200 do -250 KB na pierwszym ekranie mobile (do zmierzenia po wdrożeniu).

### P-06 [Medium] Rozmiar HTML/DOM: 455 KB raw, 2667 elementów, 222 KB to klasy Tailwind, 101 KB inline SVG

- **Dowód:** patrz tabela "Skład HTML". Dwa loga SVG po 16 KB (desktop i mobile header) duplikują ścieżki; 145 `<svg>` w całości. Long tasks parsera: 117 ms i 54 ms (x4).
- **Rekomendacja:** (1) jedno logo SVG zamiast dwóch (CSS `hidden`/`block` albo `<symbol>` + `<use>`; plik `resources/js/components/home/logo.tsx`); (2) wspólne `@apply`/komponenty dla powtarzalnych długich zestawów klas (np. kafelki bento, LiveBuild `resources/js/components/home/live-build/*`), by zmniejszyć 2152 atrybutów `class`; (3) elementy dekoracyjne pod linią zgięcia (LiveBuild phone/editor, bento) renderować dopiero po wejściu w viewport (hydration on visible). Brotli już łagodzi koszt sieciowy (57 KB), więc priorytet = DOM/parse, nie transfer.

### P-07 [Low] HTML bez cache, `Set-Cookie` na każdej odpowiedzi

- **Dowód:** `cache-control: no-cache, private`, `vary: X-Inertia`, `cf-cache-status: DYNAMIC`, `Set-Cookie: XSRF-TOKEN` i `netizopl-session` na stronach publicznych. TTFB mimo to 0,10-0,19 s, więc wpływ na CWV jest mały.
- **Rekomendacja (opcjonalna):** dla stron marketingowych wyłączyć sesję/cookie (middleware `StartSession`/`VerifyCsrfToken` tylko na trasach formularzy) i dodać `Cache-Control: public, s-maxage=300, stale-while-revalidate=60` + Cloudflare Cache Rule dla HTML. Uwaga na token CSRF osadzany w formularzach (Inertia czyta cookie `XSRF-TOKEN`).

### P-08 [Low] CSS blokujący renderowanie (27 KB br / 159 KB raw)

- **Dowód:** `render-blocking-insight`: `app-CFZq5pi_.css`, szacowany zysk 130 ms (Lighthouse), wpis w `network-dependency-tree`. Jest `preload as=style` w `Link`.
- **Rekomendacja:** wyciąć z `resources/css/app.css` style używane wyłącznie przez sekcje pod linią zgięcia i partnerów do osobnego pliku albo wstawić krytyczny CSS inline. Zysk niewielki, stąd Low.

### P-09 [Low] Fonty: 4 pliki woff2 (85 KB); fonty mono nie są preloadowane

- **Dowód:** preload tylko `geist-latin-wght` (29,8 KB) i `geist-latin-ext-wght` (16,8 KB) w `resources/views/app.blade.php:85`. `geist-mono-latin` (23,6 KB) i `geist-mono-latin-ext` (15,2 KB) są odkrywane dopiero z CSS (żądanie ~336 ms, priorytet VeryHigh). `font-display-insight` zaliczony, CLS 0, brak FOIT-owego skoku.
- **Rekomendacja:** ograniczyć użycie Geist Mono do minimum albo dołożyć jego preload tylko jeśli występuje nad linią zgięcia; w przeciwnym razie zostawić. Latin-ext jest potrzebny dla polskich znaków, więc preload obu wariantów Geist jest uzasadniony.

### P-10 [Low] `manifest.webmanifest` serwowany jako `application/octet-stream`, bez cache

- **Dowód:** `curl -I`: `content-type: application/octet-stream`, `cf-cache-status: DYNAMIC` (pobierany też przez Lighthouse: 1,1 KB).
- **Rekomendacja:** w konfiguracji serwera/Cloudflare ustawić `application/manifest+json` dla `.webmanifest`; dodać cache. Link: `resources/views/app.blade.php` (znacznik `rel="manifest"`).

### P-11 [Info] Co działa dobrze

- SSR: pełna treść w HTML, FCP/LCP obrazu gotowe od pierwszego bajtu.
- Brotli na dokumencie, CSS, JS (`content-encoding: br`), HTTP/2 + `alt-svc: h3`.
- TTFB 96-152 ms, brak przekierowań dla docelowego URL.
- LCP element poprawnie oznaczony (`eager` + `fetchpriority="high"`), trzy zaliczone testy `lcp-discovery-insight`.
- CLS 0 na wszystkich stronach (obrazy z `width/height`, zarezerwowane ramki, fonty `font-display` poprawne).
- Motion bez `motion.*` (bez dodatkowych ~27 KB gz), animacje tylko transform/opacity.
- Desktop: 99-100 punktów, TBT 0.

## Priorytety (wg oczekiwanego wpływu)

1. P-03 + P-04 + P-05 razem (lazy dialogów, odroczenie 3rd party, małe warianty zdjęć): największy wpływ na LCP mobile w labie.
2. P-02: cache `immutable` dla `/build/assets/*` i zdjęć (tanie, zysk na powtórnych wizytach).
3. P-06: odchudzenie DOM/HTML (wpływ na INP i long taski).
4. P-07, P-08, P-09, P-10: porządki o małym wpływie.
5. Dodać RUM (`web-vitals` -> GA4) lub włączyć klucz CrUX, żeby zweryfikować wyniki na danych terenowych.

## Ocena kategorii

**80/100** — Desktop jest praktycznie idealny (99-100, TBT 0, CLS 0), SSR/Brotli/TTFB są dobre, ale mobile ma w labie LCP 3,9-4,5 s na stronie głównej (FAIL) przez 509 KB JS, skrypty 3rd party i nadmiarowe zdjęcia, a statyczne zasoby mają tylko 4-godzinny cache; brak danych CrUX nie pozwala potwierdzić wyniku na prawdziwych użytkownikach.
