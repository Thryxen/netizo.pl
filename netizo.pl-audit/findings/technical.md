# Audyt techniczny SEO: https://netizo.pl (2026-10-11)

Zakres: 4 publiczne strony HTML (`/`, `/partnerzy`, `/en`, `/en/partners`) oraz ich warianty URL, nagłówki, sitemap, robots, SSR, rozmiar HTML. Kod w repo tylko czytany (bez modyfikacji). Pomiary live: curl (UA Chrome, ~1 req/s), `render_page.py --mode always` (Playwright), `sitemap_discovery.py`, surowe pliki z `raw/`. Dane lab Lighthouse pochodzą z jednego przebiegu mobile wykonanego równolegle przez inny wątek audytu (nie jest to field data, brak GSC/CrUX).

## Podsumowanie

| Kategoria | Status | Ocena |
|---|---|---|
| Crawlability (robots, sitemap, noindex) | Zaliczone z uwagami | 88 |
| Indexability (canonical, duplikaty, 404) | Wymaga poprawy | 66 |
| Security (HTTPS, nagłówki, CSP) | Wymaga poprawy | 52 |
| URL structure i przekierowania | Zaliczone z uwagami | 78 |
| Mobile | Zaliczone | 92 |
| Core Web Vitals (potencjał ze źródła + 1 lab) | Wymaga poprawy | 68 |
| Structured data (poprawność techniczna) | Zaliczone | 85 |
| JS rendering (SSR) | Zaliczone | 95 |
| IndexNow | Brak (nie wykryto) | 40 |

Priorytety: 0 Critical, 2 High, 6 Medium, 10 Low/Info (szczegóły niżej).

---

## High

### T-01. Warianty `/index.php` i `/index.php/<ścieżka>` zwracają 200 i same siebie kanonizują (duplikat całego serwisu)
- Ważność: High
- Dowód (live, 2026-10-11):
  - `https://netizo.pl/index.php` → 200, `<link rel="canonical" href="https://netizo.pl/index.php">`, `robots: index, follow`.
  - `https://netizo.pl/index.php/partnerzy` → 200, canonical `https://netizo.pl/index.php/partnerzy`, hreflang `en` = `https://netizo.pl/index.php/en/partners`, `og:url` i JSON-LD `url` też z `index.php`.
  - `https://netizo.pl/index.php?x=1` → canonical `https://netizo.pl/index.php`. Wariant `/en/index.php` → 404 (`No input file specified.`, 29 B, plain text z php-fpm).
  - W HTML żadnej strony nie ma linku do `index.php` (0 trafień w 4 plikach), więc duplikat powstaje dopiero przy zewnętrznym linku lub skanerze. Ale gdy powstanie, canonical i hreflang nie konsolidują sygnałów, bo wskazują ten sam duplikat.
- Przyczyna: `route()` w `LocalizedRoutes` buduje URL z root requestu, a ten zawiera `/index.php`, gdy żądanie weszło przez front controller z prefiksem. Źródła canonical/hreflang/og:url: `app/Http/Controllers/Controller.php:43` (`setCanonical`), `:46-49` (hreflang), `:51` (`OpenGraph::setUrl`); wartości z `app/Services/LocalizedRoutes.php:67` (`route($localizedName)`) i `:42` (`url()`); JSON-LD `url` w `app/Http/Controllers/HomeController.php:48` i `PartnerProgramController.php:41`.
- Rekomendacja (zrobić warstwowo):
  1. Serwer/Cloudflare: 301 z `/index.php*` na wariant bez prefiksu. Cloudflare Redirect Rule (działa na planie Free): warunek `starts_with(http.request.uri.path, "/index.php")`, cel dynamiczny `concat("https://netizo.pl", substring(http.request.uri.path, 10))`, kod 301, zachowaj query string. Alternatywa w nginx: `rewrite ^/index\.php(/.*)?$ $1 permanent;` w bloku `server` przed `location ~ \.php$`.
  2. Aplikacja (hardening, niezależny od serwera): w `app/Providers/AppServiceProvider.php:29-34` (`boot()`) dodać `URL::forceRootUrl(config('app.url'))` w produkcji, żeby canonical/hreflang/og:url/JSON-LD zawsze używały `APP_URL`, niezależnie od ścieżki wejścia. Dodatkowo globalny middleware (obok `SetLocale`, `bootstrap/app.php:56`) zwracający 301, gdy `$request->getBaseUrl() === '/index.php'`.
  3. Test regresji w `tests/Feature/HomePageTest.php` (już sprawdza canonical, linia ~327): żądanie `/index.php/partnerzy` ma dawać 301 lub canonical bez `index.php`.

