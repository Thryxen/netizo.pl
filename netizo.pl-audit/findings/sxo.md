# SXO (Search Experience Optimization): netizo.pl

Data: 2026-10-11 · Zakres: `https://netizo.pl/`, `https://netizo.pl/partnerzy` (EN tylko pomocniczo) · Metoda: render Playwright (`render_page.py --mode always`) + `parse_html.py` dla netizo.pl; WebSearch (8 klastrów fraz, 17 zapytań) + pobranie i parsowanie 19 stron z wyników (`render_page.py --mode never`), dane w `netizo.pl-audit/raw/sxo-serp/` (`leszno-1..9.*`, `x-1..10.*`) oraz `raw/sxo-home-*.json`, `raw/sxo-partners-*.json`.

> **SXO Gap Score: 42/100.** To osobna miara, nie SEO Health Score.

---

## 1. Najważniejsze ustalenie: niedopasowanie typu strony (CRITICAL)

Netizo to **jedna długa strona główna** (Landing/Hybrid: hero, 6 kafelków usług, 5 realizacji w modalach, proces, panel klienta, FAQ, newsletter, brief) i **jedna podstrona** `/partnerzy`. Google dla fraz docelowych nagradza jednak **dedykowane podstrony usługowo-lokalne** (Leszno), **artykuły i cenniki** („ile kosztuje…”) oraz **rankingi i katalogi** („software house Poznań”). Strona główna konkuruje więc o 6–8 różnych intencji naraz i żadnej nie obsługuje lepiej niż wyspecjalizowane strony konkurencji. Jedynym dopasowaniem jest `/partnerzy`.

W żadnym z około 40 przeanalizowanych wyników netizo.pl się nie pojawia. Pobrany HTML 19 stron z SERP, w tym rankingów Oferteo „Leszno” (438 firm), zawiera **0 wzmianek „netizo”**. Zapytania brandowe („netizo.pl”, „Netizo Leszno strony internetowe”, `site:netizo.pl`) w użytej wyszukiwarce zwracają Netię i inne podmioty, czyli marka nie jest rozpoznawana jako encja.

### Macierz SERP → typ strony → niedopasowanie

| # | Fraza (klaster) | Dominujący typ w SERP (taksonomia) | Konsensus | Strona Netizo i jej typ | Ocena | Netizo w wynikach |
|---|---|---|---|---|---|---|
| 1 | tworzenie stron internetowych Leszno | **Local / Service Page dla miasta** (webtom, lxproject, smart-agency, investnet, candyweb, kowalskistudio, maszwww, em-promo) + 1 ranking Oferteo (Comparison) | 8/9 = **89%** | `/`, Landing/Hybrid ogólnopolski | **CRITICAL** | nie |
| 2 | agencja interaktywna Leszno (wariant „…strony www sklepy internetowe”) | **Local / Service Page** (m16 `/strony-internetowe/leszno/`, candyweb `/miasto/agencja-interaktywna-leszno/`, mantikora, artso, kowalskistudio, websylium) + Oferteo „10 najlepszych 2026” + 1 blog (seosem24) | 7/9 = **78%** | `/` | **CRITICAL** | nie |
| 3 | strony internetowe Leszno | intencja niejednoznaczna: wyszukiwarka zwróciła serwisy instytucji (leszno.pl, policja, archiwum). Wariant komercyjny pokrywa się z #1 | niska pewność | `/` | **HIGH** (jak #1) | nie |
| 4 | software house Poznań | **Comparison / katalog** (startup-house directory ×2, TTMS „Top 10” ×2, GoodFirms, aplikuj.pl) + profile firm (LinkedIn Flow2Code, poznan.pl) | 6/9 = **67%** | brak (Netizo nie ma obecności w Poznaniu) | **HIGH** | nie |
| 5 | tworzenie stron internetowych (ogólnopolska) | intencja mieszana: **Blog/poradnik/DIY** (zpe.gov, antyweb ×2, Shopify blog, kwalifikacje.gov) + profile agencji (innowise, YetiWeb) | 6/9 = 67% informacyjnych | `/` (title „Tworzymy Strony WWW…”) | **MEDIUM** | nie |
| 6 | ile kosztuje strona internetowa (+ „cennik 2026”) | **Blog Post / cennik** (kb.pl `Article`, hostinger tutorial, landingi blog, superbiz, orange poradnik, upmenu blog, cenauslug `FAQPage`+`HowTo`+`Service`) | 9/9 = **100%** | jeden akordeon FAQ na `/` | **CRITICAL** | nie |
| 7 | aplikacje webowe dla firm (+ „tworzenie aplikacji webowych … software house”) | **Hybrid / informacyjny** (OVH „Co to jest aplikacja internetowa?”, appmaster ×3, poradnikprzedsiebiorcy, cenauslug „Kiedy warto…”), w wariancie usługowym profile Useme/LinkedIn/Oferteo | 7/9 = **78%** | kafelek „Aplikacje webowe” (~12 słów) na `/` | **HIGH** | nie |
| 8 | program partnerski agencja interaktywna / prowizja za polecenie klienta | **Landing Page programu partnerskiego** (Hostinger, GoDaddy, InMotion) + artykuły (antyweb/spidersweb o nazwa.pl, payproglobal, clickup) | ~50/50 Landing/Blog | `/partnerzy`, Landing + kalkulator (Tool) | **ALIGNED** (typ) | nie (SERP zdominowany przez hosting) |

### Co mają strony z top 10 dla „tworzenie stron internetowych Leszno” (zmierzone, 8 stron usługowych)

