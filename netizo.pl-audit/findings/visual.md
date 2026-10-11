# Audyt wizualny i mobilny: https://netizo.pl (2026-10-11)

Zakres: `/`, `/partnerzy`, `/en`, `/en/partners`. Desktop 1440x900 (DPR 1), mobile 390x844 (DPR 2, iOS UA, touch), light; dodatkowo dark dla `/`. Dane z Playwright (Chromium), po 3-3,5 s od `networkidle` (animacje wejścia zakończone). Skrypty `capture_screenshot.py` i `analyze_visual.py` mają na sztywno 1920x1080 / 375x812, więc `analyze_visual.py` uruchomiono dla czterech adresów (wyniki w `raw/visual/analyze_*.json`), a właściwe pomiary i zrzuty zrobiono własnym skryptem Playwright z żądanymi viewportami.

Uwaga o metodzie: `analyze_visual.py` daje fałszywe negatywy. `cta_visible=false` dla `/`, `/partnerzy` i `/en/partners`, bo szuka `a[href*=contact]` albo tekstu "Contact"/"Get Started", a CTA witryny to `<button>` "Wyceń projekt" / "Dołącz do programu". Pole `touch_targets_ok` jest w skrypcie na sztywno `true`, to nie jest pomiar. Poniższe wnioski opierają się na własnych pomiarach DOM (`getBoundingClientRect`) i na oglądzie zrzutów.

Ograniczenia oceny: wzrokowo obejrzałem zrzuty PL (desktop fold, slice'y 01-15, mobile fold + ok. 12 slice'ów, menu, dialog, baner), `/partnerzy` (fold desktop i mobile) i `/en` mobile fold. Zrzuty dark oraz `/en` i `/en/partners` desktop są zapisane i zmierzone (metryki w `raw/visual/metrics-first-pass.json`), ale nie oceniałem ich osobno wzrokowo. Dla dark sprawdziłem tylko kontrast numerycznie.

## Podsumowanie

Strona jest wizualnie dopracowana i spójna (monochromatyczny shadcn, szyny i nity, zdjęcia jako jedyny kolor). Nie wykryłem poziomego scrolla w żadnej szerokości (320, 360, 375, 390, 768, 1024, 1280, 1440, 1920 px), CLS jest praktycznie zerowy (0,0004 desktop, 0 mobile), kontrast tekstu jest bardzo dobry (2 z 396 węzłów tekstowych poniżej progu WCAG w light, oba dekoracyjne), a przełącznik języka jest widoczny w nagłówku na każdej szerokości. Główne słabości dotyczą mobile: baner cookies zajmuje 28% ekranu i na małych telefonach zasłania główne CTA, numer telefonu nie jest widoczny w pierwszym ekranie, a stopka/menu prowadzą do martwych stron prawnych.

## Above the fold

### Desktop 1440x900 (`/`)
- Widoczne bez scrolla: logo, nawigacja (Usługi, Projekty, Proces, FAQ, Kontakt), przełącznik języka "English", przełącznik motywu, "Panel klienta", CTA "Wyceń projekt" w nagłówku (y=14) i w hero (y=533-573), drugie CTA "Zobacz realizacje", linia "Odpowiadamy w ciągu 24 godzin.", H1 "Tworzymy strony WWW dla ambitnych." (53 px), lead "Strony, aplikacje webowe i mobilne oraz systemy dla firm...", wizualizacja sklepu po prawej.
- Co firma robi: jasne (strony WWW, aplikacje, systemy). Dla kogo: tylko ogólnie ("dla ambitnych", "dla firm"). Brak lokalizacji (Leszno), brak branży/segmentu i brak numeru telefonu w pierwszym ekranie.
- Pasek liczb (149+ projektów, 8 lat, 99,8%, 0 zł za wycenę) zaczyna się tuż pod foldem (y≈765) i na desktopie przy pierwszej wizycie jest zasłonięty bannerem cookies.
- Baner cookies na desktopie: 128 px z 900 (14%), dolny pasek, nie blokuje CTA. FAB telefonu (52x52, y=700-752) jest podniesiony nad baner (baner od y=772, odstęp 20 px), więc się nie nakładają.

