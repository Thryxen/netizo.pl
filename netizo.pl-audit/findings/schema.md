# Audyt danych strukturalnych — netizo.pl

Data: 2026-10-11. Zakres: `/`, `/en`, `/partnerzy`, `/en/partners` (źródło: `raw/*.html`, SSR — JSON-LD jest w surowym HTML, nie wymaga renderowania JS). Metoda: parsowanie wszystkich `<script type="application/ld+json">`, porównanie z widoczną treścią, lektura kodu generującego, weryfikacja w dokumentacji i changelogu Google (pobrane 2026-10-11). Rich Results Test / validator.schema.org nie były uruchamiane (wymagają przeglądarki) — walidacja wykonana ręcznie wg dokumentacji i skryptem (składnia, @id, URL-e absolutne, brak placeholderów).

## 0. Korekta założeń zlecenia (FAQPage)

Zlecenie zakłada, że Google pokazuje dziś rich results FAQ dla stron rządowych/zdrowotnych. To nieaktualne. Changelog Google Search Central: 8 maja 2026 — „Deprecating the FAQ rich result feature … will no longer appear in Google Search starting May 7, 2026"; 12 czerwca 2026 — dokumentacja FAQ rich result usunięta („no longer shown in Google Search results"). Od 7.05.2026 FAQ rich results nie ma dla żadnej witryny. Dla Netizo (strona komercyjna) wniosek praktyczny jest ten sam co przed zmianą: zero korzyści SERP z FAQPage. Pozostałe zweryfikowane fakty użyte niżej: Organization — brak wymaganych właściwości, zalecane m.in. logo (min. 112×112 px), telephone, email, contactPoint, sameAs, legalName, taxID/vatID, foundingDate, numberOfEmployees; Local business — wymagane tylko `name` i `address`, `priceRange` < 100 znaków; site name — `WebSite` tylko na stronie głównej domeny (podkatalog `/en` nie jest wspierany, „Google Search does not support site names at the subdirectory level"); breadcrumbs — od 22.01.2025 tylko desktop.

## 1. Wykrycie

| Strona | Format | Bloki | Typy |
|---|---|---|---|
| `/` | JSON-LD (head, SSR) | 2 | `ProfessionalService` (+ `PostalAddress`, `Country`), `FAQPage` (11 × `Question`/`Answer`) |
| `/en` | JSON-LD | 2 | j.w., treść po angielsku |
| `/partnerzy` | JSON-LD | 2 | `WebPage`, `FAQPage` (9 pytań) |
| `/en/partners` | JSON-LD | 2 | `WebPage`, `FAQPage` (9 pytań) |

Microdata i RDFa: brak (0 × `itemscope`, `typeof`, `vocab`). Wszystkie 8 bloków to poprawny JSON, osobne `<script>` bez `@graph`, bez żadnego `@id`. Raw HTML i render dają ten sam wynik (`structured_data` z `home-render.json`: 2 bloki, oba valid) — schema jest renderowane po stronie serwera.

Źródła w kodzie: `HomeController.php:44-67` (ProfessionalService przez `JsonLdMulti`), `PartnerProgramController.php:38-43` (WebPage), `Controller.php:17-32` (`faqSchema()`), `resources/views/app.blade.php:64` (`SEO::generate()`), `app.blade.php:66-71` (skrypt FAQ), `config/seotools.php:84-95` (domyślne JSON-LD), `App\Services\SocialProfiles` (`sameAs`).

## 2. Walidacja per blok

| Blok | @context https | @type poprawny | Wymagane (Google) | Typy wartości | Placeholdery | URL absolutne | Daty ISO | Wynik |
|---|---|---|---|---|---|---|---|---|
| `ProfessionalService` PL/EN | tak | tak (podtyp LocalBusiness/Organization) | `name`, `address` obecne | tak | brak | tak | n/d | PASS, 0 błędów; luki w zalecanych (telephone, email, logo, geo, openingHours) |
| `FAQPage` (4 strony) | tak | tak | `Question.name`, `acceptedAnswer.text` | tak | brak | n/d | n/d | PASS składniowo; 11/11 i 9/9 pytań i odpowiedzi obecne w widocznej treści; ostrzeżenie: niewidoczne znaki (S-07); brak funkcji w Google (S-06) |
| `WebPage` `/partnerzy`, `/en/partners` | tak | tak | brak wymagań (Google nie ma funkcji WebPage) | tak | brak | tak | n/d | PASS, ale minimalny (S-04) |

Sprawdzone względem treści: telefon `+48 884 343 924` i `kontakt@netizo.pl` są w stopce (e-mail zasłonięty przez Cloudflare, po dekodowaniu zgodny), `sameAs` = trzy profile ze stopki, „150+ projektów, 8 lat doświadczenia" = liczniki w hero, `inLanguage` zgodne z `<html lang>`, adresy OG-image zwracają 200. Nie wykryto błędów składniowych ani ostrzeżeń „missing required".

## 3. Ustalenia

### S-01 — `ProfessionalService` bez telephone, email, logo, contactPoint — High
- Dowód: blok na `/` i `/en` ma tylko name, description, url, image (obraz OG 1200×630), address (Leszno/wielkopolskie/PL), areaServed, knowsLanguage, priceRange, sameAs. Tymczasem na stronie są: `+48 884 343 924` (`tel:+48884343924`, stopka i kontakt), `kontakt@netizo.pl`, logo (`/images/icons/icon-512.png`, 512×512 PNG, 200 OK, ciemny kwadrat czytelny na białym tle). Dane są publiczne i widoczne, więc zgodne z zasadą „schema = treść strony".
- Wpływ: dla firmy usługowej z siedzibą w Lesznie to najważniejsze sygnały encji (knowledge panel, kontakt, logo w wynikach); przy ich braku encja jest uboga.
- Rekomendacja: dodać `email`, `telephone`, `contactPoint`, `logo` (ImageObject), `alternateName: "Netizo.pl"` (zgodnie z `apple-mobile-web-app-title` i manifestem). Szybka poprawka bez refaktoru: w `HomeController.php:45-61` dopisać `->addValue('email', 'kontakt@netizo.pl')->addValue('telephone', '+48 884 343 924')->addValue('logo', asset('images/icons/icon-512.png'))->addValue('contactPoint', [...])`. Docelowo wartości do `config/company.php` (dziś duplikują się w `resources/js/lib/site.ts:10-16`).

### S-02 — Brak spójnego grafu: brak @id, encja rozdwojona między PL i EN — Medium
- Dowód: `url` organizacji to `https://netizo.pl` na `/`, ale `https://netizo.pl/en` na `/en` (`HomeController.php:48`, `LocalizedRoutes::url('home')`); `image` różni się (`og-netizo-2.png` vs `og-netizo-en.png`); żaden węzeł nie ma `@id`; FAQPage nie jest powiązane z żadną stroną ani organizacją. Dla Google `url` jest identyfikatorem organizacji (w dokumentacji Organization: „helps Google uniquely identify your organization") — dwa różne `url` to dwie encje.
- Rekomendacja: jedna encja `https://netizo.pl/#organization` z `url` = `https://netizo.pl/` we wszystkich językach (zmiana `HomeController.php:48` na `route('home')`), `image`/`logo` niezależne od języka, obrazy OG per język przenieść do węzła WebPage (`primaryImageOfPage`). Całość w jednym `@graph` z powiązaniami `isPartOf`/`about`/`publisher`/`creator` (sekcja 5). Uwaga: Google nie wymaga `@id` (usunęli go z dokumentacji Local business — wystarcza `url`), ale `@id` porządkuje graf dla Bing, narzędzi AI i walidatorów.

### S-03 — Brak węzła `WebSite` — Medium
- Dowód: żaden z 8 bloków nie ma `WebSite`. Google: „To indicate your site name preference, add WebSite structured data to your home page". Nazwa „Netizo" jest dziś spójna w `<title>`, `og:site_name` i `name` organizacji, więc ryzyko jest małe, ale preferencję można wskazać wprost (`name: "Netizo"`, `alternateName: "Netizo.pl"`).
- Rekomendacja: dodać `WebSite` z `@id` `https://netizo.pl/#website` (`url` = korzeń domeny, także na `/en`). Nie dodawać `potentialAction`/SearchAction (sitelinks searchbox wycofany, witryna nie ma wyszukiwarki). Na stronie głównej ma być dokładnie jeden `WebSite` — dlatego projekty portfolio modelować jako `CreativeWork`, nie `WebSite`.

### S-04 — Strony partnerskie: `WebPage` bez powiązań, bez Organization i breadcrumbs — Medium
- Dowód: `/partnerzy` i `/en/partners` mają tylko 6 pól WebPage (name, description, url, image, inLanguage) i FAQPage; brak `isPartOf`, `publisher`/`about`, `breadcrumb`, `primaryImageOfPage`. Test `PartnerProgramPageTest.php:78` wręcz wymusza brak organizacji na tej stronie. Strona jest osobnym „bytem" bez wskazania wydawcy.
- Rekomendacja: graf z krótkim węzłem `Organization` (ten sam `@id`; celowo typ `Organization`, bo `ProfessionalService` = LocalBusiness wymaga `address` i Google zgłosiłby błąd na skróconym węźle), `WebSite`, `WebPage` z `isPartOf` + `publisher` + `breadcrumb`, `BreadcrumbList` (Strona główna → Program partnerski), `FAQPage`. Wartość BreadcrumbList jest mała (2 poziomy, od 2025 tylko desktop), więc priorytet niski w obrębie tego ustalenia. Opcjonalnie węzeł `Service` opisujący program (15% netto, 12 miesięcy, wypłata w 14 dni — fakty z treści strony); to bez funkcji w Google, tylko porządek encji.

### S-05 — Usługi i portfolio nieodzwierciedlone w schema — Medium
- Dowód: strona pokazuje 6 usług (sekcja „Co dla Ciebie zbudujemy": aplikacje webowe, mobilne, AI i automatyzacja, backend, DevOps, e-commerce; `resources/js/components/home/services-section.tsx:30-60`), widełki cen w FAQ (1–5 tys. zł, 5–15 tys. zł, 15–50 tys. zł, od 50 tys. zł) i 5 projektów z linkami (Treepro.pl, Vetly.pl, energizo.pl, nakazdaokazje.pl, KrainaMT2.pl; `HomeController::projectProps()`); w JSON-LD nie ma nic z tego. Google nie ma rich resulta dla Service/OfferCatalog/CreativeWork, więc to wyłącznie korzyść encyjna (Bing, odpowiedzi AI), nie SERP.
- Rekomendacja: `hasOfferCatalog` (6 × Offer → Service, bez cen) w węźle organizacji oraz `ItemList` z `CreativeWork` generowany z tych samych `$projects` co strona (sekcja 5). Treść usług trzymać w `lang/{pl,en}/home.php` (`schema.services`) — dziś tylko w TSX. Ceny z FAQ jako `priceSpecification` dopiero po dopisaniu na stronie, czy są netto czy brutto (FAQ tego nie mówi).

### S-06 — FAQPage: brak korzyści w Google, realistyczna ocena wartości — Info
- Dowód: 4 × FAQPage (11 + 11 + 9 + 9 pytań), generowane z jednego źródła `lang/{pl,en}/{home,partners}.php` przez `Controller.php:17-32`; treść w 100% zgodna z widoczną; to prawdziwe FAQ właściciela, więc FAQPage (nie QAPage) jest semantycznie poprawne.
- Ocena: Google — zero (od 7.05.2026, sekcja 0). Bing/AI — korzyść niepotwierdzona; ilościowo nie da się jej zmierzyć, a treści i tak są w widocznym HTML, który crawlery AI czytają bezpośrednio. Koszt utrzymania prawie zerowy (jedno źródło, testy). Zalecenie: zostawić istniejące (nie usuwać — brak szkody), nie rozbudowywać o nowe FAQPage ani nie uznawać tego za dźwignię SEO; wartość realna leży w widocznej sekcji FAQ, nie w znaczniku.

### S-07 — Niewidoczne znaki U+2060 i U+00A0 w tekście JSON-LD — Low
- Dowód: w `home-pl.html` 6 × U+2060 (WORD JOINER) i 11 × U+00A0 w bloku FAQ (np. „1–⁠5 tys. zł"), w `home-en.html` 6 i 7; strony partnerskie bez U+2060, z NBSP (7 i 5). Źródło: `lang/pl/home.php:51-55` i odpowiedniki; `Controller.php:28` przekazuje tekst bez normalizacji. Znaki są potrzebne na ekranie (zrywanie zakresów), ale w danych maszynowych psują tokenizację i dopasowanie tekstu („1–5" z niewidocznym znakiem w środku).
- Rekomendacja: w `faqSchema()` (docelowo `StructuredData::faq()`) `str_replace(["\u{2060}", "\u{00A0}"], ['', ' '], $text)`; dostosować `PartnerProgramPageTest.php:75` (porównuje `text` 1:1 z `faq[0]['answer']`).

### S-08 — `priceRange: "$$"` — Low
- Dowód: `HomeController.php:61`. Wartość jest generyczna, w dolarach, a strona podaje ceny w PLN (FAQ: od 1 tys. zł). Nie jest błędem (poniżej 100 znaków), ale nie niesie informacji.
- Rekomendacja: `od 1000 PLN` (PL) / `from PLN 1,000` (EN) — dokładnie to, co mówi FAQ — albo usunąć.

### S-09 — Domyślne JSON-LD w `config/seotools.php` jest nieaktualne i utajone — Low
- Dowód: `config/seotools.php:84-95` ustawia domyślny `WebPage` „Netizo | Software House" z opisem „aplikacje webowe, mobilne i systemy enterprise" i `url => 'full'` (łącznie z query string). Dziś nie widać go na 4 stronach, bo kontrolery nadpisują wszystko. Każda nowa strona, która nie ustawi JSON-LD, wyemituje ten przestarzały blok (`JsonLd::isEmpty()` jest false przy niepustych defaultach). Przy migracji na własny `@graph` bez wyzerowania defaultów dostaniesz zdublowany blok.
- Rekomendacja: `'json-ld' => ['defaults' => []]` (po migracji). Analogicznie opis w `config/seotools.php:16` jest nieaktualny (nieużywany, ale mylący).

### S-10 — Drobna niespójność PL/EN w twierdzeniach — Low
- Dowód: `lang/en/home.php:62` (FAQ EN) mówi „companies from all over the country and from abroad … in Polish or English", a odpowiednik PL (`Czy pracujecie tylko z firmami z Leszna?`) tylko „z całej Polski"; `areaServed` na `/en` to wyłącznie Poland (`lang/en/home.php:13`). CLAUDE.md wymaga tych samych twierdzeń w obu językach.
- Rekomendacja: ujednolicić treść (klient `lavaforyou.is` sugeruje, że zagraniczni klienci są prawdziwi) i dopasować `areaServed`.

### S-11 — Brakujące właściwości: co dodać, a czego nie — Info

| Właściwość | Decyzja | Uzasadnienie |
|---|---|---|
| telephone, email, logo, contactPoint, alternateName | DODAĆ (S-01) | dane na stronie |
| sameAs (FB, IG, TikTok) | jest | zgodne ze stopką; Discord pusty w `.env`; LinkedIn/GitHub/Clutch dopiero gdy istnieją |
| geo | NIE dodawać teraz | model SAB, na stronie brak adresu ulicy; środek Leszna nie jest lokalizacją firmy; wymaga decyzji o publikacji adresu (lokalne pakiety i tak zależą od Google Business Profile) |
| streetAddress, postalCode | placeholder, po decyzji właściciela | brak na stronie (kod pocztowy Leszna 64-100 do potwierdzenia) |
| openingHoursSpecification | NIE dodawać | na stronie brak godzin (jest tylko „odpowiadamy w ciągu 24 godzin") |
| founder, foundingDate, numberOfEmployees | placeholdery, po dopisaniu na stronie sekcji „O nas" | „8 lat doświadczenia" nie jest datą założenia; dane niewidoczne na stronie naruszałyby zasadę zgodności schema z treścią |
| legalName, taxID/vatID | placeholdery | strony `/regulamin` i `/polityka-prywatnosci` zwracają 404 (`resources/js/lib/site.ts:63-71`) — po ich publikacji dopisać dane firmy |
| aggregateRating, Review | NIE dodawać | brak opinii na stronie; dla LocalBusiness/Organization opinie z własnej witryny to „self-serving", a Google zaleca aggregateRating tylko dla serwisów zbierających opinie o innych firmach |
| Product/Offer z ceną | NIE | brak ofert z ceną na stronie |
| HowTo, SpecialAnnouncement | NIE | wycofane |

### S-12 — Spójność danych strukturalnych ze stroną — Info (pozytyw)
`inLanguage` = `app()->getLocale()`; `url` budowane przez `LocalizedRoutes` (nie z żądania), więc duplikat `/index.php` nie zanieczyszcza JSON-LD; hreflang/canonical spójne z `url` WebPage (`https://netizo.pl` i `https://netizo.pl/` są równoważne, ale w grafie warto stosować wersję z `/` dla korzenia domeny); FAQ w JSON-LD = FAQ widoczne (liczba, kolejność i teksty).

## 4. Co działa dobrze
- Pełne JSON-LD w SSR, w `<head>`, każde 8/8 bloków poprawnym JSON-em, `@context` https, URL-e absolutne, brak placeholderów i przestarzałych typów (brak HowTo, SpecialAnnouncement).
- Jedno źródło prawdy dla FAQ (`lang/*`), znacznik zawsze zgodny z widoczną treścią i objęty testami (`HomePageTest`, `PartnerProgramPageTest`, `TranslationParityTest`).
- Poprawna lokalizacja: `inLanguage`, `knowsLanguage`, osobne opisy i obrazy OG per język, hreflang + x-default.
- `sameAs` z konfiguracji (`SocialProfiles`) wyłącznie z realnych, wypełnionych profili; puste sieci są pomijane (test).
- Typ `ProfessionalService` z wymaganymi dla Google `name` i `address`; adres bez ulicy to świadomy wybór SAB.
- Brak ryzykownych znaczników: brak sfabrykowanych ocen, FAQ jest autentyczne.

## 5. Gotowe bloki JSON-LD do wdrożenia

Zasady: jeden `<script type="application/ld+json">` z `@graph` na stronę; encja `https://netizo.pl/#organization` i `https://netizo.pl/#website` takie same w PL i EN; `url` organizacji i witryny to zawsze korzeń domeny. W blokach nie ma placeholderów — wszystkie wartości pochodzą z treści strony lub z kodu. Bloki wygenerowano i zwalidowano skryptem (składnia, rozwiązywalność wszystkich `@id`, brak duplikatów, URL-e https, brak placeholderów i znaków U+2060/U+00A0). `FAQPage` pokazano skrócone do 2 pytań — pełne 11 (strona główna) i 9 (partnerzy) generuje kod z `lang/*` (odpowiedzi po normalizacji z S-07). Węzeł `ItemList` pokazano z 2 z 5 projektów — reszta z bazy (`$projects`).

Logo: tymczasowo `https://netizo.pl/images/icons/icon-512.png` (istnieje, 512×512). Docelowo warto wystawić dedykowany plik logo (np. `public/assets/images/logo-netizo.png`) i zmienić `config/company.php`.

### 5.1 Strona główna PL (`/`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://netizo.pl/#organization",
      "name": "Netizo",
      "alternateName": "Netizo.pl",
      "url": "https://netizo.pl/",
      "description": "Profesjonalne tworzenie stron internetowych i aplikacji webowych dla firm. Nowoczesny design, szybkość i SEO w standardzie. 150+ projektów, 8 lat doświadczenia.",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://netizo.pl/#logo",
        "url": "https://netizo.pl/images/icons/icon-512.png",
        "contentUrl": "https://netizo.pl/images/icons/icon-512.png",
        "width": 512,
        "height": 512,
        "caption": "Netizo"
      },
      "image": "https://netizo.pl/images/icons/icon-512.png",
      "email": "kontakt@netizo.pl",
      "telephone": "+48 884 343 924",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+48 884 343 924",
        "email": "kontakt@netizo.pl",
        "availableLanguage": [
          "pl",
          "en"
        ]
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Leszno",
        "addressRegion": "wielkopolskie",
        "addressCountry": "PL"
      },
      "areaServed": [
        {
          "@type": "Country",
          "name": "Polska"
        },
        {
          "@type": "City",
          "name": "Leszno"
        }
      ],
      "knowsLanguage": [
        "pl",
        "en"
      ],
      "priceRange": "od 1000 PLN",
      "sameAs": [
        "https://www.facebook.com/netizo.agency",
        "https://www.instagram.com/netizo.agency",
        "https://www.tiktok.com/@netizo.agency"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Co dla Ciebie zbudujemy",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Aplikacje webowe",
              "description": "Nowoczesne aplikacje SPA i SSR, od prostych landing page po złożone platformy SaaS."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Aplikacje mobilne",
              "description": "Jeden kod na iOS i Android, pełna wydajność na obu platformach."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI & Automatyzacja",
              "description": "Chatboty, integracje z AI i automatyzacja procesów."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Systemy backend",
              "description": "Skalowalne API i mikroserwisy gotowe na wysokie obciążenia."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "DevOps & Cloud",
              "description": "Infrastruktura jako kod, CI/CD, konteneryzacja i monitoring 24/7."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "E-commerce",
              "description": "Sklepy internetowe i marketplace’y z integracją płatności i fulfillmentu."
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://netizo.pl/#website",
      "url": "https://netizo.pl/",
      "name": "Netizo",
      "alternateName": "Netizo.pl",
      "inLanguage": [
        "pl",
        "en"
      ],
      "publisher": {
        "@id": "https://netizo.pl/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://netizo.pl/#webpage",
      "url": "https://netizo.pl/",
      "name": "Tworzymy Strony WWW dla Ambitnych Firm | Netizo",
      "description": "Profesjonalne tworzenie stron internetowych i aplikacji webowych dla firm. Nowoczesny design, szybkość i SEO w standardzie. React, Next.js, Laravel. 150+ projektów, 8 lat doświadczenia. Bezpłatna wycena!",
      "inLanguage": "pl",
      "isPartOf": {
        "@id": "https://netizo.pl/#website"
      },
      "about": {
        "@id": "https://netizo.pl/#organization"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://netizo.pl/assets/images/og-netizo-2.png",
        "width": 1200,
        "height": 630
      },
      "image": "https://netizo.pl/assets/images/og-netizo-2.png"
    },
    {
      "@type": "FAQPage",
      "@id": "https://netizo.pl/#faq",
      "url": "https://netizo.pl/#faq",
      "isPartOf": {
        "@id": "https://netizo.pl/#webpage"
      },
      "inLanguage": "pl",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Ile kosztuje strona internetowa lub aplikacja?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Prosta strona kosztuje zwykle 1–5 tys. zł, rozbudowana strona lub mały sklep 5–15 tys. zł, aplikacja webowa 15–50 tys. zł, a duże systemy od 50 tys. zł. Ostateczna cena zależy od zakresu, a dokładną wycenę dostajesz bezpłatnie po briefie."
          }
        },
        {
          "@type": "Question",
          "name": "Ile trwa stworzenie strony lub aplikacji?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Landing page powstaje zwykle w 2–3 tygodnie, strona firmowa w 4–6 tygodni, a aplikacja webowa w 2–4 miesiące. Dokładny termin ustalamy po briefie, gdy znamy zakres prac."
          }
        }
      ]
    },
    {
      "@type": "ItemList",
      "@id": "https://netizo.pl/#portfolio",
      "name": "Ostatnie wdrożenia",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "CreativeWork",
            "@id": "https://netizo.pl/#project-treepropl",
            "name": "Treepro.pl",
            "url": "https://treepro.pl",
            "description": "Responsywna strona dla firmy zajmującej się wycinką drzew, wynajmem podnośników i pracami ogrodowymi na terenie zachodniej Polski.",
            "genre": "Strona firmowa / Local SEO",
            "image": "https://netizo.pl/storage/projects/thumbnails/01KWVJR3BWFV5RJKYB5A9PR019.webp",
            "keywords": [
              "PHP",
              "JavaScript",
              "CSS"
            ],
            "creator": {
              "@id": "https://netizo.pl/#organization"
            }
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "CreativeWork",
            "@id": "https://netizo.pl/#project-vetlypl",
            "name": "Vetly.pl",
            "url": "https://vetly.pl",
            "description": "Platforma dla właścicieli zwierząt, która pozwala znaleźć weterynarza w okolicy i umówić wizytę online bez telefonów i kolejek.",
            "genre": "Platforma rezerwacji / Pet care",
            "image": "https://netizo.pl/storage/projects/thumbnails/01KWVJVPAVN3G5123A038B7EYF.webp",
            "keywords": [
              "Laravel",
              "Inertia.js",
              "React JS"
            ],
            "creator": {
              "@id": "https://netizo.pl/#organization"
            }
          }
        }
      ]
    }
  ]
}
```

### 5.2 Strona główna EN (`/en`)
Ta sama encja `@id` i `url` korzenia; różnią się teksty, `inLanguage`, `@id` strony (`https://netizo.pl/en#webpage`), obraz OG i `areaServed`.
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://netizo.pl/#organization",
      "name": "Netizo",
      "alternateName": "Netizo.pl",
      "url": "https://netizo.pl/",
      "description": "Websites and web applications for businesses, designed and built in Poland. Modern design, speed and SEO as standard. 150+ projects, 8 years of experience.",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://netizo.pl/#logo",
        "url": "https://netizo.pl/images/icons/icon-512.png",
        "contentUrl": "https://netizo.pl/images/icons/icon-512.png",
        "width": 512,
        "height": 512,
        "caption": "Netizo"
      },
      "image": "https://netizo.pl/images/icons/icon-512.png",
      "email": "kontakt@netizo.pl",
      "telephone": "+48 884 343 924",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+48 884 343 924",
        "email": "kontakt@netizo.pl",
        "availableLanguage": [
          "pl",
          "en"
        ]
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Leszno",
        "addressRegion": "wielkopolskie",
        "addressCountry": "PL"
      },
      "areaServed": [
        {
          "@type": "Country",
          "name": "Poland"
        },
        {
          "@type": "City",
          "name": "Leszno"
        }
      ],
      "knowsLanguage": [
        "pl",
        "en"
      ],
      "priceRange": "from PLN 1,000",
      "sameAs": [
        "https://www.facebook.com/netizo.agency",
        "https://www.instagram.com/netizo.agency",
        "https://www.tiktok.com/@netizo.agency"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "What we’ll build for you",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Web applications",
              "description": "Modern SPA and SSR apps, from simple landing pages to complex SaaS platforms."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Mobile apps",
              "description": "One codebase for iOS and Android, with full performance on both."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI & automation",
              "description": "Chatbots, AI integrations and process automation."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Backend systems",
              "description": "Scalable APIs and microservices built for heavy load."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "DevOps & cloud",
              "description": "Infrastructure as code, CI/CD, containers and 24/7 monitoring."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "E-commerce",
              "description": "Online stores and marketplaces with payment and fulfillment integrations."
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://netizo.pl/#website",
      "url": "https://netizo.pl/",
      "name": "Netizo",
      "alternateName": "Netizo.pl",
      "inLanguage": [
        "pl",
        "en"
      ],
      "publisher": {
        "@id": "https://netizo.pl/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://netizo.pl/en#webpage",
      "url": "https://netizo.pl/en",
      "name": "Websites and Web Apps for Ambitious Companies | Netizo",
      "description": "Websites and web applications for businesses, designed and built by a software house from Poland. Modern design, speed and SEO as standard. React, Next.js, Laravel. 150+ projects, 8 years of experience. Free quote!",
      "inLanguage": "en",
      "isPartOf": {
        "@id": "https://netizo.pl/#website"
      },
      "about": {
        "@id": "https://netizo.pl/#organization"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://netizo.pl/assets/images/og-netizo-en.png",
        "width": 1200,
        "height": 630
      },
      "image": "https://netizo.pl/assets/images/og-netizo-en.png"
    },
    {
      "@type": "FAQPage",
      "@id": "https://netizo.pl/en#faq",
      "url": "https://netizo.pl/en#faq",
      "isPartOf": {
        "@id": "https://netizo.pl/en#webpage"
      },
      "inLanguage": "en",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does a website or an app cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A simple website usually costs PLN 1,000–5,000, a larger website or a small online store PLN 5,000–15,000, a web application PLN 15,000–50,000, and large systems start at PLN 50,000. The final price depends on the scope, and you get a detailed quote for free after the brief."
          }
        },
        {
          "@type": "Question",
          "name": "How long does it take to build a website or an app?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A landing page usually takes 2–3 weeks, a company website 4–6 weeks, and a web application 2–4 months. We set the exact deadline after the brief, once we know the scope of work."
          }
        }
      ]
    },
    {
      "@type": "ItemList",
      "@id": "https://netizo.pl/#portfolio",
      "name": "Recent launches",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "CreativeWork",
            "@id": "https://netizo.pl/#project-treepropl",
            "name": "Treepro.pl",
            "url": "https://treepro.pl",
            "description": "Responsywna strona dla firmy zajmującej się wycinką drzew, wynajmem podnośników i pracami ogrodowymi na terenie zachodniej Polski.",
            "genre": "Strona firmowa / Local SEO",
            "image": "https://netizo.pl/storage/projects/thumbnails/01KWVJR3BWFV5RJKYB5A9PR019.webp",
            "keywords": [
              "PHP",
              "JavaScript",
              "CSS"
            ],
            "creator": {
              "@id": "https://netizo.pl/#organization"
            }
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "CreativeWork",
            "@id": "https://netizo.pl/#project-vetlypl",
            "name": "Vetly.pl",
            "url": "https://vetly.pl",
            "description": "Platforma dla właścicieli zwierząt, która pozwala znaleźć weterynarza w okolicy i umówić wizytę online bez telefonów i kolejek.",
            "genre": "Platforma rezerwacji / Pet care",
            "image": "https://netizo.pl/storage/projects/thumbnails/01KWVJVPAVN3G5123A038B7EYF.webp",
            "keywords": [
              "Laravel",
              "Inertia.js",
              "React JS"
            ],
            "creator": {
              "@id": "https://netizo.pl/#organization"
            }
          }
        }
      ]
    }
  ]
}
```

### 5.3 Program partnerski PL (`/partnerzy`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://netizo.pl/#organization",
      "name": "Netizo",
      "url": "https://netizo.pl/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://netizo.pl/#logo",
        "url": "https://netizo.pl/images/icons/icon-512.png",
        "contentUrl": "https://netizo.pl/images/icons/icon-512.png",
        "width": 512,
        "height": 512,
        "caption": "Netizo"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://netizo.pl/#website",
      "url": "https://netizo.pl/",
      "name": "Netizo",
      "publisher": {
        "@id": "https://netizo.pl/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://netizo.pl/partnerzy#webpage",
      "url": "https://netizo.pl/partnerzy",
      "name": "Program partnerski Netizo",
      "description": "Polecaj Netizo firmom, które potrzebują strony, sklepu lub aplikacji, i dostawaj 15% netto od każdej opłaconej faktury klienta przez 12 miesięcy. Bez opłat i bez limitu poleceń.",
      "inLanguage": "pl",
      "isPartOf": {
        "@id": "https://netizo.pl/#website"
      },
      "publisher": {
        "@id": "https://netizo.pl/#organization"
      },
      "breadcrumb": {
        "@id": "https://netizo.pl/partnerzy#breadcrumb"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://netizo.pl/assets/images/og-netizo-partnerzy.png",
        "width": 1200,
        "height": 630
      },
      "image": "https://netizo.pl/assets/images/og-netizo-partnerzy.png"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://netizo.pl/partnerzy#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Strona główna",
          "item": "https://netizo.pl/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Program partnerski Netizo",
          "item": "https://netizo.pl/partnerzy"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://netizo.pl/partnerzy#faq",
      "url": "https://netizo.pl/partnerzy#faq",
      "isPartOf": {
        "@id": "https://netizo.pl/partnerzy#webpage"
      },
      "inLanguage": "pl",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Kto może zostać partnerem?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Każdy, kto zna właścicieli firm: biuro rachunkowe, agencja marketingowa, grafik, doradca, nasz klient albo osoba prywatna. Nie musisz mieć doświadczenia w sprzedaży ani znać się na stronach internetowych."
          }
        },
        {
          "@type": "Question",
          "name": "Czy muszę prowadzić działalność gospodarczą?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nie. Z firmą rozliczamy się na podstawie faktury, a z osobą prywatną podpisujemy umowę i wypłacamy prowizję na jej podstawie."
          }
        }
      ]
    }
  ]
}
```