| Sygnał | Konkurencja (8 stron usługowych) | netizo.pl `/` |
|---|---|---|
| URL dedykowany frazie i miastu | 7/8 (`/strony-internetowe-leszno/`, `/tworzenie-stron-internetowych-leszno/`) | brak |
| „Leszno” w `<title>` | 8/8 | 0 („Tworzymy Strony WWW dla Ambitnych Firm \| Netizo”) |
| „Leszno” w H1 | 7/8 | 0 (H1 „Tworzymy strony WWW dla ambitnych.”) |
| Wystąpienia „Leszn*” w widocznej treści | 14–61 (mediana ~37) | **3** (tylko FAQ „Czy pracujecie tylko z firmami z Leszna?”) |
| Liczba słów (`parse_html`) | 823–2 823 (mediana ~1 700) na **jedną** usługę | 2 381 na **całą** firmę (6 usług po ~10–15 słów + teksty makiet UI) |
| Cena lub link do cennika | 7/8 (em-promo „od 1099 zł”, maszwww „od 1400 zł netto”, lxproject „od 1 749 zł netto”, kowalskistudio 2 500 / 3 500 / 5 500 zł netto; webtom, smart-agency, investnet linkują `/cennik`) | widełki tylko w akordeonie FAQ #1 |
| FAQ z pytaniem „Ile kosztuje strona internetowa w Lesznie?” | 5/5 stron z FAQ | ogólne „Ile kosztuje strona internetowa lub aplikacja?” |
| Opinie i referencje klientów | candyweb („Opinie od naszych klientów”), kowalskistudio („Opinie klientów”), em-promo, maszwww; Oferteo: oceny i liczba opinii | **brak** |
| Mapa lub adres | 3/8 osadzają mapę (smart-agency, m16, mantikora), candyweb „Gdzie jesteśmy?” | brak adresu ulicy i mapy |
| `BreadcrumbList` | 6/8 | brak |
| `LocalBusiness`/`ProfessionalService` | smart-agency (`LocalBusiness` + `OpeningHoursSpecification`), investnet, m16 (`ProfessionalService` + `OfferCatalog` + `AggregateRating`), mantikora | `ProfessionalService` bez telefonu, ulicy, kodu, geo, logo i godzin |
| Link `tel:` | 8/8 | jest (`tel:+48884343924`, nagłówek mobilny i stopka) |

Wniosek: przegrana nie wynika z jakości strony. Netizo ma lepszy design, wydajność, proces i panel klienta niż większość tych stron. Brakuje mu natomiast **adresu URL, który odpowiada intencji**.

---

## 2. Profil strony docelowej (IST)

- **`/`**: typ wg taksonomii **Landing Page / Hybrid** (CTA nad linią zgięcia, social proof, usługi, proces, FAQ). Title: „Tworzymy Strony WWW dla Ambitnych Firm | Netizo” (`lang/pl/home.php:10`). H1: „Tworzymy strony WWW dla ambitnych.” (`resources/js/components/home/hero.tsx:48`). Meta description ~200 zn. Liczba słów 2 381. Schema: `ProfessionalService` + `FAQPage` (`app/Http/Controllers/HomeController.php:45-67`). 22 obrazy (dekoracyjne `alt=""`, zrzuty projektów z alt). CTA: „Wyceń projekt” (×2 nad zgięciem), „Zobacz realizacje”, brief w 6 krokach, szybka wiadomość, „Zadzwońcie do mnie” (callback), newsletter, „Zostań partnerem”.
- **`/partnerzy`**: **Landing Page + Tool** (kalkulator prowizji). Title: „Program partnerski: 15% prowizji za polecenie | Netizo”. H1: „Polecasz nas, dostajesz 15% od każdego zamówienia.” 1 068 słów. Schema: `WebPage` + `FAQPage` (9 pytań).
- Mobile above the fold (`screenshots/home-pl-mobile-light-fold-cookie.png`): H1, lead, „Wyceń projekt” i „Zobacz realizacje”. Lokalizacji, ceny, liczb („150+”, „8 lat”, „0 zł”) ani dowodu społecznego nie widać, a baner cookies zakrywa ~1/3 ekranu.

---

## 3. Znaleziska

### SXO-01: Brak lokalnej podstrony „Tworzenie stron internetowych Leszno” (klaster #1–#3)
- **Ważność:** Critical
- **Dowód:** 8/9 wyników to dedykowane strony miasto + usługa z „Leszno” w title (8/8) i H1 (7/8), „Leszn*” 14–61 razy w treści, ~1 700 słów. Netizo: „Leszno” 0× w title i H1, 3× w treści (`lang/pl/home.php:86-87`). Frazy miast są wyłącznie w `meta keywords` (`lang/pl/home.php:16-45`, ~90 fraz), które Google ignoruje.
- **Rekomendacja:** utworzyć `GET /tworzenie-stron-internetowych/leszno` (EN: pominąć, bo to fraza lokalna PL) jako Local Page wg szablonu SOLL z sekcji 7. Unikalna treść ≥1 200 słów: realne firmy z Leszna i okolic (Treepro.pl działa w zachodniej Polsce), spotkanie na miejscu, NAP z adresem, mapa, cennik „od…”, FAQ z pytaniami lokalnymi. Route w `routes/web.php`, kontroler na wzór `PartnerProgramController`, meta przez `Controller::localizedSeo()`, wpis w `public/sitemap.xml`. Meta keywords usunąć (`HomeController.php:29`, `lang/pl/home.php:16-45`).

