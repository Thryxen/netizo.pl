# Strony usług – plan implementacji

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trzy strony usług (strony internetowe, sklepy internetowe, aplikacje webowe) w PL i EN, z cenami „od”, realizacjami z panelu, poradnikiem i FAQ, podlinkowane z bento na stronie głównej.

**Architecture:** Enum `App\Enums\Service` spina trasy, kolumnę `projects.services` (pole „Usługi” w panelu) i przedziały cen. Jeden `ServicePageController` z trzema akcjami renderuje strony Inertia `services/{websites,stores,apps}`; każda składa wspólny szablon `components/services/service-page.tsx` z własną treścią, sceną hero i makietami. Meta, opisy progów i FAQ siedzą w `lang/{pl,en}/services.php` (jedno źródło dla strony, JSON-LD i llms.txt).

**Tech Stack:** Laravel 12, Pest 4, Inertia v3, React 19, TypeScript, Tailwind 4, shadcn/ui, SEOTools, codex-image (zdjęcia), Playwright (obrazy OG).

**Spec:** `docs/superpowers/specs/2026-10-12-service-pages-design.md`

## Global Constraints

- Ceny z FAQ i briefu: strony 1 000–5 000 zł (2–3 tyg.) i 5 000–15 000 zł (4–6 tyg.); sklepy 5 000–15 000 zł i 15 000–50 000 zł (bez terminów); aplikacje 15 000–50 000 zł (2–4 mies.) i od 50 000 zł.
- Adresy: `/tworzenie-stron-internetowych` ↔ `/en/website-development`, `/sklepy-internetowe` ↔ `/en/online-stores`, `/aplikacje-webowe` ↔ `/en/web-applications`; trasy `services.{websites,stores,apps}` i `en.services.*`.
- Bez `->defaults()` na trasach: `HandleInertiaRequests` buduje `alternates` z parametrów trasy, więc domyślny parametr wylądowałby w hreflang jako `?service=…`.
- Pliki językowe zawierają tylko niepuste stringi (`TranslationParityTest`), więc liczby (ceny) siedzą w enumie, nie w `lang/`.
- Title ≤ 60 znaków, meta description ≤ 155 znaków.
- Monochrom, kolor tylko ze zdjęć; bez etykiet nad nagłówkami, bez strzałek w tekście przycisków, sentence case; SSR-safe (bez `window`/`document` w renderze); efekty ruchu z pełnym stanem statycznym (`.js` + `prefers-reduced-motion: no-preference`).
- Nie używać `motion.*`/`animate()`; scroll tylko przez `useScroll` + `useMotionStyle`.
- Bez commitów (prośba użytkownika); praca bez pytań do końca.
- Treść EN: amerykańska pisownia, te same fakty i liczby co PL.

## Review Focus

- Projekt nieaktywny, ale oznaczony usługą → nie może pojawić się na stronie usługi (test w Task 2).
- Projekt bez żadnej usługi lub z `services = null` (stare rekordy) → nie pojawia się nigdzie, panel pokazuje puste pola wyboru, zapis bez zaznaczeń zapisuje `[]` (testy w Task 1).
- Nieznana lub powtórzona wartość usługi w żądaniu panelu → błąd walidacji `services.*`, nic nie zapisane (Task 1).
- Strona usługi bez żadnej realizacji → sekcja realizacji znika, nagłówek nie linkuje do nieistniejącej kotwicy (Task 5, sprawdzone zrzutem i propsami).
- Zmiana projektu oznaczonego usługą (także zdjęcie oznaczenia) → IndexNow zgłasza strony usług sprzed i po zmianie (Task 3).

---

### Task 1: Enum usług i pole „Usługi” w panelu

**Files:**
- Create: `app/Enums/Service.php`
- Create: `database/migrations/2026_10_12_140000_add_services_to_projects_table.php`
- Modify: `app/Models/Project.php` (fillable, cast, scope `forService`)
- Modify: `database/factories/ProjectFactory.php` (stan `withServices`)
- Modify: `database/seeders/ProjectSeeder.php` (usługi dla przykładowych projektów)
- Modify: `app/Http/Requests/Admin/SaveProjectRequest.php`
- Modify: `app/Http/Controllers/Admin/ProjectController.php` (`serviceOptions`, `services` w `formProps`)
- Modify: `resources/js/types/admin.ts`, `resources/js/components/admin/project-form.tsx`, `resources/js/pages/admin/projects/{create,edit}.tsx`
- Test: `tests/Feature/Admin/ProjectTest.php`

