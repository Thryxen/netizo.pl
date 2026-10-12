import { Package, RefreshCw } from 'lucide-react';
import type { ComponentType } from 'react';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { DoneTick, vignetteCard, vignetteChip, VignetteStage } from './vignette-parts';

const COPY = localized({
    pl: {
        toPay: 'Do zapłaty',
        total: '238,00\u00A0zł',
        methods: ['BLIK', 'Karta', 'Przelew'],
        paid: 'Opłacono',
        shipping: 'Paczkomat',
        tracking: 'Nr przesyłki',
        sent: 'Nadano',
        product: 'Kubek szałwiowy',
        price: '69,00\u00A0zł',
        sizes: ['250\u00A0ml', '350\u00A0ml', '450\u00A0ml'],
        sync: 'Stany z ERP',
        synced: '2 min temu',
        stock: [
            { item: 'Kubek 350\u00A0ml', count: '12\u00A0szt.' },
            { item: 'Misa duża', count: '4\u00A0szt.' },
            { item: 'Talerz płaski', count: 'brak' },
        ],
        url: 'twojsklep.pl › kubki',
        resultTitle: 'Kubek szałwiowy 350\u00A0ml – Twój Sklep',
        resultPrice: '69,00\u00A0zł',
        inStock: 'W magazynie',
        week: 'Sprzedaż w tym tygodniu',
        weekTotal: '4\u00A0820\u00A0zł',
        days: ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'],
    },
    en: {
        toPay: 'Total',
        total: 'PLN\u00A0238.00',
        methods: ['BLIK', 'Card', 'Transfer'],
        paid: 'Paid',
        shipping: 'Parcel locker',
        tracking: 'Tracking no.',
        sent: 'Shipped',
        product: 'Sage mug',
        price: 'PLN\u00A069.00',
        sizes: ['250\u00A0ml', '350\u00A0ml', '450\u00A0ml'],
        sync: 'Stock from the ERP',
        synced: '2 min ago',
        stock: [
            { item: 'Mug 350\u00A0ml', count: '12\u00A0pcs' },
            { item: 'Large bowl', count: '4\u00A0pcs' },
            { item: 'Dinner plate', count: 'out' },
        ],
        url: 'yourstore.com › mugs',
        resultTitle: 'Sage mug 350\u00A0ml – Your Store',
        resultPrice: 'PLN\u00A069.00',
        inStock: 'In stock',
        week: 'Sales this week',
        weekTotal: 'PLN\u00A04,820',
        days: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    },
});

/** A barcode's bars: widths in px, black and white in turn. */
const BARCODE = [2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2] as const;

/** Sales per day of the week (relative), the busiest day in ink. */
const WEEK = [38, 52, 44, 61, 70, 92, 57] as const;

/** Płatności online: the checkout's payment step with BLIK chosen and the payment confirmed. */
function PaymentVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] p-3', vignetteCard)}>
                <span className="flex items-baseline justify-between">
                    <span className="text-muted-foreground">{copy.toPay}</span>
                    <span className="text-sm font-semibold tabular-nums">{copy.total}</span>
                </span>
                <span className="mt-3 grid grid-cols-3 gap-1.5">
                    {copy.methods.map((method, index) => (
                        <span key={method} className={cn('flex h-7 items-center justify-center rounded-[3px] border text-[10px] font-medium', index === 0 && 'border-foreground bg-foreground text-background')}>
                            {method}
                        </span>
                    ))}
                </span>
                <span className="mt-3 flex items-center gap-2 border-t pt-2.5">
                    <DoneTick />
                    <span className="font-medium">{copy.paid}</span>
                </span>
            </div>
        </VignetteStage>
    );
}

/** Wysyłka bez przepisywania: the shipping label printed from the panel. */
function ShippingVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] p-3', vignetteCard)}>
                <span className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                        <Package aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                        {copy.shipping}
                    </span>
                    <span className={vignetteChip}>{copy.sent}</span>
                </span>
                <span className="mt-3 flex h-9 items-stretch gap-px overflow-hidden">
                    {BARCODE.map((width, index) => (
                        <span key={index} style={{ width }} className={index % 2 === 0 ? 'bg-foreground' : 'bg-transparent'} />
                    ))}
                </span>
                <span className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{copy.tracking}</span>
                    <span className="font-mono text-foreground">6203 4410 2287</span>
                </span>
            </div>
        </VignetteStage>
    );
}