### SXO-02: Pytanie „ile kosztuje strona internetowa” obsługuje akordeon na stronie głównej (klaster #6)
- **Ważność:** Critical
- **Dowód:** SERP 9/9 to artykuły i cenniki (kb.pl 1 302 słowa + `Article`; cenauslug „średnio 6 000 zł”, `FAQPage`+`HowTo`; landingi, hostinger). Netizo ma jedną odpowiedź w FAQ (`lang/pl/home.php:50-51`: 1–5 / 5–15 / 15–50 / 50+ tys. zł), schowaną ok. 10 ekranów w dół. Typ Landing Page pod frazę informacyjną to wg taksonomii niedopasowanie CRITICAL.
- **Rekomendacja:** (a) `/cennik`: Service/Tool z pakietami (strona wizytówka, firmowa, sklep, aplikacja), widełkami netto, czynnikami ceny i kalkulatorem opartym na wzorcu `commission-calculator.tsx` (presety już są w `partner-data.ts`: 4 000 / 10 000 / 15 000 / 30 000 zł). (b) `/blog/ile-kosztuje-strona-internetowa`: artykuł 1 500–2 500 słów z tabelą cen 2026, kosztami utrzymania (domena, hosting, SSL, opieka), porównaniem agencji z freelancerem i kreatorem, autorem i datą (`Article`). FAQ na stronie głównej linkuje do obu.

### SXO-03: Sześć usług bez własnych podstron
- **Ważność:** High
- **Dowód:** sekcja „Co dla Ciebie zbudujemy” (`resources/js/components/home/services-section.tsx:28-57`) daje każdej usłudze 1 zdanie (~10–15 słów) plus tagi technologii. Dla „aplikacje webowe dla firm” SERP to w 78% treści hybrydowe/edukacyjne („co to jest”, „kiedy warto”, „ile kosztuje”: cenauslug podaje 110–240 zł/h, 2 tyg.–7 mies.). Netizo nie ma strony, która mogłaby na to odpowiadać.
- **Rekomendacja:** podstrony `/tworzenie-stron-internetowych`, `/sklepy-internetowe`, `/aplikacje-webowe` (później `/aplikacje-mobilne`, `/automatyzacja-ai`). Każda wg SOLL Service Page: problem → zakres → proces (komponent `process-section` do reużycia) → 2–3 dopasowane case studies → widełki ceny → FAQ specyficzne dla usługi → CTA z brief z preselekcją typu (`brief-options.ts`, wartość `types[]`). Kafelki bento linkują do podstron (dziś „Rozpocznij” tylko otwiera kontakt).

### SXO-04: Strona główna nie komunikuje frazy ani lokalizacji
- **Ważność:** High
- **Dowód:** title, H1, lead i hero nie zawierają „tworzenie stron internetowych”, „Leszno” ani „Wielkopolska”. JSON-LD ma tylko `addressLocality: Leszno` (`HomeController.php:50-55`). W treści widocznej „tworzenie stron” pada raz.
- **Rekomendacja:** title np. „Tworzenie stron internetowych i aplikacji webowych | Netizo Leszno” (`lang/pl/home.php:10`). Pod H1 lub w leadzie (`hero.tsx:49`) dodać „Software house z Leszna, pracujemy z firmami z całej Polski”. H1 może zostać brandowy, bo stronami docelowymi fraz staną się podstrony z SXO-01/03.

### SXO-05: Systemowy deficyt zaufania (najsłabszy wymiar u wszystkich person)
- **Ważność:** High
- **Dowód:** brak opinii i cytatów klientów, zdjęć i nazwisk zespołu, pełnych danych firmy (ulica, NIP/KRS), mapy, ocen zewnętrznych (Google, Oferteo, Clutch). Linki w stopce `/regulamin`, `/polityka-prywatnosci`, `/utrzymanie` dają 404 (`resources/js/lib/site.ts:63-65`), a strona zbiera leady w 5 formularzach. Liczby „150+ zrealizowanych projektów”, „30M+ zapytań”, „250K+ linii kodu” nie mają pokrycia: pokazanych jest 5 case studies i 8 domen w marquee, z czego 2 bez linku (vetly.pl, lavaforyou.is). Konkurencja eksponuje „Opinie klientów” (candyweb, kowalskistudio, em-promo), a Oferteo pokazuje np. „109 opinii”.
- **Rekomendacja:** sekcja „Co mówią klienci” (2–3 cytaty z imieniem, firmą i zdjęciem, np. Treepro, Energizo, Na Każdą Okazję) przy „Zaufali nam” (`clients-section.tsx`). Strona `/o-nas` (zespół, NIP, adres, rok założenia). Zbudować `/regulamin`, `/polityka-prywatnosci`, `/utrzymanie`. Zebrać opinie w Google Business Profile i Oferteo. Liczbę „150+” albo udokumentować (lista realizacji), albo zastąpić weryfikowalną.

### SXO-06: Case studies nie mają własnych URL-i
- **Ważność:** High
- **Dowód:** „Zobacz case study projektu …” otwiera `CaseStudyDialog` (`resources/js/components/home/projects-section.tsx:69`) bez zmiany adresu. Model `Project` ma już `slug`, `full_description`, `challenges`, `solutions` i `metrics`. Konkurencja ma sekcje „Realizacje” i osobne strony portfolio (webtom „Co stworzyliśmy?”, smart-agency „Realizacje”).
- **Rekomendacja:** `/realizacje` oraz `/realizacje/{project:slug}` (EN `/en/projects/{slug}` z polami `_en`) z treścią z modelu, zrzutami, metrykami, stackiem, cytatem klienta i CTA „Chcę podobny projekt”. Schema `CreativeWork` + `BreadcrumbList`. Modal może zostać jako podgląd z linkiem „Pełne case study”.