### Mobile 390x844 (`/`)
- Bez banera: nagłówek 65 px (logo, "EN", ikona telefonu, hamburger, każdy cel 44x44), H1 (y≈93-228), lead, CTA "Wyceń projekt" (16..158 x 400..444) i "Zobacz realizacje" (170..333), zdjęcie hero od y=492, pasek liczb poniżej.
- Z banerem: baner ma 236 px z 844 (28% viewportu) i zaczyna się w y=608. CTA (do y=444) pozostaje w pełni widoczne, ale zdjęcie hero i linia "Odpowiadamy w ciągu 24 godzin" są zasłonięte (na `/partnerzy` linia "Udział jest bezpłatny. Odpowiadamy w ciągu 24 godzin" jest pod banerem).
- Telefon: w nagłówku jest tylko ikona słuchawki, która otwiera dialog "Oddzwonimy do Ciebie" (formularz z numerem klienta), a nie link `tel:`. Numer +48 884 343 924 pojawia się dopiero w dialogu (drugie dotknięcie), w sekcji kontaktu (y≈19364 z 20809 px) i w stopce.

### `/partnerzy` i `/en/partners`
- Desktop: H1 "Polecasz nas, dostajesz 15% od każdego zamówienia.", CTA "Dołącz do programu" + "Policz swoją prowizję", przykładowa karta z wyliczeniem (18 000 zł → 2 700 zł) widoczne w pierwszym ekranie. Bardzo czytelna propozycja wartości.
- Mobile: H1 + lead + dwa CTA ułożone pionowo (y≈473-570), w nagłówku przycisk "Dołącz" i "EN". Brak hamburgera (strona ma tylko jeden przycisk i przełącznik języka), co jest spójne z krótką stroną.

### `/en` i `/en/partners`
- Układ identyczny jak PL ("We build websites for the ambitious.", "Get a quote", "See our work"), przełącznik pokazuje "PL". Treści i hierarchia zgodne z wersją PL.

## Znaleziska

### 1. Baner cookies na małych telefonach zasłania główne CTA hero (Medium)
- Dowód: baner ma stałą wysokość 236 px na mobile (`--cookie-banner-height: 236px`). CTA "Wyceń projekt" leży w y=400-444 niezależnie od wysokości ekranu. Widoczność CTA nad banerem: 390x844 pełne 44 px; 393x852, 412x915, 430x932 pełne 44 px; 375x667 (iPhone SE) tylko 31 z 44 px, baner = 35% ekranu; 360x640 tylko 4 px (baner 37%); 320x640 tylko 4 px, drugie CTA "Zobacz realizacje" (y=456) całkowicie pod banerem. Na 390x844 baner zasłania 28% pierwszego ekranu, razem z hero-zdjęciem.
- Rekomendacja: na mobile zmniejszyć baner do ok. 120-140 px: krótszy tekst (jedno zdanie), przyciski obok siebie lub kompaktowe, "Dostosuj" jako link w treści zamiast osobnego paska 41 px. Zmiana w stylach widoku: `resources/views/vendor/cookie-consent/cookies.blade.php` (reguły mobilne w bloku `@media (max-width: 768px)` od linii 506, wysokość `.cookies__alert` od linii 148). Alternatywnie dolny pasek 1-wierszowy z dwoma przyciskami.

### 2. Brak numeru telefonu i lokalizacji w pierwszym ekranie (Medium)
- Dowód: w hero (desktop i mobile) nie ma numeru ani "Leszno"; ikona telefonu w nagłówku mobile (`site-header.tsx:205-213`, `openCallback` w linii 210) i FAB na desktopie (`callback-fab.tsx:29`) otwierają formularz oddzwonienia, a nie `tel:`. Dla B2B z lokalnym wymiarem (SAB Leszno + cała PL) to osłabia zaufanie przy pierwszej wizycie. Numer w pierwszym ekranie nie istnieje nawet w nagłówku desktop.
- Rekomendacja: w linii pod CTA (`resources/js/components/home/hero.tsx:110-120`, `copy.reply`) dodać drugi, tekstowy element: "Leszno, cała Polska" oraz link `tel:+48884343924` ("lub zadzwoń: +48 884 343 924"). Na mobile rozważyć, by długie przytrzymanie/drugi przycisk w dialogu było `tel:` (jest już w dialogu) albo dodać ikonę `tel:` obok ikony oddzwonienia.

