/**
 * Generuje obrazy do podglądów linków (og:image, twitter:image), 1200 × 630 px, do public/assets/images:
 *   og-netizo-2.png          strona główna, z szablon.html
 *   og-netizo-partnerzy.png  program partnerski (/partnerzy), z szablon-partnerzy.html
 *   og-netizo-en.png         angielska strona główna (/en), z szablon-en.html
 *   og-netizo-partners-en.png  angielski program partnerski (/en/partners), z szablon-partnerzy-en.html
 *   og-netizo-o-nas.png      strona „O nas” (/o-nas), z szablon-o-nas.html
 *   og-netizo-about-en.png   angielska strona „O nas” (/en/about), z szablon-o-nas-en.html
 *   og-netizo-polityka-prywatnosci.png, og-netizo-privacy-policy-en.png, og-netizo-regulamin.png, og-netizo-terms-en.png,
 *   og-netizo-regulamin-partnerski.png, og-netizo-partner-terms-en.png
 *                            polityka prywatności, regulamin i regulamin programu partnerskiego (/polityka-prywatnosci,
 *                            /en/privacy-policy, /regulamin, /en/terms, /partnerzy/regulamin, /en/partners/terms), z jednego
 *                            szablonu szablon-dokument.html z tekstami z `values` poniżej
 *   og-netizo-realizacje.jpg, og-netizo-projects-en.jpg
 *                            lista realizacji (/realizacje, /en/projects), z szablon-realizacje.html: mozaika zdjęć
 *                            z public/assets/images/photos (data URI), więc JPEG (`format: 'jpeg'`), nie PNG
 *   og-netizo-tworzenie-stron-internetowych.jpg, og-netizo-websites-en.jpg, og-netizo-sklepy-internetowe.jpg,
 *   og-netizo-online-stores-en.jpg, og-netizo-aplikacje-webowe.jpg, og-netizo-web-applications-en.jpg,
 *   og-netizo-aplikacje-mobilne.jpg, og-netizo-mobile-apps-en.jpg, og-netizo-automatyzacja-ai.jpg,
 *   og-netizo-ai-automation-en.jpg, og-netizo-devops-i-chmura.jpg, og-netizo-devops-cloud-en.jpg
 *                            strony usług (PL i EN), z jednego szablonu szablon-usluga.html: nagłówek strony, cena „od”
 *                            (jak w App\Enums\Service) i zdjęcie z hero usługi, więc też JPEG
 * Logo, sygnet i fonty są wspólne z wizytówkami (netizo/wizytowki), więc marka zmienia się w jednym miejscu.
 *
 * Uruchomienie (z katalogu projektu, bez instalowania niczego w projekcie):
 *   npx -y -p playwright@1.58.0 node netizo/og-image/generuj.cjs
 * Tylko wybrane obrazy: dopisz nazwy plików, np. `… generuj.cjs og-netizo-en.png og-netizo-partners-en.png`.
 * Gdy brakuje przeglądarki: npx -y playwright@1.58.0 install chromium
 *
 * Po zmianie nazwy pliku zaktualizuj odwołania: dla strony głównej HomeController, config/seotools.php
 * i tests/Feature/HomePageTest.php, dla partnerów PartnerProgramController i tests/Feature/PartnerProgramPageTest.php,
 * dla wersji angielskiej klucz `seo.image` w lang/en/home.php lub lang/en/partners.php i te same testy, dla stron prawnych
 * klucz `image` w lang/{pl,en}/legal.php i tests/Feature/LegalPagesTest.php.
 * Nowa nazwa omija pamięć podręczną podglądów (Facebook, Discord, Cloudflare), która trzyma stary obraz pod starym adresem.
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const SHARED = path.join(DIR, '..', 'wizytowki');
const OUTPUT_DIR = path.join(DIR, '..', '..', 'public', 'assets', 'images');
const PHOTOS_DIR = path.join(OUTPUT_DIR, 'photos');

/** Zdjęcie z serii (wariant 768w) jako data URI, bo strona jest ładowana przez setContent (bez adresu bazowego). */
function photo(name) {
    return `data:image/webp;base64,${fs.readFileSync(path.join(PHOTOS_DIR, `${name}-768.webp`)).toString('base64')}`;
}

/** Zdjęcia mozaiki z hero listy realizacji (components/projects/projects-hero.tsx). */
function projectsMosaic() {
    return { photoCode: photo('about-code'), photoWorkshop: photo('mission-workshop'), photoVisit: photo('about-visit') };
}
/** Wartości obrazu strony usługi: nagłówek (H1 strony w liniach), cena „od”, nazwa nad zdjęciem, adres i zdjęcie z hero. */
function service({ lang, label, headline, price, url, photoName, photoPosition = '50% 50%' }) {
    return { lang, label, headline, pricePrefix: lang === 'pl' ? 'od' : 'from', price, url, photo: photo(photoName), photoPosition };
}

