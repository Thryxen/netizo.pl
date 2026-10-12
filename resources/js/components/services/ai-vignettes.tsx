import { Bot, FileText, Inbox, Users } from 'lucide-react';
import type { ComponentType } from 'react';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { DoneTick, vignetteCard, vignetteChip, VignetteStage } from './vignette-parts';

const COPY = localized({
    pl: {
        question: 'Czy mogę zwrócić zamówienie po 20 dniach?',
        answer: 'Tak, masz na to 30 dni od odbioru paczki.',
        source: 'regulamin-sklepu.pdf, §\u00A08',
        invoice: 'Faktura FV/10/2026',
        fields: [
            { label: 'Sprzedawca', value: 'Hurtownia Agro' },
            { label: 'Kwota brutto', value: '1\u00A0230,00\u00A0zł' },
            { label: 'Termin płatności', value: '24.10.2026' },
        ],
        read: 'Odczytano 3 z 3 pól',
        flow: ['Poczta', 'AI', 'CRM'],
        flowNote: 'Nowe zgłoszenie trafia do CRM z kategorią i priorytetem',
        refund: 'Zwrot 249,00\u00A0zł',
        waiting: 'Czeka na akceptację',
        approve: 'Zatwierdź',
        reject: 'Odrzuć',
        log: [
            { time: '09:12', action: 'Odpowiedź wysłana klientowi' },
            { time: '09:14', action: 'Faktura odczytana' },
            { time: '09:15', action: 'Zadanie dodane do CRM' },
        ],
        usage: 'Zużycie w październiku',
        spent: '184\u00A0zł',
        limit: 'z limitu 400\u00A0zł',
    },
    en: {
        question: 'Can I return an order after 20 days?',
        answer: 'Yes, you have 30 days from receiving the parcel.',
        source: 'store-terms.pdf, §\u00A08',
        invoice: 'Invoice INV/10/2026',
        fields: [
            { label: 'Seller', value: 'Farm Wholesale' },
            { label: 'Gross amount', value: 'PLN\u00A01,230.00' },
            { label: 'Due date', value: '10/24/2026' },
        ],
        read: '3 of 3 fields read',
        flow: ['Email', 'AI', 'CRM'],
        flowNote: 'A new request lands in the CRM with a category and priority',
        refund: 'Refund of PLN\u00A0249.00',
        waiting: 'Waiting for approval',
        approve: 'Approve',
        reject: 'Reject',
        log: [
            { time: '09:12', action: 'Answer sent to the customer' },
            { time: '09:14', action: 'Invoice read' },
            { time: '09:15', action: 'Task added to the CRM' },
        ],
        usage: 'Usage in October',
        spent: 'PLN\u00A0184',
        limit: 'of the PLN\u00A0400 limit',
    },
});

/** Share of the monthly limit used (184 of 400). */
const USAGE_SHARE = 184 / 400;

/** Chatbot na Twoich danych: a customer's question, the answer and the document it comes from. */
function RagChatVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className="flex w-full max-w-[16.5rem] flex-col gap-2">
                <span className="max-w-[85%] self-end rounded-lg rounded-br-[3px] bg-foreground px-2.5 py-1.5 text-background">{copy.question}</span>
                <span className="flex items-start gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-[3px] border bg-background">
                        <Bot aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                    </span>
                    <span className={cn('min-w-0 rounded-lg rounded-tl-[3px] px-2.5 py-1.5', vignetteCard)}>
                        <span className="block">{copy.answer}</span>
                        <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                            <FileText aria-hidden="true" className="size-2.5" strokeWidth={2} />
                            {copy.source}
                        </span>
                    </span>
                </span>
            </div>
        </VignetteStage>
    );
}

/** Odczytywanie dokumentów: the fields read off an invoice. */
function InvoiceVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] overflow-hidden', vignetteCard)}>
                <span className="flex items-center gap-1.5 border-b bg-muted/50 px-3 py-2 font-medium">
                    <FileText aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                    {copy.invoice}
                </span>
                <ul className="flex flex-col gap-1.5 px-3 py-2.5">
                    {copy.fields.map(({ label, value }) => (
                        <li key={label} className="flex items-center gap-2">
                            <DoneTick />
                            <span className="flex-1 text-muted-foreground">{label}</span>
                            <span className="font-medium tabular-nums">{value}</span>
                        </li>
                    ))}
                </ul>
                <span className="block border-t px-3 py-1.5 text-[10px] text-muted-foreground">{copy.read}</span>
            </div>
        </VignetteStage>
    );
}

/** Integracje z systemami: a request from the inbox through the AI into the CRM. */
function FlowVignette() {
    const copy = useCopy(COPY);
    const icons = [Inbox, Bot, Users];

    return (
        <VignetteStage>
            <div className="flex w-full max-w-[16rem] flex-col items-center gap-3">
                <div className="flex w-full items-center">
                    {copy.flow.map((step, index) => {
                        const Icon = icons[index];

                        return (
                            <div key={step} className="flex flex-1 items-center last:flex-none">
                                <span className={cn('flex flex-col items-center gap-1 px-2.5 py-2', vignetteCard, index === 1 && 'border-foreground')}>
                                    <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
                                    <span className="text-[10px] font-medium">{step}</span>
                                </span>
                                {index < copy.flow.length - 1 && <span className="mx-1 h-px flex-1 border-t border-dashed border-foreground/40" />}
                            </div>
                        );
                    })}
                </div>
                <span className="text-center text-[10px] leading-snug text-muted-foreground">{copy.flowNote}</span>
            </div>
        </VignetteStage>
    );
}

/** Człowiek w pętli: a refund the AI prepared, waiting for a person's approval. */
function ApprovalVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[15rem] p-3', vignetteCard)}>
                <span className="flex items-baseline justify-between gap-2">
                    <span className="font-medium">{copy.refund}</span>
                    <span className={vignetteChip}>{copy.waiting}</span>
                </span>
                <span className="mt-3 grid grid-cols-2 gap-1.5">
                    <span className="flex h-6 items-center justify-center rounded-[3px] bg-foreground text-[10px] font-medium text-background">{copy.approve}</span>
                    <span className="flex h-6 items-center justify-center rounded-[3px] border text-[10px] font-medium">{copy.reject}</span>
                </span>
            </div>
        </VignetteStage>
    );
}

/** Log każdej akcji: what the automation did this morning, with the time of each action. */
function LogVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <ul className={cn('w-full max-w-[16rem] divide-y', vignetteCard)}>
                {copy.log.map(({ time, action }) => (
                    <li key={time} className="flex items-center gap-2.5 px-3 py-2">
                        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">{time}</span>
                        <span className="flex-1 truncate">{action}</span>
                        <DoneTick />
                    </li>
                ))}
            </ul>
        </VignetteStage>
    );
}

/** Kontrola kosztów: this month's usage of the AI models against the limit. */
function CostVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[15rem] p-3', vignetteCard)}>
                <span className="block text-muted-foreground">{copy.usage}</span>
                <span className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-base font-semibold tabular-nums">{copy.spent}</span>
                    <span className="text-[10px] text-muted-foreground">{copy.limit}</span>
                </span>
                <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-foreground/10">
                    <span style={{ width: `${USAGE_SHARE * 100}%` }} className="block h-full rounded-full bg-foreground" />
                </span>
            </div>
        </VignetteStage>
    );
}

/** The scope items' vignettes, in the order of AI_COPY's items. */
export const AI_VIGNETTES: ComponentType[] = [RagChatVignette, InvoiceVignette, FlowVignette, ApprovalVignette, LogVignette, CostVignette];
