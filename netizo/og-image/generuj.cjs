/**
 * Generuje obrazy do podglądów linków (og:image, twitter:image), 1200 × 630 px, do public/assets/images:
 *   og-netizo-2.png          strona główna, z szablon.html
 *   og-netizo-partnerzy.png  program partnerski (/partnerzy), z szablon-partnerzy.html
 *   og-netizo-en.png         angielska strona główna (/en), z szablon-en.html
 *   og-netizo-partners-en.png  angielski program partnerski (/en/partners), z szablon-partnerzy-en.html
 *   og-netizo-o-nas.png      strona „O nas” (/o-nas), z szablon-o-nas.html
 *   og-netizo-about-en.png   angielska strona „O nas” (/en/about), z szablon-o-nas-en.html
 *   og-netizo-polityka-prywatnosci.png, og-netizo-privacy-policy-en.png, og-netizo-regulamin.png, og-netizo-terms-en.png
 *                            polityka prywatności i regulamin (/polityka-prywatnosci, /en/privacy-policy, /regulamin,
 *                            /en/terms), z jednego szablonu szablon-dokument.html z tekstami z `values` poniżej
 *   og-netizo-realizacje.jpg, og-netizo-projects-en.jpg
 *                            lista realizacji (/realizacje, /en/projects), z szablon-realizacje.html: mozaika zdjęć
 *                            z public/assets/images/photos (data URI), więc JPEG (`format: 'jpeg'`), nie PNG
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
