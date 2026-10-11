# Audyt mapy witryny — https://netizo.pl

Data audytu: 2026-10-11. Zakres: `https://netizo.pl/sitemap.xml` (statyczny plik `public/sitemap.xml`, identyczny z wersją na produkcji: `diff` bez różnic, 2385 B), `robots.txt`, spójność z canonical/hreflang w HTML, statusy URL, pokrycie vs crawl, propozycja poprawionego pliku i generowania dynamicznego.

Artefakty w `netizo.pl-audit/raw/sitemap/`: `live-sitemap.xml` (pobrany na żywo), `live-sitemap.headers`, `discovery.json` (sitemap_discovery.py), `url-status.tsv`, `sitemap.xsd`, `check-output.txt` (skrypt hreflang/reciprocity), `sitemap.proposed.xml` (poprawiony plik).

## Podsumowanie

Mapa jest techniczne poprawna i działa (poprawny XML, HTTP 200, wskazana w robots.txt, wszystkie 4 realne strony 200 z poprawnym hreflang), ale 4 z 8 wpisów to szum odziedziczony po poprzednim brandzie (Voxbit): adresy z fragmentem `#`, w tym `#stack` do nieistniejącej kotwicy, z nieaktualnym `lastmod` 2025-12-05. Plik jest utrzymywany ręcznie, więc `lastmod` nie śledzi zmian treści (projekty/klienci z panelu). Trzy podstrony prawne linkowane w stopce (`/regulamin`, `/polityka-prywatnosci`, `/utrzymanie`) zwracają 404, więc po ich utworzeniu trzeba je dodać do mapy.

### Wynik walidacji (pass/fail)

| Kontrola | Wynik | Dowód |
|---|---|---|
| Poprawność XML (well-formed) | PASS | `xmllint --noout` bez błędów; UTF-8; przestrzenie nazw `sitemaps.org/0.9` i `xhtml` zadeklarowane |
| Zgodność ze schematem `sitemap.xsd` | FAIL (Low) | `<lastmod>` stoi po `<xhtml:link>` (XSD wymaga loc, lastmod, changefreq, priority, dopiero potem elementy obcej przestrzeni nazw); xmllint: „Element lastmod: This element is not expected" w 4 wpisach (linie 8, 17, 50, 59 pliku live). Google to toleruje |
| Limity pliku (50 000 URL / 50 MB) | PASS | 8 wpisów, 2385 B (0,005% limitu); indeks sitemap niepotrzebny |
| Dostępność i nagłówki | PASS | HTTP/2 200, `content-type: text/xml; charset=utf-8`, ETag + `If-None-Match` → 304, brotli przy `Accept-Encoding: br`, `cf-cache-status: DYNAMIC` |
| Wskazanie w robots.txt | PASS | `Sitemap: https://netizo.pl/sitemap.xml` (URL bezwzględny, https); `User-agent: * / Allow: /` |
| sitemap_discovery.py | PASS | `declared`: 1 wpis; `found`: `https://netizo.pl/sitemap.xml` (źródło robots.txt, 200, `urlset`, valid=true); `/sitemap_index.xml`, `/sitemap-index.xml`, `/wp-sitemap.xml` → 404 (oczekiwane, nic nie deklarowane); `warnings: []`, `error: null`. Brak zadeklarowanych błędów do raportowania |
| Statusy URL | PASS (realne strony) | 4/4 realne adresy 200, bez przekierowań (`num_redirects=0`), bez `noindex` (`<meta name="robots" content="index, follow">`, brak `X-Robots-Tag`) |
| Adresy z fragmentem `#` | FAIL (Medium) | 4 z 8 wpisów (linie 22, 28, 34, 40) — patrz S-01 |
| Wiarygodność `lastmod` | FAIL (Medium) | 4 wpisy z 2025-12-05 vs 2026-10-09 — patrz S-02 |
| Zgodność `<loc>` z canonical | FAIL (Low) | `https://netizo.pl/` vs `https://netizo.pl` — patrz S-05 |
| hreflang: wzajemność, self-reference, x-default | PASS | Skrypt: 4 wpisy, każdy ma pl/en/x-default, odwołania wzajemne, x-default = wersja PL; zestawy identyczne z `<link rel="alternate">` w HTML (z dokładnością do ukośnika w stronie głównej) |
| `priority` / `changefreq` | FAIL (Info) | Obecne we wszystkich 8 wpisach, ignorowane przez Google |
| Pokrycie (crawl vs mapa) | PASS | 4 publiczne strony HTML = 4 URL w mapie; brak stron w crawlu bez wpisu w mapie |
| URL niedostępne / przekierowane / noindex w mapie | PASS | 0 stron 404/3xx/noindex (fragmenty to ten sam dokument `/`, status 200) |
| Quality gate stron lokalizacyjnych (30+ ostrzeżenie, 50+ stop) | PASS | 0 stron lokalizacyjnych w mapie; ~90 fraz miast jest tylko w `meta keywords`, nie ma stron „miasto + usługa" |