### T-02. Stopka na KAŻDEJ stronie linkuje do 3 nieistniejących podstron (404): `/utrzymanie`, `/regulamin`, `/polityka-prywatnosci`
- Ważność: High
- Dowód: `resources/js/lib/site.ts:63-65` (PL) i `:69-71` (EN, z `hrefLang: 'pl'`). Live: `/utrzymanie` 404, `/regulamin` 404, `/polityka-prywatnosci` 404, `/en/privacy` 404. Linki są w stopce SSR HTML wszystkich 4 stron (po 1 wystąpieniu każdego, razem 12 broken internal links; menu mobilne korzysta z tej samej listy `infoLinks`).
- Wpływ: zmarnowany crawl budget i sygnał niskiej jakości (broken internal links), brak strony polityki prywatności przy 5 formularzach zbierających dane osobowe, GA4 + Clarity i bannerze cookies (ryzyko zgodności z RODO, spadek zaufania/E-E-A-T). Wersja EN linkuje do nieistniejących stron polskich, więc użytkownik EN trafia na polską stronę 404.
- Rekomendacja: albo opublikować te 3 strony (trasy w `routes/web.php:16-17` i `:27-29`, wpis w `public/sitemap.xml`, hreflang przez `LocalizedRoutes`), albo do czasu publikacji usunąć wpisy z `infoLinks` (`site.ts:62-71`). Polityka prywatności powinna być też podlinkowana z bannera cookies (`config/cookieconsent.php:56`, `'policy' => null`) i z formularzy.

---

## Medium

### T-03. Brak nagłówka HSTS (apex i www)
- Ważność: Medium
- Dowód: `curl -I https://netizo.pl/` i `https://www.netizo.pl/` → brak `strict-transport-security`. HTTP→HTTPS działa (301), TLS 1.3, certyfikat Let's Encrypt ważny do 2027-01-05, więc wdrożenie HSTS jest bezpieczne.
- Rekomendacja: włączyć w Cloudflare (SSL/TLS → Edge Certificates → HSTS): `max-age=15552000` (6 mies.) na start, potem 31536000, `includeSubDomains` dopiero po sprawdzeniu wszystkich subdomen (`panel-klienta.netizo.pl` odpowiada przez HTTPS, 302 → `/login`), `preload` opcjonalnie. Alternatywnie w `app/Http/Middleware/SecurityHeaders.php:27-30` dodać `Strict-Transport-Security` dla `$request->isSecure()` (proxy zaufane w `bootstrap/app.php:30-39`), ale rozwiązanie na Cloudflare obejmuje także pliki statyczne i błędy 404 z serwera.

### T-04. CSP osłabiona: `'unsafe-inline' 'unsafe-eval'`, a Trusted Types z domyślną polityką przepuszczającą wszystko
- Ważność: Medium
- Dowód: `app/Http/Middleware/SecurityHeaders.php:47` (`script-src ... 'unsafe-inline' 'unsafe-eval' ...`), `:80` (`require-trusted-types-for 'script'`), `:83` (`trusted-types default dompurify gtm clarity`). Polityka `default` w `resources/views/app.blade.php:5-13` zwraca string bez zmian w `createHTML`/`createScript`/`createScriptURL`, więc Trusted Types nie chroni przed DOM XSS (jest zgodnością formalną). Dodatkowo `'unsafe-inline'` unieważnia ochronę skryptów inline.
- Nadmiarowe źródła: `https://fonts.googleapis.com` w `script-src` (`:47`) i `style-src` (`:50`) oraz `https://fonts.gstatic.com` w `font-src` (`:56`), mimo że fonty są self-hosted (CLAUDE.md: brak Google Fonts); `https://challenges.cloudflare.com` w `script-src` i `frame-src` (`:47`, `:62`) potrzebne tylko w `/admin/login`; `img-src ... https:` (`:53`) przepuszcza dowolny host HTTPS.
- Rekomendacja: (1) wprowadzić nonce: `Vite::useCspNonce()` w middleware, `nonce="{{ Vite::cspNonce() }}"` na 4 inline `<script>` w `app.blade.php` (linie 5, 15, 30, 49) i Clarity (104), a w CSP `script-src 'self' 'nonce-…' 'strict-dynamic'` zamiast `'unsafe-inline'`; (2) usunąć `'unsafe-eval'` po sprawdzeniu GTM/Clarity w trybie `Content-Security-Policy-Report-Only`; (3) albo zaimplementować realny sanitizer w polityce `default`, albo zdjąć `require-trusted-types-for`; (4) osobna, ciaśniejsza CSP dla `/admin*` (Turnstile) i bez Cloudflare Challenges dla strony publicznej; (5) usunąć nieużywane hosty Google Fonts.
- Uwaga: to dług bezpieczeństwa, nie czynnik rankingowy; wdrożyć stopniowo (Report-Only), żeby nie zablokować GA4/Clarity.