**Interfaces:**
- Produces: `enum Service: string { Websites='websites'; Stores='stores'; Apps='apps' }`, `Service::routeName(): string` (`services.websites`), `Service::adminLabel(): string`, `Service::priceBrackets(): list<array{from:int,to:int|null}>`; `Project::scopeForService($query, Service $service)`; `ProjectFactory::withServices(Service ...$services)`; Inertia props panelu `serviceOptions: {value,label}[]`, `project.services: string[]`.

- [ ] **Step 1: Testy panelu (failing)**

```php
it('saves the services whose pages show the project, in the order of the services', function () {
    $this->post(route('admin.projects.store'), validProjectPayload(['services' => ['stores', 'websites']]))
        ->assertRedirect(route('admin.projects.index'))
        ->assertSessionHasNoErrors();

    expect(Project::query()->where('slug', 'netizo-case-study')->firstOrFail()->services)->toBe(['websites', 'stores']);
});

it('saves a project without services as an empty list', function () {
    $this->post(route('admin.projects.store'), validProjectPayload())->assertSessionHasNoErrors();

    expect(Project::query()->where('slug', 'netizo-case-study')->firstOrFail()->services)->toBe([]);
});

it('refuses an unknown or repeated service and saves nothing', function (array $services, string $field) {
    $this->post(route('admin.projects.store'), validProjectPayload(['services' => $services]))->assertSessionHasErrors($field);

    assertDatabaseCount('projects', 0);
})->with([
    'unknown' => [['blog'], 'services.0'],
    'repeated' => [['apps', 'apps'], 'services.0'],
    'not a list' => ['apps', 'services'],
]);

it('passes the services and their options to the forms', function () {
    $project = Project::factory()->withServices(Service::Apps)->create();
    $legacy = Project::factory()->create(['services' => null]);

    $this->get(route('admin.projects.edit', $project))->assertInertia(fn (Assert $page) => $page
        ->where('project.services', ['apps'])
        ->where('serviceOptions', [
            ['value' => 'websites', 'label' => 'Strony internetowe'],
            ['value' => 'stores', 'label' => 'Sklepy internetowe'],
            ['value' => 'apps', 'label' => 'Aplikacje webowe'],
        ]));
    $this->get(route('admin.projects.edit', $legacy))->assertInertia(fn (Assert $page) => $page->where('project.services', []));
    $this->get(route('admin.projects.create'))->assertInertia(fn (Assert $page) => $page->has('serviceOptions', 3));
});

it('clears the services of a project when none are sent', function () {
    $project = Project::factory()->withServices(Service::Stores)->create(['slug' => 'netizo-case-study']);

    $this->put(route('admin.projects.update', $project), validProjectPayload())->assertSessionHasNoErrors();

    expect($project->fresh()->services)->toBe([]);
});
```

- [ ] **Step 2:** `php artisan test --compact tests/Feature/Admin/ProjectTest.php` → FAIL (brak enumu i kolumny).
- [ ] **Step 3: Implementacja**

`app/Enums/Service.php`:

```php
<?php

namespace App\Enums;

/**
 * The services with a page of their own. The value names the page's Polish route (`services.{value}`, the English twin
 * is `en.` + that), its copy in lang/{pl,en}/services.php and the tag a project carries in the admin panel to be shown
 * on that page.
 */
enum Service: string
{
    case Websites = 'websites';
    case Stores = 'stores';
    case Apps = 'apps';

    public function routeName(): string
    {
        return "services.{$this->value}";
    }

    /** The service in the admin panel (Polish only). */
    public function adminLabel(): string
    {
        return match ($this) {
            self::Websites => 'Strony internetowe',
            self::Stores => 'Sklepy internetowe',
            self::Apps => 'Aplikacje webowe',
        };
    }

    /**
     * The price brackets of the service's tiers in złoty, in the order of the tiers in lang/{pl,en}/services.php: where
     * the price starts and where it usually ends (null: no usual ceiling). The same ranges as the home FAQ and the brief.
     *
     * @return list<array{from: int, to: int|null}>
     */
    public function priceBrackets(): array
    {
        return match ($this) {
            self::Websites => [['from' => 1000, 'to' => 5000], ['from' => 5000, 'to' => 15000]],
            self::Stores => [['from' => 5000, 'to' => 15000], ['from' => 15000, 'to' => 50000]],
            self::Apps => [['from' => 15000, 'to' => 50000], ['from' => 50000, 'to' => null]],
        };
    }
}
```

