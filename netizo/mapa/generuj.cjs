/**
 * Generuje mapę okolic Leszna do strony „O nas” (sekcja „Jak pracujemy”):
 *   public/assets/images/maps/okolice-leszna.svg
 * z danych OpenStreetMap (© współtwórcy OpenStreetMap, licencja ODbL; podpis jest na stronie): drogi ekspresowe
 * i krajowe, rzeki, jeziora i zabudowa (bez dróg wojewódzkich i kolei, żeby mapa była czytelna w małym rozmiarze). Obszar (granice) jest wspólny ze stroną:
 * resources/js/components/about/meeting-area.json, więc pinezki miejscowości trafiają w mapę.
 *
 * Mapa jest maską (czarne kształty o różnej przezroczystości): strona maluje ją kolorem tekstu, więc ten sam plik
 * działa w jasnym i ciemnym motywie. Odwzorowanie jak na stronie: długość geograficzna razy cos(środkowej
 * szerokości), czyli kilometr ma tę samą długość w poziomie i w pionie.
 *
 * Uruchomienie (z katalogu projektu, bez instalowania niczego):
 *   node netizo/mapa/generuj.cjs
 * Bez pobierania (z zapisanej odpowiedzi Overpass): node netizo/mapa/generuj.cjs --dane ścieżka/overpass.json
 * Inny serwer Overpass: OVERPASS_URL=https://… node netizo/mapa/generuj.cjs (główny bywa przeciążony, stąd domyślny).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const AREA_FILE = path.join(ROOT, 'resources/js/components/about/meeting-area.json');
const OUTPUT_FILE = path.join(ROOT, 'public/assets/images/maps/okolice-leszna.svg');
const OVERPASS_URL = process.env.OVERPASS_URL || 'https://gall.openstreetmap.de/api/interpreter';

/** Szerokość mapy w jednostkach SVG; wysokość wynika z proporcji obszaru. */
const WIDTH = 1000;

/** Warstwy od spodu: [klucz, styl]. Krycie to krycie koloru tekstu na stronie. */
const LAYERS = [
    ['residential', 'fill="#000" fill-opacity=".2"'],
    ['water', 'fill="#000" fill-opacity=".34" fill-rule="evenodd"'],
    ['river', 'fill="none" stroke="#000" stroke-opacity=".38" stroke-width="1.8"'],
    ['primary', 'fill="none" stroke="#000" stroke-opacity=".4" stroke-width="2.2"'],
    ['motorway', 'fill="none" stroke="#000" stroke-opacity=".62" stroke-width="3.6"'],
];

/** Tolerancja upraszczania (Douglas–Peucker) i minimalna powierzchnia wielokątów, w jednostkach SVG. */
const SIMPLIFY = { line: 1.1, polygon: 0.8 };
const MIN_AREA = { residential: 10, water: 5 };

function query({ north, south, west, east }) {
    return `[out:json][timeout:180][bbox:${south},${west},${north},${east}];(
        way["highway"~"^(motorway|trunk|primary)$"];
        way["waterway"="river"];
        way["natural"="water"];
        relation["natural"="water"];
        way["landuse"="residential"];
    );out geom;`;
}

async function loadElements(bounds) {
    const cacheIndex = process.argv.indexOf('--dane');

    if (cacheIndex !== -1) {
        return JSON.parse(fs.readFileSync(process.argv[cacheIndex + 1], 'utf8')).elements;
    }

    const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'netizo-map-generator/1.0 (kontakt@netizo.pl)' },
        body: new URLSearchParams({ data: query(bounds) }),
    });

    if (!response.ok) {
        throw new Error(`Overpass odpowiedział ${response.status}. Spróbuj później albo ustaw OVERPASS_URL na inny serwer.`);
    }

    return (await response.json()).elements;
}

function projector({ north, south, west, east }) {
    const lonScale = Math.cos((((north + south) / 2) * Math.PI) / 180);
    const scale = WIDTH / ((east - west) * lonScale);

    return {
        height: (north - south) * scale,
        project: ({ lat, lon }) => [(lon - west) * lonScale * scale, (north - lat) * scale],
    };
}

function perpendicularDistance([x, y], [x1, y1], [x2, y2]) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);

    return length === 0 ? Math.hypot(x - x1, y - y1) : Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / length;
}

/** Douglas–Peucker, iteracyjnie (długie drogi nie przepełniają stosu). */
function simplify(points, tolerance) {
    if (points.length < 3) {
        return points;
    }

    const keep = new Uint8Array(points.length);
    keep[0] = keep[points.length - 1] = 1;
    const stack = [[0, points.length - 1]];

    while (stack.length > 0) {
        const [first, last] = stack.pop();
        let farthest = -1;
        let farthestDistance = tolerance;

        for (let index = first + 1; index < last; index++) {
            const distance = perpendicularDistance(points[index], points[first], points[last]);

            if (distance > farthestDistance) {
                farthest = index;
                farthestDistance = distance;
            }
        }

        if (farthest !== -1) {
            keep[farthest] = 1;
            stack.push([first, farthest], [farthest, last]);
        }
    }

    return points.filter((_, index) => keep[index]);
}