/** Produkty i warianty: a product card with its glazes and capacities, each with its own stock. */
function VariantsVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('grid w-full max-w-[16rem] grid-cols-[4.5rem_1fr] gap-3 p-2.5', vignetteCard)}>
                <span className="aspect-square rounded-[3px] bg-muted" />
                <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{copy.product}</span>
                    <span className="text-muted-foreground tabular-nums">{copy.price}</span>
                    <span className="mt-2 flex gap-1.5">
                        <span className="size-3.5 rounded-full bg-foreground/80 ring-1 ring-foreground ring-offset-1 ring-offset-background" />
                        <span className="size-3.5 rounded-full bg-foreground/35" />
                        <span className="size-3.5 rounded-full border bg-foreground/10" />
                    </span>
                    <span className="mt-2 flex gap-1">
                        {copy.sizes.map((size, index) => (
                            <span key={size} className={cn(vignetteChip, 'px-1', index === 1 && 'border-foreground')}>
                                {size}
                            </span>
                        ))}
                    </span>
                </span>
            </div>
        </VignetteStage>
    );
}

/** Stany i integracje: stock levels synced from the ERP. */
function StockVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] overflow-hidden', vignetteCard)}>
                <span className="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
                    <span className="flex items-center gap-1.5 font-medium">
                        <RefreshCw aria-hidden="true" className="size-3" strokeWidth={2} />
                        {copy.sync}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{copy.synced}</span>
                </span>
                <ul className="divide-y">
                    {copy.stock.map(({ item, count }, index) => (
                        <li key={item} className="flex items-center justify-between px-3 py-1.5">
                            <span>{item}</span>
                            <span className={cn('tabular-nums', index === copy.stock.length - 1 ? 'text-muted-foreground' : 'font-medium')}>{count}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </VignetteStage>
    );
}

/** Produkty widoczne w Google: the product in search results with its price and availability. */
function ProductResultVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('grid w-full max-w-[16.5rem] grid-cols-[1fr_3.5rem] gap-3 p-3', vignetteCard)}>
                <span className="min-w-0">
                    <span className="block truncate font-mono text-[10px] text-muted-foreground">{copy.url}</span>
                    <span className="mt-1.5 block text-[12px] leading-snug font-medium underline decoration-foreground/30 underline-offset-2">{copy.resultTitle}</span>
                    <span className="mt-2 flex items-center gap-1.5 text-[10px]">
                        <span className="font-semibold tabular-nums">{copy.resultPrice}</span>
                        <span aria-hidden="true" className="h-3 w-px bg-border" />
                        <span className="text-muted-foreground">{copy.inStock}</span>
                    </span>
                </span>
                <span className="aspect-square self-center rounded-[3px] bg-muted" />
            </div>
        </VignetteStage>
    );
}

/** Panel sprzedaży: this week's sales by day in the store's panel. */
function SalesVignette() {
    const copy = useCopy(COPY);
    const peak = Math.max(...WEEK);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] p-3', vignetteCard)}>
                <span className="block text-muted-foreground">{copy.week}</span>
                <span className="mt-0.5 block text-base font-semibold tabular-nums">{copy.weekTotal}</span>
                <span className="mt-3 grid h-14 grid-cols-7 items-end gap-1.5">
                    {WEEK.map((sales, day) => (
                        <span key={day} style={{ height: `${(sales / peak) * 100}%` }} className={cn('rounded-[2px] bg-foreground', sales !== peak && 'opacity-25')} />
                    ))}
                </span>
                <span className="mt-1.5 grid grid-cols-7 gap-1.5 text-center text-[9px] text-muted-foreground">
                    {copy.days.map((day) => (
                        <span key={day}>{day}</span>
                    ))}
                </span>
            </div>
        </VignetteStage>
    );
}

/** The scope items' vignettes, in the order of STORES_COPY's items. */
export const STORES_VIGNETTES: ComponentType[] = [PaymentVignette, ShippingVignette, VariantsVignette, StockVignette, ProductResultVignette, SalesVignette];