### 3. Martwe linki prawne w stopce i menu mobilnym (Medium wizualnie; High w kategorii zaufanie/compliance)
- Dowód: stopka (desktop y≈11815-11879, mobile) i menu mobilne (y=677-765) pokazują "Utrzymanie", "Regulamin", "Polityka prywatności", wszystkie prowadzą do 404 (potwierdzone w briefie). Użytkownik widzi je na każdej stronie, także w drugim wierszu menu.
- Rekomendacja: do czasu publikacji stron ukryć linki albo zbudować strony; źródło: `resources/js/lib/site.ts:63-65` (PL) i `:69-71` (EN, z `hrefLang: 'pl'`). Baner cookies też nie linkuje do polityki prywatnej.

### 4. Cele dotykowe poniżej 44 px w elementach mobilnych (Low)
- Dowód (mobile 390 px): przyciski baneru "Tylko niezbędne" i "Zaakceptuj wszystko" mają 358x36 px; przełączniki zakładek formularza "Projekt na zlecenie" / "Stała współpraca" 176x38 px; linki w marquee klientów 40 px wysokości (np. `treepro.pl` 126x40). Pozostałe: nagłówek 44x44, CTA hero 44 px, pozycje menu 56 px, linki menu 44 px, linki stopki 44 px (wszystkie OK).
- Przypadek desktopu: linki nawigacji 36 px, "Zobacz case study" 36 px: akceptowalne dla myszy.
- Rekomendacja: przyciski baneru min. 44 px (`.cookiesBtn__link` w `cookies.blade.php` od linii 257), zakładki formularza min. 44 px, link marquee `py-2` → `py-3` (`resources/js/components/home/clients-section.tsx:117`).

### 5. Menu mobilne: CTA "Wyceń projekt" poniżej widocznej części (Low)
- Dowód: kontener przewijany w menu ma 874 px zawartości przy 780 px widocznych; przycisk "Wyceń projekt" jest na y=838-882 w ekranie 844 px, widać go tylko jako 6-px pasek, a e-mail i przełącznik motywu (y=886) są poza ekranem. W nagłówku na telefonach przycisk "Wyceń projekt" jest ukryty (`hidden sm:inline-flex`, `site-header.tsx:219`), więc po zjechaniu poniżej hero jedynym stałym CTA jest ikona słuchawki bez etykiety.
- Rekomendacja: wyjąć przycisk "Wyceń projekt" z przewijanego kontenera (`site-header.tsx:253`, przycisk w linii 304) i przykleić na dole panelu albo zmniejszyć wysokość wierszy z 56 do 48 px.

### 6. Statystyki wiarygodności: bardzo wyraziste, ale niezweryfikowalne (Low, wizualnie ważne)
- Dowód: "30M+ zapytań miesięcznie obsługują nasze systemy", "250K+ linii kodu w produkcji" (`clients-section.tsx:21-22`) i "149+ zrealizowanych projektów" w pasku pod hero (`hero.tsx:133`, dane STATS) przy 5 case studies na stronie. Duże, bezpośrednio pod H1 i w sekcji "Zaufali nam".
- Rekomendacja: oprzeć liczby o weryfikowalne źródła albo zamienić na konkret (np. liczba klientów, lata obsługi), bo przy braku opinii/logotypów klientów to jedyny dowód społeczny.

### 7. Długość strony na mobile (Low)
- Dowód: strona główna ma ok. 20 600-20 800 px wysokości na 390 px (ok. 24 ekrany), partnerzy ok. 10 400 px. Pięć projektów to ok. 1000 px każdy (ok. 5000 px razem). Nawigacja w menu pomaga, ale długi scroll bez stałego CTA (patrz pkt 5).
- Rekomendacja: na mobile pokazać 2-3 projekty i "Zobacz więcej", albo zagęścić karty (mniejszy screenshot).

