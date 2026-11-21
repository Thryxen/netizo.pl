import { useEffect, useRef } from 'react';
import { BentoTile, type BentoRivet, BentoTileText, type BentoService, liveVisualProps, tileGutterTop, tileGutterX } from '@/components/home/bento/bento-tile';
import { useInViewLoop } from '@/components/motion/use-in-view-loop';
import { formatInteger, type Localized, localized, useCopy, useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** One period of players online (relative, 0–100); the chart repeats it, so the scroll loops seamlessly. */
const ONLINE = [
    46, 48, 52, 50, 55, 60, 58, 64, 70, 68, 74, 80, 86, 82, 78, 72, 66, 60, 52, 44, 38, 30, 24, 20, 18, 17, 19, 22, 26, 24, 28, 32, 30, 34, 38, 36, 40, 42, 41, 44,
] as const;

const CHART_HEIGHT = 40;
const CHART_WIDTH = ONLINE.length * 2;

/** Two periods side by side, as integer-derived coordinates (identical on server and client). */
const LINE = Array.from({ length: CHART_WIDTH + 1 }, (_, x) => {
    const y = CHART_HEIGHT - 2 - (ONLINE[x % ONLINE.length] / 100) * 34;

    return `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(2)}`;
}).join('');
const AREA = `${LINE}L${CHART_WIDTH} ${CHART_HEIGHT}L0 ${CHART_HEIGHT}Z`;

/** Readings the counters step through while live; index 0 is the static frame. */
const ACCOUNTS = [1846, 1846, 1847, 1847, 1848, 1848, 1849, 1849] as const;
const PLAYERS = [156, 158, 161, 159, 163, 160, 157, 162] as const;
const EARNED = [420, 420, 440, 440, 440, 490, 490, 510] as const;
const TICK_MS = 1300;

const COPY = localized({
    pl: { accounts: 'Konta', online: 'Gracze online', earned: 'Wpłaty dziś', currency: (value: string): string => `${value} zł`, live: 'na żywo' },
    en: { accounts: 'Accounts', online: 'Players online', earned: 'Payments today', currency: (value: string): string => `PLN ${value}`, live: 'live' },
});

const numbers = (readings: readonly number[]): Localized<string[]> => ({
    pl: readings.map((reading) => formatInteger(reading, 'pl')),
    en: readings.map((reading) => formatInteger(reading, 'en')),
});
const ACCOUNT_TEXT = numbers(ACCOUNTS);
const PLAYER_TEXT = numbers(PLAYERS);

/**
 * Panel administratora: the dashboard live. The accounts, the players online and today's payments tick through
 * readings (written straight to the DOM) over the players-online chart, which keeps scrolling (one CSS transform).
 */
export function AdminTile({ service, rivets }: { service: BentoService; rivets?: BentoRivet[] }) {
    const { ref, active } = useInViewLoop<HTMLDivElement>();
    const accountsRef = useRef<HTMLSpanElement>(null);
    const playersRef = useRef<HTMLSpanElement>(null);
    const earnedRef = useRef<HTMLSpanElement>(null);
    const readingRef = useRef(0);
    const copy = useCopy(COPY);
    const locale = useLocale();

    useEffect(() => {
        if (!active) {
            return;
        }

        const timer = window.setInterval(() => {
            readingRef.current = (readingRef.current + 1) % PLAYERS.length;

            if (accountsRef.current && playersRef.current && earnedRef.current) {
                accountsRef.current.textContent = ACCOUNT_TEXT[locale][readingRef.current];
                playersRef.current.textContent = PLAYER_TEXT[locale][readingRef.current];
                earnedRef.current.textContent = copy.currency(String(EARNED[readingRef.current]));
            }
        }, TICK_MS);

        return () => window.clearInterval(timer);
    }, [active, locale, copy]);

    return (
        <BentoTile className="lg:col-span-2" rivets={rivets}>
            <BentoTileText service={service} className={cn(tileGutterX, tileGutterTop)} />

            <div ref={ref} {...liveVisualProps(active)} className="mt-auto pt-7">
                <dl className={cn('grid grid-cols-3 gap-3', tileGutterX)}>
                    {[
                        { label: copy.accounts, ref: accountsRef, value: ACCOUNT_TEXT[locale][0] },
                        { label: copy.online, ref: playersRef, value: PLAYER_TEXT[locale][0] },
                        { label: copy.earned, ref: earnedRef, value: copy.currency(String(EARNED[0])) },
                    ].map((stat) => (
                        <div key={stat.label} className="min-w-0">
                            <dt className="truncate text-[11px] text-muted-foreground">{stat.label}</dt>
                            <dd ref={stat.ref} className="mt-0.5 text-xl leading-none font-semibold tracking-tight whitespace-nowrap tabular-nums sm:text-2xl">
                                {stat.value}
                            </dd>
                        </div>
                    ))}
                </dl>

                {/* Runs rail to rail of the tile; dashed gridlines stay put while the series scrolls under them. */}
                <div className="relative mt-4 h-20 overflow-hidden">
                    <span className="absolute inset-x-0 top-1/4 border-t border-dashed border-foreground/15" />
                    <span className="absolute inset-x-0 top-2/4 border-t border-dashed border-foreground/15" />
                    <span className="absolute inset-x-0 top-3/4 border-t border-dashed border-foreground/15" />
                    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none" className="nz-bento-scroll nz-bento-loop absolute inset-y-0 left-0 h-full w-[200%]">
                        <path d={AREA} className="fill-foreground/[0.07]" />
                        <path d={LINE} vectorEffect="non-scaling-stroke" strokeWidth={1.5} strokeLinejoin="round" className="fill-none stroke-foreground" />
                    </svg>
                </div>

                <div className={cn('flex items-center gap-1.5 border-t border-foreground/15 py-2.5 text-[11px] text-muted-foreground', tileGutterX)}>
                    <span className="nz-bento-blink nz-bento-loop size-1.5 rounded-full bg-foreground" />
                    {copy.online}, {copy.live}
                </div>
            </div>
        </BentoTile>
    );
}