## Znaleziska

### S-01 — 4 z 8 wpisów to adresy z fragmentem `#` (w tym nieistniejąca kotwica `#stack`)
**Ważność: Medium**

Dowód:
- `public/sitemap.xml:22,28,34,40`: `https://netizo.pl/#stack`, `/#projekty`, `/#faq`, `/#kontakt`.
- Fragment nie jest wysyłany do serwera: `curl` na każdy z tych adresów zwraca ten sam dokument co `/` (HTTP 200, 455 004 B, `url_effective` identyczny). Google i Bing odrzucają fragment przy normalizacji URL, więc 5 wpisów (`/` + 4 fragmenty) wskazuje jeden adres `https://netizo.pl/` z dwiema różnymi wartościami `lastmod` (2026-10-09 i 2025-12-05) — skrypt kontrolny: „unique after fragment strip: 4" z 8 wpisów.
- Kotwica `#stack` nie istnieje w żadnej wersji strony. Obecne `id` na stronie głównej PL: `uslugi, projekty, misja, klienci, proces, panel, faq, newsletter, kontakt`; EN: `services, projects, mission, clients, process, client-portal, faq, newsletter, contact`. Spośród czterech wpisów istnieje w obu językach tylko `#faq`; `#projekty` i `#kontakt` istnieją wyłącznie w wersji PL (w EN: `#projects`, `#contact`), a `#stack` nigdzie.
- Wpisy te nie mają `xhtml:link` (hreflang), więc są niespójne z resztą pliku.
- Pochodzenie: plik z commitu `663329d` (2026-06-15, domena voxbit.pl), w `c875226` (2026-10-07) podmieniono tylko domenę.

Skutek: brak realnej szkody w rankingu (fragmenty są ignorowane), ale zaśmiecają mapę, sugerują 4 dodatkowe „strony", mylą narzędzia (Search Console pokaże je jako duplikaty/zignorowane) i psują wiarygodność całego pliku.

Rekomendacja: usunąć linie 21–44 z `public/sitemap.xml` (wszystkie 4 wpisy). Sekcje strony jednostronicowej nie wymagają osobnych wpisów; ewentualne linki do sekcji w wynikach (sitelinks) Google dobiera sam z linków wewnętrznych.

### S-02 — `lastmod` niewiarygodny: 4 wpisy z 2025-12-05, sprzeczne z 2026-10-09 dla tego samego dokumentu
**Ważność: Medium**

