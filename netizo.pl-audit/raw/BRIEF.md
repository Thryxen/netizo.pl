# Wspólny brief audytu SEO — https://netizo.pl (2026-10-11)

## Zasady dla agentów
- Uruchamiaj skrypty pluginu ZAWSZE z prefiksem:
  `CLAUDE_SEO_PYTHON=/Users/thryxen/.local/share/uv/python/cpython-3.12-macos-aarch64-none/bin/python3.12 "/Users/thryxen/.claude/plugins/cache/agricidaniel-claude-seo/claude-seo/2.4.2/scripts/claude-seo" run <script>.py ...`
  (system ma tylko Pythona 3.9; runtime pluginu jest już po `setup`).
- W zsh NIE używaj zmiennej o nazwie `path` (nadpisuje PATH). Adresy z `?` w pętlach dawaj w pojedynczych cudzysłowach.
- NIE modyfikuj kodu projektu (`/Users/thryxen/PhpstormProjects/netizo.pl`) — tylko go czytaj, żeby wskazywać konkretne pliki do poprawy (`plik:linia`).
- Zapisuj wyłącznie do `/Users/thryxen/PhpstormProjects/netizo.pl/netizo.pl-audit/` (findings, screenshots, raw).
- Nie wysyłaj formularzy, nie loguj się do /admin, max ~1 req/s do netizo.pl.
- Findings pisz PO POLSKU (identyfikatory, nazwy plików i terminy techniczne w oryginale). Każde znalezisko: tytuł, ważność (Critical/High/Medium/Low/Info), dowód (co dokładnie zmierzono), rekomendacja (konkretny fix, najlepiej z plikiem w repo).
- Najpierw zapisz częściowy plik findings po pierwszym przebiegu, na końcu go nadpisz pełną wersją.
- Na końcu pliku findings dodaj sekcję `## Ocena kategorii` z liczbą 0–100 i 1-zdaniowym uzasadnieniem.

## Witryna
- Netizo — agencja interaktywna / software house (strony WWW, aplikacje webowe, sklepy), siedziba Leszno (wielkopolskie), obsługa całej Polski; tel. +48 884 343 924. Typ: usługi profesjonalne B2B, hybryda SAB (lokalnie Leszno + region, zdalnie cała PL), dwujęzyczna (PL bez prefiksu, EN pod /en).
- Stack: Laravel 12 + Inertia v3 + React 19 SSR, za Cloudflare. Kod źródłowy w `/Users/thryxen/PhpstormProjects/netizo.pl` (patrz `CLAUDE.md` w repo — opisuje architekturę, SEO, i18n).
- Publiczne strony HTML (całość serwisu): `https://netizo.pl/`, `https://netizo.pl/partnerzy`, `https://netizo.pl/en`, `https://netizo.pl/en/partners`. Brak bloga / podstron usług / case studies.

## Surowe dane (już pobrane) — `netizo.pl-audit/raw/`
- `home-pl.html|.headers`, `partners-pl.*`, `home-en.*`, `partners-en.*` — HTML SSR + nagłówki (UA Chrome desktop).
- `home-render.json` — wynik `render_page.py --mode auto --json` dla strony głównej (is_spa=false).
- `file_robots_txt`, `file_sitemap_xml`, `file_*` — pliki discovery; `checks.txt` — przekierowania i dostęp botów.

## Ustalone fakty (nie trzeba ponownie mierzyć, ale można zweryfikować)
- Wszystkie 4 strony: 200, HTTP/2, TTFB ~0.10–0.19 s; `cache-control: no-cache, private`, `cf-cache-status: DYNAMIC`.
- HTML strony głównej ~455 KB (PL) / ~453 KB (EN), partnerzy ~179 KB.
- Brak nagłówka HSTS. Zduplikowane `x-content-type-options` i `x-frame-options`. CSP z `'unsafe-inline' 'unsafe-eval'` i Trusted Types.
- robots.txt: `User-agent: * / Allow: /` + Sitemap. Wszystkie boty (Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, CCBot, Applebot) dostają 200.
- Brak: llms.txt, llms-full.txt, /.well-known/security.txt, ai-catalog.json, agent/mcp discovery (404).
- `manifest.webmanifest?v=3` → 200, ale `content-type: application/octet-stream`.
- Przekierowania: http→https 301; http://www → https://www → apex (2 skoki); `/en/` i `/partnerzy/` → 200 (canonical poprawnie wskazuje wersję bez slasha); `/index.php` → 200 z canonical `https://netizo.pl/index.php` (duplikat!); `/?utm_source=…` → canonical `https://netizo.pl` (OK); `/PARTNERZY` → 404.
- Linki w stopce na KAŻDEJ stronie: `/utrzymanie`, `/regulamin`, `/polityka-prywatnosci` → 404 (źródło: `resources/js/lib/site.ts:63-71`). Strona zbiera leady (5 formularzy) i używa GA4 (G-2L7MT88BQT) + Microsoft Clarity + baner cookies.
- sitemap.xml (statyczny `public/sitemap.xml`): 8 `<url>`, w tym 4 adresy z fragmentem (`/#stack`, `/#projekty`, `/#faq`, `/#kontakt`; anchor `#stack` nie istnieje), hreflang w sitemapie dla 4 właściwych stron.
- `<head>` strony głównej PL: title „Tworzymy Strony WWW dla Ambitnych Firm | Netizo”, meta description (~200 zn.), meta keywords z ~90 frazami miast (Leszno, Poznań, Wrocław, Rawicz, Miejska Górka…), canonical + hreflang pl/en/x-default, OG/Twitter, JSON-LD `ProfessionalService` (adres: tylko Leszno/wielkopolskie/PL, sameAs FB/IG/TikTok, brak telefonu/geo/logo) + `FAQPage`.
- Zewnętrzne linki do projektów klientów: treepro.pl, temar-mt.pl, nakazdaokazje.pl, leasingodreki.pl, krainamt2.pl, energizo.pl; panel klienta panel-klienta.netizo.pl.
- Brak poświadczeń Google API (GSC/CrUX/GA4), Matomo, Moz. Dostępny Common Crawl Web Graph. Brak bazy drift.