### 5.4 Program partnerski EN (`/en/partners`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://netizo.pl/#organization",
      "name": "Netizo",
      "url": "https://netizo.pl/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://netizo.pl/#logo",
        "url": "https://netizo.pl/images/icons/icon-512.png",
        "contentUrl": "https://netizo.pl/images/icons/icon-512.png",
        "width": 512,
        "height": 512,
        "caption": "Netizo"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://netizo.pl/#website",
      "url": "https://netizo.pl/",
      "name": "Netizo",
      "publisher": {
        "@id": "https://netizo.pl/#organization"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://netizo.pl/en/partners#webpage",
      "url": "https://netizo.pl/en/partners",
      "name": "Netizo Partner Program",
      "description": "Refer Netizo to companies that need a website, an online store or an app, and earn 15% of every paid client invoice (net) for 12 months. No fees and no limit on referrals.",
      "inLanguage": "en",
      "isPartOf": {
        "@id": "https://netizo.pl/#website"
      },
      "publisher": {
        "@id": "https://netizo.pl/#organization"
      },
      "breadcrumb": {
        "@id": "https://netizo.pl/en/partners#breadcrumb"
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://netizo.pl/assets/images/og-netizo-partners-en.png",
        "width": 1200,
        "height": 630
      },
      "image": "https://netizo.pl/assets/images/og-netizo-partners-en.png"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://netizo.pl/en/partners#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://netizo.pl/en"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Netizo Partner Program",
          "item": "https://netizo.pl/en/partners"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://netizo.pl/en/partners#faq",
      "url": "https://netizo.pl/en/partners#faq",
      "isPartOf": {
        "@id": "https://netizo.pl/en/partners#webpage"
      },
      "inLanguage": "en",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who can become a partner?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Anyone who knows business owners: an accounting firm, a marketing agency, a graphic designer, a consultant, one of our clients or a private person. You don’t need sales experience or any knowledge of websites."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to run a business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Companies invoice us, and with a private person we sign an agreement and pay the commission under it."
          }
        }
      ]
    }
  ]
}
```

### 5.5 Opcjonalnie: węzeł `Service` programu partnerskiego (Low, bez funkcji w Google)
Dodać do `@graph` strony partnerskiej i w WebPage dopisać `"about": {"@id": "https://netizo.pl/partnerzy#program"}` (EN: `https://netizo.pl/en/partners#program`). Wszystkie fakty pochodzą z meta description i FAQ strony.
```json
{
  "@type": "Service",
  "@id": "https://netizo.pl/partnerzy#program",
  "name": "Program partnerski Netizo",
  "serviceType": "Program poleceń",
  "provider": {
    "@id": "https://netizo.pl/#organization"
  },
  "description": "15% netto od każdej opłaconej faktury poleconego klienta przez 12 miesięcy od pierwszego zamówienia, wypłata w ciągu 14 dni od opłacenia faktury. Bez opłat i bez limitu poleceń.",
  "areaServed": {
    "@type": "Country",
    "name": "Polska"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": "Biura rachunkowe, agencje marketingowe, graficy, doradcy, klienci Netizo i osoby prywatne"
  }
}
```