### 8. Drobny tekst (<12 px) w makietach UI (Low)
- Dowód: w widocznych węzłach tekstowych (bez `aria-hidden`) 122 elementy mają font poniżej 12 px, głównie makiety panelu klienta, hero i procesu (np. "panel-klienta.netizo.pl" 11,6 px, "Tablica" 10,8 px, `<Hero />` 8 px). Są dekoracyjne i skalowane, ale czytniki ekranu przeczytają je jako zwykły tekst.
- Rekomendacja: oznaczyć makiety `aria-hidden="true"` albo `role="img"` z `aria-label` (komponenty w `resources/js/components/home/panel/`, `live-build/`, `bento/`).

### 9. Baner cookies: warstwa "Dostosuj" i asymetria przycisków (Info)
- Dowód: po rozwinięciu "Dostosuj" baner ma 665 px z 844 (79% ekranu, przewijany wewnętrznie, `overflow-y: auto`); działa po akcji użytkownika, więc nie jest interstitialem. "Zaakceptuj wszystko" jest wypełniony, "Tylko niezbędne" jest przyciskiem konturowym (obie opcje na pierwszej warstwie). Baner nie przykrywa treści na końcu strony (stopka kończy się dokładnie nad banerem, `body` ma `padding-bottom` = wysokość banera), a otwarty dialog/menu (z-index 50) przykrywa baner (z-index 45), więc nie ma kolizji warstw.

### 10. Wyniki kontrastu (Info, pozytywne)
- Light: 2 z 396 węzłów poniżej progu: separator "/" w breadcrumbie makiety (2,3:1, dekoracyjny) i "Brak zadań" w makiecie (4,46:1). Dark: 1 z 396 (separator "/" 3,41:1). Tekst pomocniczy (muted) przechodzi 4,5:1.

## Mobile responsywność

| Kryterium | Wynik |
|---|---|
| Meta viewport | `width=device-width, initial-scale=1` (OK, bez blokady zoomu) |
| Poziomy scroll | brak przy 320, 360, 375, 390, 768, 1024, 1280, 1440, 1920 px (`scrollWidth` = `innerWidth`) |
| Bazowy font | 16 px; H1 53 px na desktopie, na telefonie 3 linie (ok. 135 px wysokości) |
| Nawigacja mobile | hamburger 44x44, panel boczny z 9 pozycjami po 56 px; zamykany Esc |
| Przełącznik języka | widoczny w nagłówku zawsze: "EN" na telefonie (44x61), "English" na desktopie; w stopce także; jest zwykłym linkiem `/en` ↔ `/` |
| Przełącznik motywu | w nagłówku od `sm`, na telefonie przeniesiony do menu (zgodnie z założeniem projektu) |
| FAB oddzwonienia | tylko od `lg` (`max-lg:hidden`, `callback-fab.tsx:29`), na telefonie nie koliduje z banerem; na desktopie podnosi się nad baner o `--cookie-banner-height` |
| Elementy nakładające się | nie wykryto; dialog oddzwonienia przykrywa baner poprawnie |
| Interstitiale | brak popupu przy wejściu; jedyny element to dolny baner cookies; dialog oddzwonienia otwiera się wyłącznie po akcji |
| CLS | 0,0004 (desktop), 0 (mobile) |
| Obrazy | 22 `<img>`, wszystkie z `alt` (17 dekoracyjnych z pustym alt), bez zepsutych, wszystkie z wymiarami |

## Co działa dobrze
- Czysta, spójna hierarchia: jeden H1, dwa CTA (główne wypełnione, drugie konturowe), czytelny lead, brak konkurujących akcentów kolorystycznych.
- Brak poziomego scrolla i brak CLS w całym zakresie szerokości, w tym 320 px.
- Przełącznik języka zawsze widoczny (nagłówek + stopka), skracany do "EN" tam, gdzie brakuje miejsca; poprawne `<html lang>`.
- Cele dotykowe w nagłówku i hero mają 44 px, pozycje menu 56 px; CTA hero dostają `max-md:h-11` (`hero.tsx:110`).
- Baner cookies jest dobrze zintegrowany: rezerwuje wysokość (`--cookie-banner-height`), podnosi FAB, nie koliduje z modalami, zachowuje motyw dark/light.
- Wysoki kontrast tekstu i czytelne wersje dark; makiety UI (panel, bento, proces) dobrze tłumaczą ofertę bez stockowych zdjęć.
- Strona partnerska ma najmocniejszy pierwszy ekran: konkretna obietnica (15%), przykład liczbowy i CTA od razu widoczne.
- Zgodność PL/EN: układ i hierarchia identyczne.