Migracja: `$table->json('services')->nullable()->after('is_active');` / `dropColumn('services')`.
Model: `'services'` w `$fillable`, `'services' => 'array'` w `$casts`, scope:

```php
/**
 * Projects tagged in the admin panel with the service, shown on its page.
 */
public function scopeForService($query, Service $service)
{
    return $query->whereJsonContains('services', $service->value);
}
```

Fabryka: `'services' => []` w definicji i stan `withServices(Service ...$services)` mapujący na wartości.
`SaveProjectRequest`: reguły `'services' => ['nullable', 'array']`, `'services.*' => ['string', 'distinct', Rule::enum(Service::class)]`; atrybuty `usługi`/`usługa`; komunikat `services.*.distinct` „Każdą usługę możesz zaznaczyć tylko raz.”; w `projectAttributes()` `'services' => $this->services()` zwracające zaznaczone wartości w kolejności `Service::cases()`.
`ProjectController`: `create()`/`edit()` dostają `'serviceOptions' => $this->serviceOptions()`; `formProps()` dodaje `'services' => $this->serviceValues($project)` (tylko znane wartości, `[]` dla `null`).
Formularz: pole „Usługi” (3 `Checkbox` z `Label`) w zakładce „Podstawowe” pod przełącznikiem aktywności, opis „Projekt pokaże się w realizacjach na stronach zaznaczonych usług, gdy jest aktywny.”; `services` w polach zakładki (nawigacja do błędów), w `ProjectFormData` i w danych początkowych (`project?.services ?? []`).
Seeder: `services` dla każdego slugu: `zloty-klos` websites+stores, `mebloteka` stores, `flotapro` apps, `fizjo-studio` websites, `zielone-tarasy` websites, `promien-fotowoltaika` websites, `lingwista` apps, `agrosklad` stores+apps, `autopunkt` websites.

- [ ] **Step 4:** `php artisan migrate`, testy panelu → PASS. Lokalnie przypisać usługi istniejącym projektom (tylko kolumna `services`, wg listy z seedera) przez tinker.

### Task 2: Kontroler, trasy, treść serwerowa i JSON-LD

**Files:**
- Create: `app/Http/Controllers/ServicePageController.php`
- Modify: `routes/web.php`
- Create: `lang/pl/services.php`, `lang/en/services.php`
- Modify: `app/Services/StructuredData.php` (`areaServed()` publiczne, używane w `organization()`)
- Modify: `app/Http/Controllers/Concerns/PresentsProjects.php` (`projectSummary()`), `app/Http/Controllers/PortfolioController.php` (używa `projectSummary()`)
- Create (szkielety, rozbudowa w Task 5): `resources/js/pages/services/{websites,stores,apps}.tsx`
- Test: `tests/Feature/ServicePagesTest.php`, `tests/Feature/TranslationParityTest.php`

**Interfaces:**
- Consumes: `Service`, `Project::forService()`.
- Produces: props `offers: {name, description, timeline: string|null, includes: string[], priceFrom: int, priceTo: int|null}[]`, `faq: {question, answer}[]`, `projects: ProjectSummary[]` (≤ 4), `otherServices: {key, name, description, priceFrom, url}[]`; lang `services.{key}.seo.{title,description,name,breadcrumb,image,image_alt}`, `services.{key}.card.{name,description}`, `services.{key}.offers[].{name,description,timeline?,includes[]}`, `services.{key}.faq[]`; JSON-LD `{url}#service`.

- [ ] **Step 1: Testy (failing)** – w `ServicePagesTest.php`, dataset `$servicePages = ['websites pl' => ['/tworzenie-stron-internetowych', 'services/websites', 'pl'], 'websites en' => ['/en/website-development', 'services/websites', 'en'], …]`:
  - komponent, `locale`, `alternates` (obie wersje), `offers` = 2 progi z cenami z `Service::priceBrackets()` i nazwami z pliku językowego, `faq` = `__("services.{key}.faq")`, `otherServices` = pozostałe dwie usługi z URL-ami w języku strony;
  - realizacje: tylko aktywne z daną usługą, w kolejności `sort_order`, max 4, bez projektów innych usług i bez `services = null`;
  - meta: `<title>`, opis ≤ 155, title ≤ 60, canonical, hreflang pl/en/x-default, `og:image` 1200×630 z `og:image:alt`, `twitter:image`;
  - JSON-LD: `WebPage` z `mainEntity` → `#service`, `BreadcrumbList` (Netizo → usługa), `Service` z `provider` → organizacja i `offers[].priceSpecification` (`minPrice` = ceny z enumu, `priceCurrency` PLN), `FAQPage` z tymi samymi pytaniami co props;
  - tytuł zawiera cenę „od” pierwszego progu w formacie języka („1 000 zł” z twardą spacją albo bez – sprawdzić faktyczny zapis w tytule; „PLN 1,000”).