### SXO-07: Netizo niewidoczne w SERP i katalogach, które dominują frazy lokalne i „software house”
- **Ważność:** High
- **Dowód:** 0 wzmianek w 19 pobranych stronach SERP, w tym w rankingach Oferteo `projektowanie-stron-internetowych/leszno` i `agencja-interaktywna/leszno`. Dla „software house Poznań” 6/9 wyników to katalogi i rankingi (GoodFirms, startup-house directory, TTMS).
- **Rekomendacja:** profile w Oferteo (Leszno), Clutch, GoodFirms i techbehemoths z portfolio i opiniami; Google Business Profile z kategorią „Projektant stron internetowych” (dalej: `/seo local`). Na „software house Poznań” **nie** tworzyć doorway page bez realnej obecności. Strona `/tworzenie-stron-internetowych/poznan` dopiero przy ≥2 klientach z Poznania i unikalnej treści, bo masowe strony miast to ryzyko polityki „scaled content / doorway”.

### SXO-08: Program partnerski: typ dopasowany, ale brakuje dokumentów i dowodów
- **Ważność:** Medium
- **Dowód:** `/partnerzy` spełnia wzorzec Landing (hero z liczbami 15% / 12 mies. / 14 dni / 0 zł, kalkulator, kroki, zasady, FAQ, krótki formularz). Warunki są konkurencyjne wobec benchmarków z SERP: InMotion 10% przez 12 mies., agencja z ogłoszenia Useme 10% z wypłatą w 15 dni, nazwa.pl 25–50% na hosting. Jednak „Pełną umowę dostajesz do przejrzenia przed startem” (`resources/js/components/partners/rules-section.tsx:9`), link „Regulamin” w stopce to 404, brak opinii partnerów i danych firmy wypłacającej prowizję. Hostinger ma `FAQPage` + `Service` i sekcję opinii („Nie wierz nam na słowo”).
- **Rekomendacja:** `/partnerzy/regulamin` (publiczny regulamin programu). Pod „Zasady programu” dodać przykładowe zestawienie wypłaty i pierwszy cytat partnera po starcie. Dodać `Organization` z NIP. Uczciwe oczekiwania: wolumen fraz partnerskich jest niski i zdominowany przez hosting, więc to strona do ruchu bezpośredniego i poleceń, nie do SEO.

### SXO-09: Schema słabsza niż u konkurencji z SERP
- **Ważność:** Medium
- **Dowód:** `ProfessionalService` (`HomeController.php:45-61`) bez `telephone`, `email`, `streetAddress`, `postalCode`, `geo`, `logo`, `openingHoursSpecification`; brak `Service`/`OfferCatalog` i `BreadcrumbList`. Konkurencja: m16 (`ProfessionalService` + `OfferCatalog` + `AggregateRating`), smart-agency (`LocalBusiness` + `OpeningHoursSpecification`), Oferteo (`AggregateRating` + `Review`).
- **Rekomendacja:** uzupełnić NAP i geo w organizacji. Na podstronach usług dodać `Service` (`provider` → organizacja, `areaServed`), na `/cennik` `OfferCatalog`, na blogu `Article`, wszędzie `BreadcrumbList`. Szczegóły: `/seo schema`.

### SXO-10: Sekcja usług mówi do developera, nie do właściciela firmy
- **Ważność:** Low
- **Dowód:** w treści dla SMB dominują tagi Kubernetes, Terraform, LangChain, RAG, Agents, GraphQL, „p95 42 ms” (`services-section.tsx`, kafelki `bento/`). Konkurencja lokalna mówi językiem korzyści („strony, które generują zapytania 24/7”, „edycja treści”, „widoczność w Mapach Google”).
- **Rekomendacja:** na stronie głównej tagi skrócić do 2–3 i dodać zdanie korzyści per usługa. Pełny stack przenieść na `/aplikacje-webowe`.

### SXO-11: Mobile above the fold bez sygnału lokalnego i dowodu
- **Ważność:** Low
- **Dowód:** zrzut mobilny: liczby „150+ / 8 lat / 0 zł za wycenę” i „Odpowiadamy w ciągu 24 godzin” są poniżej zgięcia, a baner cookies zajmuje ~1/3 ekranu.
- **Rekomendacja:** w hero mobile linia „Leszno · cała Polska · odpowiedź w 24 h”, baner cookies kompaktowy (1 wiersz + 2 przyciski).

---

## 4. User stories (z sygnałów SERP)

> Ograniczenie: narzędzie nie zwraca bloków PAA, local packa, reklam ani AI Overview. Jako **proxy PAA** służą pytania z sekcji FAQ stron rankujących (pobrane i sparsowane).

1. **Właściciel lokalnej firmy (awareness → consideration).** Jako właściciel firmy usługowej z Leszna chcę znaleźć wykonawcę strony w okolicy, z którym mogę się spotkać, bo chcę mieć kontrolę nad projektem i zaufanie do wykonawcy. Blokuje mnie **trust gap**: brak adresu, mapy i opinii lokalnych klientów.
   *Sygnały:* 8/9 wyników to strony „[usługa] Leszno”; FAQ maszwww „Czy w Lesznie można spotkać się osobiście, aby omówić projekt?”, webtom „Czy realizujecie strony internetowe dla firm z Leszna zdalnie?”; mapy u smart-agency, m16, mantikora; Oferteo z ocenami i liczbą opinii.
2. **Kupujący wrażliwy na cenę (consideration).** Jako przedsiębiorca chcę poznać realny koszt strony, zanim zadzwonię, bo nie chcę tracić czasu na rozmowy poza budżetem. Blokuje mnie **price sensitivity**: cena jest dopiero po briefie.
   *Sygnały:* SERP „ile kosztuje strona internetowa” 9/9 cenników; „Ile kosztuje strona internetowa w Lesznie?” w 5/5 FAQ konkurencji; ceny „od 1099 zł”, „od 1400 zł netto”, „od 1 749 zł netto”, „2 500 / 3 500 / 5 500 zł netto”; cenauslug „średnio 6 000 zł”.
