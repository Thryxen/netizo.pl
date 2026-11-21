import { Ban, Cpu } from 'lucide-react';
import { Appear, BentoTile, type BentoRivet, BentoTileText, type BentoService, liveVisualProps, tileGutterBottom, tileGutterTop, tileGutterX } from '@/components/home/bento/bento-tile';
import { useLiveLoop } from '@/components/motion/use-in-view-loop';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** the character → its trades → its fights → a second account on the same machine → the machine banned (static frame) → fade out. */
const PHASE_MS = [700, 1200, 1200, 1500, 3200, 450] as const;
const TRADES = 1;
const FIGHTS = 2;
const SHARED = 3;
const BANNED = 4;
const RESET = 5;

/** The graph in a 200×132 box: the character in the middle, partners around, the shared machine between two accounts. */
const CENTER = { x: 96, y: 66 };
const TRADE_NODES = [
    { x: 34, y: 28 },
    { x: 26, y: 92 },
    { x: 88, y: 118 },
];
const FIGHT_NODES = [
    { x: 150, y: 20 },
    { x: 104, y: 14 },
];
const MACHINE = { x: 146, y: 74 };
const SUSPECT = { x: 180, y: 108 };

const COPY = localized({
    pl: {
        rows: ['Handel · 14 000 000 yang', 'PvP · 6 walk', 'Ten sam HWID · 2 konta', 'HWID zablokowany'],
        shared: 'Wspólny HWID',
    },
    en: {
        rows: ['Trade · 14,000,000 yang', 'PvP · 6 fights', 'Same HWID · 2 accounts', 'HWID banned'],
        shared: 'Shared HWID',
    },
});

const fade = 'transition-opacity duration-500 data-[show=false]:opacity-0';

/**
 * Logi i bany: the connection graph of one character, built up while in view. Its trades and its fights link it to
 * other characters, then a second account turns out to play from the same machine, and the machine is banned. The rows
 * beside the graph name each step.
 */
export function LogsTile({ service, rivets }: { service: BentoService; rivets?: BentoRivet[] }) {
    const { ref, step, active } = useLiveLoop<HTMLDivElement>(PHASE_MS, { staticStep: BANNED });
    const at = (phase: number): boolean => step >= phase && step !== RESET;
    const copy = useCopy(COPY);
    const banned = at(BANNED);

    return (
        <BentoTile className="md:col-span-2" rivets={rivets}>
            <BentoTileText service={service} className={cn(tileGutterX, tileGutterTop)} />

            <div ref={ref} {...liveVisualProps(active)} className={cn('mt-auto grid items-center gap-4 pt-6 sm:grid-cols-[1.1fr_1fr]', tileGutterX, tileGutterBottom)}>
                <svg viewBox="0 0 200 132" className="h-36 w-full overflow-visible sm:h-40">
                    {TRADE_NODES.map((node) => (
                        <g key={`${node.x}-${node.y}`} data-show={at(TRADES)} className={fade}>
                            <line x1={CENTER.x} y1={CENTER.y} x2={node.x} y2={node.y} strokeWidth={1.5} className="stroke-foreground/35" />
                            <circle cx={node.x} cy={node.y} r={7} className="fill-background stroke-foreground/60" strokeWidth={1.5} />
                        </g>
                    ))}
                    {FIGHT_NODES.map((node) => (
                        <g key={`${node.x}-${node.y}`} data-show={at(FIGHTS)} className={fade}>
                            <line x1={CENTER.x} y1={CENTER.y} x2={node.x} y2={node.y} strokeWidth={1.5} strokeDasharray="3 3" className="stroke-foreground/35" />
                            <circle cx={node.x} cy={node.y} r={7} className="fill-muted stroke-foreground/60" strokeWidth={1.5} strokeDasharray="3 2" />
                        </g>
                    ))}
                    <g data-show={at(SHARED)} className={fade}>
                        <line x1={CENTER.x} y1={CENTER.y} x2={MACHINE.x} y2={MACHINE.y} strokeWidth={2} className="stroke-foreground" />
                        <line x1={MACHINE.x} y1={MACHINE.y} x2={SUSPECT.x} y2={SUSPECT.y} strokeWidth={2} className="stroke-foreground" />
                        <rect x={MACHINE.x - 6} y={MACHINE.y - 6} width={12} height={12} rx={2} className={cn('stroke-foreground transition-colors duration-500', banned ? 'fill-foreground' : 'fill-background')} strokeWidth={2} />
                        <circle cx={SUSPECT.x} cy={SUSPECT.y} r={7} className={cn('stroke-foreground transition-colors duration-500', banned ? 'fill-foreground' : 'fill-background')} strokeWidth={2} />
                    </g>
                    <circle cx={CENTER.x} cy={CENTER.y} r={11} className="fill-foreground" />
                </svg>

                <ul className="flex flex-col gap-1.5 text-[11px] leading-snug">
                    {copy.rows.map((row, index) => (
                        <li key={row}>
                            <Appear show={at(index + 1)} className={cn('flex items-center gap-2 rounded-[5px] px-2.5 py-1.5', index === 3 ? 'bg-foreground font-medium text-background' : 'border')}>
                                {index === 2 && <Cpu className="size-3 shrink-0" />}
                                {index === 3 && <Ban className="size-3 shrink-0" />}
                                {index < 2 && <span className={cn('size-2 shrink-0 rounded-full border border-foreground/60', index === 1 && 'border-dashed bg-muted')} />}
                                <span className="truncate">{row}</span>
                            </Appear>
                        </li>
                    ))}
                </ul>
            </div>
        </BentoTile>
    );
}
