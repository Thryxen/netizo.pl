# Audyt obrazów — https://netizo.pl (2026-10-11)

## Zakres i metoda

- Źródła: SSR HTML (`raw/home-pl.html`, `raw/partners-pl.html`, wersje EN), nagłówki `curl -I` zasobów, raporty Lighthouse 13.5.0 (`image-delivery-insight`, `cache-insight`, `lcp-*-insight`), pobrane screenshoty projektów (`/storage/projects/{full,thumbnails}/*.webp`, 10 plików), pliki `public/assets/images/photos/` z repo (rozmiary zgodne z produkcją, np. `backdrop-workshop-768.webp` = 26 002 B w obu miejscach) oraz kod `photo.tsx`, `photos.ts`, `ImageOptimizer.php`.
- Brak danych terenowych; pomiary laboratoryjne.

## Inwentarz

- **`/`: 22 tagi `<img>`** — 5 `eager` w hero (1 z `fetchpriority="high"` = LCP, 4 produkty sklepu), 17 `lazy`; React dokłada też 5 `<link rel="preload" as="image">` w body (LCP z `fetchPriority="high"`, pozostałe 4 bez priorytetu). 145 inline `<svg>` (loga, ikony, mock-upy) — to nie `<img>`.
- **`/partnerzy`: 2 `<img>`** — `partner-referral` (LCP, `eager`, `fetchpriority="high"`), `partner-question` (`lazy`).
- Wersje EN mają identyczny zestaw `<img>`; zmienia się tylko `alt` screenshotów.
- Formaty: wszystkie raster to **WebP** (zdjęcia, screenshoty, placeholdery); OG obrazy i ikony to PNG/ICO. Brak AVIF. Brak JPG/PNG o dużej wadze.

## Znaleziska

### I-01 [Medium] Brak małych wariantów responsywnych: slot 64-270 px dostaje plik 768w (298 KiB nadmiaru)

- **Dowód:** Lighthouse `image-delivery-insight`: oszczędność **298 KiB** na `/` (mobile). Przykład `shop-hero-768.webp` (83 KB; 768x469 dla slotu 159x106 = ~79 KB nadmiaru + ~23 KB do zyskania samą kompresją). Cztery obrazy `shop-*` w hero łącznie 267 KB na mobile. Ten sam `shop-hero` jest użyty 5 razy w slotach 64-270 px (`sizes`: `270px`/`40vw`, `170px`, `160px`, `64px`); przeglądarka ma do wyboru tylko 768w lub 1536w.
- **Gdzie:** `resources/js/lib/photos.ts:54` (`srcSet` = tylko `-768` + natywny); sloty: `resources/js/components/home/live-build/shop-window.tsx:160` (`sizes="(min-width: 640px) 270px, 40vw"`), `:182` (`190px`/`28vw`), `resources/js/components/home/panel/board-scene.tsx:276,334-341`, `resources/js/components/home/process/design-artifact.tsx:17,146-153`.
- **Rekomendacja:** wygenerować `{name}-320.webp` i `{name}-480.webp` (skrypt generujący serię zdjęć; pliki w `public/assets/images/photos/`), dodać je w `photos.ts:54`; dla miniatur (64-80 px) rozważyć osobne, małe pliki. Szacunek: -200 do -250 KB na pierwszym ekranie mobile (do zmierzenia po wdrożeniu).

### I-02 [Medium] Screenshoty projektów: pełnostronicowe pliki 1920 px wysokie na 4-7 tys. px, 1,33 MB w 5 plikach, a "miniatura" prawie tak ciężka jak pełny obraz

- **Dowód (pobrane z produkcji):**

