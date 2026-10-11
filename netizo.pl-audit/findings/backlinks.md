# Profil linków zwrotnych — netizo.pl (audyt 2026-10-11)

Poziom źródeł: **Tier 0** (Common Crawl Web Graph + Backlink Verification Crawler). Brak Moz, Bing Webmaster, DataForSEO, GSC. W konsekwencji **nie istnieją dane o liczbie domen linkujących, rozkładzie jakości, anchorach, toksyczności, tempie przyrostu ani geografii**. Nie podaję tych liczb i nie liczę Backlink Health Score (patrz `## Ocena kategorii`).

Etykiety źródeł: `CC (0.50)` = Common Crawl, domenowo; `Verify (0.95)` = crawler weryfikacyjny / bezpośredni odczyt HTML; `Parsed (0.95)` = HTML zapisany w `raw/`; `Zewn. (0.70)` = publiczne API (Wayback CDX, DNS).

## Podsumowanie

| Obszar | Wynik | Źródło |
|---|---|---|
| Netizo.pl w Common Crawl Web Graph (cc-main-2026-jan-feb-mar) | Brak domeny w grafie (brak PageRank / harmonic centrality) | CC (0.50) + własny pełny skan pliku rankingów |
| Domeny linkujące (liczba) | **Brak danych** | brak źródła |
| Bezpośrednie linki z 6 stron klientów do `netizo.pl` | **0 / 6** | Verify (0.95) |
| Linki z 5 działających stron klientów do `voxbit.pl` (stara marka) | **5 / 5 zweryfikowane**, bez `nofollow` | Verify (0.95) |
| `voxbit.pl` → `netizo.pl` | 301 na stronę główną dla każdej testowanej ścieżki | Verify (0.95) |
| Historia starych URL-i (link reclamation) | Brak materiału do odzyskania (0 zarchiwizowanych URL-i `voxbit.pl` w Wayback) | Zewn. (0.70) |
| Katalogi (Clutch/Sortlist/GoodFirms), media lokalne, wzmianki bez linku | **Nie zweryfikowano** | patrz „Czego nie sprawdziłem” |

## Znaleziska