3. **Marketing manager firmy średniej (consideration → decision).** Jako marketing manager chcę porównać 3–4 agencje na podstawie case studies z wynikami i podejścia do SEO przy redesignie, bo muszę uzasadnić wybór przed zarządem. Blokuje mnie **comparison fatigue** i brak linkowalnych dowodów.
   *Sygnały:* rankingi Oferteo „10 najlepszych 2026”; FAQ kowalskistudio „Dlaczego agencja interaktywna, a nie freelancer?”; maszwww „Czy strona będzie szybka (PageSpeed)?”, „Czy prowadzicie kampanie Google Ads w regionie?”; webtom „Czy pomagacie w pozycjonowaniu strony?”.
4. **Startup lub firma potrzebująca aplikacji (awareness → consideration).** Jako założyciel chcę zrozumieć, kiedy aplikacja webowa ma sens i ile kosztuje MVP, bo mam ograniczony budżet i termin. Blokuje mnie **technical confusion**: brak treści edukacyjnej i wyceny godzinowej lub sprintowej.
   *Sygnały:* OVH „Co to jest aplikacja internetowa?”, cenauslug „Kiedy warto zdecydować się na stworzenie aplikacji webowej?”, stawki 110–240 zł/h, czas 2 tyg.–7 mies.; SERP „software house Poznań” to rankingi (ocena wiarygodności).
5. **Potencjalny partner polecający (decision).** Jako księgowa lub grafik chcę zarabiać na poleceniach bez sprzedawania, bo i tak mnie o to pytają. Blokuje mnie ryzyko: nie znam umowy i nie wiem, czy wypłata nastąpi.
   *Sygnały:* strony programów Hostinger, GoDaddy i InMotion (FAQ, opinie, „10% przez 12 mies.”); artykuły o nazwa.pl (25–50%); ogłoszenie agencji z prowizją 10% i wypłatą w 15 dni.

---

## 5. Persony i scoring (Relevance / Clarity / Trust / Action, po 25 pkt)

| Persona | Strona | Relevance | Clarity | Trust | Action | Razem | Ocena |
|---|---|---|---|---|---|---|---|
| Właściciel lokalnej firmy z Leszna | `/` | 11 | 12 | 8 | 18 | **49** | Needs Work |
| Startup potrzebujący aplikacji | `/` | 13 | 13 | 10 | 17 | **53** | Needs Work |
| Marketing manager firmy średniej | `/` | 16 | 15 | 9 | 17 | **57** | Needs Work |
| Potencjalny partner polecający | `/partnerzy` | 23 | 22 | 13 | 22 | **80** | Excellent (na granicy) |

Średnia ważona (lokalne frazy komercyjne mają największy wolumen intencji: 40% / 20% / 25% / 15%): **~56/100**. Najsłabszy wymiar systemowy to **Trust** (średnio 10/25).

**1. Właściciel lokalnej firmy z Leszna: 49/100 (najsłabsza persona, największa waga)**
- *Relevance 11:* oferta obejmuje strony, ale ramę ustawiają SaaS, DevOps i AI; brak pakietu „strona dla firmy usługowej”, Leszno tylko w FAQ #10.
- *Clarity 12:* cena w zwiniętym akordeonie FAQ #1, lokalizacji nie ma nad zgięciem.
- *Trust 8:* brak adresu, mapy, NIP i opinii; 404 na regulaminie i polityce prywatności. Case Treepro (lokalne SEO, zachodnia Polska) jest trafny, ale ukryty w modalu.
- *Action 18:* „Wyceń projekt” nad zgięciem, telefon w nagłówku mobile, callback, odpowiedź w 24 h. Brakuje CTA „Umów spotkanie w Lesznie”.
- **Poprawka:** podstrona `/tworzenie-stron-internetowych/leszno` (SOLL niżej) z H1 „Tworzenie stron internetowych Leszno”, blokiem NAP i mapą, cenami „od … zł netto”, 2 cytatami lokalnych klientów i CTA „Umów bezpłatne spotkanie w Lesznie” (formularz callback z polem „preferowane miejsce”).

**2. Startup potrzebujący aplikacji: 53/100**
- *Relevance 13:* kafelek „Aplikacje webowe” ma ~12 słów; case Vetly.pl (platforma rezerwacji, „1000+ weterynarzy”) jest trafny; brak oferty MVP i discovery, informacji o własności kodu i NDA.
- *Clarity 13:* widełki 15–50 tys. zł tylko w FAQ; sprinty 2-tygodniowe w „Jak pracujemy”.
- *Trust 10:* liczby „30M+ zapytań”, „250K+ linii kodu” bez dowodu; brak zespołu i bloga technicznego.
- *Action 17:* brief ma opcję „Aplikacja web”, ale brak niskoprogowego CTA „Warsztat discovery / wycena MVP”.
- **Poprawka:** `/aplikacje-webowe` (Hybrid): H2 „Kiedy firmie opłaca się aplikacja webowa”, „Ile kosztuje aplikacja webowa (MVP od … zł, sprint … zł)”, „Własność kodu i NDA”, pełne case study Vetly, CTA „Zamów warsztat discovery (2 h)” prowadzące do brief z preselekcją `types[]=web-app`.