### T-05. `public/sitemap.xml`: 4 z 8 wpisów to adresy z fragmentem `#` (duplikaty strony głównej), w tym nieistniejący `#stack`; plik statyczny, `lastmod` ręczny
- Ważność: Medium
- Dowód: `public/sitemap.xml:22` (`/#stack`), `:28` (`/#projekty`), `:34` (`/#faq`), `:40` (`/#kontakt`). Fragment nie jest wysyłany do serwera, więc wszystkie 4 to ten sam URL co `https://netizo.pl/`. W HTML brak `id="stack"` (0 trafień); istniejące kotwice to `#uslugi`, `#projekty`, `#faq`, `#kontakt`. Wpisy mają `lastmod` 2025-12-05, a prawdziwe strony 2026-10-09. `changefreq`/`priority` są ignorowane przez Google. Helper `sitemap_discovery.py`: sitemap zadeklarowana w robots.txt, 200, `urlset`, valid (poprawny XML), brak sitemap index (404 na fallbackach, co jest normalne).
- Co działa: 4 właściwe strony mają komplet `xhtml:link` (pl, en, x-default); zestawy identyczne z HTML (patrz T-14). W `<url>` elementy `xhtml:link` stoją przed `lastmod` (poprawne dla Google, ale ścisła walidacja XSD sitemap 0.9 oczekuje `loc, lastmod, changefreq, priority`, potem elementy obcej przestrzeni nazw; Info).
- Rekomendacja: usunąć 4 wpisy z fragmentem (zostaną 4 URL-e). Zamiast pliku statycznego wygenerować sitemapę z tras (`LocalizedRoutes::LOCALES`, `Route::has`) z `lastmod` z `max(updated_at)` projektów/klientów i z `lang`; albo zostawić plik, ale dodać krok w deployu aktualizujący `lastmod`.

### T-06. Cache: assety z hashem tylko 4 h; HTML `no-cache, private` i `Set-Cookie` na każdym GET (także dla botów)
- Ważność: Medium
- Dowód (live):
  - `/build/assets/app-CFZq5pi_.css`, `app-CpHfl-vG.js`, `home-*.js`, `*.webp`, `/images/icons/*`, `favicon.svg`, `og-netizo-2.png`: `cache-control: max-age=14400` (domyślny Browser Cache TTL Cloudflare, bo origin nie wysyła nagłówka), `cf-cache-status: HIT`. Pliki z hashem w nazwie powinny mieć `public, max-age=31536000, immutable`. Lighthouse (cache-insight) szacuje 513 KiB do zaoszczędzenia przy powtórnej wizycie.
  - `public/.htaccess:30-54` ustawia 12 miesięcy i `immutable`, ale reguły nie działają: odpowiedzi wyglądają na serwowane przez nginx (etag w formacie hex-hex, komunikat `No input file specified.` z php-fpm; wnioskowanie, konfiguracji serwera nie widziałem). Plik zawiera też tylko kompresję/cache, bez reguł front controllera.
  - Strony HTML: `cache-control: no-cache, private`, `cf-cache-status: DYNAMIC`; każdy GET (także Googlebot) dostaje `Set-Cookie: XSRF-TOKEN` i `netizopl-session`, bo grupa `web` startuje sesję (`bootstrap/app.php:46-50`; `config/session.php:21` domyślnie `database`, `.env.example:30`, czyli jeśli produkcja używa tego sterownika, każde wejście bota zapisuje wiersz w tabeli `sessions`). TTFB i tak jest dobry (0,10-0,22 s z WAW), więc to usprawnienie, nie awaria.
  - `/cookie-consent/script?id=…` (JS banera) także `no-cache, private`, czyli żądanie do PHP przy każdej wizycie.
