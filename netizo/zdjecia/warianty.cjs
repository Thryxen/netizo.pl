/**
 * Generuje mniejsze warianty zdjęć z serii (public/assets/images/photos): z pliku `{nazwa}.webp` w natywnej szerokości
 * powstają `{nazwa}-768.webp`, `{nazwa}-384.webp` i `{nazwa}-256.webp` (WebP, jakość 80, jak dotychczasowe -768).
 * Lista zdjęć pochodzi z PHOTOS w resources/js/lib/photos.ts, a `photo()` z tego pliku buduje z nich srcset, więc
 * nowe zdjęcie wystarczy dopisać tam i uruchomić skrypt. Małe warianty dostają sloty 64–300 px (sklep w hero,
 * makiety), żeby telefon nie pobierał 768w do miniatury.
 *
 * Uruchomienie (z katalogu projektu, bez instalowania niczego w projekcie):
 *   npx -y -p sharp@0.35.5 node netizo/zdjecia/warianty.cjs
 * Istniejące warianty zostają; `--nadpisz` generuje wszystkie od nowa. Można też podać nazwy zdjęć,
 * np. `… warianty.cjs shop-hero shop-hat`.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const PHOTOS_DIR = path.join(ROOT, 'public', 'assets', 'images', 'photos');
const PHOTOS_TS = path.join(ROOT, 'resources', 'js', 'lib', 'photos.ts');
/** Te same szerokości co PHOTO_WIDTHS w resources/js/lib/photos.ts. */
const WIDTHS = [768, 384, 256];
const QUALITY = 80;
const RUN_COMMAND = 'npx -y -p sharp@0.35.5 node netizo/zdjecia/warianty.cjs';

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

/** Nazwy zdjęć z obiektu PHOTOS (`'shop-hero': { width: 1536, height: 1024 }`). */
function photoNames() {
    const source = fs.readFileSync(PHOTOS_TS, 'utf8');
    const block = source.slice(source.indexOf('const PHOTOS = {'));
    const names = [...block.slice(0, block.indexOf('} as const')).matchAll(/'([a-z0-9-]+)':\s*\{\s*width/g)].map((match) => match[1]);

    if (names.length === 0) {
        throw new Error(`Nie znaleziono listy zdjęć (PHOTOS) w ${PHOTOS_TS}`);
    }

    return names;
}

async function main() {
    const sharp = loadModule('sharp');
    const args = process.argv.slice(2);
    const overwrite = args.includes('--nadpisz');
    const requested = args.filter((arg) => !arg.startsWith('--'));
    const names = photoNames();
    const unknown = requested.filter((name) => !names.includes(name));

    if (unknown.length > 0) {
        console.error(`Nieznane zdjęcia: ${unknown.join(', ')}. Dostępne: ${names.join(', ')}`);
        process.exit(1);
    }

    for (const name of requested.length > 0 ? requested : names) {
        const source = path.join(PHOTOS_DIR, `${name}.webp`);
        const { width } = await sharp(source).metadata();

        for (const variantWidth of WIDTHS) {
            const output = path.join(PHOTOS_DIR, `${name}-${variantWidth}.webp`);

            if (variantWidth >= width) {
                throw new Error(`${name}.webp ma ${width} px, a wariant ${variantWidth} px musi być węższy`);
            }

            if (!overwrite && fs.existsSync(output)) {
                continue;
            }

            await sharp(source).resize({ width: variantWidth }).webp({ quality: QUALITY, effort: 6 }).toFile(output);
            console.log(`${path.relative(ROOT, output)}  ${(fs.statSync(output).size / 1024).toFixed(1)} KB`);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