**3. Marketing manager firmy średniej: 57/100**
- *Relevance 16:* FAQ o redesignie i przekierowaniach przy migracji, panel klienta, proces z „Dostajesz:” na każdym etapie. Brak treści o SEO/treściach, analityce i dostępności.
- *Clarity 15:* nawigacja kotwicami; nie ma stron, które można wysłać przełożonemu (case studies bez URL).
- *Trust 9:* metryki projektów są, ale bez cytatów klientów, ocen zewnętrznych i nazwisk.
- *Action 17:* szczegółowy brief i szybka wiadomość; brak rezerwacji konsultacji w kalendarzu i oferty PDF.
- **Poprawka:** `/realizacje/{slug}` z wynikami „przed/po” i cytatem, `/o-nas` z zespołem, CTA „Umów 30-min konsultację” obok „Wyceń projekt”.

**4. Potencjalny partner polecający: 80/100**
- *Relevance 23 / Clarity 22 / Action 22:* dedykowana strona, liczby w hero, kalkulator, segmenty odbiorców, krótki formularz z odpowiedzią w 24 h.
- *Trust 13:* umowa niepubliczna, `/regulamin` 404, brak opinii partnerów i danych firmy.
- **Poprawka:** `/partnerzy/regulamin`, link pod „Zasady programu”, NIP i dane firmy w stopce, przykładowe zestawienie wypłaty.

---

## 6. SXO Gap Score: 42/100

| Wymiar | Wynik | Dowód |
|---|---|---|
| Page Type | **3/15** | 1 z 8 klastrów dopasowany (`/partnerzy`); frazy lokalne, cenowe i usługowe trafiają na jedną stronę główną |
| Content Depth | **6/15** | 2 381 słów na całą firmę vs mediana ~1 700 na jedną usługę i miasto u konkurencji; usługi po ~10–15 słów; cena tylko w FAQ |
| UX Signals | **11/15** | mocne: CTA nad zgięciem, telefon, callback, brief 6 kroków, odpowiedź w 24 h, FAQ. Słabe: case studies w modalach, 3 linki 404 w stopce, baner cookies na 1/3 ekranu mobile |
| Schema | **6/15** | `ProfessionalService` niekompletny (brak telefonu, ulicy, geo, logo, godzin), `FAQPage`; brak `Service`, `OfferCatalog`, `BreadcrumbList` i opinii |
| Media | **10/15** | wysokiej jakości zdjęcia, żywe makiety, zrzuty projektów z alt; brak zdjęć zespołu i biura, mapy oraz wideo |
| Authority | **3/15** | brak opinii, referencji, zespołu, NIP i ocen zewnętrznych; „150+ projektów” bez pokrycia; regulamin i polityka 404 |
| Freshness | **3/10** | brak bloga i dat (htmldate: 2026-01-01); sitemap `lastmod` 2026-10-09; brak treści aktualizowanych typu „cennik 2026” (cenauslug i Oferteo mają „2026” w title) |

---

## 7. Proponowana architektura podstron (usuwa niedopasowania)

```
/                                         Hub marki + usług (Landing/Hybrid). Title: „Tworzenie stron internetowych i aplikacji webowych | Netizo Leszno”
├── /tworzenie-stron-internetowych        Service Page: „tworzenie stron internetowych”, „strony www dla firm”      [klaster 5]
│   └── /tworzenie-stron-internetowych/leszno   Local Page: „tworzenie stron internetowych / strony internetowe / agencja interaktywna Leszno”   [1–3]
│       (kolejne miasta TYLKO z realnymi klientami i unikalną treścią; bez doorway pages)
├── /sklepy-internetowe                   Service Page (e-commerce: Na Każdą Okazję, HotPay, InPost)
├── /aplikacje-webowe                     Hybrid Service: „aplikacje webowe dla firm”, MVP, „software house”   [4, 7]
├── /aplikacje-mobilne, /automatyzacja-ai (faza 2)
├── /cennik                               Service/Tool: pakiety + widełki + kalkulator (wzorzec commission-calculator)   [6]
├── /realizacje                           lista case studies
│   └── /realizacje/{slug}                treepro, vetly, energizo, nakazdaokazje, krainamt2 (slug już w modelu Project)
├── /blog                                 Blog Post (Article, autor, data)
│   ├── /blog/ile-kosztuje-strona-internetowa          [6]
│   ├── /blog/ile-kosztuje-aplikacja-webowa            [7]
│   └── /blog/kiedy-warto-zamowic-aplikacje-webowa     [7]
├── /o-nas                                zespół, historia, NIP/KRS, biuro w Lesznie
├── /kontakt                              NAP + mapa + formularze (dziś tylko kotwica #kontakt)
├── /utrzymanie                           opieka techniczna, pakiety (dziś 404 w stopce)
├── /partnerzy                            ALIGNED [8]
│   └── /partnerzy/regulamin
└── /regulamin, /polityka-prywatnosci     (dziś 404)
EN: /en/web-development, /en/web-apps, /en/projects/{slug}, /en/pricing (bez stron miast PL)
```

**Wdrożenie w repo:** trasy i ich angielskie bliźniaki w `routes/web.php` (wzorzec nazw `x` ↔ `en.x`, `App\Services\LocalizedRoutes`); kontrolery na wzór `PartnerProgramController` (SEO przez `Controller::localizedSeo()`, FAQ z `lang/{pl,en}/*.php` + `Controller::faqSchema()`); strony w `resources/js/pages/` rejestrowane w `lib/pages.ts`; nawigacja w `site-header.tsx`, gdzie „Usługi”, „Projekty” i „Kontakt” prowadzą do podstron zamiast `#uslugi` / `#projekty`; `infoLinks` w `lib/site.ts:60-73`; `public/sitemap.xml` (zamiast adresów z fragmentami `/#stack`, `/#projekty`, `/#faq`, `/#kontakt`). Linkowanie wewnętrzne: kafelki usług → podstrony usług, FAQ „Ile kosztuje…” → `/cennik` i artykuł, FAQ „Czy pracujecie tylko z firmami z Leszna?” → `/tworzenie-stron-internetowych/leszno`.