### 1. Stopki 5 działających stron klientów linkują do starej marki `voxbit.pl`, a żadna do `netizo.pl` — High
**Dowód (Verify 0.95):** `verify_backlinks.py --target https://netizo.pl` dla 6 stron klientów dał 6/6 `link_removed` (HTTP 200, brak linku). Wyszukanie ciągu „netizo” w surowym HTML wszystkich 6 stron: 0 trafień. Ten sam crawler z `--target https://voxbit.pl` dał 5 `verified` i 1 `link_removed` (temar-mt.pl, patrz #4):

| Strona | Anchor / tekst | Element graficzny | rel | Uwagi |
|---|---|---|---|---|
| treepro.pl | „Strona stworzona przez” | `<img alt="Voxbit">` hotlink z `voxbit.pl/assets/images/logo.svg` | noopener noreferrer | sitemap: 1 URL |
| nakazdaokazje.pl | „Strona stworzona przez” | inline SVG `aria-label="Voxbit"` | noopener | stopka potwierdzona też na `/kontakt`; sitemap: 27 `<loc>` |
| leasingodreki.pl | pusty tekst linku | `<img alt="Voxbit">` hotlink z `voxbit.pl/assets/images/logo.svg` | noopener noreferrer | `/sitemap.xml` zwraca 404 |
| krainamt2.pl | „Strona napisana przez” | `<img alt="voxbit.pl">` (własna kopia `krainamt2.pl/assets/images/voxbit.svg`, 200 `image/svg+xml`) | noopener noreferrer | stopka potwierdzona też na `/cs`; sitemapy: pages 119, guides 35, servers 61 `<loc>` (pozostałych 5 sitemap nie liczyłem) |
| energizo.pl | „Strona stworzona przez” | inline SVG logo Voxbit | noopener | sitemap: 7 `<loc>`, część to kotwice `/#…` |

Żaden z linków nie ma `nofollow`/`sponsored`/`ugc`. Stopka jest ponadstronowa, ale potwierdziłem ją tylko na stronie głównej i jednej podstronie dla krainamt2.pl i nakazdaokazje.pl. Liczby linków na pozostałych podstronach nie znam.

**Skutek:** nazwa marki w anchorze/alt to „Voxbit”, więc sygnał marki nie wspiera „Netizo”. Link przechodzi przez redirect (#2). Według dokumentowanego stanowiska Google przekierowania 301 przekazują sygnały. Nie zmierzyłem tego tutaj.
**Rekomendacja:** podmienić stopki na `<a href="https://netizo.pl" rel="noopener">` z tekstem „Realizacja: Netizo” i logo/`alt="Netizo"`. Nie dodawać `nofollow`. Kolejność: najpierw krainamt2.pl (największy serwis wg sitemap), potem nakazdaokazje.pl. Czy Netizo ma dostęp do kodu tych serwisów — nie wiem. Link w `resources/js/…` repozytorium netizo.pl tego nie naprawi, bo to osobne projekty.

### 2. Zhotlinkowane logo `voxbit.pl/assets/images/logo.svg` (treepro.pl, leasingodreki.pl) prowadzi dziś na stronę HTML — Medium
**Dowód (Verify 0.95):** `curl -L https://voxbit.pl/assets/images/logo.svg` kończy na `https://netizo.pl/`, `content-type: text/html; charset=utf-8`, 1 redirect. Przeglądarka nie wyrenderuje HTML jako obrazu. Nie otwierałem tych stron w przeglądarce, więc „uszkodzone logo” jest wnioskiem z typu zawartości, nie obserwacją wizualną.
**Rekomendacja:** w obu stopkach zastąpić hotlink własnym plikiem Netizo (jak zrobiono w krainamt2.pl, które trzyma logo u siebie).

### 3. `voxbit.pl` — przekierowanie 301 na stronę główną dla wszystkich ścieżek; brak historii do odzyskania — Low / Info
**Dowód:**
- `https://voxbit.pl/` oraz `/assets/images/logo.svg`, `/robots.txt`, `/sitemap.xml`, `/kontakt`, `/uslugi`, `/blog` → 301 `https://netizo.pl/` (Verify 0.95). `https://www.voxbit.pl` → 301 `https://netizo.pl/` w jednym skoku.
- NS `voxbit.pl` = `aliza.ns.cloudflare.com` / `isaac.ns.cloudflare.com` (te same co `netizo.pl`).
- Wayback CDX: `voxbit.pl` → 0 zarchiwizowanych URL-i; `netizo.pl` → 1 zapis z 2024-03-20, status 525 (Zewn. 0.70). Nie ma więc znanych starych adresów, które trzeba mapować 1:1.
- Repozytorium wspomina Voxbit tylko jako starą markę (`CLAUDE.md:151`) i projekt pomocniczy `voxbit-center` w `docs/superpowers/…`. Pierwszy commit repo: 2026-06-15.

**Uwaga o DNS:** lokalny resolver maszyny audytowej (router 192.168.1.1) zwracał pustą odpowiedź A dla `voxbit.pl` (curl: „Could not resolve host”), a 1.1.1.1, 8.8.8.8 i 9.9.9.9 zwracały 104.21.9.5 i 172.67.140.205. Redirect testowałem przez `--resolve voxbit.pl:443:104.21.9.5`. Uznaję to za artefakt lokalnej sieci, ale **nie sprawdziłem tego z innych sieci**. W `.pl` istnieje rekord DS dla `voxbit.pl`. Przyczyny pustej odpowiedzi nie ustaliłem.
**Rekomendacja:** zostawić 301 co najmniej do czasu podmiany stopek (#1). Zalecane sprawdzenie `voxbit.pl` z innej sieci/resolvera oraz czy rekord DS zgadza się z kluczami w Cloudflare. Redirect `/robots.txt` i `/sitemap.xml` na HTML strony głównej jest nietypowy. Jeśli ma sens, wyłączyć te dwie ścieżki z reguły Cloudflare.

### 4. temar-mt.pl to domyślna strona hostingu, a netizo.pl linkuje do niej jako do realizacji — Medium
**Dowód (Parsed 0.95 + Verify 0.95):** `https://temar-mt.pl/` → 200, `<title>Strona domyślna</title>`, tekst „To jest strona domyślna. Aby ją zmienić, wgraj pliki do katalogu public_html”, znacznik „utworzono: Mon Sep 7 19:27:09 2026”, logo Seohost. Link w `home-pl.html` i `home-en.html`: `https://temar-mt.pl`, `rel="noopener noreferrer"`.
**Rekomendacja:** ukryć lub oznaczyć projekt w panelu `/admin/projects`, dopóki strona nie zostanie wdrożona. Nie sprawdzałem rekordów w bazie, więc nie wskażę rekordu. Po wdrożeniu dodać w stopce temar-mt.pl link „Realizacja: Netizo” zgodnie z #1.

### 5. Common Crawl: netizo.pl nie ma w grafie, a narzędzie CC pluginu daje fałszywe negatywy — Info
**Dowód (CC 0.50):**
- `commoncrawl_graph.py` dla `netizo.pl`, `voxbit.pl`, `netizo.agency`, `cdn.netizo.pl` i 5 domen klientów: `in_crawl=false`, `in_rankings=false`, wszystkie metryki `null`. Release: `cc-main-2026-jan-feb-mar`.
- To samo narzędzie zwróciło „nie znaleziono” także dla `allegro.pl`, `onet.pl` i `wp.pl`, a dla `google.com` `in_rankings=false`. Wynik narzędzia jest więc **niewiarygodny**; przyczyny nie ustaliłem.
- Dlatego przeskanowałem niezależnie cały plik `…-domain-ranks.txt.gz` (2 365 541 332 B, strumień zakończony bez błędu gzip, 120 025 754 wierszy): są m.in. `com.google` (rank harmonic 3), `pl.allegro` (3591), `pl.onet` (4659), `co.clutch` (2217), `co.goodfirms` (825), `com.sortlist` (501702). **Nie ma** `pl.netizo`, `pl.voxbit`, `agency.netizo`, ani domen: treepro.pl, temar-mt.pl, nakazdaokazje.pl, leasingodreki.pl, krainamt2.pl, energizo.pl. Skan dotyczył tylko wpisanych nazw domen.
- Graf obejmuje crawl z I kwartału 2026, a repozytorium netizo.pl ma pierwszy commit 2026-06-15.
- Zapytania do `index.commoncrawl.org` dały 504/502 (netizo.pl) lub 404 „brak zapisów” (voxbit.pl, krainamt2.pl w wybranych crawlach). Traktuję je jako niejednoznaczne.

**Interpretacja:** brak w grafie **nie oznacza niskiej autorytatywności** — domena po prostu nie została wykryta w tym wydaniu. Nie da się z tego wyciągnąć liczby domen linkujących. Kolejne wydanie grafu (kwartalne, https://commoncrawl.org/web-graphs) może ją zawierać.

### 6. panel-klienta.netizo.pl — indeksowalna strona logowania, bez linku powrotnego — Low
**Dowód (Parsed 0.95):** `/` → 302 `/login` → 200; `<title>Netizo</title>`; `<meta name="robots" content="index, follow">`; canonical `https://panel-klienta.netizo.pl/login`; robots.txt `Allow: /` + Sitemap (zawartości sitemapy nie sprawdzałem). W HTML strony logowania nie ma żadnego `<a>` do `netizo.pl`. `netizo.pl` linkuje do panelu z `rel="noopener"` na wszystkich 4 stronach (`resources/js/lib/site.ts:16`, `clientPanelUrl`).
**Rekomendacja:** w osobnym repo panelu: `noindex` dla `/login` oraz opcjonalnie link „Netizo” do `https://netizo.pl` w stopce. Wartość SEO takiego linku z subdomeny jest niska. Chodzi głównie o spójność marki.

### 7. Profile społecznościowe — linkowane z witryny, istnienie profili nie zweryfikowane — Low / Info
**Dowód (Parsed 0.95):** `sameAs` w JSON-LD oraz stopka: `facebook.com/netizo.agency`, `instagram.com/netizo.agency`, `tiktok.com/@netizo.agency` (`config/socials.php`, wartości z `.env`), `rel="noopener noreferrer"`. Zapytania curl: Facebook HTTP 400, Instagram i TikTok HTTP 200 z ogólnymi tytułami strony. To nie dowodzi istnienia profilu. **Nie zweryfikowałem**, czy profile istnieją, czy mają link do `https://netizo.pl` w opisie ani ilu mają obserwujących.
**Rekomendacja:** ręcznie sprawdzić, że bio każdego profilu zawiera `https://netizo.pl`. Takie linki zwykle nie przekazują wartości rankingowej, ale wzmacniają spójność encji (NAP/sameAs).

## Czego nie sprawdziłem
- Liczba i jakość domen linkujących, anchor text, spam, tempo przyrostu, follow/nofollow, geografia — **brak źródła** (Tier 0).
- Obecność w Clutch, Sortlist, GoodFirms, polskich katalogach firm, Google Business Profile — nie sprawdzałem. Wyszukiwarka DuckDuckGo wyświetliła CAPTCHA, której nie obchodziłem, a zgadywanie adresów profili byłoby spekulacją.
- Wzmianki o „Netizo” i „Voxbit” bez linku (media, fora, katalogi) — nie sprawdzałem.
- Czy Netizo ma dostęp do kodu stron klientów — nie wiem.
- Inne podstrony klientów poza stroną główną i jedną podstroną dla krainamt2.pl i nakazdaokazje.pl.
- Wizualny render stopek i logo — nie otwierałem przeglądarki.
- `voxbit.pl` z sieci innej niż audytowa (patrz #3).

## Strategia linków dla małej agencji (realistyczna, bez obietnic liczbowych)
1. **Napraw to, co już istnieje (tydzień 1).** Podmień stopki klientów z Voxbit na Netizo (#1, #2). Wprowadź stały zapis w umowie/checklistach wdrożenia: „link w stopce: Realizacja: Netizo → `https://netizo.pl`, bez `nofollow`”. Zmieniaj tekst anchora w granicach rozsądku („Realizacja: Netizo”, „Strona wykonana przez Netizo”), żeby nie powielać jednego wzorca. To najtańsze i w pełni kontrolowane źródło linków.
2. **Opublikuj to, do czego można linkować.** Serwis nie ma bloga, podstron usług ani case studies (brief). Bez własnych zasobów trudno zdobyć linki redakcyjne. Zacznij od 2–3 opisów realizacji z działających wdrożeń (energizo.pl, krainamt2.pl, nakazdaokazje.pl, leasingodreki.pl, treepro.pl) za zgodą klientów, z linkiem zwrotnym od klienta. Zakres treści: `/seo content`.
3. **Katalogi branżowe (Clutch, Sortlist, GoodFirms).** Domeny te występują w grafie CC (clutch.co, goodfirms.co, sortlist.com), więc to realne, rozpoznawalne źródła. Profile wymagają zwykle opinii klientów. Poproś 2–3 zadowolonych klientów o recenzje. Koszty, widoczność dla rynku PL i wymogi weryfikacji każdej platformy należy sprawdzić samodzielnie. Nie zakładam żadnych liczb.
4. **Lokalnie (Leszno i region).** Lokalne portale informacyjne, izby gospodarcze, stowarzyszenia przedsiębiorców, lokalne wydarzenia i sponsoring. Konkretnych nazw nie weryfikowałem. Do uzupełnienia po rozpoznaniu rynku. Spójny NAP (nazwa, adres, telefon) wymaga uzupełnienia danych o telefon i adres w JSON-LD (to zakres audytu local SEO).
5. **Program partnerski (`/partnerzy`).** Daj partnerom gotowy snippet linku do `/partnerzy` i `/`. Jeśli link niesie prowizję, Google zaleca `rel="sponsored"` (lub `nofollow`). Nie traktuj tego jako źródła „czystych” linków rankingowych, ale jako źródło ruchu i wzmianek marki.
6. **Wzmianki bez linku.** Po uzyskaniu dostępu do narzędzia (GSC lub Moz) wyszukaj wzmianki „Netizo” i „Voxbit” bez linku i poproś o dodanie linku.
7. **Pomiar.** Podłącz bezpłatne źródła: Google Search Console → raport Linki, Bing Webmaster Tools, Moz API (limit 2 500 wierszy/mies. wg dokumentacji pluginu). Dopiero wtedy da się policzyć Backlink Health Score. Alternatywnie rozszerzenie DataForSEO.
8. **Czego unikać:** kupowanie linków, sieci PBN, masowe zgłoszenia do katalogów, jednolity anchor ze słowem kluczowym we wszystkich stopkach.

## Priorytety

| Priorytet | Działanie |
|---|---|
| High | Podmienić linki w stopkach 5 stron klientów z `voxbit.pl` na `netizo.pl` (#1) |
| Medium | Zamienić hotlinkowane logo Voxbit na własny plik (#2); ukryć lub oznaczyć temar-mt.pl do czasu wdrożenia (#4) |
| Medium | Uruchomić GSC „Linki” + Bing Webmaster Tools, żeby zdobyć jakiekolwiek dane o domenach linkujących |
| Low | Sprawdzić `voxbit.pl` z innej sieci, wyłączyć redirect `/robots.txt` i `/sitemap.xml` (#3); `noindex` na loginie panelu (#6); zweryfikować bio profili społecznościowych (#7) |

## Dane strukturalne (Backlink Profile)

```json
{
  "category": "Backlink Profile",
  "tier": 0,
  "score": null,
  "score_status": "INSUFFICIENT_DATA",
  "factors_with_data": 0,
  "total_factors": 7,
  "metrics": {
    "cc_in_graph": false,
    "cc_release": "cc-main-2026-jan-feb-mar",
    "client_direct_links_to_netizo": "0/6",
    "client_links_to_voxbit": "5/5 live (temar-mt.pl parked)",
    "voxbit_redirect": "301 -> https://netizo.pl/ (all tested paths)",
    "referring_domains": null
  },
  "findings": [
    {"id": "BL-1", "severity": "High", "title": "Stopki klientów linkują do voxbit.pl, nie do netizo.pl"},
    {"id": "BL-2", "severity": "Medium", "title": "Hotlink logo voxbit.pl zwraca HTML (redirect)"},
    {"id": "BL-3", "severity": "Low", "title": "voxbit.pl: wildcard 301 na stronę główną, brak historii w Wayback; anomalia DNS w lokalnym resolverze"},
    {"id": "BL-4", "severity": "Medium", "title": "temar-mt.pl to domyślna strona hostingu"},
    {"id": "BL-5", "severity": "Info", "title": "netizo.pl poza grafem Common Crawl; narzędzie CC pluginu daje fałszywe negatywy"},
    {"id": "BL-6", "severity": "Low", "title": "panel-klienta.netizo.pl: indeksowalny login, brak linku powrotnego"},
    {"id": "BL-7", "severity": "Low", "title": "Profile społecznościowe niezweryfikowane"}
  ]
}
```

## Ocena kategorii

**Ocena: brak danych (Backlink Health Score nie obliczony).** Dostępne jest wyłącznie Tier 0: Common Crawl nie zawiera domeny (nie interpretuję tego jako „niskiej autorytatywności”), a 0 z 7 czynników oceny ma źródło danych (wymagane minimum: 4), więc każda liczba 0–100 byłaby zgadywaniem. Jakościowo to, co dało się zmierzyć, wypada słabo: 0/6 stron klientów linkuje bezpośrednio do netizo.pl, 5/5 działających stopek wskazuje starą markę Voxbit (przez 301), a jedna „realizacja” to domyślna strona hostingu. Naprawa stopek (#1) jest tania i w pełni kontrolowana.
