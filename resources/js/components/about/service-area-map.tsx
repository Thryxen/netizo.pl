import { type CSSProperties, useRef } from 'react';
import { useEntrance, useInViewLoop } from '@/components/motion';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { MEETING_TOWNS, type Town } from './about-data';
import area from './meeting-area.json';

const COPY = localized({
    pl: {
        label: 'Mapa okolic Leszna z miejscowościami, w których spotykamy się z klientami osobiście: Leszno, Rydzyna, Wschowa, Kościan, Gostyń i Rawicz.',
        scale: '10 km',
        attribution: '© OpenStreetMap',
    },
    en: {
        label: 'Map of the Leszno area with the towns where we meet clients in person: Leszno, Rydzyna, Wschowa, Kościan, Gostyń and Rawicz.',
        scale: '10 km',
        attribution: '© OpenStreetMap',
    },
});

/** The map image: roads, rivers, lakes and towns from OpenStreetMap, drawn by netizo/mapa/generuj.cjs as a mask. */
const MAP_URL = '/assets/images/maps/okolice-leszna.svg';

type Point = { x: number; y: number };

const KM_PER_DEGREE_OF_LATITUDE = 111.32;
const EARTH_RADIUS_KM = 6371;
const SCALE_BAR_KM = 10;
/** How far the outline sits outside the outermost towns, as a factor from the centre. */
const OUTLINE_INFLATE = 1.32;

const { north, south, west, east } = area.bounds;
/** Longitude shrinks with the cosine of the latitude: with it, a kilometre is as long across as up and down. */
const LON_SCALE = Math.cos((((north + south) / 2) * Math.PI) / 180);
/** Map units are degrees of latitude, x to the east and y to the south (the projection of the map image). */
const WIDTH = (east - west) * LON_SCALE;
const HEIGHT = north - south;

const project = (town: Town): Point => ({ x: (town.lon - west) * LON_SCALE, y: north - town.lat });

const TOWN_POINTS = MEETING_TOWNS.map((town) => ({ town, ...project(town) }));

/** Straight-line distance in km (haversine). */
function distanceKm(from: Town, to: Town): number {
    const radians = (degrees: number): number => (degrees * Math.PI) / 180;
    const dLat = radians(to.lat - from.lat);
    const dLon = radians(to.lon - from.lon);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(dLon / 2) ** 2;

    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

const LESZNO = MEETING_TOWNS.find((town) => town.name === 'Leszno') ?? MEETING_TOWNS[0];

/** The other meeting towns with their straight-line distance from Leszno, nearest first (the list beside the map). */
export const TOWN_DISTANCES = MEETING_TOWNS.filter((town) => town !== LESZNO)
    .map((town) => ({ name: town.name, km: Math.round(distanceKm(LESZNO, town)) }))
    .sort((a, b) => a.km - b.km);

const cross = (o: Point, a: Point, b: Point): number => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

/** Convex hull (monotone chain), counter-clockwise. */
function convexHull(points: Point[]): Point[] {
    const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
    const half = (list: Point[]): Point[] =>
        list.reduce<Point[]>((hull, point) => {
            while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], point) <= 0) {
                hull.pop();
            }

            return [...hull, point];
        }, []);
    const lower = half(sorted);
    const upper = half([...sorted].reverse());

    return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/** A closed Catmull-Rom curve through the points, as cubic Bézier segments: a soft outline instead of a polygon. */
function smoothClosedPath(points: Point[]): string {
    const at = (index: number): Point => points[(index + points.length) % points.length];
    const format = ({ x, y }: Point): string => `${x.toFixed(4)} ${y.toFixed(4)}`;
    const segments = points.map((point, index) => {
        const [previous, next, afterNext] = [at(index - 1), at(index + 1), at(index + 2)];
        const firstControl = { x: point.x + (next.x - previous.x) / 6, y: point.y + (next.y - previous.y) / 6 };
        const secondControl = { x: next.x - (afterNext.x - point.x) / 6, y: next.y - (afterNext.y - point.y) / 6 };

        return `C ${format(firstControl)} ${format(secondControl)} ${format(next)}`;
    });

    return `M ${format(points[0])} ${segments.join(' ')} Z`;
}

const hull = convexHull(TOWN_POINTS);
const centre = { x: hull.reduce((sum, point) => sum + point.x, 0) / hull.length, y: hull.reduce((sum, point) => sum + point.y, 0) / hull.length };
const OUTLINE = smoothClosedPath(
    hull.map((point) => ({ x: centre.x + (point.x - centre.x) * OUTLINE_INFLATE, y: centre.y + (point.y - centre.y) * OUTLINE_INFLATE })),
);
const OUTLINE_ORIGIN = `${((centre.x / WIDTH) * 100).toFixed(1)}% ${((centre.y / HEIGHT) * 100).toFixed(1)}%`;
const SCALE_BAR_WIDTH = `${(SCALE_BAR_KM / KM_PER_DEGREE_OF_LATITUDE / WIDTH) * 100}%`;

const MAP_MASK: CSSProperties = {
    maskImage: `url(${MAP_URL})`,
    WebkitMaskImage: `url(${MAP_URL})`,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
};