### SOLL: `/tworzenie-stron-internetowych/leszno` (mobile-first)
```
<header> logo · Usługi · Realizacje · Cennik · Kontakt · [Wyceń projekt] </header>
<section hero>
  H1: „Tworzenie stron internetowych Leszno”
  Lead: „Software house z Leszna. Strony firmowe od X zł netto, sklepy od Y zł netto, gotowe w 4–6 tygodni.”
  CTA: [Wyceń projekt → brief, types[]=website] [Umów spotkanie w Lesznie → callback] · tel. +48 884 343 924
  Pasek zaufania: „150+ projektów · 8 lat · odpowiedź w 24 h · ★ ocena Google (po zebraniu)”
</section>
<section> H2 „Strony dla firm z Leszna i okolic”: Rydzyna, Święciechowa, Rawicz, Kościan, Gostyń (realne obszary, bez listy 90 miast) </section>
<section> H2 „Realizacje dla firm z regionu”: Treepro.pl (74 miejscowości, 3 województwa) → /realizacje/treepro </section>
<section> H2 „Ile kosztuje strona internetowa w Lesznie?”: 3 pakiety netto + link /cennik </section>
<section> H2 „Jak pracujemy”: 4 etapy (reużyć process-section) + panel klienta </section>
<section> H2 „Opinie klientów”: 2–3 cytaty z imieniem i firmą </section>
<section> H2 „Gdzie jesteśmy”: NAP (ulica, kod 64-100 Leszno), mapa, godziny, „spotkamy się u Ciebie lub w biurze” </section>
<section> H2 FAQ: „Czy można spotkać się osobiście w Lesznie?”, „Czy strona będzie widoczna w Mapach Google?”, „Czy mogę sam edytować treści?”, „Czy zajmiecie się domeną i hostingiem?”, „Ile trwa stworzenie strony?” </section>
<section> CTA powtórzone + szybka wiadomość </section>
Schema: ProfessionalService (pełny NAP + geo + openingHours) + Service(areaServed: Leszno) + FAQPage + BreadcrumbList
```

### SOLL: `/cennik`
```
H1: „Cennik stron internetowych i aplikacji 2026”
Tool nad zgięciem: wybór typu (wizytówka / firmowa / sklep / aplikacja) + suwaki (podstrony, CMS, integracje) → widełki netto
Tabela pakietów (netto, czas realizacji, co zawiera) · „Od czego zależy cena” · koszty utrzymania (domena, hosting, opieka → /utrzymanie)
FAQ (z SERP): „Ile kosztuje strona wizytówka?”, „Ile kosztuje sklep internetowy?”, „Agencja czy freelancer?”, „Czy wycena jest bezpłatna?”
CTA: [Dokładna wycena po briefie: 0 zł]
Schema: OfferCatalog/Offer(priceSpecification) + FAQPage + BreadcrumbList
```

---

## 8. Priorytety (od najsłabszej persony)

1. **`/tworzenie-stron-internetowych/leszno`** + uzupełnienie NAP w schema i GBP (persona 1, klastry 1–3). Największy zwrot.
2. **`/cennik` + artykuł „Ile kosztuje strona internetowa (2026)”** (klaster 6, personas 1 i 2).
3. **Trust pack (systemowo):** opinie klientów, `/o-nas` z NIP i zespołem, naprawa 404 (`/regulamin`, `/polityka-prywatnosci`, `/utrzymanie`), profile w Oferteo, Clutch i Google.
4. **`/realizacje/{slug}`**: case studies jako indeksowalne URL-e (personas 2 i 3).
5. **`/aplikacje-webowe`, `/tworzenie-stron-internetowych`, `/sklepy-internetowe`** + linkowanie z kafelków bento (klastry 4, 5, 7).
6. Title strony głównej z frazą i lokalizacją; usunięcie `meta keywords`.
7. `/partnerzy/regulamin` + dowody dla partnerów.

Powiązane analizy: E-E-A-T → `/seo content`; brakujące typy schema → `/seo schema`; intencja lokalna i Google Business Profile → `/seo local`; treść podstron → `/seo page`.

---

## 9. Ograniczenia

- **WebSearch to nie Google:** wyszukiwarka z własnym indeksem (US). Brak pozycji, bloków PAA, local packa, reklam, featured snippets i AI Overview. Jako proxy PAA użyto pytań FAQ ze stron rankujących. Zapytania „strony internetowe Leszno” i „agencja interaktywna Leszno” w wersji bazowej zwróciły wyniki niekomercyjne, więc użyto wariantu „…strony www sklepy internetowe”.
- Brak GSC, Keyword Planner i danych o wolumenach: wagi person są szacunkowe, a niewidoczność netizo.pl dotyczy przeanalizowanej próbki (nie wyklucza pozycji poza top 10 w Google).
- Nie sprawdzono Google Business Profile ani opinii w Google.
- Strony konkurencji pobrano bez renderu JS (`--mode never`), więc treść ładowana skryptem mogła zostać pominięta. Liczba słów z `parse_html` obejmuje nawigację i stopkę (dotyczy też netizo.pl, gdzie wlicza się tekst makiet UI i banera cookies).
- `/en` i `/en/partners` oceniono tylko pomocniczo (te same niedopasowania; fraz EN nie badano).

---

## 10. Źródła SERP (pobrane i sparsowane)