- [ ] **Step 2:** testy → FAIL (brak tras).
- [ ] **Step 3: Implementacja** – trasy (bez defaults, osobne akcje):

```php
Route::get('/tworzenie-stron-internetowych', [ServicePageController::class, 'websites'])->name('services.websites');
Route::get('/sklepy-internetowe', [ServicePageController::class, 'stores'])->name('services.stores');
Route::get('/aplikacje-webowe', [ServicePageController::class, 'apps'])->name('services.apps');
// en.: /website-development, /online-stores, /web-applications
```

Kontroler: akcje `websites()`, `stores()`, `apps()` → `page(Service $service)`: meta jak w `PortfolioController::pageMeta()` (z `image:alt`), `localizedSeo($service->routeName())`, `offers()` łączy `__("services.{key}.offers")` z `priceBrackets()` po indeksie, realizacje `Project::active()->forService($service)->ordered()->limit(4)`, `otherServices()`, JSON-LD: `StructuredData::page('WebPage', …, [['name' => breadcrumb, 'url' => $pageUrl]], ['mainEntity' => StructuredData::reference($pageUrl, 'service')])`, `serviceSchema()` (Service: `@id`, `name` = `seo.name`, `serviceType` = `card.name`, `description`, `url`, `mainEntityOfPage`, `provider`, `areaServed` = `StructuredData::areaServed()`, `availableLanguage`, `offers` z `PriceSpecification` `minPrice` + `priceCurrency`), `StructuredData::faq()`.
Treść lang: dla każdej usługi `seo`, `card`, 2 progi (`offers`), 7 pytań FAQ; liczby w tekstach zgodne z enumem i FAQ strony głównej.
Szkielety stron: `export default function Websites(props: ServicePageProps) { return null; }` (wypełnione w Task 5).
`TranslationParityTest`: `'services'` w obu datasetach.
- [ ] **Step 4:** testy → PASS; `PortfolioPageTest` dalej PASS po wydzieleniu `projectSummary()`.

### Task 3: Sitemapa, llms.txt, IndexNow i testy przekrojowe

**Files:**
- Modify: `app/Services/Sitemap.php`, `app/Services/LlmsTxt.php`, `lang/{pl,en}/llms.php`, `app/Http/Controllers/Admin/ProjectController.php`
- Test: `tests/Feature/SitemapTest.php`, `tests/Feature/LlmsTxtTest.php`, `tests/Feature/IndexNowTest.php`, `tests/Feature/StructuredDataTest.php`, `tests/Feature/SecurityHeadersTest.php`

**Interfaces:**
- Consumes: trasy `services.*`, `__("services.{key}.faq")`, `__("services.{key}.card.name")`, `Service::routeName()`.

- [ ] **Step 1: Testy (failing)**
  - Sitemap: lista oczekiwanych URL-i po `/en`: `/tworzenie-stron-internetowych`, `/en/website-development`, `/sklepy-internetowe`, `/en/online-stores`, `/aplikacje-webowe`, `/en/web-applications`, potem dotychczasowe; `lastmod` strony usługi = późniejsza z dat strony i projektów.
  - llms.txt: linki do 6 stron usług; FAQ każdej usługi w obu językach (`[pytanie](…#faq): odpowiedź`); „Usługi” linkują do stron usług dla trzech usług ze stronami.
  - IndexNow: zapis publicznego projektu z `stores` zgłasza `/sklepy-internetowe` i `/en/online-stores`; zdjęcie oznaczenia `apps` zgłasza strony aplikacji (stan sprzed zmiany); `indexnow:submit` bez opcji: 22 URL-e zamiast 16.
  - StructuredDataTest: 6 stron w `$publicPages`.
  - SecurityHeadersTest: `/tworzenie-stron-internetowych` w liście.