const IMAGES = [
    { template: 'szablon.html', output: 'og-netizo-2.png' },
    { template: 'szablon-partnerzy.html', output: 'og-netizo-partnerzy.png' },
    { template: 'szablon-en.html', output: 'og-netizo-en.png' },
    { template: 'szablon-partnerzy-en.html', output: 'og-netizo-partners-en.png' },
    { template: 'szablon-o-nas.html', output: 'og-netizo-o-nas.png' },
    { template: 'szablon-o-nas-en.html', output: 'og-netizo-about-en.png' },
    {
        template: 'szablon-dokument.html',
        output: 'og-netizo-polityka-prywatnosci.png',
        values: { lang: 'pl', title: 'Polityka prywatności', party: 'Administrator danych', url: 'netizo.pl/polityka-prywatnosci' },
    },
    {
        template: 'szablon-dokument.html',
        output: 'og-netizo-privacy-policy-en.png',
        values: { lang: 'en', title: 'Privacy policy', party: 'Data controller', url: 'netizo.pl/en/privacy-policy' },
    },
    {
        template: 'szablon-dokument.html',
        output: 'og-netizo-regulamin.png',
        values: { lang: 'pl', title: 'Regulamin serwisu', party: 'Usługodawca', url: 'netizo.pl/regulamin' },
    },
    {
        template: 'szablon-dokument.html',
        output: 'og-netizo-terms-en.png',
        values: { lang: 'en', title: 'Terms of service', party: 'Service provider', url: 'netizo.pl/en/terms' },
    },
    {
        template: 'szablon-dokument.html',
        output: 'og-netizo-regulamin-partnerski.png',
        values: { lang: 'pl', title: 'Regulamin programu partnerskiego', party: 'Organizator', url: 'netizo.pl/partnerzy/regulamin' },
    },
    {
        template: 'szablon-dokument.html',
        output: 'og-netizo-partner-terms-en.png',
        values: { lang: 'en', title: 'Partner program terms', party: 'Organizer', url: 'netizo.pl/en/partners/terms' },
    },
    {
        template: 'szablon-realizacje.html',
        output: 'og-netizo-realizacje.jpg',
        format: 'jpeg',
        values: { lang: 'pl', label: 'Realizacje', headline: 'Zobacz, co<br>zbudowaliśmy<br>dla klientów.', url: 'netizo.pl/realizacje', ...projectsMosaic() },
    },
    {
        template: 'szablon-realizacje.html',
        output: 'og-netizo-projects-en.jpg',
        format: 'jpeg',
        values: { lang: 'en', label: 'Projects', headline: 'See what<br>we built for<br>our clients.', url: 'netizo.pl/en/projects', ...projectsMosaic() },
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-tworzenie-stron-internetowych.jpg',
        format: 'jpeg',
        values: service({ lang: 'pl', label: 'Strony internetowe', headline: 'Tworzenie<br>stron<br>internetowych', price: '799&nbsp;zł', url: 'netizo.pl/tworzenie-stron-internetowych', photoName: 'websites-studio', photoPosition: '42% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-websites-en.jpg',
        format: 'jpeg',
        values: service({ lang: 'en', label: 'Websites', headline: 'Website<br>development<br>for businesses', price: 'PLN&nbsp;799', url: 'netizo.pl/en/website-development', photoName: 'websites-studio', photoPosition: '42% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-sklepy-internetowe.jpg',
        format: 'jpeg',
        values: service({ lang: 'pl', label: 'Sklepy internetowe', headline: 'Tworzenie<br>sklepów<br>internetowych', price: '1&nbsp;299&nbsp;zł', url: 'netizo.pl/sklepy-internetowe', photoName: 'stores-packing', photoPosition: '40% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-online-stores-en.jpg',
        format: 'jpeg',
        values: service({ lang: 'en', label: 'Online stores', headline: 'Online store<br>development', price: 'PLN&nbsp;1,299', url: 'netizo.pl/en/online-stores', photoName: 'stores-packing', photoPosition: '40% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-aplikacje-webowe.jpg',
        format: 'jpeg',
        values: service({ lang: 'pl', label: 'Aplikacje webowe', headline: 'Aplikacje<br>webowe<br>na zamówienie', price: '1&nbsp;699&nbsp;zł', url: 'netizo.pl/aplikacje-webowe', photoName: 'apps-office', photoPosition: '42% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-web-applications-en.jpg',
        format: 'jpeg',
        values: service({ lang: 'en', label: 'Web applications', headline: 'Custom web<br>application<br>development', price: 'PLN&nbsp;1,699', url: 'netizo.pl/en/web-applications', photoName: 'apps-office', photoPosition: '42% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-aplikacje-mobilne.jpg',
        format: 'jpeg',
        values: service({ lang: 'pl', label: 'Aplikacje mobilne', headline: 'Aplikacje<br>mobilne na<br>iOS i Android', price: '999&nbsp;zł', url: 'netizo.pl/aplikacje-mobilne', photoName: 'mobile-cafe', photoPosition: '38% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-mobile-apps-en.jpg',
        format: 'jpeg',
        values: service({ lang: 'en', label: 'Mobile apps', headline: 'iOS and Android<br>app development', price: 'PLN&nbsp;999', url: 'netizo.pl/en/mobile-apps', photoName: 'mobile-cafe', photoPosition: '38% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-automatyzacja-ai.jpg',
        format: 'jpeg',
        values: service({ lang: 'pl', label: 'AI &amp; Automatyzacja', headline: 'Automatyzacja<br>i wdrożenia AI<br>w firmie', price: '299&nbsp;zł', url: 'netizo.pl/automatyzacja-ai', photoName: 'ai-office', photoPosition: '30% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-ai-automation-en.jpg',
        format: 'jpeg',
        values: service({ lang: 'en', label: 'AI &amp; automation', headline: 'AI and<br>automation<br>for businesses', price: 'PLN&nbsp;299', url: 'netizo.pl/en/ai-automation', photoName: 'ai-office', photoPosition: '30% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-devops-i-chmura.jpg',
        format: 'jpeg',
        values: service({ lang: 'pl', label: 'DevOps &amp; Cloud', headline: 'DevOps<br>i chmura<br>dla firm', price: '499&nbsp;zł', url: 'netizo.pl/devops-i-chmura', photoName: 'devops-desk', photoPosition: '30% 50%' }),
    },
    {
        template: 'szablon-usluga.html',
        output: 'og-netizo-devops-cloud-en.jpg',
        format: 'jpeg',
        values: service({ lang: 'en', label: 'DevOps &amp; cloud', headline: 'DevOps<br>and cloud<br>for businesses', price: 'PLN&nbsp;499', url: 'netizo.pl/en/devops-cloud', photoName: 'devops-desk', photoPosition: '30% 50%' }),
    },
];
const SIZE = { width: 1200, height: 630 };
/** WhatsApp pomija podgląd z obrazem większym niż 300 KB. */
const MAX_BYTES = 300 * 1024;
const RUN_COMMAND = 'npx -y -p playwright@1.58.0 node netizo/og-image/generuj.cjs';

/** Pakiety z `npx -p` nie są widoczne dla require(), więc szukamy ich też w katalogach .bin z PATH. */
function loadModule(name) {
    const candidates = [name];

    for (const dir of (process.env.PATH ?? '').split(path.delimiter)) {
        if (dir.endsWith(path.join('node_modules', '.bin'))) {
            candidates.push(path.join(dir, '..', name));
        }
    }

    for (const candidate of candidates) {
        try {
            return require(candidate);
        } catch {
            // Następny kandydat.
        }
    }

    console.error(`Nie znaleziono pakietu "${name}". Uruchom: ${RUN_COMMAND}`);
    process.exit(1);
}

/** Fonty jako data URI, bo strona jest ładowana przez setContent (bez adresu, względem którego działałoby fonts/). */
function inlineFonts(html) {
    return html.replace(/url\('fonts\/([^']+)'\)/g, (match, file) => {
        const data = fs.readFileSync(path.join(SHARED, 'fonts', file)).toString('base64');

        return `url('data:font/ttf;base64,${data}')`;
    });
}

function render(template, values) {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        if (!(key in values)) {
            throw new Error(`Nieznany znacznik w szablonie: ${match}`);
        }

        return values[key];
    });
}

(async () => {
    const { chromium } = loadModule('playwright');
    const values = {
        logo: fs.readFileSync(path.join(SHARED, 'logo.svg'), 'utf8'),
        sygnet: fs.readFileSync(path.join(SHARED, 'sygnet.svg'), 'utf8'),
    };

    const requested = process.argv.slice(2);
    const unknown = requested.filter((output) => !IMAGES.some((image) => image.output === output));

    if (unknown.length > 0) {
        throw new Error(`Nieznany obraz: ${unknown.join(', ')}. Dostępne: ${IMAGES.map((image) => image.output).join(', ')}.`);
    }

    const browser = await chromium.launch();

    try {
        for (const image of IMAGES.filter((candidate) => requested.length === 0 || requested.includes(candidate.output))) {
            const html = render(inlineFonts(fs.readFileSync(path.join(DIR, image.template), 'utf8')), { ...values, ...image.values });
            const output = path.join(OUTPUT_DIR, image.output);
            const page = await browser.newPage({ viewport: SIZE, deviceScaleFactor: 1 });

            await page.setContent(html, { waitUntil: 'load' });
            await page.evaluate(() => document.fonts.ready);
            await page.screenshot({ path: output, type: image.format ?? 'png', ...(image.format === 'jpeg' ? { quality: 86 } : {}), clip: { x: 0, y: 0, ...SIZE } });
            await page.close();

            const bytes = fs.statSync(output).size;

            if (bytes >= MAX_BYTES) {
                throw new Error(`${image.output} ma ${Math.round(bytes / 1024)} KB, a podglądy w WhatsApp wymagają mniej niż 300 KB.`);
            }

            console.log(`✓ ${path.relative(process.cwd(), output)} (${SIZE.width} × ${SIZE.height}, ${Math.round(bytes / 1024)} KB)`);
        }
    } finally {
        await browser.close();
    }
})().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