## Zrzuty ekranu (`/Users/thryxen/PhpstormProjects/netizo.pl/netizo.pl-audit/screenshots/`)

Fold z banerem cookies (desktop 1440x900, mobile 780x1688 = 390x844 @2x):
- `home-pl-desktop-light-fold-cookie.png`, `home-pl-mobile-light-fold-cookie.png`
- `home-pl-desktop-dark-fold-cookie.png`, `home-pl-mobile-dark-fold-cookie.png` (dark, tylko `/`)
- `partnerzy-pl-desktop-light-fold-cookie.png`, `partnerzy-pl-mobile-light-fold-cookie.png`
- `home-en-desktop-light-fold-cookie.png`, `home-en-mobile-light-fold-cookie.png`
- `partners-en-desktop-light-fold-cookie.png`, `partners-en-mobile-light-fold-cookie.png`

Fold bez banera (baner ukryty CSS-em tylko do zrzutu, mobile DPR 1):
- `home-pl-desktop-light-fold-nocookie.png`, `home-pl-mobile-light-fold-nocookie.png`
- `partnerzy-pl-desktop-light-fold-nocookie.png`, `partnerzy-pl-mobile-light-fold-nocookie.png`
- `home-en-desktop-light-fold-nocookie.png`, `home-en-mobile-light-fold-nocookie.png`
- `partners-en-desktop-light-fold-nocookie.png`, `partners-en-mobile-light-fold-nocookie.png`

Cała strona (po przewinięciu, baner ukryty; mobile DPR 1, wysokość 10-20 tys. px):
- `home-pl-desktop-light-full.png`, `home-pl-mobile-light-full.png`
- `partnerzy-pl-desktop-light-full.png`, `partnerzy-pl-mobile-light-full.png`
- `home-en-desktop-light-full.png`, `home-en-mobile-light-full.png`
- `partners-en-desktop-light-full.png`, `partners-en-mobile-light-full.png`

Interakcje i warianty (mobile 390x844 @2x, PL, light):
- `home-pl-mobile-light-cookie-customize.png` (rozwinięte "Dostosuj", 79% ekranu)
- `home-pl-mobile-light-cookie-after-toggle.png`
- `home-pl-mobile-light-contact-with-cookie.png` (sekcja kontaktu z banerem)
- `home-pl-mobile-light-footer-with-cookie.png` (koniec strony z banerem)
- `home-pl-mobile-light-menu-open.png` (menu mobilne, CTA ucięte u dołu)
- `home-pl-mobile-light-callback-dialog-with-cookie.png` (dialog oddzwonienia nad banerem)
- `home-pl-desktop-light-callback-dialog.png` (dialog na desktopie)
- `home-pl-320px-light-fold-cookie.png`, `home-pl-768px-light-fold-cookie.png`, `home-pl-1024px-light-fold-cookie.png` (fold z banerem przy 320x640, 768x1024, 1024x768)

Pliki `agentic-*.png` w tym katalogu pochodzą z innego agenta, nie z tego audytu.

Dane pomocnicze w `raw/visual/`: `metrics-first-pass.json` (4 strony x 2 urządzenia + dark: elementy interaktywne, cele <44 px, fixed/sticky, banner, tekst <12 px, obrazy, język, `tel:`), `metrics-interactions.json` (menu, dialog, szerokości 320-1920), `metrics-contrast-struct.json` (kontrast, nagłówki, widoczność CTA vs baner na 375x667/360x640/393x852/412x915/430x932), `analyze_*.json` (skrypt `analyze_visual.py`), `slices/` (slice'y całych stron, 28 mobile / 16 desktop dla `/`).

## Ocena kategorii

**82/100.** Bardzo dobra jakość wizualna i brak problemów strukturalnych na mobile (brak poziomego scrolla, CLS≈0, wysoki kontrast, przełącznik języka zawsze widoczny); punkty tracą: baner cookies (28% ekranu, zasłania główne CTA na telefonach o wysokości ≤667 px), brak numeru telefonu/lokalizacji w pierwszym ekranie, martwe linki prawne w stopce i menu oraz kilka celów dotykowych poniżej 44 px.
