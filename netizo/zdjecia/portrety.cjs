/**
 * Przygotowuje zdjęcie współwłaściciela do awatara na stronie „O nas” (PersonAvatar): kwadratowy kadr popiersia,
 * WebP 96 px i 192 px (awatar ma 25–56 px CSS, 192 px wystarcza na ekranach 3×) w public/assets/images/people.
 * Nazwę plików wpisz w polu `portrait` osoby w resources/js/components/about/about-data.ts.
 *
 * Uruchomienie (z katalogu projektu, bez instalowania niczego w projekcie):
 *   npx -y -p sharp@0.35.5 node netizo/zdjecia/portrety.cjs <nazwa> <zdjęcie> [lewo,góra,bok]
 * np. `… portrety.cjs damian-idzik damian_idzik.png 67,20,1100` (kadr w pikselach oryginału; bez niego środek zdjęcia).
 */
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', '..', 'public', 'assets', 'images', 'people');
const WIDTHS = [96, 192];
const QUALITY = 80;
const RUN_COMMAND = 'npx -y -p sharp@0.35.5 node netizo/zdjecia/portrety.cjs <nazwa> <zdjęcie> [lewo,góra,bok]';

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

async function main() {
    const sharp = loadModule('sharp');
    const [name, source, cropArg] = process.argv.slice(2);

    if (!name || !source || !/^[a-z0-9-]+$/.test(name)) {
        console.error(`Użycie: ${RUN_COMMAND}`);
        process.exit(1);
    }

    const { width, height } = await sharp(source).metadata();
    const side = Math.min(width, height);
    const [left, top, size] = cropArg
        ? cropArg.split(',').map(Number)
        : [Math.round((width - side) / 2), Math.round((height - side) / 2), side];

    if ([left, top, size].some((value) => !Number.isInteger(value) || value < 0) || left + size > width || top + size > height) {
        throw new Error(`Kadr ${cropArg} wychodzi poza zdjęcie ${width} × ${height} px`);
    }

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    for (const outputWidth of WIDTHS) {
        const output = path.join(OUTPUT_DIR, `${name}-${outputWidth}.webp`);

        await sharp(source).extract({ left, top, width: size, height: size }).resize(outputWidth).webp({ quality: QUALITY, effort: 6 }).toFile(output);
        console.log(`${path.relative(process.cwd(), output)}  ${(fs.statSync(output).size / 1024).toFixed(1)} KB`);
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
