import { Check, Package, ShoppingBag } from 'lucide-react';
import { SceneChip } from '@/components/home/scenes/scene-parts';
import { localized, useCopy } from '@/lib/i18n';
import { ServiceScene, useServiceScene } from './service-scene';

const COPY = localized({
    pl: {
        order: 'Nowe zamówienie #2041',
        orderDetail: '2 × kubek szałwiowy, misa',
        amount: '238,00\u00A0zł',
        paid: 'Płatność przyjęta',
        paidDetail: 'BLIK, 238,00\u00A0zł',
        label: 'Etykieta nadania gotowa',
        labelDetail: 'Paczkomat, wysyłka dziś',
    },
    en: {
        order: 'New order #2041',
        orderDetail: '2 × sage mug, bowl',
        amount: 'PLN\u00A0238.00',
        paid: 'Payment received',
        paidDetail: 'BLIK, PLN\u00A0238.00',
        label: 'Shipping label ready',
        labelDetail: 'Parcel locker, ships today',
    },
});

/**
 * Sklepy internetowe: a ceramics studio packing orders; over the wall one order goes through the store: it arrives, the
 * payment is received, the shipping label is ready to print.
 */
export function StoresScene({ className }: { className?: string }) {
    const loop = useServiceScene();
    const copy = useCopy(COPY);

    return (
        <ServiceScene
            loop={loop}
            photoName="stores-packing"
            imgClassName="object-[34%_50%] sm:object-[42%_50%] lg:object-[48%_50%]"
            className={className}
            top={
                <SceneChip
                    show={loop.step >= 1}
                    from="above"
                    icon={ShoppingBag}
                    title={copy.order}
                    detail={copy.orderDetail}
                    trailing={<span className="self-start text-xs font-semibold whitespace-nowrap tabular-nums">{copy.amount}</span>}
                />
            }
            middle={<SceneChip show={loop.step >= 2} icon={Check} title={copy.paid} detail={copy.paidDetail} />}
            bottom={<SceneChip show={loop.step >= 3} icon={Package} title={copy.label} detail={copy.labelDetail} />}
        />
    );
}
