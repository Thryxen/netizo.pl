import { BellRing, Coffee } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Appear } from '@/components/home/bento/bento-tile';
import { CHIP_SURFACE, ChipIcon, SceneChip } from '@/components/home/scenes/scene-parts';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ServiceScene, useServiceScene } from './service-scene';

/** Stamps on the loyalty card: collected so far, out of the card's total. */
const STAMPS = 8;
const CARD_SIZE = 10;

const COPY = localized({
    pl: {
        order: 'Zamówienie w aplikacji',
        orderDetail: 'Flat white i croissant',
        amount: '24,00\u00A0zł',
        loyalty: 'Karta lojalnościowa',
        stamps: `${STAMPS} z ${CARD_SIZE}`,
        ready: 'Twoja kawa jest gotowa',
        readyDetail: 'Odbiór przy barze, zamówienie #318',
        now: 'teraz',
    },
    en: {
        order: 'Order in the app',
        orderDetail: 'Flat white and croissant',
        amount: 'PLN\u00A024.00',
        loyalty: 'Loyalty card',
        stamps: `${STAMPS} of ${CARD_SIZE}`,
        ready: 'Your coffee is ready',
        readyDetail: 'Pick it up at the bar, order #318',
        now: 'now',
    },
});

/**
 * Aplikacje mobilne: a café counter with its ordering app on a phone; over the wall an order goes through the app: placed
 * from the phone, stamped on the loyalty card, and the push notification that it is ready to pick up.
 */
export function MobileScene({ className }: { className?: string }) {
    const loop = useServiceScene();
    const copy = useCopy(COPY);

    return (
        <ServiceScene
            loop={loop}
            photoName="mobile-cafe"
            imgClassName="object-[30%_50%] sm:object-[40%_50%] lg:object-[46%_50%]"
            className={className}
            top={<SceneChip show={loop.step >= 3} from="above" icon={BellRing} title={copy.ready} detail={copy.readyDetail} trailing={<span className="self-start text-[11px] text-muted-foreground">{copy.now}</span>} />}
            middle={
                <Appear show={loop.step >= 2} from="none" className={cn('rounded-lg p-3', CHIP_SURFACE, 'duration-600 data-[show=false]:translate-y-3')}>
                    <span className="flex items-baseline justify-between gap-3 text-xs">
                        <span className="font-medium">{copy.loyalty}</span>
                        <span className="text-muted-foreground tabular-nums">{copy.stamps}</span>
                    </span>
                    <span className="mt-2.5 grid grid-cols-10 gap-1">
                        {Array.from({ length: CARD_SIZE }, (_, stamp) => (
                            <span
                                key={stamp}
                                data-on={stamp < STAMPS}
                                style={{ transitionDelay: loop.step >= 2 ? `${stamp * 60}ms` : undefined } as CSSProperties}
                                className="aspect-square rounded-full border transition-colors duration-300 data-[on=true]:border-foreground data-[on=true]:bg-foreground"
                            />
                        ))}
                    </span>
                </Appear>
            }
            bottom={
                <SceneChip
                    show={loop.step >= 1}
                    leading={<ChipIcon icon={Coffee} />}
                    title={copy.order}
                    detail={copy.orderDetail}
                    trailing={<span className="self-start text-xs font-semibold whitespace-nowrap tabular-nums">{copy.amount}</span>}
                />
            }
        />
    );
}