| Projekt | full (1920 px szer.) | rozmiar | thumbnail (1600 px szer.) | rozmiar |
|---|---|---|---|---|
| Treepro.pl | 1920x7002 | 319 334 B | 1600x5835 | 241 328 B |
| Vetly.pl | 1920x4579 | 226 760 B | 1600x3816 | 178 670 B |
| energizo.pl | 1920x6911 | 305 248 B | 1600x5760 | 242 138 B |
| nakazdaokazje.pl | 1920x4267 | 352 476 B | 1600x3556 | 288 136 B |
| KrainaMT2.pl | 1920x1075 | 125 386 B | 1600x896 | 97 280 B |
| **Suma** | | **1 329 204 B (~1,27 MiB)** | | **1 047 552 B (~1,0 MiB)** |

  Podgląd kart na stronie głównej (`variant="preview"`, okno 16:10 przycięte od góry, przewijane po najechaniu) ładuje `fullImageUrl` (`project-frame.tsx:49`: `fullImageUrl ?? thumbnailUrl`), czyli 125-352 KB na kartę, bez `srcset`. Pole `thumbnailUrl` nie jest w ogóle używane na stronie głównej (tylko jako fallback i w panelu admina), a samo jest pełnostronicowe (1600x3556-5835), więc nie spełnia roli miniatury. Wszystkie 5 plików ładuje się leniwie przy przewijaniu (nie wpływa na LCP), ale ~1,3 MB przy dojściu do sekcji projektów.
- **Gdzie:** `app/Http/Controllers/Admin/ProjectController.php:26-27` (thumbnail 1600 px, full 1920 px — oba pełnej wysokości), `app/Services/ImageOptimizer.php:21` (domyślna `$quality = 95`), `:29-32` (tylko skalowanie szerokości, bez przycięcia), `:36` (encode WebP), `app/Http/Controllers/HomeController.php:108-109` (przekazanie URL-i), `resources/js/components/home/project-frame.tsx:49,106-118`.
- **Rekomendacja:** (1) w `ImageOptimizer` obniżyć jakość do ~78-82 dla screenshotów (95 daje nieproporcjonalnie duże pliki); (2) zrobić prawdziwą miniaturę: przycięcie górnych ~1280x800 (`fit()`/`crop` z Intervention) do podglądu karty, a pełny obraz zostawić tylko dla `case-study-dialog.tsx:153`; (3) jeśli podgląd ma zachować przewijanie całej strony po hover, wygenerować wariant 960-1280 px szerokości i podać `srcset`/`sizes` (karta zajmuje `lg:col-span-7`, `projects-section.tsx:127`); (4) opcjonalnie AVIF/WebP z fallbackiem. Szacunek: z ~1,3 MB do ~0,3-0,5 MB (nie zmierzono).

### I-03 [Low] Atrybuty `width`/`height` screenshotów nie odpowiadają rzeczywistym wymiarom (CLS bezpieczny dzięki kontenerowi)

- **Dowód:** HTML ma `width="1600" height="1000"` dla wszystkich 5 screenshotów, a pliki mają 1920x1075-1920x7002. Ramka (`aspect-[16/10] overflow-hidden`) rezerwuje miejsce niezależnie od obrazu, więc CLS = 0 w pomiarach (Lighthouse, wszystkie 7 przebiegów); obrazy są poniżej linii zgięcia. W dialogu (`ScrollableScreenshot`) `<img>` nie ma w ogóle `width`/`height` ani `loading` (`project-frame.tsx:177`), ale pojawia się dopiero po interakcji.
- **Rekomendacja:** przekazywać rzeczywiste wymiary z backendu (np. `fullImageWidth/Height` w `HomeController.php:108-109`, odczyt przy zapisie w `ImageOptimizer`) lub zostawić stałe, jeśli ramka zawsze ma stały stosunek; dla `project-frame.tsx:177` dodać `width`/`height` z tych danych.

### I-04 [Low] Brak AVIF; jakość WebP seria zdjęć mogłaby być niższa