- Rekomendacja:
  1. nginx: `location ^~ /build/assets/ { add_header Cache-Control "public, max-age=31536000, immutable" always; }`, dla `/assets/images/` `max-age=2592000`; w Cloudflare Browser Cache TTL ustawić `Respect Existing Headers`.
  2. Opcjonalnie (większy zysk): nie startować sesji dla anonimowych GET strony publicznej (osobna grupa middleware bez `StartSession`/`ShareErrorsFromSession`, CSRF dla formularzy pobierany osobno lub dla POST), a potem Cache Rule w Cloudflare dla `/`, `/en`, `/partnerzy`, `/en/partners` z krótkim Edge TTL i purge po zmianie projektów. Wymaga przemyślenia flow CSRF/Inertia (token w cookie `XSRF-TOKEN`), więc traktować jako projekt, nie quick fix.

### T-07. Rozmiar HTML i DOM: 455 KB (PL) / 453 KB (EN) / 179 KB (partnerzy); 2674 elementów; ~270 KB JS (Brotli)
- Ważność: Medium
- Dowód (rozbiór `raw/home-pl.html`, 455 004 B):

| Składnik | Rozmiar | Udział |
|---|---|---|
| Atrybuty `class` (2151 szt., Tailwind) | ~224 KB | ~49% |
| Inline SVG (145 szt., 81 unikalnych) | ~101 KB | ~22% |
| Inline `<script>` (15; w tym Inertia JSON 13,7 KB i JSON-LD ~5 KB) | ~26 KB | ~6% |
| Inline `<style>` (7) | ~19,5 KB | ~4% |
| Widoczny tekst | ~16,7 KB | ~3,7% |

  - Inertia `<script data-page="app" type="application/json">` ma tylko 13,7 KB (3%); w nim projects 9,0 KB, faq 3,6 KB, clients 0,5 KB. To NIE jest główne źródło wagi; FAQ występuje trzykrotnie (props, DOM, JSON-LD), ale to ~12 KB.
  - Największe SVG: dwa pełne logotypy `viewBox 1892.46×453.47` po 16 KB (nagłówek `site-header.tsx:174` i stopka `site-footer.tsx:56`, razem 32 KB; definicja ścieżek w `logo.tsx:10-49`, z tagline, który przy `h-9` jest nieczytelny); 25 KB to duplikaty tych samych SVG. Najcięższe sekcje: `#panel` ~70 KB, `#uslugi` (bento) ~51 KB, `#proces` ~51 KB, hero ~46 KB, `#projekty` ~38 KB, `#kontakt` ~33 KB. 1158 elementów `<span>`, 303 `<path>`.
  - Transfer: Brotli 57 002 B (home), gzip 72 013 B, więc realny koszt sieciowy HTML jest niski; problem dotyczy parsowania/hydracji.
  - JS/CSS strony głównej: 20 plików, łącznie 296 KB Brotli (JS ~270 KB, CSS 25,5 KB; po dekompresji ~985 KB). Największe: `app-*.js` 114,6 KB br (358 KB raw), `home-*.js` 54,4 KB br, `use-in-page-anchors-*.js` 33,8 KB br, `index-*.js` 22,4 KB br, `alert-*.js` 21,5 KB br. Wszystkie 19 chunków jest w `<link rel=modulepreload>` i w nagłówku `Link`, także te potrzebne dopiero po interakcji (kreator briefu: `brief-options`, `checkbox`, `textarea`, `tabs`, `select`, `sheet`).
  - Lab (Lighthouse 13.5, mobile, symulacja, 1 przebieg): Performance 84, FCP 2,1 s, LCP 3,9 s (strefa Needs Improvement; element LCP to hero `<img backdrop-workshop-768.webp>`, już z `fetchpriority=high`, `loading=eager`, wykrywalny w dokumencie), TBT 140 ms, CLS 0, TTI 5,8 s, main thread 2,9 s, DOM 2667 elementów, unused JS ~137 KiB (w tym `gtag/js` ~75 KB i `app-*.js` ~65 KB), render-blocking CSS ~300 ms. INP nie da się zmierzyć bez field data.