function area(ring) {
    let sum = 0;

    for (let index = 0; index < ring.length; index++) {
        const [x1, y1] = ring[index];
        const [x2, y2] = ring[(index + 1) % ring.length];
        sum += x1 * y2 - x2 * y1;
    }

    return Math.abs(sum) / 2;
}

/** Ścieżka SVG z całkowitymi współrzędnymi i ruchami względnymi (najkrótszy zapis). */
function pathData(points, closed) {
    const rounded = points.map(([x, y]) => [Math.round(x), Math.round(y)]).filter(([x, y], index, list) => index === 0 || x !== list[index - 1][0] || y !== list[index - 1][1]);

    if (rounded.length < 2) {
        return '';
    }

    const [[startX, startY], ...rest] = rounded;
    let previous = rounded[0];
    const moves = rest.map(([x, y]) => {
        const move = `${x - previous[0]} ${y - previous[1]}`;
        previous = [x, y];

        return move;
    });

    return `M${startX} ${startY}l${moves.join(' ').replace(/ -/g, '-')}${closed ? 'z' : ''}`;
}

/** Łączy odcinki pierścieni z relacji (multipolygon) w zamknięte pierścienie. */
function assembleRings(segments) {
    const rings = [];
    const pending = segments.map((segment) => [...segment]);

    while (pending.length > 0) {
        let ring = pending.shift();

        for (let joined = true; joined && !samePoint(ring[0], ring[ring.length - 1]); ) {
            joined = false;

            for (let index = 0; index < pending.length; index++) {
                const segment = pending[index];
                const end = ring[ring.length - 1];

                if (samePoint(segment[0], end)) {
                    ring = ring.concat(segment.slice(1));
                } else if (samePoint(segment[segment.length - 1], end)) {
                    ring = ring.concat([...segment].reverse().slice(1));
                } else {
                    continue;
                }

                pending.splice(index, 1);
                joined = true;
                break;
            }
        }

        if (samePoint(ring[0], ring[ring.length - 1])) {
            rings.push(ring);
        }
    }

    return rings;
}

const samePoint = (a, b) => a.lat === b.lat && a.lon === b.lon;

function layerOf(tags) {
    if (tags.highway === 'motorway' || tags.highway === 'trunk') {
        return 'motorway';
    }

    if (tags.highway === 'primary' || tags.highway === 'secondary') {
        return tags.highway;
    }

    if (tags.waterway === 'river') {
        return 'river';
    }

    if (tags.natural === 'water') {
        return 'water';
    }

    if (tags.landuse === 'residential') {
        return 'residential';
    }

    return tags.railway === 'rail' ? 'rail' : null;
}

async function main() {
    const { bounds } = JSON.parse(fs.readFileSync(AREA_FILE, 'utf8'));
    const { height, project } = projector(bounds);
    const elements = await loadElements(bounds);
    const paths = Object.fromEntries(LAYERS.map(([key]) => [key, []]));

    const addPolygon = (layer, rings) => {
        const projected = rings.map((ring) => simplify(ring.map(project), SIMPLIFY.polygon)).filter((ring) => ring.length >= 4);

        if (projected.length > 0 && area(projected[0]) >= MIN_AREA[layer]) {
            paths[layer].push(projected.map((ring) => pathData(ring, true)).join(''));
        }
    };

    for (const element of elements) {
        const layer = layerOf(element.tags ?? {});

        if (layer === null || !(layer in paths)) {
            continue;
        }

        if (element.type === 'relation') {
            const members = (role) => element.members.filter((member) => member.type === 'way' && member.role === role && member.geometry).map((member) => member.geometry);
            addPolygon(layer, [...assembleRings(members('outer')), ...assembleRings(members('inner'))]);
        } else if (layer === 'water' || layer === 'residential') {
            if (element.geometry.length >= 4 && samePoint(element.geometry[0], element.geometry[element.geometry.length - 1])) {
                addPolygon(layer, [element.geometry]);
            }
        } else {
            const data = pathData(simplify(element.geometry.map(project), SIMPLIFY.line), false);

            if (data) {
                paths[layer].push(data);
            }
        }
    }

    const body = LAYERS.filter(([key]) => paths[key].length > 0)
        .map(([key, style]) => `<path ${style} stroke-linecap="round" stroke-linejoin="round" d="${paths[key].join('')}"/>`)
        .join('\n');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${Math.round(height)}">\n<!-- © współtwórcy OpenStreetMap (ODbL), netizo/mapa/generuj.cjs -->\n${body}\n</svg>\n`;

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, svg);
    console.log(`${path.relative(ROOT, OUTPUT_FILE)}: ${(svg.length / 1024).toFixed(0)} KB, ${LAYERS.map(([key]) => `${key} ${paths[key].length}`).join(', ')}`);
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