[webtom.pl](https://webtom.pl/strony-internetowe-leszno/) · [oferteo: projektowanie stron Leszno](https://www.oferteo.pl/projektowanie-stron-internetowych/leszno) · [lxproject.pl](https://lxproject.pl/tworzenie-stron-internetowych-leszno/) · [smart-agency.pl](https://www.smart-agency.pl/strony-internetowe-leszno/) · [investnet.pl](https://www.investnet.pl/tworzenie-stron-internetowych-leszno/) · [candyweb.pl](https://candyweb.pl/strony-internetowe-leszno/) · [em-promo.pl](https://em-promo.pl/) · [kowalskistudio.pl](https://kowalskistudio.pl/strony-internetowe-leszno/) · [maszwww.pl](https://maszwww.pl/tworzenie-stron-internetowych-leszno/) · [oferteo: agencja interaktywna Leszno](https://www.oferteo.pl/agencja-interaktywna/leszno) · [m16.pl](https://www.m16.pl/strony-internetowe/leszno/) · [mantikora.pl](https://mantikora.pl/strony-internetowe-leszno/) · [websylium.com](https://websylium.com/) · [kb.pl cennik](https://kb.pl/ceny/uslugi-biznesowe/cennik-stron-internetowych-sprawdzamy-ile-kosztuje-zrobienie-strony/) · [cenauslug: strona firmowa](https://cenauslug.pl/firma-i-biuro/stworzenie-firmowej-strony-internetowej-do-5-podstron) · [cenauslug: aplikacje webowe](https://cenauslug.pl/firma-i-biuro/tworzenie-aplikacji-webowych) · [landingi.com](https://landingi.com/pl/blog/koszt-utrzymania-strony-internetowej/) · [OVHcloud](https://www.ovhcloud.com/pl/learn/what-is-web-application/) · [Hostinger partner program](https://www.hostinger.com/pl/partner-program) · z listy wyników (niepobrane): [TTMS top 10](https://ttms.com/pl/top-10-firm-software-house-w-polsce/), [GoodFirms Poznań](https://www.goodfirms.co/directory/city/top-website-development-companies/wordpress/poznan), [hostinger: ile kosztuje strona](https://www.hostinger.com/pl/tutoriale/?p=487), [antyweb: nazwa.pl program partnerski](https://antyweb.pl/firma-nazwa-pl-wyplaca-atrakcyjne-prowizje-za-polecanie-swoich-uslug-na-jakich-zasadach-dziala-program-partnerski), [InMotion agency partner](https://www.inmotionhosting.com/pl/agency-partner-program?mktgp=t).

---

## 11. Dane strukturalne do `audit-data.json` (kategoria „Search Experience”)

```json
{
  "category": "Search Experience",
  "score": 42,
  "sxo_gap_score": {"page_type": 3, "content_depth": 6, "ux_signals": 11, "schema": 6, "media": 10, "authority": 3, "freshness": 3},
  "persona_scores": {"local_owner_leszno": 49, "startup_web_app": 53, "marketing_manager": 57, "referral_partner": 80, "weighted": 56},
  "findings": [
    {"id": "SXO-01", "severity": "Critical", "title": "Brak lokalnej podstrony 'Tworzenie stron internetowych Leszno' (SERP 89% stron miasto+usługa)", "file": "routes/web.php; lang/pl/home.php:10,16-45"},
    {"id": "SXO-02", "severity": "Critical", "title": "'Ile kosztuje strona internetowa': SERP 100% artykułów i cenników, Netizo ma tylko akordeon FAQ", "file": "lang/pl/home.php:50-51"},
    {"id": "SXO-03", "severity": "High", "title": "6 usług bez podstron (~10-15 słów na usługę)", "file": "resources/js/components/home/services-section.tsx:28-57"},
    {"id": "SXO-04", "severity": "High", "title": "Title, H1 i hero bez frazy i lokalizacji (Leszno 3x w treści vs 14-61x u konkurencji)", "file": "lang/pl/home.php:10; resources/js/components/home/hero.tsx:48-49"},
    {"id": "SXO-05", "severity": "High", "title": "Deficyt zaufania: brak opinii, zespołu, NAP i NIP; regulamin i polityka 404", "file": "resources/js/lib/site.ts:63-65"},
    {"id": "SXO-06", "severity": "High", "title": "Case studies tylko w modalu, bez URL", "file": "resources/js/components/home/projects-section.tsx:69"},
    {"id": "SXO-07", "severity": "High", "title": "Netizo niewidoczne w SERP i katalogach (0 wzmianek w 19 stronach SERP)", "file": null},
    {"id": "SXO-08", "severity": "Medium", "title": "/partnerzy dopasowany typem, ale bez publicznego regulaminu i dowodów", "file": "resources/js/components/partners/rules-section.tsx:9"},
    {"id": "SXO-09", "severity": "Medium", "title": "Schema słabsza niż u konkurencji (brak NAP/geo, Service, OfferCatalog, BreadcrumbList)", "file": "app/Http/Controllers/HomeController.php:45-61"},
    {"id": "SXO-10", "severity": "Low", "title": "Sekcja usług w żargonie technicznym zamiast korzyści dla SMB", "file": "resources/js/components/home/services-section.tsx"},
    {"id": "SXO-11", "severity": "Low", "title": "Mobile above the fold bez lokalizacji i dowodu; baner cookies zajmuje ~1/3 ekranu", "file": "resources/js/components/home/hero.tsx"}
  ]
}
```

---

## Ocena kategorii

**42/100**: strona jest dopracowana wizualnie i konwersyjnie (CTA, brief, callback, panel, dopasowany typem `/partnerzy`), ale architektura jednej strony głównej nie pasuje do typów stron, które Google nagradza dla fraz docelowych (lokalne strony usługowe 78–89%, cenniki i artykuły 100%, katalogi 67%), a deficyt zaufania (brak opinii, NAP, regulaminu) obniża ocenę każdej persony.