- Rekomendacja:
  1. Logo: jedno `<symbol>` + `<use>` albo plik `/logo.svg` przez `<img>` (cache), wariant bez tagline w nagłówku; usunie ~30 KB.
  2. Kod dzielony: kreator briefu, dialog callbacku, dialog case study i komponenty `select`/`sheet`/`tabs` ładować przez `React.lazy` + dynamiczny import po pierwszej interakcji (usuwa je z modulepreload i z krytycznej ścieżki). Wyłączyć `modulepreload` dla chunków niekrytycznych.
  3. Ograniczyć rozdrobnienie DOM: tile'e bento i panel klienta (`components/home/bento/`, `components/home/panel/`) renderować po wejściu w viewport (IntersectionObserver) zamiast pełnego SSR; zostawić SSR dla treści indeksowanej (H1, usługi, FAQ).
  4. Skrypty stron trzecich (`gtag/js` 180 KB raw, Clarity) ładować po zgodzie i po `load` (patrz T-15).

### T-08. Cloudflare Email Address Obfuscation przepisuje SSR HTML (adres e-mail znika z kodu, wstrzykiwany jest `email-decode.min.js`)
- Ważność: Medium (Low dla rankingu, istotne dla crawlerów AI i kontaktu)
- Dowód: w odpowiedzi serwera na `/`, `/en`, `/partnerzy`, `/en/partners` (pliki `raw/*.html`) adresy `kontakt@netizo.pl` są zastąpione `href="/cdn-cgi/l/email-protection#…"` i tekstem `[email protected]` (2 linki na stronę, 0 trafień `kontakt@netizo.pl`), a przed `</body>` jest `/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js`. Po wyrenderowaniu w Chromium (Playwright) link wraca do `mailto:kontakt@netizo.pl`. Skrypt `email-decode` jest w łańcuchu krytycznym Lighthouse. Dodatkowo Cloudflare modyfikuje HTML po SSR React, co grozi niezgodnością hydracji (w teście Playwright `console_errors` puste).
- Wpływ: crawlery bez JS (Bing, GPTBot, ClaudeBot, PerplexityBot) i walidatory widzą `[email protected]` zamiast publicznego, celowo eksponowanego adresu firmy; osłabia sygnał kontaktu/NAP. Adres jest publicznie eksponowany w stopce i sekcji kontaktu, więc obfuskacja nie daje korzyści.
- Rekomendacja: Cloudflare → Scrape Shield → Email Address Obfuscation: wyłączyć (albo wyłączyć regułą Configuration Rule dla hosta). Adres dodać także do JSON-LD `ProfessionalService` (`email`, `telephone`; brak ich w `HomeController.php:45-61`).

---

## Low / Info

### T-09. Zduplikowane nagłówki `x-content-type-options` i `x-frame-options` oraz przestarzały `x-xss-protection`
- Ważność: Low
- Dowód: w odpowiedzi HTML (`raw/home-pl.headers`, `/up`, `/cookie-consent/script`) po dwa razy `x-content-type-options: nosniff` i `x-frame-options: SAMEORIGIN`, a także `x-xss-protection: 1; mode=block`. Laravel ustawia je raz (`SecurityHeaders.php:27-28`, `Response::headers->set`). Drugi komplet pochodzi z warstwy przed aplikacją: odpowiedzi statyczne (`/build/assets/*.css`, `manifest.webmanifest`) mają tylko pojedynczy komplet z `x-frame-options`, `x-xss-protection`, `x-content-type-options`, a 404 z Laravela (`/storage/logs/laravel.log`, `/nie-istnieje`) ma po jednym i bez `x-xss-protection` (znak, że to `add_header` w nginx bez `always`, nie dotyczy kodów 4xx). Wnioskowanie: konfiguracji serwera nie widziałem; sprawdzić też Cloudflare Managed Transform "Add security headers".
- Rekomendacja: usunąć `add_header X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection` z bloku PHP w nginx (albo `fastcgi_hide_header` dla tych nagłówków z php-fpm) i zostawić zdefiniowane w `SecurityHeaders.php:27-28`. `X-XSS-Protection` nie wysyłać wcale (lub `0`). Funkcjonalnie duplikaty z identyczną wartością są w większości przeglądarek niegroźne, ale to szum, sygnał niespójnej konfiguracji i pozycja flagowana przez skanery bezpieczeństwa.