- [ ] **Step 2:** testy → FAIL.
- [ ] **Step 3: Implementacja**
  - `Sitemap::PAGES`: `'services.websites' => '2026-10-12'`, `'services.stores' => '2026-10-12'`, `'services.apps' => '2026-10-12'` zaraz po `home`; w `match` dodać je do gałęzi z `[$projectsChangedAt]`.
  - `LlmsTxt::PAGES` + `llms.pages.{websites,stores,apps}` (nazwa i notka z cenami „od” i terminami); `llms.services[]` dla trzech usług dostaje `'page' => '<key>'`, a `sections()` linkuje je do `LocalizedRoutes::url("services.{page}")`; po FAQ partnerów sekcje `llms.headings.service_faq` (`:service: najczęstsze pytania`) z `faqLinks(__("services.{key}.faq"), anchored(url, 'service_faq'))`; `llms.anchors.service_faq` = `faq`.
  - `Admin\ProjectController`: `publicUrls(Project)` = case study + strony usług z `services` (gdy aktywny); `store`, `update` (przed i po), `destroy`, `destroyMany` używają `publicUrls()`; `announce()` dokłada strony z listami projektów jak dotąd.
- [ ] **Step 4:** testy → PASS.

### Task 4: Zdjęcia codex-image

**Files:**
- Create: `public/assets/images/photos/{websites-studio,websites-prototype,stores-packing,stores-product-shoot,apps-office,apps-warehouse}.webp` (+ `-768`, `-384`, `-256`)
- Modify: `resources/js/lib/photos.ts` (`PHOTOS` + opis serii)

- [ ] **Step 1:** Wygenerować 6 zdjęć skillem codex-image (1536×1024), prompty w stylu serii: naturalne ciepłe światło, szałwiowa ściana, jasny dąb, rośliny, lniane/wełniane tekstury, bez twarzy (dłonie albo osoby tyłem/poza kadrem), spokojna płaszczyzna po prawej w zdjęciach hero (chipy), małe polskie miasto za oknem, ekrany bez czytelnego tekstu.
- [ ] **Step 2:** Konwersja do WebP 1536×1024 (sharp, jakość 80), `PHOTOS` uzupełnione, `npx -y -p sharp@0.35.5 node netizo/zdjecia/warianty.cjs <nazwy>`.
- [ ] **Step 3:** `php artisan test --compact tests/Feature/PhotoVariantsTest.php` → PASS; obejrzeć arkusz kontaktowy wszystkich zdjęć i odrzucić te, które odstają od serii.

### Task 5: Szablon strony usługi i trzy strony

**Files:**
- Modify: `resources/js/lib/site.ts` (`pageUrls.websites|stores|apps`, `serviceLinks`, `useServiceLinks()`), `resources/js/lib/sections.ts` (`serviceSections`, `useServiceSections()`)
- Create: `resources/js/types/services.ts`
- Modify: `resources/js/components/projects/project-grid.tsx` (wydzielone `ProjectCardList` z poziomem nagłówka kart), `resources/js/components/home/contact-section.tsx` (`briefTypes`), `resources/js/components/home/brief/brief-wizard.tsx` (`initialTypes`)
- Create: `resources/js/components/home/deferred-callback-dialog.tsx` (z `pages/home.tsx`), modyfikacja `pages/home.tsx`
- Create w `resources/js/components/services/`: `service-copy.ts` (typy + `emphasis()`), `service-page.tsx`, `service-header.tsx`, `service-hero.tsx`, `scope-section.tsx`, `vignette-parts.tsx`, `pricing-section.tsx`, `service-process-section.tsx`, `service-projects-section.tsx`, `guide-section.tsx`, `service-faq-section.tsx`, `other-services-section.tsx`, `{websites,stores,apps}-copy.ts`, `{websites,stores,apps}-scene.tsx`, `{websites,stores,apps}-vignettes.tsx`
- Modify: `resources/js/pages/services/{websites,stores,apps}.tsx`

**Interfaces:**
- Consumes: props z Task 2, zdjęcia z Task 4, `SubpageHeader`, `Section`/`SectionHeading`/`Rivet`/`bleedClassName`, `SplitLines`, `SceneBackdrop`/`SceneChip`/`CHIP_SURFACE`, `useLiveLoop`, `Reveal`, `FaqAnswer`, `ContactSection`, `HomeUiProvider`, `ProjectCardList`.
- Produces: `ServicePage({ service, copy, scene, vignettes, guidePhoto, briefTypes, ...ServicePageProps })`; `serviceSections` PL `zakres, cennik, proces, realizacje, poradnik, faq` / EN `whats-included, pricing, process, projects, guide, faq`.

