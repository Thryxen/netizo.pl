/**
 * Generuje wizytówki do druku z szablon.html i danych z osoby.json: dla każdej osoby PDF 91 × 61 mm (85 × 55 + 3 mm
 * spadu, strona 1 przód, strona 2 tył, wektorowo z osadzonymi fontami, z TrimBox i BleedBox dla drukarni) do pdf/ oraz
 * podglądy PNG przyciętych kart do podglad/. Kod QR na przodzie zapisuje kontakt (vCard) w telefonie.
 *
 * Lakier UV 3D (Chroma, z folią Soft Skin): uv3d/{slug}.pdf to ta sama wizytówka z tyłem jako stroną 1 (Chroma lakieruje
 * pierwszą stronę projektu), a uv3d/maska.pdf to maska lakieru, wspólna dla wszystkich (podgląd: podglad/maska-uv3d.png).
 *
 * Pola osoby: name, role, phone, email. Wizytówka firmowa: "company": true (role niepotrzebne, w vCard kontakt jest
 * firmą), a w polu po lewej zamiast imienia i stanowiska stoją "heading" i "subheading". Opcjonalne "slug" nadaje nazwę
 * plików (domyślnie z name).
 *
 * Uruchomienie (z katalogu projektu, bez instalowania niczego w projekcie):
 *   npx -y -p playwright@1.58.0 -p qrcode@1.5.4 -p pdf-lib@1.17.1 node netizo/wizytowki/generuj.cjs
 * Gdy brakuje przeglądarki: npx -y playwright@1.58.0 install chromium
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const BLEED_MM = 3;
const CARD_MM = { width: 85, height: 55 };
const PX_PER_MM = 96 / 25.4;
/** Podgląd w ~600 dpi. */
const PREVIEW_SCALE = 6;
const PT_PER_MM = 72 / 25.4;
/**
 * Chroma: lakier UV 3D co najmniej 3 mm od linii cięcia („Elementy uszlachetnienia nachodzą na margines
 * bezpieczeństwa”). 0,2 mm zapasu na wygładzone krawędzie, gdy ich kontrola rasteryzuje maskę.
 */
const VARNISH_MARGIN_MM = 3.2;
const RUN_COMMAND = 'npx -y -p playwright@1.58.0 -p qrcode@1.5.4 -p pdf-lib@1.17.1 node netizo/wizytowki/generuj.cjs';

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

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

/** Wartość vCard: przecinki, średniki i ukośniki poprzedzone ukośnikiem. */
const escapeVcard = (value) => String(value).replace(/[\\,;]/g, (char) => `\\${char}`);

const slugify = (value) =>
    value
        .replace(/ł/g, 'l')
        .replace(/Ł/g, 'L')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

function vcard(person) {
    const parts = person.name.trim().split(/\s+/);
    const lastName = parts.length > 1 ? parts.pop() : '';
    const firstName = parts.join(' ');

    return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${escapeVcard(lastName)};${escapeVcard(firstName)};;;`,
        `FN:${escapeVcard(person.name)}`,
        'ORG:Netizo',
        ...(person.role ? [`TITLE:${escapeVcard(person.role)}`] : []),
        ...(person.company ? ['X-ABShowAs:COMPANY'] : []),
        `TEL:${person.phone.replace(/[^\d+]/g, '')}`,
        `EMAIL:${person.email}`,
        'URL:https://netizo.pl',
        'END:VCARD',
    ].join('\r\n');
}

/**
 * Kod QR (korekcja L: karta jest czysta, a mniejsza korekcja daje większe moduły, łatwiejsze do zeskanowania z druku)
 * jako SVG z wypełnionych prostokątów (jeden na każdy poziomy ciąg modułów). SVG z biblioteki rysuje moduły
 * liniami z crispEdges, co po przeskalowaniu zostawia jasne szczeliny między rzędami i psuje skanowanie.
 */
function qrSvg(QRCode, text) {
    const { modules } = QRCode.create(text, { errorCorrectionLevel: 'L' });
    const { size, data } = modules;
    let d = '';

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (!data[y * size + x]) {
                continue;
            }

            let run = 1;

            while (x + run < size && data[y * size + x + run]) {
                run++;
            }

            d += `M${x} ${y}h${run}v1h-${run}z`;
            x += run - 1;
        }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><path fill="#0a0a0a" d="${d}"/></svg>`;
}