- **Dowód:** wszystkie zdjęcia to WebP (30 plików, ~2,18 MB łącznie, w tym obie wersje: natywna i 768w). Największe: `world-wool.webp` 213 728 B (1536 px), `shop-hero.webp` 199 486 B, `shop-hat.webp` 138 012 B, `contact-desk.webp` 136 610 B. Warianty 768w: `contact-desk-768` 89 902 B, `world-wool-768` 91 494 B, `shop-hero-768` 83 214 B, `shop-hat-768` 79 426 B — duże jak na 768 px (zdjęcia z drobnym szumem/teksturą wełny). Lighthouse: ~23 KB do zyskania na samym `shop-hero-768` przez wyższą kompresję.
- **Rekomendacja:** przy regeneracji serii (patrz `lib/photos.ts:1-5`) obniżyć jakość WebP do ~72-78 i ewentualnie dodać AVIF przez `<picture>` w `photo.tsx:24-34` (`<source type="image/avif" srcSet=...>`). Priorytet niski, bo zdjęcia są już WebP, a po I-01 część bajtów i tak zniknie.

### I-05 [Low] Nieużywane pliki w katalogu zdjęć

- **Dowód:** `hero-studio.webp` (90 546 B) i `hero-studio-768.webp` (63 688 B) leżą w `public/assets/images/photos/`, ale nie występują w mapie `PHOTOS` (`resources/js/lib/photos.ts:20-35`) ani w HTML (hero zastąpił `LiveBuild`). Wspomina o nich jeszcze `CLAUDE.md`.
- **Rekomendacja:** usunąć pliki i wpis z `CLAUDE.md` (154 KB w repo/na dysku; bez wpływu na transfer użytkownika).

### I-06 [Low] Cache obrazów tylko 4 h; brak `immutable`

- **Dowód:** `cache-control: max-age=14400` dla `/assets/images/photos/*`, `/storage/projects/*`, `/assets/images/og-*.png`, `favicon.ico`. Pliki ze screenshotów mają nazwy ULID (niezmienne po wgraniu, `ImageOptimizer.php:34`), zdjęcia serii mają stałe nazwy (zmiana wymaga zmiany nazwy lub query).
- **Rekomendacja:** dla `/storage/projects/*` ustawić rok + `immutable`; dla `/assets/images/photos/*` rok + wersjonowanie przez nazwę lub `?v=`. Szczegóły w `performance.md` (P-02).

### I-07 [Info] Pozostałe obserwacje (bez akcji lub do wiadomości)