/** Where a town's chip sits around its dot (the dot is the anchor's origin). */
const LABEL_SIDE: Record<Town['labelSide'], string> = {
    top: 'bottom-3.5 left-0 -translate-x-1/2',
    right: 'top-0 left-3.5 -translate-y-1/2',
    bottom: 'top-3.5 left-0 -translate-x-1/2',
    left: 'top-0 right-3.5 -translate-y-1/2',
};

/**
 * The entrance (once, when the map is 30% in view): the outline opens from the centre of the area, then the towns pop
 * in one after another; afterwards each dot sends out a slow ring while the map is on screen. The hidden states exist
 * only under `.js` + no reduced motion, so SSR, no-JS and reduced motion show the finished map without rings.
 */
const MAP_CSS = `
[data-map-pulse] { display: none; }
@media (prefers-reduced-motion: no-preference) {
    .js [data-area-map='pending'] [data-map-outline],
    .js [data-area-map='pending'] [data-map-town] { opacity: 0; }
    [data-area-map='entering'] [data-map-outline] { animation: area-map-outline 1.5s var(--ease-expo-out) both; }
    [data-area-map='entering'] [data-map-town] {
        animation: area-map-town 0.7s var(--ease-expo-out) both;
        animation-delay: calc(0.45s + var(--town) * 0.11s);
    }
    .js [data-area-map='entering'] [data-map-pulse] {
        display: block;
        animation: area-map-pulse 2.8s ease-out infinite both;
        animation-delay: calc(1.4s + var(--town) * 0.45s);
    }
}
@keyframes area-map-outline {
    from { opacity: 0; clip-path: circle(0% at var(--origin)); }
    to { opacity: 1; clip-path: circle(80% at var(--origin)); }
}
@keyframes area-map-town {
    from { opacity: 0; transform: translateY(8px) scale(0.85); }
    to { opacity: 1; transform: none; }
}
@keyframes area-map-pulse {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    10% { opacity: 0.55; }
    80%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(3.2); }
}
`;

type ServiceAreaMapProps = {
    className?: string;
};

/**
 * The Leszno area from OpenStreetMap (main roads, rivers, lakes, towns) in the text colour, so it follows the theme,
 * with the towns where we meet clients in person as chips inside a soft dashed outline like the page rails, a 10 km
 * scale bar and the OpenStreetMap credit. No base is marked: we travel to the client. SSR-safe: the outline and the
 * positions are computed once from MEETING_TOWNS and meeting-area.json, the bounds of the map image.
 */
export function ServiceAreaMap({ className }: ServiceAreaMapProps) {
    const copy = useCopy(COPY);
    const entranceRef = useRef<HTMLDivElement>(null);
    const entrance = useEntrance(entranceRef, { amount: 0.3 });
    const loop = useInViewLoop<HTMLDivElement>();
    const pulseStyle: CSSProperties = { animationPlayState: loop.active ? 'running' : 'paused' };

    return (
        <div ref={loop.ref} className={cn('relative w-full', className)}>
            <style>{MAP_CSS}</style>
            <div
                ref={entranceRef}
                role="img"
                aria-label={copy.label}
                data-area-map={entrance}
                className="relative w-full"
                style={{ aspectRatio: `${WIDTH} / ${HEIGHT}`, '--origin': OUTLINE_ORIGIN } as CSSProperties}
            >
                <div aria-hidden="true" className="absolute inset-0 bg-foreground" style={MAP_MASK} />
                {/* The map is cut at its bounds: fade the top and bottom edges into the page instead of a hard line. */}
                <div aria-hidden="true" className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-card to-transparent" />
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />

                <svg data-map-outline="" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} aria-hidden="true" className="absolute inset-0 size-full">
                    <path d={OUTLINE} className="fill-foreground/[0.05] stroke-foreground/55" strokeWidth={1.5} strokeDasharray="7 6" vectorEffect="non-scaling-stroke" />
                </svg>

                {TOWN_POINTS.map(({ town, x, y }, index) => {
                    const isLeszno = town === LESZNO;

                    return (
                        <div
                            key={town.name}
                            aria-hidden="true"
                            data-map-town=""
                            className="absolute size-0"
                            style={{ left: `${(x / WIDTH) * 100}%`, top: `${(y / HEIGHT) * 100}%`, '--town': index } as CSSProperties}
                        >
                            <span data-map-pulse="" style={pulseStyle} className="absolute top-0 left-0 size-4 rounded-full border border-foreground/60" />
                            <span
                                className={cn(
                                    'absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-[3px] ring-card',
                                    isLeszno ? 'size-4' : 'size-2.5',
                                )}
                            />
                            <span
                                className={cn(
                                    'absolute border bg-card px-2.5 py-1 text-xs leading-none whitespace-nowrap sm:text-[0.8125rem]',
                                    LABEL_SIDE[town.labelSide],
                                    isLeszno ? 'border-foreground bg-foreground font-semibold text-background' : 'border-border font-medium',
                                )}
                            >
                                {town.name}
                            </span>
                        </div>
                    );
                })}

                <div aria-hidden="true" className="absolute bottom-4 left-4 flex flex-col gap-1.5 text-xs text-muted-foreground" style={{ width: SCALE_BAR_WIDTH }}>
                    <span className="tabular-nums">{copy.scale}</span>
                    <span className="h-1.5 border-x border-b border-foreground/50" />
                </div>
            </div>

            <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 bottom-3 bg-card/85 px-1.5 py-0.5 text-[0.6875rem] text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
                {copy.attribution}
            </a>
        </div>
    );
}