Dowód:
- `git show 663329d:public/sitemap.xml` (Initial commit, voxbit.pl): wszystkie 5 wpisów z `2025-12-05`; commit `c875226` zmienił domenę na netizo.pl, nie ruszając dat. Realne zmiany strony głównej są późniejsze (np. `3e22107`, 2026-10-09 16:08, stopka z social media).
- Dla 4 realnych stron `lastmod` 2026-10-09 jest zgodny z historią gita: ostatni commit zmieniający pliki strony głównej (`HomeController`, `lang/{pl,en}/home.php`, `resources/js/components/home`, `pages/home.tsx`) to `3e22107` z 2026-10-09; strony partnerów (`lang/{pl,en}/partners.php`, `components/partners`, `PartnerProgramController`) to `8e361b7` z 2026-10-09. Późniejsze commity (`29b15cf`, `203c2e8`, 2026-10-09 wieczór i 2026-10-11) dotyczą wyłącznie panelu `/admin`, więc słusznie nie podbijają `lastmod`. Format `YYYY-MM-DD` (W3C Datetime) poprawny, brak dat z przyszłości.
- Zgodność jest jednak przypadkowa: plik zapisano 2026-10-09 10:07 (mtime), a zmiana stopki była o 16:08 tego samego dnia — dzień się zgadza tylko dzięki granulacji dat.
- Google (dokumentacja sitemap): `lastmod` jest brany pod uwagę tylko wtedy, gdy jest konsekwentnie i weryfikowalnie dokładny; 4 z 8 nieaktualnych dat obniżają zaufanie do całego pola.

Rekomendacja: usunąć wpisy z S-01 (znika problem sprzeczności); dla pozostałych 4 stron utrzymywać `lastmod` automatycznie (S-04). Daty „ostatniej istotnej zmiany", nie daty deployu: deploy sam w sobie (np. `last-modified` pliku = 2026-10-11 07:58 UTC) nie jest zmianą treści.

### S-03 — Strony prawne linkowane w stopce nie istnieją (404), a po utworzeniu trzeba je dodać do mapy
**Ważność: Medium** (dla mapy; priorytet samego braku polityki prywatności oceniają kategorie On-page/Compliance)

Dowód:
- `resources/js/lib/site.ts:63-65` (PL) i `:69-71` (EN) linkują `/utrzymanie`, `/regulamin`, `/polityka-prywatnosci`; `curl` → 404 dla wszystkich trzech (`url-status.tsv`). Linki są w stopce każdej z 4 stron.
- Wersja EN stopki wskazuje te same polskie adresy z `hrefLang: 'pl'` (brak odpowiedników EN).
- Serwis zbiera dane przez 5 formularzy oraz GA4/Clarity, więc polityka prywatności jest w praktyce obowiązkowa.
- Mapa słusznie ich dziś nie zawiera (martwe URL w mapie byłyby błędem High).

Rekomendacja: po utworzeniu tras dopisać je do mapy jako wpisy tylko-PL (bez `xhtml:link`, dopóki nie ma bliźniaków `en.*`; z bliźniakami — pełny zestaw pl/en/x-default). W generatorze z S-04 wystarczy dopisać nazwę trasy do listy `PAGES` — `LocalizedRoutes::alternates()` zwraca `[]` dla trasy bez bliźniaka, co daje wpis bez hreflang. Do czasu publikacji nie dodawać ich do mapy.

### S-04 — Mapa jest plikiem statycznym, utrzymywanym ręcznie, równolegle do hreflang w HTML
**Ważność: Low**