/** Fonty jako data URI, bo strona jest ładowana przez setContent (bez adresu, względem którego działałoby fonts/). */
function inlineFonts(html) {
    return html.replace(/url\('fonts\/([^']+)'\)/g, (match, file) => {
        const data = fs.readFileSync(path.join(DIR, 'fonts', file)).toString('base64');

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

/**
 * Uruchamiane w stronie po załadowaniu fontów: zmniejsza tekst z [data-fit], aż zmieści się w swoim pudełku. Jedna
 * linia: do 60% rozmiaru. data-fit="wrap": najpierw do 80% w jednej linii, potem od 85% w najwyżej dwóch (do 50%).
 */
function fitText() {
    for (const element of document.querySelectorAll('[data-fit]')) {
        element.style.removeProperty('font-size');
        element.style.removeProperty('white-space');

        const wraps = element.dataset.fit === 'wrap';
        const base = parseFloat(getComputedStyle(element).fontSize);
        const overflows = () => element.scrollWidth > element.clientWidth + 0.5;
        const lines = () => Math.round(element.scrollHeight / parseFloat(getComputedStyle(element).lineHeight));
        const shrinkWhile = (tooBig, min) => {
            let size = parseFloat(element.style.fontSize) || base;

            while (tooBig() && size > min) {
                size -= 0.2;
                element.style.fontSize = `${size}px`;
            }
        };

        shrinkWhile(overflows, base * (wraps ? 0.8 : 0.6));

        if (wraps && overflows()) {
            element.style.whiteSpace = 'normal';
            element.style.fontSize = `${base * 0.85}px`;
            shrinkWhile(() => overflows() || lines() > 2, base * 0.5);
        }
    }
}

/**
 * Uruchamiane w stronie: wypełnia każde [data-pattern] sygnetami N z <template id="sygnet">, znaki wysokości data-size mm.
 * data-grid="kolumny rzędy" rozpina siatkę na cały format netto: skrajne znaki stoją data-inset mm od linii cięcia, a
 * rozstaw wynika z liczby znaków. Nóż nie przecina więc żadnego znaku, a spad zostaje gładki, bez wzoru.
 * data-fade="x0 y0 x1 y1" (mm od cięcia) wygasza wzór: od punktu (x0, y0), gdzie go nie ma, do (x1, y1), gdzie ma pełny
 * kolor --pattern. Pośrednie tony to pełne kolory zmieszane z --paper, nie przezroczystość, żeby PDF do druku jej
 * nie zawierał.
 */
function drawPattern({ bleed, card }) {
    const source = document.querySelector('#sygnet').content.firstElementChild;
    const [, , viewWidth, viewHeight] = source.getAttribute('viewBox').split(/\s+/).map(Number);
    const smoothstep = (t) => {
        const clamped = Math.min(1, Math.max(0, t));

        return clamped * clamped * (3 - 2 * clamped);
    };

    for (const layer of document.querySelectorAll('[data-pattern]')) {
        const [columns, rows] = layer.dataset.grid.split(/\s+/).map(Number);
        const height = parseFloat(layer.dataset.size);
        const width = (height * viewWidth) / viewHeight;
        const inset = parseFloat(layer.dataset.inset);
        const fade = layer.dataset.fade?.split(/\s+/).map(Number);
        const strength = (x, y) => {
            if (!fade) {
                return 1;
            }

            const [fromX, fromY, toX, toY] = fade;
            const dx = toX - fromX;
            const dy = toY - fromY;

            return smoothstep(((x - fromX) * dx + (y - fromY) * dy) / (dx * dx + dy * dy));
        };
        /** Środki count znaków o rozmiarze extent, równo rozłożonych od inset do length - inset. */
        const nodes = (length, extent, count) => {
            const first = inset + extent / 2;
            const pitch = (length - 2 * first) / (count - 1);

            return Array.from({ length: count }, (_, index) => first + index * pitch);
        };

        layer.replaceChildren();

        for (const y of nodes(card.height, height, rows)) {
            for (const x of nodes(card.width, width, columns)) {
                const tone = strength(x, y);

                if (tone < 0.06) {
                    continue;
                }

                const mark = document.createElement('div');

                mark.className = 'pattern__mark svg-fit';
                mark.style.left = `${bleed + x - width / 2}mm`;
                mark.style.top = `${bleed + y - height / 2}mm`;
                mark.style.height = `${height}mm`;
                mark.style.color = `color-mix(in srgb, var(--pattern) ${(tone * 100).toFixed(1)}%, var(--paper))`;
                mark.append(source.cloneNode(true));
                layer.append(mark);
            }
        }
    }
}

/**
 * Chromium zaokrągla stronę PDF w górę do siatki 1/300 cala (91 × 61 mm → 258 × 173,04 pt), a treść przycina do
 * dokładnego rozmiaru z @page, przyklejoną do lewego górnego rogu. Przy prawej i dolnej krawędzi zostawał przez to
 * niezadrukowany pasek ułamka punktu, widoczny jako biała linia na ciemnym tyle. Przycinamy MediaBox do treści
 * (91 × 61 mm; wysokość treści Chromium zaokrągla do 1/64 px, więc bywa o tysięczne części milimetra mniejsza) i dodajemy
 * TrimBox (linia cięcia, 85 × 55 mm, liczona od lewego górnego rogu jak w szablonie) oraz BleedBox (spad).
 */
async function fitPageBoxes(PDFDocument, pdf) {
    const document = await PDFDocument.load(pdf, { updateMetadata: false });
    const contentPt = (mm) => Math.min(mm * PT_PER_MM, (Math.round(mm * PX_PER_MM * 64) / 64) * 0.75);
    const bleed = BLEED_MM * PT_PER_MM;
    const width = contentPt(CARD_MM.width + 2 * BLEED_MM);
    const height = contentPt(CARD_MM.height + 2 * BLEED_MM);
    const trim = { width: CARD_MM.width * PT_PER_MM, height: CARD_MM.height * PT_PER_MM };

    for (const page of document.getPages()) {
        const top = page.getMediaBox().height;

        page.setMediaBox(0, top - height, width, height);
        page.setBleedBox(0, top - height, width, height);
        page.setTrimBox(bleed, top - bleed - trim.height, trim.width, trim.height);
    }

    return document.save({ useObjectStreams: false });
}

/** Ta sama wizytówka z odwróconą kolejnością stron: tył jako strona 1, bo Chroma lakieruje pierwszą stronę projektu. */
async function backFirst(PDFDocument, pdf) {
    const source = await PDFDocument.load(pdf, { updateMetadata: false });
    const document = await PDFDocument.create({ updateMetadata: false });

    for (const page of await document.copyPages(source, [1, 0])) {
        document.addPage(page);
    }

    return document.save({ useObjectStreams: false });
}

/**
 * Uruchamiane w stronie: położenie wielkiego sygnetu z tyłu względem lewego górnego rogu karty ze spadem, jako przekształcenie
 * jednostek SVG sygnetu na piksele CSS (x = originX + u · scale).
 */
function measureMark() {
    const card = document.querySelector('.card.dark').getBoundingClientRect();
    const svg = document.querySelector('.card.dark .mark svg');
    const box = svg.getBoundingClientRect();
    const [viewX, viewY, , viewHeight] = svg.getAttribute('viewBox').split(/\s+/).map(Number);
    const scale = box.height / viewHeight;

    return { originX: box.left - card.left - viewX * scale, originY: box.top - card.top - viewY * scale, scale };
}

/** Pole lakieru: format netto pomniejszony o VARNISH_MARGIN_MM z każdej strony, w mm od lewego górnego rogu ze spadem. */
const varnishArea = () => ({
    x: BLEED_MM + VARNISH_MARGIN_MM,
    y: BLEED_MM + VARNISH_MARGIN_MM,
    width: CARD_MM.width - 2 * VARNISH_MARGIN_MM,
    height: CARD_MM.height - 2 * VARNISH_MARGIN_MM,
});

/**
 * Maska lakieru UV 3D do tyłu (wymagania Chromy: osobny plik, lakier tam, gdzie czerń K=100%, białe tło bez lakieru,
 * lakier ≥ 3 mm od linii cięcia, linie ≥ 2 pt, pola do 9 cm², nie na białych elementach). Lakierujemy wielki sygnet N:
 * jest ciemnoszary, więc żółtawy odcień lakieru na nim ginie, a w polu lakieru jego dwie części mają ok. 5,1 i 6,7 cm².
 * Logo i nagłówek są białe, a drobny wzór ma kreski węższe niż 2 pt, więc zostają bez lakieru. Maska ma format i pola
 * stron wizytówki, a sygnet stoi tam, gdzie zmierzył go measureMark. Rysuje ją pdf-lib, nie Chromium, bo Chromium
 * zapisuje kolory w RGB, a czerń maski musi być czystym K.
 */
async function varnishMask(pdfLib, mark, paths) {
    const { PDFDocument, cmyk, pushGraphicsState, popGraphicsState, rectangle, clip, endPath } = pdfLib;
    const document = await PDFDocument.create({ updateMetadata: false });
    const pageHeight = (CARD_MM.height + 2 * BLEED_MM) * PT_PER_MM;
    const page = document.addPage([(CARD_MM.width + 2 * BLEED_MM) * PT_PER_MM, pageHeight]);
    const area = varnishArea();
    const ptPerPx = 72 / 96;

    page.pushOperators(
        pushGraphicsState(),
        rectangle(area.x * PT_PER_MM, pageHeight - (area.y + area.height) * PT_PER_MM, area.width * PT_PER_MM, area.height * PT_PER_MM),
        clip(),
        endPath(),
    );

    for (const d of paths) {
        page.drawSvgPath(d, {
            x: mark.originX * ptPerPx,
            y: pageHeight - mark.originY * ptPerPx,
            scale: mark.scale * ptPerPx,
            color: cmyk(0, 0, 0, 1),
        });
    }

    page.pushOperators(popGraphicsState());

    return fitPageBoxes(PDFDocument, await document.save({ useObjectStreams: false }));
}

/** Maska jako SVG w pikselach CSS, do podglądu PNG. */
function varnishMaskSvg(mark, paths) {
    const px = (mm) => mm * PX_PER_MM;
    const area = varnishArea();

    return [
        `<svg xmlns="http://www.w3.org/2000/svg" width="${px(CARD_MM.width + 2 * BLEED_MM)}" height="${px(CARD_MM.height + 2 * BLEED_MM)}" style="display: block">`,
        '<rect width="100%" height="100%" fill="#fff"/>',
        `<clipPath id="area"><rect x="${px(area.x)}" y="${px(area.y)}" width="${px(area.width)}" height="${px(area.height)}"/></clipPath>`,
        `<g clip-path="url(#area)"><g transform="matrix(${mark.scale} 0 0 ${mark.scale} ${mark.originX} ${mark.originY})">`,
        ...paths.map((d) => `<path d="${d}"/>`),
        '</g></g></svg>',
    ].join('');
}

(async () => {
    const people = JSON.parse(fs.readFileSync(path.join(DIR, 'osoby.json'), 'utf8'));

    for (const [index, person] of people.entries()) {
        for (const field of person.company ? ['name', 'phone', 'email'] : ['name', 'role', 'phone', 'email']) {
            if (!person[field]) {
                throw new Error(`osoby.json, pozycja ${index + 1}: brak pola "${field}".`);
            }
        }
    }

    const QRCode = loadModule('qrcode');
    const { chromium } = loadModule('playwright');
    const pdfLib = loadModule('pdf-lib');
    const { PDFDocument } = pdfLib;

    const template = inlineFonts(fs.readFileSync(path.join(DIR, 'szablon.html'), 'utf8'));
    const shared = {
        logo: fs.readFileSync(path.join(DIR, 'logo.svg'), 'utf8'),
        sygnet: fs.readFileSync(path.join(DIR, 'sygnet.svg'), 'utf8'),
    };

    fs.mkdirSync(path.join(DIR, 'pdf'), { recursive: true });
    fs.mkdirSync(path.join(DIR, 'podglad'), { recursive: true });
    fs.mkdirSync(path.join(DIR, 'uv3d'), { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage({ deviceScaleFactor: PREVIEW_SCALE });
    /** Tył jest wspólny, więc wielki sygnet stoi na każdej wizytówce w tym samym miejscu. */
    let mark;

    for (const person of people) {
        const slug = person.slug ?? slugify(person.name);
        const html = render(template, {
            ...shared,
            qr: qrSvg(QRCode, vcard(person)),
            personClass: person.company ? ' person--company' : '',
            name: escapeHtml(person.heading ?? person.name),
            role: escapeHtml(person.subheading ?? person.role ?? ''),
            phone: escapeHtml(person.phone),
            email: escapeHtml(person.email),
        });

        await page.setContent(html, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(fitText);
        await page.evaluate(drawPattern, { bleed: BLEED_MM, card: CARD_MM });

        const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });

        const printable = await fitPageBoxes(PDFDocument, pdf);

        fs.writeFileSync(path.join(DIR, 'pdf', `${slug}.pdf`), printable);
        fs.writeFileSync(path.join(DIR, 'uv3d', `${slug}.pdf`), await backFirst(PDFDocument, printable));
        mark ??= await page.evaluate(measureMark);

        const cards = await page.$$('.card');

        /*
         * Każda strona fotografowana z lewego górnego rogu strony: tył pod przodem zaczyna się na 61 mm (230,55 px),
         * a Chromium dociąga ułamek piksela, więc logo na podglądzie tyłu stało ok. 0,13 mm wyżej niż na przodzie
         * (w PDF stoją tak samo).
         */
        for (const [index, side] of [
            [0, 'przod'],
            [1, 'tyl'],
        ]) {
            await page.evaluate((index) => {
                document.querySelectorAll('.card').forEach((card, i) => (card.style.display = i === index ? '' : 'none'));
            }, index);
            const box = await cards[index].boundingBox();

            await page.screenshot({
                path: path.join(DIR, 'podglad', `${slug}-${side}.png`),
                clip: {
                    x: box.x + BLEED_MM * PX_PER_MM,
                    y: box.y + BLEED_MM * PX_PER_MM,
                    width: CARD_MM.width * PX_PER_MM,
                    height: CARD_MM.height * PX_PER_MM,
                },
            });
        }

        console.log(`✓ ${person.name}: pdf/${slug}.pdf, uv3d/${slug}.pdf, podglad/${slug}-przod.png, podglad/${slug}-tyl.png`);
    }

    const sygnetPaths = [...shared.sygnet.matchAll(/\sd="([^"]+)"/g)].map(([, d]) => d);

    fs.writeFileSync(path.join(DIR, 'uv3d', 'maska.pdf'), await varnishMask(pdfLib, mark, sygnetPaths));
    await page.setContent(`<body style="margin: 0">${varnishMaskSvg(mark, sygnetPaths)}</body>`);
    await page.screenshot({
        path: path.join(DIR, 'podglad', 'maska-uv3d.png'),
        clip: {
            x: BLEED_MM * PX_PER_MM,
            y: BLEED_MM * PX_PER_MM,
            width: CARD_MM.width * PX_PER_MM,
            height: CARD_MM.height * PX_PER_MM,
        },
    });
    console.log('✓ Maska lakieru UV 3D: uv3d/maska.pdf, podglad/maska-uv3d.png');

    await browser.close();
})().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