### T-10. Wariant ze slashem `/en/` i `/partnerzy/` zwraca 200 zamiast 301 (canonical poprawny)
- Ważność: Low
- Dowód: `https://netizo.pl/en/` → 200, canonical `https://netizo.pl/en`; `https://netizo.pl/partnerzy/?a=1` → 200, canonical `https://netizo.pl/partnerzy`; `https://netizo.pl//` → 200 (canonical `https://netizo.pl`). `/PARTNERZY` i `/EN` → 404 (poprawnie, wielkość liter rozróżniana). Parametry (`?utm_source=…&gclid=…`, `?lang=pl`) mają canonical bez parametrów (`Controller.php:43`), co jest OK.
- Rekomendacja: 301 `/xxx/` → `/xxx` w nginx: `rewrite ^/(.+)/$ /$1 permanent;` (standardowa reguła Laravel, której nie ma w `public/.htaccess:1-54`).

### T-11. Łańcuch www: `http://www.netizo.pl` → `https://www.netizo.pl` → `https://netizo.pl` (2 skoki)
- Ważność: Low
- Dowód: `http://www.netizo.pl/` 2 skoki (301 + 301), `http://www.netizo.pl/partnerzy` 2 skoki; `http://netizo.pl/en` → 1 skok; `https://www.netizo.pl/en/partners` → 1 skok. Ścieżka i język zachowane.
- Rekomendacja: jedna reguła Cloudflare Redirect Rule: host `www.netizo.pl` (dowolny schemat) → `concat("https://netizo.pl", http.request.uri.path)` z zachowaniem query string, 301.

### T-12. Meta description za długie, `meta keywords` z ~78 frazami miast
- Ważność: Low
- Dowód: długość description: PL home 203 znaki (`lang/pl/home.php:11`), EN home 214 (`lang/en/home.php:10`), partnerzy PL 177 i EN 171 (`lang/pl/partners.php:11`, `lang/en/partners.php:10`); Google przycina w okolicach ~155-160 znaków (CTA „Bezpłatna wycena!” zniknie ze snippetu). Title: 47-54 znaki, OK. `<meta name="keywords">` na `/`: 78 fraz (wzorzec „tworzenie stron Leszno/Poznań/Wrocław/Rawicz/Miejska Górka…”, `lang/pl/home.php:16`, domyślne w `config/seotools.php:18-44`). Google ignoruje to pole, a lista nazw miejscowości bez pokrycia treścią wygląda jak keyword stuffing (Bing może to traktować jako sygnał spamu). Jedno H1 na stronę, hierarchia OK (14 H2, 34 H3 na home).
- Rekomendacja: skrócić description do ≤155 znaków, usunąć `keywords` z `HomeController.php:29`, `PartnerProgramController.php:23` i z defaultów `config/seotools.php`. Lokalne frazy obsłużyć treścią (strona/sekcja Leszno, NAP, `areaServed` w JSON-LD), nie meta keywords.

### T-13. `manifest.webmanifest` serwowany jako `application/octet-stream`
- Ważność: Low
- Dowód: `https://netizo.pl/manifest.webmanifest?v=3` → 200, `content-type: application/octet-stream` (594 B). Treść poprawna (`public/manifest.webmanifest`), ikony `/images/icons/icon-192.png`, `icon-512.png` odpowiadają 200 `image/png`.
- Rekomendacja: w `mime.types` nginx dodać `application/manifest+json webmanifest;`. Opcjonalnie dodać `id` w manifeście.