Dowód:
- `public/sitemap.xml` nie jest generowany przez żaden kod (grep po repo: „sitemap" tylko w `CLAUDE.md`, `public/robots.txt`, `public/sitemap.xml` i jednym zdaniu FAQ w `lang/en/home.php`); brak testu mapy w `tests/Feature`.
- hreflang jest utrzymywany w dwóch miejscach: dynamicznie w `Controller::localizedSeo()` (`app/Http/Controllers/Controller.php:38-49`, źródło `LocalizedRoutes::alternates()`, `app/Services/LocalizedRoutes.php:51`) oraz ręcznie w pliku XML. Dziś są zgodne, ale każda nowa strona wymaga dwóch niezależnych zmian.
- Treść strony głównej zależy od danych z panelu (`Project::active()`, `Client::active()` w `HomeController::index`), a ręczny plik nie reaguje na ich zmiany.

Rekomendacja: generować mapę z tras (szkic w sekcji „Generowanie dynamiczne"), z `lastmod` z `updated_at` projektów/klientów i daty treści ze configu/gita, plus test spójności. Priorytet niski, bo serwis ma 4 URL; rośnie wraz z S-03 i każdą nową podstroną.

### S-05 — `<loc>` strony głównej z ukośnikiem, canonical i hreflang w HTML bez
**Ważność: Low**

Dowód:
- Sitemap: `<loc>https://netizo.pl/</loc>` i `hreflang` pl/x-default `href="https://netizo.pl/"` (linie 4, 5, 7, 14, 16).
- HTML `home-pl.html`: `<link rel="canonical" href="https://netizo.pl">`, `hreflang="pl"` i `x-default` → `https://netizo.pl`, `og:url` → `https://netizo.pl`; to wynik `route('home')` (Laravel obcina końcowy `/`).
- RFC 3986 / Google traktują oba zapisy jako ten sam URL (żądanie to w obu przypadkach `GET /`), więc nie ma realnej szkody; kontrola string-w-string wskazuje jednak rozbieżność (`loc_exact=False` w `check-output.txt`), a narzędzia SEO mogą zgłaszać „canonical ≠ URL w mapie".

Rekomendacja: ujednolicić na zapis zgodny z HTML, czyli bez końcowego ukośnika (poprawiony plik poniżej). Odwrotna zmiana (ukośnik w canonical) wymagałaby zmian w `LocalizedRoutes`/`Controller` i w `tests/Feature/HomePageTest.php:327-330` (testy używają `url('/')` = bez ukośnika), więc nie jest warta zachodu.

### S-06 — Kolejność elementów w `<url>` niezgodna z XSD
**Ważność: Low**

Dowód: `xmllint --schema sitemap.xsd` na pliku live: `lastmod` „is not expected" w czterech wpisach, bo stoi po `xhtml:link`. Po przeniesieniu `lastmod` zaraz za `loc` i poluzowaniu wildcardu dla przestrzeni xhtml (brak XSD dla xhtml w standardowym schemacie) poprawiony plik waliduje się bez błędów.

Rekomendacja: kolejność `loc` → `lastmod` → (`changefreq`, `priority` — jeśli zostają) → `xhtml:link`. Uwzględnione w poprawionym pliku.

### S-07 — `priority` i `changefreq` we wszystkich wpisach
**Ważność: Info**

Dowód: `public/sitemap.xml` — 8× `<changefreq>` i 8× `<priority>` (1.0, 0.9, 0.8, 0.8, 0.7, 0.9, 0.6, 0.5). Google oba pola ignoruje (Bing opiera się głównie na `lastmod`). Wartości są też mało wiarygodne: `weekly` dla strony głównej, która nie zmienia się co tydzień; `/#kontakt` 0.9 przy `/en` 0.9.

Rekomendacja: usunąć (poprawiony plik).

### S-08 — Brak weryfikacji zgłoszenia mapy w Search Console / Bing Webmaster
**Ważność: Info**

Dowód: brak dostępu do GSC/Bing (brak poświadczeń w briefie), więc nie da się sprawdzić statusu „Pomyślnie przetworzono", liczby odkrytych URL ani ewentualnego przypadku „Zduplikowana strona, użytkownik nie wybrał strony kanonicznej" po fragmentach.

Rekomendacja: po wdrożeniu poprawionej mapy ponownie przesłać `https://netizo.pl/sitemap.xml` w GSC (Indeksowanie → Mapy witryny) i Bing Webmaster Tools; sprawdzić raport „Strony" pod kątem `/index.php` (patrz uwaga poniżej).

### Uwaga pomocnicza (poza zakresem mapy)
`https://netizo.pl/index.php` zwraca 200 z canonical `https://netizo.pl/index.php` (wg briefu) — duplikat strony głównej niewystępujący w mapie (słusznie), ale warto go przekierować 301 na `/` w innej kategorii audytu. `/en/` i `/partnerzy/` zwracają 200 z canonicalem bez ukośnika; mapa używa prawidłowych form.

## Pokrycie: crawl vs mapa

| URL (crawl) | W mapie | HTTP | canonical | hreflang w HTML = mapa |
|---|---|---|---|---|
| `https://netizo.pl` | tak (`/`) | 200 | self (`https://netizo.pl`) | tak (po normalizacji `/`) |
| `https://netizo.pl/en` | tak | 200 | self | tak (dokładnie) |
| `https://netizo.pl/partnerzy` | tak | 200 | self | tak (dokładnie) |
| `https://netizo.pl/en/partners` | tak | 200 | self | tak (dokładnie) |

Brakujące strony (w crawlu, ale nie w mapie): brak. Nadmiarowe wpisy (w mapie, ale nie strony): 4 fragmenty z S-01. Strony 404/301 w mapie: brak. Podstrony usług, blog, case studies nie istnieją (brief), więc nie ma czego dodawać poza stronami prawnymi (S-03). Panel `/admin` (302 → `/admin/login`) jest poza mapą, zgodnie z oczekiwaniem.

## Proponowany sitemap.xml (gotowy do wklejenia w `public/sitemap.xml`)

Zmiany: usunięte 4 fragmenty, usunięte `changefreq`/`priority`, `lastmod` tuż po `loc`, `<loc>` i hreflang strony głównej bez końcowego ukośnika (dokładnie jak canonical). Plik kontrolny: `raw/sitemap/sitemap.proposed.xml` — well-formed, waliduje się względem `sitemap.xsd` (wildcard xhtml w trybie lax), skrypt wzajemności hreflang: zero uwag, `<loc>` i hreflang równe canonicalom z HTML (`exact=True` dla wszystkich 4).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://netizo.pl</loc>
    <lastmod>2026-10-09</lastmod>
    <xhtml:link rel="alternate" hreflang="pl" href="https://netizo.pl"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://netizo.pl/en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://netizo.pl"/>
  </url>
  <url>
    <loc>https://netizo.pl/en</loc>
    <lastmod>2026-10-09</lastmod>
    <xhtml:link rel="alternate" hreflang="pl" href="https://netizo.pl"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://netizo.pl/en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://netizo.pl"/>
  </url>
  <url>
    <loc>https://netizo.pl/partnerzy</loc>
    <lastmod>2026-10-09</lastmod>
    <xhtml:link rel="alternate" hreflang="pl" href="https://netizo.pl/partnerzy"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://netizo.pl/en/partners"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://netizo.pl/partnerzy"/>
  </url>
  <url>
    <loc>https://netizo.pl/en/partners</loc>
    <lastmod>2026-10-09</lastmod>
    <xhtml:link rel="alternate" hreflang="pl" href="https://netizo.pl/partnerzy"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://netizo.pl/en/partners"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://netizo.pl/partnerzy"/>
  </url>
</urlset>
```

Przy ręcznym utrzymaniu: `lastmod` podbijać tylko przy istotnej zmianie treści danej strony (nie przy deployu); po dodaniu projektu/klienta w panelu podbić `lastmod` strony głównej (PL i EN). Po przejściu na generowanie z tras (niżej) pole przestaje być ręczne.

## Generowanie dynamiczne z tras (szkic, niezweryfikowany w repo; repo nie było modyfikowane)

Cel: jedno źródło prawdy dla URL i hreflang (to samo `LocalizedRoutes::alternates()`, którego używa `Controller::localizedSeo()`), prawdziwy `lastmod`, brak ręcznej synchronizacji. Bez nowych zależności (bez `spatie/laravel-sitemap`).

Założenia i uwagi wdrożeniowe:
- Usunąć `public/sitemap.xml`, inaczej serwer WWW poda plik statyczny przed Laravelem.
- Trasę `GET /sitemap.xml` zarejestrować poza grupą `web` (np. w `then:` w `bootstrap/app.php`, jak `routes/admin.php`), żeby odpowiedź nie dostawała ciasteczek sesji/XSRF ani nie przechodziła przez `HandleInertiaRequests`.
- Kanoniczne URL-e z `route()`/`LocalizedRoutes` dają dokładnie ten sam zapis co canonical w HTML (`https://netizo.pl` bez ukośnika), więc S-05 znika automatycznie.
- W Blade nagłówek XML wypisać przez `{!! '<?xml version="1.0" encoding="UTF-8"?>' !!}` (unikanie interpretacji `<?xml` jako short tag PHP).

`app/Services/Sitemap.php`:

```php
<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Project;
use Carbon\CarbonImmutable;

/**
 * Indexable pages for sitemap.xml: one entry per page and language, hreflang from LocalizedRoutes.
 */
class Sitemap
{
    /** Polish route names of the indexable pages; the English twin (`en.<name>`) is picked up by LocalizedRoutes. */
    public const PAGES = ['home', 'partners'];

    /**
     * @return list<array{loc: string, lastmod: string, alternates: array<string, string>}>
     */
    public function entries(): array
    {
        $entries = [];

        foreach (self::PAGES as $name) {
            $alternates = LocalizedRoutes::alternates($name);
            $urls = $alternates === [] ? [route($name)] : array_values($alternates);

            if ($alternates !== []) {
                $alternates['x-default'] = $alternates[LocalizedRoutes::DEFAULT_LOCALE];
            }

            foreach ($urls as $url) {
                $entries[] = ['loc' => $url, 'lastmod' => $this->lastmod($name), 'alternates' => $alternates];
            }
        }

        return $entries;
    }

    /**
     * Date of the last significant change: the content date from config/sitemap.php, and for the home page also the
     * newest change of an active project or client edited in the admin panel.
     */
    private function lastmod(string $page): string
    {
        $dates = [config("sitemap.lastmod.{$page}")];

        if ($page === 'home') {
            $dates[] = Project::active()->max('updated_at');
            $dates[] = Client::active()->max('updated_at');
        }

        return collect($dates)
            ->filter()
            ->map(fn (string $date): CarbonImmutable => CarbonImmutable::parse($date))
            ->max()
            ->toDateString();
    }
}
```

`config/sitemap.php` (daty treści statycznej; ustawiane w deployu z gita, żeby nie były ręczne):

```php
<?php

return [
    'lastmod' => [
        'home' => env('SITEMAP_LASTMOD_HOME', '2026-10-09'),
        'partners' => env('SITEMAP_LASTMOD_PARTNERS', '2026-10-09'),
    ],
];
```

W skrypcie deployu, gdzie jest `.git`: `SITEMAP_LASTMOD_HOME=$(git log -1 --format=%cs -- lang/pl/home.php lang/en/home.php app/Http/Controllers/HomeController.php resources/js/pages/home.tsx resources/js/components/home)` i analogicznie dla partnerów (`lang/{pl,en}/partners.php`, `app/Http/Controllers/PartnerProgramController.php`, `resources/js/pages/partners.tsx`, `resources/js/components/partners`). Alternatywa bez gita: ręcznie podbijana data w configu przy zmianie treści (prostsze, ale znów ręczne).

`app/Http/Controllers/SitemapController.php` (invokable, `php artisan make:controller SitemapController --invokable`):

```php
public function __invoke(Sitemap $sitemap): Response
{
    $xml = Cache::remember('sitemap.xml', now()->addHour(), fn (): string => view('sitemap', [
        'entries' => $sitemap->entries(),
    ])->render());

    return response($xml, 200, [
        'Content-Type' => 'application/xml; charset=utf-8',
        'Cache-Control' => 'public, max-age=3600',
    ]);
}
```

`resources/views/sitemap.blade.php`:

```blade
{!! '<?xml version="1.0" encoding="UTF-8"?>' !!}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
@foreach ($entries as $entry)
    <url>
        <loc>{{ $entry['loc'] }}</loc>
        <lastmod>{{ $entry['lastmod'] }}</lastmod>
@foreach ($entry['alternates'] as $locale => $href)
        <xhtml:link rel="alternate" hreflang="{{ $locale }}" href="{{ $href }}"/>
@endforeach
    </url>
@endforeach
</urlset>
```

Trasa (poza grupą `web`): `Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');`. Strony prawne z S-03 dodaje się jedną linią w `Sitemap::PAGES` (np. `'privacy'`, `'terms'`, `'maintenance'` — jako trasy PL bez bliźniaka: wpis bez hreflang) i wpisem w `config/sitemap.php`.

Test Pest (`tests/Feature/SitemapTest.php`, szkic): pobrać `/sitemap.xml`, `simplexml_load_string`, sprawdzić że (1) lista `<loc>` to dokładnie `[url('/'), url('/en'), url('/partnerzy'), url('/en/partners')]`, (2) żaden `loc` nie zawiera `#`, (3) każdy `loc` zwraca 200 i zawiera `<link rel="canonical" href="{loc}">` (spójność z canonical), (4) wzajemność hreflang, (5) `lastmod` pasuje do `^\d{4}-\d{2}-\d{2}$` i nie jest z przyszłości. Opcjonalny test-strażnik: każda publiczna trasa GET (poza `admin.*`, `up`, `sitemap`) jest w `Sitemap::PAGES` albo na liście wyjątków — wtedy nowa strona nie wypadnie z mapy.

Alternatywa prostsza: komenda `php artisan sitemap:generate` zapisująca `public/sitemap.xml` przy deployu. Gorsza, bo po edycji projektu w panelu plik jest nieaktualny do następnego deployu — czyli znów niewiarygodny `lastmod`. Wersja z kontrolerem (żądanie + cache 1 h) jest do polecenia.

## Plan działania (kolejność)

1. Podmienić `public/sitemap.xml` na plik z sekcji „Proponowany sitemap.xml" (usuwa S-01, S-02, S-05, S-06, S-07 jednym ruchem; 5 minut).
2. Utworzyć i opublikować strony `/polityka-prywatnosci`, `/regulamin` (i `/utrzymanie`) albo usunąć linki z `resources/js/lib/site.ts:63-65,69-71`; po publikacji dodać do mapy (S-03).
3. Przejść na generowanie dynamiczne + test (S-04).
4. Ponownie przesłać mapę w GSC i Bing Webmaster (S-08).

## Dane strukturalne (do audit-data.json, kategoria „Sitemap")

```json
{
  "category": "Sitemap",
  "score": 72,
  "checks": {
    "xml_valid": true,
    "xsd_valid": false,
    "url_count": 8,
    "size_bytes": 2385,
    "within_limits": true,
    "declared_in_robots": true,
    "discovery_found": ["https://netizo.pl/sitemap.xml"],
    "all_real_urls_200": true,
    "fragment_urls": 4,
    "deprecated_tags": ["priority", "changefreq"],
    "hreflang_reciprocal": true,
    "x_default": true,
    "coverage_crawl_vs_sitemap": "4/4"
  },
  "findings": [
    {"id": "S-01", "severity": "Medium", "title": "4 z 8 wpisow to adresy z fragmentem #", "file": "public/sitemap.xml:22-44"},
    {"id": "S-02", "severity": "Medium", "title": "lastmod 2025-12-05 nieaktualny i sprzeczny z 2026-10-09", "file": "public/sitemap.xml:23,29,35,41"},
    {"id": "S-03", "severity": "Medium", "title": "Strony prawne w stopce zwracaja 404, do dodania do mapy po utworzeniu", "file": "resources/js/lib/site.ts:63-71"},
    {"id": "S-04", "severity": "Low", "title": "Mapa statyczna, utrzymywana recznie, rownolegle do hreflang w HTML", "file": "public/sitemap.xml"},
    {"id": "S-05", "severity": "Low", "title": "loc strony glownej z ukosnikiem, canonical bez", "file": "public/sitemap.xml:4-7"},
    {"id": "S-06", "severity": "Low", "title": "Kolejnosc elementow url niezgodna z XSD (lastmod po xhtml:link)", "file": "public/sitemap.xml"},
    {"id": "S-07", "severity": "Info", "title": "priority i changefreq ignorowane przez Google", "file": "public/sitemap.xml"},
    {"id": "S-08", "severity": "Info", "title": "Brak weryfikacji zgloszenia mapy w GSC/Bing (brak dostepu)", "file": null}
  ]
}
```

## Ocena kategorii

72/100 — mapa działa poprawnie (poprawny XML, 200, wskazana w robots.txt, 4/4 stron z wzajemnym hreflang i x-default), ale punkty tracą: 4 z 8 wpisów z fragmentem `#` i nieaktualnym `lastmod` z poprzedniego brandu, ręczne utrzymanie pliku, niespójny zapis URL strony głównej względem canonical oraz niezaimplementowany plan dla stron prawnych linkowanych w stopce (404).