### 5.6 Opcjonalne rozszerzenie organizacji — WYŁĄCZNIE PO UZUPEŁNIENIU DANYCH NA STRONIE
Poniższe wartości są PLACEHOLDERAMI: nie istnieją na stronie, więc nie wolno ich wdrażać (ani zgadywać), dopóki właściciel nie poda danych i nie opublikuje ich w widocznej treści (np. „O nas", `/regulamin`). Wartości w nawiasach kwadratowych do podmiany; klucze bez danych usunąć.
```json
{
  "@id": "https://netizo.pl/#organization",
  "legalName": "[PLACEHOLDER: pełna nazwa prawna z /regulamin]",
  "taxID": "[PLACEHOLDER: NIP]",
  "foundingDate": "[PLACEHOLDER: RRRR-MM-DD — data założenia, nie „8 lat doświadczenia"]",
  "founder": { "@type": "Person", "name": "[PLACEHOLDER: imię i nazwisko założyciela widoczne na stronie]" },
  "numberOfEmployees": { "@type": "QuantitativeValue", "value": "[PLACEHOLDER: liczba — tylko jeśli publiczna]" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[PLACEHOLDER: ulica i numer — tylko jeśli adres ma być publiczny]",
    "postalCode": "[PLACEHOLDER: kod pocztowy]",
    "addressLocality": "Leszno",
    "addressRegion": "wielkopolskie",
    "addressCountry": "PL"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": "[PLACEHOLDER: min. 5 miejsc po przecinku]", "longitude": "[PLACEHOLDER]" }
}
```
Nie dodawać: `openingHoursSpecification` (brak godzin na stronie), `aggregateRating`/`Review` (brak opinii; self-serving), `HowTo`.

## 6. Gdzie w kodzie to dodać

Wariant szybki (30 min, bez refaktoru) — usuwa S-01 i część S-02:
1. `app/Http/Controllers/HomeController.php:48` — `->setUrl(LocalizedRoutes::url('home'))` zmienić na `->setUrl(route('home'))` (url encji = korzeń w obu językach).
2. `HomeController.php:61` — dopisać `->addValue('alternateName', 'Netizo.pl')->addValue('email', 'kontakt@netizo.pl')->addValue('telephone', '+48 884 343 924')->addValue('logo', asset('images/icons/icon-512.png'))` oraz `contactPoint` jak w sekcji 5.1; zamienić `priceRange` (S-08).
3. `app/Http/Controllers/Controller.php:28` — normalizacja tekstu odpowiedzi (S-07).

Wariant docelowy (zalecany) — jeden graf:
1. Nowy `config/company.php` (name, alternate_name, email, phone, logo, `address.street`/`address.postal_code`, `legal_name`, `tax_id`, `founding_date` — pola z sekcji 5.6 domyślnie `null`, więc nie trafiają do JSON-LD). Dane kontaktowe z `resources/js/lib/site.ts:10-16` zostają w TSX; dodać test parytetu (config = site.ts).
2. Nowy `app/Services/StructuredData.php` (szkic niżej; `php -l` przechodzi, logiki nie uruchamiano w aplikacji — wymaga testów).
3. `lang/{pl,en}/home.php` — nowy klucz `schema` (`catalog`, `portfolio`, `price_range`, `breadcrumb_home`, `services` z 6 pozycjami `name`/`description` — teksty z `services-section.tsx:30-100`).
4. `HomeController.php:9` (usunąć `use JsonLdMulti`), `:44-67` (usunąć blok `JsonLdMulti`), `:75-77` → `->withViewData(['jsonLd' => StructuredData::home($faq, $projectProps, $title, __('home.seo.description'), $imageUrl)])` (`$projectProps` = `$projects->map(...)` policzone raz i użyte także w propsach).
5. `PartnerProgramController.php:6` (usunąć `use JsonLdMulti`), `:38-43` (usunąć), `:49-51` → `'jsonLd' => StructuredData::partners($faq, __('partners.seo.name'), $description, $imageUrl)`.
6. `Controller.php:17-32` — usunąć `faqSchema()` (przejmuje `StructuredData::faq()`).
7. `resources/views/app.blade.php:66-71` — zamiast `$faqSchema` jeden skrypt z `$jsonLd` (te same flagi `json_encode`):
```blade
@isset($jsonLd)
    <script type="application/ld+json">{!! json_encode($jsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}</script>
@endisset
```
8. `config/seotools.php:84-95` — `'defaults' => []` w sekcji `json-ld`, inaczej `SEO::generate()` (`app.blade.php:64`) wyemituje dodatkowy, przestarzały `WebPage` (S-09).
9. Testy: dziś szukają węzłów po `@type` na najwyższym poziomie (`tests/Feature/HomePageTest.php:127-150`, `:152-167`, `:169-190`, `:340-358`; `tests/Feature/PartnerProgramPageTest.php:65-80`, `:160-175`). Dodać pomocnik w `tests/Pest.php`, który spłaszcza `@graph`, i dopisać asercje: ten sam `@id` organizacji i `url` = `https://netizo.pl/` na `/` oraz `/en`, `telephone`/`email` zgodne z `config/company.php`, brak U+2060 w FAQ, wszystkie `{"@id"}` rozwiązywalne w grafie, dokładnie jeden `WebSite`.
10. Po wdrożeniu: Rich Results Test (Local business, Breadcrumb — FAQ już nie raportowane), validator.schema.org, `curl -s https://netizo.pl | grep -c 'application/ld+json'` (oczekiwane 1), Bing Webmaster Tools.

### Szkic `app/Services/StructuredData.php`
```php
<?php

namespace App\Services;

/**
 * JSON-LD of the public pages as one @graph: a single organization and website shared by every page and language,
 * a node for the page itself and its extras, all linked by @id.
 */
class StructuredData
{
    /**
     * @param  list<array{question: string, answer: string}>  $faq
     * @param  list<array{slug: string, title: string, liveUrl: string, description: string, category: string, thumbnailUrl: string|null, techStack: list<string>}>  $projects
     * @return array<string, mixed>
     */
    public static function home(array $faq, array $projects, string $title, string $description, string $imageUrl): array
    {
        return self::graph([
            self::organization(),
            self::website(full: true),
            self::webPage('home', $title, $description, $imageUrl),
            self::faq($faq, 'home'),
            self::portfolio($projects),
        ]);
    }

    /**
     * @param  list<array{question: string, answer: string}>  $faq
     * @return array<string, mixed>
     */
    public static function partners(array $faq, string $name, string $description, string $imageUrl): array
    {
        $breadcrumbId = self::pageUrl('partners').'#breadcrumb';

        return self::graph([
            self::organization(full: false),
            self::website(full: false),
            self::webPage('partners', $name, $description, $imageUrl, [
                'publisher' => ['@id' => self::organizationId()],
                'breadcrumb' => ['@id' => $breadcrumbId],
            ]),
            [
                '@type' => 'BreadcrumbList',
                '@id' => $breadcrumbId,
                'itemListElement' => [
                    ['@type' => 'ListItem', 'position' => 1, 'name' => __('home.schema.breadcrumb_home'), 'item' => self::withRootSlash(self::pageUrl('home'))],
                    ['@type' => 'ListItem', 'position' => 2, 'name' => $name, 'item' => self::pageUrl('partners')],
                ],
            ],
            self::faq($faq, 'partners'),
        ]);
    }

    /**
     * The business: the full node on the home pages, a short one (no LocalBusiness type, so no address is required)
     * on the other pages. The @id and url are the same in every language.
     *
     * @return array<string, mixed>
     */
    public static function organization(bool $full = true): array
    {
        $logoUrl = asset(config('company.logo'));
        $logo = ['@type' => 'ImageObject', '@id' => self::rootUrl().'#logo', 'url' => $logoUrl, 'contentUrl' => $logoUrl, 'width' => 512, 'height' => 512, 'caption' => config('company.name')];

        if (! $full) {
            return ['@type' => 'Organization', '@id' => self::organizationId(), 'name' => config('company.name'), 'url' => self::rootUrl(), 'logo' => $logo];
        }

        $socialProfileUrls = SocialProfiles::urls();

        return array_filter([
            '@type' => 'ProfessionalService',
            '@id' => self::organizationId(),
            'name' => config('company.name'),
            'alternateName' => config('company.alternate_name'),
            'url' => self::rootUrl(),
            'description' => __('home.seo.organization_description'),
            'logo' => $logo,
            'image' => $logoUrl,
            'email' => config('company.email'),
            'telephone' => config('company.phone'),
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'contactType' => 'customer service',
                'telephone' => config('company.phone'),
                'email' => config('company.email'),
                'availableLanguage' => LocalizedRoutes::LOCALES,
            ],
            'address' => array_filter([
                '@type' => 'PostalAddress',
                'streetAddress' => config('company.address.street'),
                'postalCode' => config('company.address.postal_code'),
                'addressLocality' => 'Leszno',
                'addressRegion' => 'wielkopolskie',
                'addressCountry' => 'PL',
            ]),
            'areaServed' => [
                ['@type' => 'Country', 'name' => __('home.seo.country')],
                ['@type' => 'City', 'name' => 'Leszno'],
            ],
            'knowsLanguage' => LocalizedRoutes::LOCALES,
            'priceRange' => __('home.schema.price_range'),
            'legalName' => config('company.legal_name'),
            'taxID' => config('company.tax_id'),
            'foundingDate' => config('company.founding_date'),
            'sameAs' => $socialProfileUrls === [] ? null : $socialProfileUrls,
            'hasOfferCatalog' => [
                '@type' => 'OfferCatalog',
                'name' => __('home.schema.catalog'),
                'itemListElement' => array_map(fn (array $service): array => [
                    '@type' => 'Offer',
                    'itemOffered' => ['@type' => 'Service', 'name' => $service['name'], 'description' => $service['description']],
                ], __('home.schema.services')),
            ],
        ], fn (mixed $value): bool => $value !== null && $value !== '');
    }

    /**
     * @return array<string, mixed>
     */
    public static function website(bool $full): array
    {
        return array_filter([
            '@type' => 'WebSite',
            '@id' => self::rootUrl().'#website',
            'url' => self::rootUrl(),
            'name' => config('company.name'),
            'alternateName' => $full ? config('company.alternate_name') : null,
            'inLanguage' => $full ? LocalizedRoutes::LOCALES : null,
            'publisher' => ['@id' => self::organizationId()],
        ]);
    }

    /**
     * @param  array<string, mixed>  $extra
     * @return array<string, mixed>
     */
    public static function webPage(string $routeName, string $name, string $description, string $imageUrl, array $extra = []): array
    {
        return [
            '@type' => 'WebPage',
            '@id' => self::pageId($routeName),
            'url' => self::pageUrl($routeName),
            'name' => $name,
            'description' => $description,
            'inLanguage' => app()->getLocale(),
            'isPartOf' => ['@id' => self::rootUrl().'#website'],
            ...($routeName === 'home' ? ['about' => ['@id' => self::organizationId()]] : []),
            'primaryImageOfPage' => ['@type' => 'ImageObject', 'url' => $imageUrl, 'width' => 1200, 'height' => 630],
            'image' => $imageUrl,
            ...$extra,
        ];
    }

    /**
     * FAQPage from the page's FAQ items. Invisible word joiners (U+2060) are dropped and no-break spaces become plain
     * spaces: they keep ranges together on screen, but only add noise to machine-read text.
     *
     * @param  list<array{question: string, answer: string}>  $faq
     * @return array<string, mixed>
     */
    public static function faq(array $faq, string $routeName): array
    {
        $plain = fn (string $text): string => str_replace(["\u{2060}", "\u{00A0}"], ['', ' '], $text);

        return [
            '@type' => 'FAQPage',
            '@id' => self::pageUrl($routeName).'#faq',
            'url' => self::withRootSlash(self::pageUrl($routeName)).'#faq',
            'isPartOf' => ['@id' => self::pageId($routeName)],
            'inLanguage' => app()->getLocale(),
            'mainEntity' => array_map(fn (array $item): array => [
                '@type' => 'Question',
                'name' => $plain($item['question']),
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $plain($item['answer'])],
            ], $faq),
        ];
    }

    /**
     * The featured projects (the same props the page shows) as an ItemList of CreativeWork. Not WebSite: the home page
     * must keep exactly one WebSite node, or Google's site-name system may get confused.
     *
     * @param  list<array{slug: string, title: string, liveUrl: string, description: string, category: string, thumbnailUrl: string|null, techStack: list<string>}>  $projects
     * @return array<string, mixed>
     */
    public static function portfolio(array $projects): array
    {
        return [
            '@type' => 'ItemList',
            '@id' => self::rootUrl().'#portfolio',
            'name' => __('home.schema.portfolio'),
            'itemListElement' => array_map(fn (array $project, int $index): array => [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'item' => array_filter([
                    '@type' => 'CreativeWork',
                    '@id' => self::rootUrl().'#project-'.str_replace('-', '', $project['slug']),
                    'name' => $project['title'],
                    'url' => $project['liveUrl'] ?: null,
                    'description' => $project['description'],
                    'genre' => $project['category'],
                    'image' => $project['thumbnailUrl'],
                    'keywords' => $project['techStack'] ?: null,
                    'creator' => ['@id' => self::organizationId()],
                ]),
            ], $projects, array_keys($projects)),
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $nodes
     * @return array<string, mixed>
     */
    public static function graph(array $nodes): array
    {
        return ['@context' => 'https://schema.org', '@graph' => $nodes];
    }

    private static function organizationId(): string
    {
        return self::rootUrl().'#organization';
    }

    /** The domain root with a trailing slash, in both languages (the organization and website live there). */
    private static function rootUrl(): string
    {
        return self::withRootSlash(route('home'));
    }

    private static function pageUrl(string $routeName): string
    {
        return LocalizedRoutes::url($routeName);
    }

    private static function pageId(string $routeName): string
    {
        return self::withRootSlash(self::pageUrl($routeName)).'#webpage';
    }

    private static function withRootSlash(string $url): string
    {
        return parse_url($url, PHP_URL_PATH) === null ? $url.'/' : $url;
    }
}
```

## 7. Priorytety wdrożenia
1. (30 min) S-01 + S-08 + S-07 w obecnym kodzie.
2. (0,5–1 dnia) graf `@graph` z `@id`, `WebSite`, organizacją na stronach partnerskich, BreadcrumbList (S-02, S-03, S-04) wraz z testami i zerowaniem defaultów (S-09).
3. (opcjonalnie) OfferCatalog i portfolio (S-05), po przeniesieniu treści usług do `lang/*`.
4. Po opublikowaniu `/regulamin` i sekcji „O nas": dane z sekcji 5.6.

## Ocena kategorii
**58/100** — dane strukturalne są poprawne, spójne z treścią i renderowane po stronie serwera (zero błędów składni i wymaganych pól), ale ograniczone do minimum: encja organizacji nie ma telefonu, e-maila ani logo mimo że są na stronie, brak `@id`/`@graph`, `WebSite` i powiązania stron partnerskich z organizacją, a PL i EN opisują technicznie dwie różne encje (`url` `/` vs `/en`); FAQPage nie daje już żadnej korzyści w Google (od 7.05.2026).