### T-14. Hreflang, canonical, x-default, wzajemność: zgodne (PASS)
- Ważność: Info (pozytyw)
- Dowód (sprawdzone skryptem na 4 stronach): każda strona ma canonical równy sobie (`https://netizo.pl`, `/en`, `/partnerzy`, `/en/partners`), komplet `pl`, `en`, `x-default` (→ PL) z odnośnikiem zwrotnym (self-reference + return links w obie strony) i `<html lang>` zgodny z wersją; zestawy w HTML identyczne z `xhtml:link` w sitemapie. Różnica `https://netizo.pl` (HTML) vs `https://netizo.pl/` (sitemap) jest tylko formalna: pusta ścieżka i `/` to ten sam URL według RFC 3986/WHATWG, więc nie ma duplikatu ani konfliktu. `og:locale`/`og:locale:alternate` poprawne. Szczegółową walidację językową (kody, treść EN) przekazać do `seo-hreflang`.
- Brak przekierowań wg języka przeglądarki (`Accept-Language: en` na `/` daje 200 bez 30x, zgodnie z CLAUDE.md) jest zgodny z zaleceniami Google.

### T-15. Skrypty analityczne ładowane bezwarunkowo, osierocony noscript GTM
- Ważność: Info (zgodność, nie ranking)
- Dowód: `resources/views/app.blade.php:14-21` (gtag/GA4 `G-2L7MT88BQT`, `gtag('config')` od razu) i `:104-110` (Clarity) uruchamiają się bez sprawdzenia zgody, mimo że baner cookies (`@cookieconsentview`) ma kategorię „analytics”, a `config/cookieconsent.php:70-73` ma puste `GOOGLE_ANALYTICS_ID`. Dodatkowo `:95-96` ma `<noscript><iframe …GTM-K8FQP9D5>`, ale w `<head>` nie ma snippetu GTM (jest tylko gtag.js), czyli kontener GTM nie jest ładowany.
- Rekomendacja: Consent Mode v2 (domyślnie `denied`) lub ładowanie GA4/Clarity po zgodzie; usunąć niezgodny noscript GTM albo dodać snippet GTM zamiast bezpośredniego gtag. Zgłosić do wątku compliance/analytics.

### T-16. `/admin/login` ma `noindex`, ale tylko w meta; brak `X-Robots-Tag`
- Ważność: Info (pozytyw z drobną uwagą)
- Dowód: `https://netizo.pl/admin/login` → 200, `<meta name="robots" content="noindex, nofollow">` (`resources/views/admin.blade.php:17`), brak canonical i brak `X-Robots-Tag`. `/admin` → 302 → `/admin/login`. robots.txt ma `Allow: /` (bez `Disallow: /admin`), co jest poprawne, bo Google może wtedy zobaczyć `noindex`. Strona 404 ma `<meta name="robots" content="noindex">` i status 404 (nie soft 404), `/up` (health check Laravela) jest publiczny (200, HTML).
- Rekomendacja: defense in depth: w `SecurityHeaders.php` dodać `X-Robots-Tag: noindex, nofollow` dla `request()->is('admin', 'admin/*')`; rozważyć ograniczenie `/up` (Cloudflare WAF lub nginx `allow`).

### T-17. Brak plików uzupełniających: security.txt, llms.txt, manifest/agent discovery, IndexNow
- Ważność: Info
- Dowód: `/.well-known/security.txt`, `llms.txt`, `llms-full.txt`, `ai-catalog.json`, `.well-known/agent.json`, `.well-known/mcp.json` → 404 (zgodnie z briefem). Klucza IndexNow nie wykryto (nie ma pliku `/{key}.txt` w `public/`).
- Rekomendacja: `security.txt` (RFC 9116, 5 minut pracy); dla IndexNow najprościej włączyć Cloudflare Crawler Hints (automatyczne IndexNow dla Bing/Yandex) lub wywołanie `api.indexnow.org` po deployu; przy 4 stronach to niski priorytet. `llms.txt` i discovery dla agentów oceniane w wątku AI/GEO.

