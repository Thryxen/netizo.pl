import { Bot, ClipboardCheck, FileText } from 'lucide-react';
import { Appear } from '@/components/home/bento/bento-tile';
import { CHIP_SURFACE, ChipIcon, SceneChip, VISITOR_BUBBLE } from '@/components/home/scenes/scene-parts';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ServiceScene, useServiceScene } from './service-scene';

/** No-break spaces keep "39 zł" / "PLN 39" and "2–3 dni" / "2–3 business days" together (as the bento's AI tile). */
const COPY = localized({
    pl: {
        question: 'Ile kosztuje wysyłka do Niemiec?',
        answer: 'Wysyłka kosztuje 39\u00A0zł, dostawa w\u00A02–\u20603\u00A0dni robocze.',
        source: 'Źródło: cennik-wysylek.pdf',
        crm: 'Rozmowa zapisana w CRM',
        crmDetail: 'Pytanie o wysyłkę, klientka: Anna K.',
        now: 'teraz',
    },
    en: {
        question: 'How much is shipping to Germany?',
        answer: 'Shipping is PLN\u00A039, with delivery in 2–\u20603\u00A0business days.',
        source: 'Source: shipping-rates.pdf',
        crm: 'Conversation saved in the CRM',
        crmDetail: 'Shipping question, customer: Anna K.',
        now: 'now',
    },
});

/**
 * AI & Automatyzacja: a support desk with invoices and the shop's chat on the laptop; over the wall the chatbot works: a
 * customer asks, the AI answers from the shop's own price list (and says so), and the conversation lands in the CRM.
 */
export function AiScene({ className }: { className?: string }) {
    const loop = useServiceScene();
    const copy = useCopy(COPY);

    return (
        <ServiceScene
            loop={loop}
            photoName="ai-office"
            imgClassName="object-[24%_50%] sm:object-[34%_50%] lg:object-[40%_50%]"
            className={className}
            top={<SceneChip show={loop.step >= 3} from="above" icon={ClipboardCheck} title={copy.crm} detail={copy.crmDetail} trailing={<span className="self-start text-[11px] text-muted-foreground">{copy.now}</span>} />}
            middle={
                <Appear show={loop.step >= 1} from="none" className="flex justify-end duration-600 data-[show=false]:translate-y-3">
                    <p className={VISITOR_BUBBLE}>{copy.question}</p>
                </Appear>
            }
            bottom={
                <Appear show={loop.step >= 2} from="none" className={cn('flex items-start gap-3 rounded-lg p-2.5 pr-3', CHIP_SURFACE, 'duration-600 data-[show=false]:translate-y-3')}>
                    <ChipIcon icon={Bot} />
                    <span className="min-w-0 text-xs leading-snug">
                        <span className="block">{copy.answer}</span>
                        <span className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <FileText aria-hidden="true" className="size-3" strokeWidth={1.75} />
                            {copy.source}
                        </span>
                    </span>
                </Appear>
            }
        />
    );
}