- **Alt text (poprawnie):** 5 screenshotów ma opisowy alt w obu językach ("Zrzut ekranu strony Treepro.pl" / "Screenshot of the Treepro.pl website"; źródło: `project-frame.tsx:15,20`). 17 zdjęć fotograficznych ma `alt=""` — zasadnie, bo są dekoracyjne (tło scen, mock-upy, `aria-hidden`), a `Photo` wymusza jawne `alt` (`photo.tsx:6-8`). Brak brakujących `alt`. Możliwa poprawa SEO obrazów: alt screenshotów mógłby zawierać opis ("Strona firmowa Treepro.pl – wycinka drzew"), ale ruch z wyszukiwania obrazów nie jest tu celem.
- **Wymiary:** każdy `<img>` ma `width`/`height` (zdjęcia: natywne wymiary z `photos.ts:20-35`), `decoding="async"`, wrapper z `bg-muted`; CLS 0.
- **srcset/sizes:** wszystkie 17 zdjęć serii mają `srcset` (`768w` + natywny) i sensowne `sizes` (np. `(min-width: 1248px) 700px, (min-width: 1024px) 56vw, 100vw` dla scen). Wyjątek: screenshoty projektów (I-02).
- **Lazy/eager/priorytet:** poniżej linii zgięcia `loading="lazy"` (domyślnie w `photo.tsx:29`), LCP `loading="eager"` + `fetchpriority="high"` (`scene-parts.tsx:77-78`, użycie `live-build.tsx:53`; strona partnerów `referral-scene.tsx:69`). Lighthouse `lcp-discovery-insight`: priorityHinted, discoverable, nie-lazy — wszystko zaliczone. Resource load delay LCP 6-22 ms. Cztery eager-owe obrazy produktów (`stage-photo.tsx:33`) konkurują z LCP o pasmo na wolnym łączu (patrz I-01); tylko LCP ma `fetchpriority`, pozostałe 4 obrazy hero nie mają `fetchpriority="low"`, a ich `<link rel="preload" as="image">` nie ma priorytetu (można dodać `fetchPriority="low"` w `StagePhoto` dla kart produktów).
- **Duplikaty zasobów:** `shop-hero` występuje 5 razy w różnych sekcjach, ale to ten sam URL (jedno pobranie, potem cache).
- **OG/Twitter image:** `og-netizo-2.png` 50 371 B (1200x630, PNG), `og-netizo-partnerzy.png` 81 830 B, `og-netizo-en.png` 49 853 B, `og-netizo-partners-en.png` 67 979 B — wszystkie dużo poniżej limitu 300 KB (WhatsApp). Meta `og:image:width=1200`, `og:image:height=630`, `twitter:image` ustawione; źródła: `lang/pl/home.php:15`, `lang/pl/partners.php:13`. Cache: 4 h. Brak `og:image:alt` (opcjonalne; nie znaleziono tagu w HTML).
- **Ikony:** `icon-192.png` 4 KB, `favicon.ico` 2,3 KB, `favicon.svg` 1,1 KB, `apple-touch-icon.png` — rozmiary pomijalne.
- **Placeholder projektu** (`project-placeholder-light/dark.webp`, 13 KB każdy) renderowany przez `ThemedImage` jako dwa `<img>` z `hidden`/`dark:hidden` (`themed-image.tsx:19-20`); przy `loading="eager"` oba by się pobrały mimo ukrycia. Obecnie nieużywane (wszystkie 5 projektów ma screenshot), więc bez wpływu.
- **Obrazy AI:** zdjęcia serii są generowane (opis w `photos.ts`); nie mają wartości w wyszukiwaniu obrazów i nie powinny być opisywane jako prawdziwe zdjęcia zespołu (kwestia wiarygodności E-E-A-T poza zakresem wydajności).

## Wagi obrazów na stronach (mobile, przebieg Lighthouse)

| Strona | Obrazy (transfer) | Szczegóły |
|---|---|---|
| `/` mobile | 7 plików, 367 KB | `shop-hero-768` 84 KB, `shop-hat-768` 80 KB, `shop-scarf-768` 60 KB, `shop-sweater-768` 45 KB, `bento-mobile-768` 40 KB, `bento-ecommerce-768` 34 KB, `backdrop-workshop-768` 26 KB (LCP). Lighthouse nie przewija, więc screenshoty projektów (+~1,3 MB) i dolne zdjęcia dochodzą dopiero przy scrollu |
| `/` desktop | 1872 KB całej strony | natywne warianty 1536w zdjęć wybierane przy większych slotach |
| `/partnerzy` | całość 613 KB | LCP `partner-referral-768` 36 KB |

## Priorytety

1. I-01 (małe warianty zdjęć) — najszybszy zysk na LCP/mobile.
2. I-02 (prawdziwa miniatura + niższa jakość + `srcset` screenshotów) — największa oszczędność bajtów (~1 MB), choć poza ścieżką LCP.
3. I-06 (cache 1 rok, `immutable`), I-04, I-03, I-05 — porządki.

## Ocena kategorii

**78/100** — Higiena jest bardzo dobra (WebP wszędzie, komplet `alt`, `width`/`height`, `srcset`/`sizes`, poprawnie oznaczony obraz LCP, CLS 0, lekkie OG), ale brakuje małych wariantów responsywnych (298 KiB nadmiaru na mobile), screenshoty projektów to pełnostronicowe pliki o łącznej wadze ~1,3 MB zapisane z jakością 95, a "miniatura" nie jest miniaturą.
