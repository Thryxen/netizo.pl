import { FileText, RefreshCw } from 'lucide-react';
import { Appear } from '@/components/home/bento/bento-tile';
import { CHIP_SURFACE, SceneChip } from '@/components/home/scenes/scene-parts';
import { formatInteger, localized, useCopy, useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ServiceScene, useServiceScene } from './service-scene';

/** Orders per hour today, the last one the current hour (relative heights). */
const ORDERS_BY_HOUR = [3, 5, 4, 7, 6, 9, 8, 11] as const;
const SYNCED_ITEMS = 1284;
const ORDERS_TODAY = 37;

const COPY = localized({
    pl: {
        sync: 'Synchronizacja z ERP zakończona',
        syncDetail: (items: string): string => `${items} pozycji, 2 min temu`,
        orders: 'Zamówienia B2B dziś',
        report: 'Raport miesięczny gotowy',
        reportDetail: 'PDF, wysłany do księgowości',
    },
    en: {
        sync: 'ERP sync complete',
        syncDetail: (items: string): string => `${items} items, 2 min ago`,
        orders: 'B2B orders today',
        report: 'Monthly report ready',
        reportDetail: 'PDF, sent to accounting',
    },
});

/**
 * Aplikacje webowe: a wholesaler's office with its system on the monitor; over the wall the application does its work:
 * the ERP sync completes, today's B2B orders come in, the monthly report goes to accounting.
 */
export function AppsScene({ className }: { className?: string }) {
    const loop = useServiceScene();
    const copy = useCopy(COPY);
    const locale = useLocale();
    const peak = Math.max(...ORDERS_BY_HOUR);

    return (
        <ServiceScene
            loop={loop}
            photoName="apps-office"
            imgClassName="object-[34%_50%] sm:object-[42%_50%] lg:object-[46%_50%]"
            className={className}
            top={<SceneChip show={loop.step >= 1} from="above" icon={RefreshCw} title={copy.sync} detail={copy.syncDetail(formatInteger(SYNCED_ITEMS, locale))} />}
            middle={
                <Appear show={loop.step >= 2} from="none" className={cn('rounded-lg p-3', CHIP_SURFACE, 'duration-600 data-[show=false]:translate-y-3')}>
                    <span className="flex items-end justify-between gap-4">
                        <span className="text-xs leading-snug">
                            <span className="block text-muted-foreground">{copy.orders}</span>
                            <span className="mt-1 block text-2xl leading-none font-semibold tabular-nums">{ORDERS_TODAY}</span>
                        </span>
                        <span className="flex h-9 items-end gap-1">
                            {ORDERS_BY_HOUR.map((orders, hour) => (
                                <span key={hour} style={{ height: `${(orders / peak) * 100}%` }} className={cn('w-1.5 rounded-[1px] bg-foreground', hour < ORDERS_BY_HOUR.length - 1 && 'opacity-30')} />
                            ))}
                        </span>
                    </span>
                </Appear>
            }
            bottom={<SceneChip show={loop.step >= 3} icon={FileText} title={copy.report} detail={copy.reportDetail} />}
        />
    );
}