### T-18. Drobne
- Ważność: Info
- `https://netizo.agency/` → 526 (nieprawidłowy certyfikat origin; z logu `raw/technical/curl1.log` z 2026-10-09 i potwierdzone live). To inna domena niż serwis, ale jeśli jest publicznie używana (uchwyt `netizo.agency` w profilach social), powinna przekierowywać na `https://netizo.pl/` albo być wyłączona.
- Zewnętrzne linki do klientów (`treepro.pl`, `temar-mt.pl`, …) i `panel-klienta.netizo.pl` istnieją; panel jest poza zakresem (302 → `/login`, 200).
- Brak sygnałów awarii SSR: ale `AppServiceProvider.php:64-71` cicho przełącza na CSR przy błędzie serwera SSR (log co minutę). Warto dodać monitoring zewnętrzny sprawdzający obecność `<h1` w HTML `/`.

---

## Co działa dobrze (PASS)

- Crawlability: `robots.txt` (`User-agent: * / Allow: /` + `Sitemap:`) i sitemap walidują się; wszystkie ważne boty (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, CCBot, Applebot) dostają 200 i identyczne 455 004 B. `.env`, `.git/HEAD` → 403, `storage/logs/laravel.log` → 404.
- SSR: serwer zwraca pełną treść (1×H1, 14 H2, 34 H3, 48 linków, 22 `<img>`, 2 bloki JSON-LD, FAQ). Porównanie surowego HTML z DOM po renderze (Playwright `--mode always`): identyczne title, canonical, robots, H1/H2/H3, liczba linków i obrazów, JSON-LD; różnią się tylko żywe kafelki bento (liczby sprzedaży i faktury demo, ~14 fragmentów) i dekodowanie e-maili Cloudflare (T-08). Treść indeksowana nie zależy od JS, `is_spa=false`, `console_errors` puste. Strona działa też bez JS: wejściowe stany ukryte są pod `.js` + `prefers-reduced-motion` z awaryjnym zdjęciem po 5 s (`app.blade.php:49-58`).
- Statusy i przekierowania: http→https 301 w jednym skoku, `www` → apex 301, 404 jako prawdziwe 404 z własną stroną (`noindex`, bez soft 404), parametry śledzące nie tworzą duplikatów (canonical bez parametrów).
- Mobile: `<meta name="viewport" content="width=device-width, initial-scale=1">` bez blokady zoomu, `theme-color`, elementy dotykowe `min-h-11` (44 px) w linkach i przyciskach, obrazy z `width`/`height` (CLS 0 w labie).
- Wydajność serwera: HTTP/2 + h3 (`alt-svc`), Brotli, TLS 1.3, TTFB 0,10-0,22 s; hero LCP z `fetchpriority=high`, `loading=eager`, preload fontów woff2; CSS animacje hero bez zależności od JS.
- Hreflang/canonical (T-14): komplet i spójny; poprawna lokalizacja `html lang`, `og:locale`.
- Nagłówki: CSP ma `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'self'`, `form-action 'self'`; `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, ciasteczka `secure; httponly; samesite=lax`.
- Structured data: 2 bloki JSON-LD (ProfessionalService + FAQPage) parsują się poprawnie (`render_page` `valid: true`); rozszerzenia (telefon, logo, geo) do wątku schema.

## Kolejność wdrożenia (propozycja)

1. T-02 (usunąć/uzupełnić 3 martwe linki stopki; dodać politykę prywatności), T-01 (redirect `index.php` + `forceRootUrl`).
2. T-05 (czyszczenie sitemap), T-03 (HSTS w Cloudflare), T-09 (duplikaty nagłówków), T-08 (wyłączyć obfuskację e-mail).
3. T-06 (cache `immutable` dla `/build/assets`), T-10/T-11 (301 slash i www), T-13 (MIME manifestu).
4. T-07 (lazy dialogów/kreatora, logo jako `<use>`/plik), T-04 (CSP z nonce, Report-Only), T-12 (meta), T-15, T-16, T-17.

## Ocena kategorii

76/100: fundament jest solidny (poprawny SSR, spójne hreflang/canonical, szybki TTFB, brak blokad botów), ale punkty odejmują duplikaty `/index.php` ze self-canonical, 3 martwe linki w stopce każdej strony, brak HSTS i osłabiona CSP, zanieczyszczona sitemap (fragmenty `#`) oraz ciężki DOM/JS (LCP 3,9 s w labie mobile) przy słabym cache assetów.