- [ ] **Step 1:** Biblioteki i typy (`site.ts`, `sections.ts`, `types/services.ts`), wydzielenia (`ProjectCardList`, `DeferredCallbackDialog`, `briefTypes`/`initialTypes`); `npm run types` → PASS, testy stron głównych i realizacji → PASS.
- [ ] **Step 2:** Sekcje szablonu, każda w swoim pliku, kolejność i zachowanie jak w specyfikacji (hero z okruszkami i paskiem faktów; zakres 3×2 z makietami; cennik ze skalą: odcinki odpowiadają kolumnom progów, otwarty przedział linią przerywaną, wypełnienie raz w widoku przez klasę pod `.js` i `prefers-reduced-motion: no-preference`, podświetlenie przy najechaniu/fokusie; proces z numerami; realizacje (bez projektów sekcja znika i link nagłówka też); poradnik z przyklejoną lewą kolumną; FAQ w obramowanym polu; inne usługi; kontakt z briefem).
- [ ] **Step 3:** Treść trzech usług PL + EN (`*-copy.ts`), około 900 słów poza FAQ na stronę; sceny hero (chipy w pętli `useLiveLoop`, stan statyczny = ostatnia klatka) i po 6 makiet na usługę.
- [ ] **Step 4:** `npm run types`, `npm run build`, testy stron usług → PASS; zrzuty ekranu PL/EN, desktop/telefon, jasny/ciemny; poprawki.

### Task 6: Strona główna, stopka, menu

**Files:**
- Modify: `resources/js/components/home/bento/bento-tile.tsx` (`href` → tytuł jako link z nakładką + „Zobacz ofertę”), `web-tile.tsx`, `backend-tile.tsx`, `ecommerce-tile.tsx`, `services-section.tsx`, `lang/{pl,en}/llms.php` (`services` jak w bento), `resources/js/components/home/site-footer.tsx` (kolumna „Usługi”), `resources/js/components/home/site-header.tsx` (linki usług w menu)
- Test: `tests/Feature/LlmsTxtTest.php` (nazwy i opisy usług = bento)

- [ ] **Step 1:** Zmienić tytuły, opisy i tagi trzech kafelków, `href` z `usePageUrls()`; llms.php w tej samej wersji.
- [ ] **Step 2:** Stopka i menu z `useServiceLinks()`.
- [ ] **Step 3:** `npm run types`, `LlmsTxtTest`, `HomePageTest` → PASS; zrzut bento i stopki.

### Task 7: Obrazy OG

**Files:**
- Create: `netizo/og-image/szablon-usluga.html`
- Modify: `netizo/og-image/generuj.cjs` (6 wpisów, `format: 'jpeg'`, opis w nagłówku)
- Create: `public/assets/images/og-netizo-{tworzenie-stron-internetowych,sklepy-internetowe,aplikacje-webowe}.jpg`, `og-netizo-{websites,online-stores,web-applications}-en.jpg`
- Modify: `lang/{pl,en}/services.php` (`seo.image`)
- Test: `tests/Feature/ServicePagesTest.php` (pliki 1200×630, JPEG, < 300 KB)

- [ ] **Step 1:** Szablon na ramie innych obrazów OG: po lewej nazwa usługi i „od X zł”, po prawej zdjęcie hero usługi (data URI).
- [ ] **Step 2:** `npx -y -p playwright@1.58.0 node netizo/og-image/generuj.cjs <6 plików>`; obejrzeć wyniki.
- [ ] **Step 3:** testy → PASS.

### Task 8: Dokumentacja i weryfikacja końcowa

**Files:**
- Modify: `CLAUDE.md` (strony usług, enum, pole w panelu, sitemapa, llms.txt, zdjęcia, OG)

- [ ] **Step 1:** CLAUDE.md w stylu istniejących opisów stron.
- [ ] **Step 2:** `vendor/bin/pint --dirty --format agent`, `npm run types`, `npm run build`, `php artisan test --compact` → wszystko PASS.
- [ ] **Step 3:** Przegląd kodu całej zmiany (fresh reviewer) i poprawki.
