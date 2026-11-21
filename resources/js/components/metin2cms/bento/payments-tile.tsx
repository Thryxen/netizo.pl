import { Check, Coins, LoaderCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { tween } from '@/components/home/bento/bento-motion';
import { Appear, BentoTile, type BentoRivet, BentoTileText, type BentoService, liveVisualProps, tileGutterBottom, tileGutterTop, tileGutterX } from '@/components/home/bento/bento-tile';
import { useLiveLoop } from '@/components/motion/use-in-view-loop';
import { formatInteger, localized, useCopy, useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** the packages → the larger one picked → the payment waits → credited, the balance counts up (static frame) → fade out. */
const PHASE_MS = [800, 900, 1400, 3000, 450] as const;
const PICKED = 1;
const PENDING = 2;
const PAID = 3;
const RESET = 4;

const COINS = 2200;

const COPY = localized({
    pl: { packages: ['10 zł', '20 zł'], bonus: '+10%', method: 'BLIK', pending: 'Oczekuje', paid: 'Zaksięgowano', balance: 'Saldo', unit: 'SM' },
    en: { packages: ['PLN 10', 'PLN 20'], bonus: '+10%', method: 'BLIK', pending: 'Pending', paid: 'Credited', balance: 'Balance', unit: 'coins' },
});

/**
 * Doładowania: a top-up from the choice of a package to the coins on the account. The larger package is picked, the
 * payment waits at the provider, then it is credited and the balance counts up (written straight to the DOM). The
 * bento's grey tile: its pieces sit on it as white cards.
 */
export function PaymentsTile({ service, rivets }: { service: BentoService; rivets?: BentoRivet[] }) {
    const { ref, step, active } = useLiveLoop<HTMLDivElement>(PHASE_MS, { staticStep: PAID });
    const balanceRef = useRef<HTMLSpanElement>(null);
    const copy = useCopy(COPY);
    const locale = useLocale();
    const picked = step >= PICKED && step !== RESET;

    useEffect(() => {
        const balance = balanceRef.current;

        if (!balance || !active) {
            return;
        }

        if (step !== PAID) {
            balance.textContent = '0';

            return;
        }

        return tween({ from: 0, to: COINS, duration: 900, onUpdate: (value) => (balance.textContent = formatInteger(Math.round(value), locale)) });
    }, [active, step, locale]);

    return (
        <BentoTile className="bg-muted" rivets={rivets}>
            <BentoTileText service={service} className={cn(tileGutterX, tileGutterTop)} />

            <div ref={ref} {...liveVisualProps(active)} className={cn('mt-auto flex flex-col gap-3 pt-7 text-[11px] leading-snug', tileGutterX, tileGutterBottom)}>
                <div className="grid grid-cols-2 gap-2">
                    {copy.packages.map((price, index) => (
                        <span key={price} className={cn('relative flex flex-col items-center gap-0.5 rounded-md border bg-background px-2 py-2.5 transition-colors duration-300', index === 1 && picked && 'border-foreground')}>
                            {index === 1 && <span className="absolute top-1 right-1 rounded-[3px] bg-foreground px-1 text-[9px] font-medium text-background">{copy.bonus}</span>}
                            <Coins className="size-3.5 text-muted-foreground" />
                            <span className="text-sm leading-tight font-semibold tabular-nums">{index === 0 ? '1000' : '2200'}</span>
                            <span className="text-[10px] text-muted-foreground">{price}</span>
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-foreground/15 pt-3">
                    <span>
                        <span className="block text-[10px] text-muted-foreground">{copy.balance}</span>
                        <span className="block text-lg leading-tight font-semibold tracking-tight tabular-nums">
                            <span ref={balanceRef}>{formatInteger(COINS, locale)}</span> {copy.unit}
                        </span>
                    </span>
                    <span className="relative flex h-6 items-center">
                        <Appear show={step === PENDING} from="none" className="absolute right-0 flex h-6 items-center gap-1.5 rounded-[3px] border bg-background px-2 whitespace-nowrap">
                            <LoaderCircle className={cn('size-3', step === PENDING && 'animate-spin')} />
                            {copy.method} · {copy.pending}
                        </Appear>
                        <Appear show={step === PAID} from="none" className="flex h-6 items-center gap-1.5 rounded-[3px] bg-foreground px-2 font-medium whitespace-nowrap text-background">
                            <Check className="size-3" strokeWidth={2.5} />
                            {copy.paid}
                        </Appear>
                    </span>
                </div>
            </div>
        </BentoTile>
    );
}
