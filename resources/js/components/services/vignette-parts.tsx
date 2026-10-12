import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Parts of the scope section's vignettes: small, static pieces of interface that show what an item of the service looks
 * like in use (in the language of the home page's process artifacts and bento tiles: hairline cards, square-cornered
 * chips, bars standing in for text). Decorative: the item's title and description carry the meaning.
 */

type VignetteStageProps = {
    children: ReactNode;
    /**
     * Where the card sits in the stage: centred, resting on the lower edge (`bottom`), or starting near the top and
     * running off the lower edge like a page that continues (`top`).
     */
    align?: 'center' | 'bottom' | 'top';
    className?: string;
};

/** The muted stage a vignette's card rests on (the cell's picture), the same height in every cell. */
export function VignetteStage({ children, align = 'center', className }: VignetteStageProps) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                '@container relative flex h-44 justify-center overflow-hidden rounded-lg bg-muted/70 px-5 text-[11px] leading-snug select-none dark:bg-muted/40',
                align === 'center' && 'items-center',
                align === 'bottom' && 'items-end pt-6',
                align === 'top' && 'items-start pt-6',
                className,
            )}
        >
            {children}
        </div>
    );
}

/** A card on the stage: hairline, solid surface, a soft short shadow in light mode. */
export const vignetteCard = 'rounded-md border bg-background shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_20px_-12px_rgb(0_0_0/0.25)] dark:shadow-none';

/** A bar standing in for a line of text. */
export function TextBar({ className }: { className?: string }) {
    return <span className={cn('block h-1.5 rounded-full bg-foreground/15', className)} />;
}

/** A small square-cornered chip (statuses, choices), like the tech tags. */
export const vignetteChip = 'inline-flex h-5 items-center gap-1 rounded-[3px] border px-1.5 text-[10px] font-medium whitespace-nowrap';

/** A filled check square: something done or confirmed. */
export function DoneTick({ className }: { className?: string }) {
    return (
        <span className={cn('flex size-3.5 shrink-0 items-center justify-center rounded-[3px] bg-foreground text-background', className)}>
            <Check aria-hidden="true" className="size-2.5" strokeWidth={3} />
        </span>
    );
}

/** A window's title bar: three dots and an address or a title. */
export function VignetteBar({ children }: { children?: ReactNode }) {
    return (
        <div className="flex h-6 items-center gap-2 border-b bg-muted/60 px-2">
            <span className="flex gap-1">
                <span className="size-1 rounded-full bg-foreground/25" />
                <span className="size-1 rounded-full bg-foreground/25" />
                <span className="size-1 rounded-full bg-foreground/25" />
            </span>
            {children && <span className="min-w-0 truncate font-mono text-[9px] text-muted-foreground">{children}</span>}
        </div>
    );
}

/** The cursor of the bento's web tile, at rest. */
export function Cursor({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 16 20" className={cn('h-4 w-3.5 fill-foreground stroke-background', className)} strokeWidth={1.25} strokeLinejoin="round">
            <path d="M1.5 1.5v14.6l3.8-3.5 2.6 6.1 2.6-1.1-2.6-6h5.1z" />
        </svg>
    );
}

const RING_TICKS = Array.from({ length: 24 }, (_, index) => index);

/** The performance ring of the bento's web tile, full: 24 segments around a score. */
export function ScoreRing({ score, className }: { score: string; className?: string }) {
    return (
        <span className={cn('relative block size-14 shrink-0', className)}>
            <svg viewBox="0 0 56 56" className="absolute inset-0 size-full">
                {RING_TICKS.map((tick) => (
                    <rect key={tick} x="27" y="1" width="2" height="6" transform={`rotate(${tick * 15} 28 28)`} className="fill-foreground" />
                ))}
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums">{score}</span>
        </span>
    );
}

/** Availability over the last days as thin bars, every day up but one short dip (the home page's launch artifact). */
export function UptimeBars({ days = 30, dip = 17, className }: { days?: number; dip?: number; className?: string }) {
    return (
        <span className={cn('flex h-5 items-end gap-[2px]', className)}>
            {Array.from({ length: days }, (_, day) => (
                <span key={day} className={cn('w-[3px] rounded-[1px] bg-foreground', day === dip ? 'h-2.5 opacity-40' : 'h-full')} />
            ))}
        </span>
    );
}
