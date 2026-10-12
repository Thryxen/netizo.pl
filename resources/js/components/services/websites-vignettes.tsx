import { Globe, Mail } from 'lucide-react';
import type { ComponentType } from 'react';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Cursor, DoneTick, ScoreRing, TextBar, VignetteBar, vignetteCard, vignetteChip, VignetteStage } from './vignette-parts';

const COPY = localized({
    pl: {
        prototype: 'Prototyp v2',
        comment: 'Większe zdjęcie?',
        performance: 'Wydajność',
        lcp: 'LCP 0,8 s',
        cls: 'CLS 0',
        url: 'twojafirma.pl › oferta',
        resultTitle: 'Twoja Firma – oferta i cennik',
        inquiry: 'Nowe zapytanie',
        from: 'Anna, przez formularz',
        message: 'Czy zrobicie bukiet na sobotę?',
        domain: 'twojafirma.pl',
        checks: ['Domena', 'Certyfikat SSL', 'Poczta firmowa'],
        active: 'aktywne',
        renewal: 'Odnowienie domeny za 30 dni',
    },
    en: {
        prototype: 'Prototype v2',
        comment: 'Bigger photo?',
        performance: 'Performance',
        lcp: 'LCP 0.8 s',
        cls: 'CLS 0',
        url: 'yourcompany.com › services',
        resultTitle: 'Your Company – services and pricing',
        inquiry: 'New inquiry',
        from: 'Anna, via the form',
        message: 'Could you make a bouquet for Saturday?',
        domain: 'yourcompany.com',
        checks: ['Domain', 'SSL certificate', 'Business email'],
        active: 'active',
        renewal: 'Domain renews in 30 days',
    },
});

/** Projekt w Figmie: a page on the design canvas, a comment pinned to its photo and the cursor at work. */
function DesignVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage align="top">
            <div className={cn('relative w-full max-w-[17rem] rounded-b-none border-b-0 p-3', vignetteCard)}>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                        <span className="size-2 bg-foreground" />
                        <TextBar className="w-10 bg-foreground/60" />
                    </span>
                    <span className={vignetteChip}>{copy.prototype}</span>
                </div>
                <div className="mt-4 grid grid-cols-[1.3fr_1fr] gap-3">
                    <div className="flex flex-col gap-1.5">
                        <span className="h-2.5 w-[90%] rounded-[2px] bg-foreground" />
                        <span className="h-2.5 w-[60%] rounded-[2px] bg-foreground" />
                        <TextBar className="mt-1.5 w-[85%]" />
                        <TextBar className="w-[70%]" />
                        <span className="mt-2 h-5 w-14 rounded-[3px] bg-foreground" />
                    </div>
                    <div className="relative aspect-[4/3] rounded-[3px] border border-dashed border-foreground/40 bg-muted">
                        <span className="absolute -top-2.5 -right-2 rounded-md rounded-bl-[2px] bg-foreground px-1.5 py-0.5 text-[9px] whitespace-nowrap text-background">{copy.comment}</span>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((card) => (
                        <span key={card} className="h-7 rounded-[3px] border" />
                    ))}
                </div>
                <Cursor className="absolute right-16 bottom-9" />
            </div>
        </VignetteStage>
    );
}

/** Wersja na telefon: the same page on a laptop and on a phone. */
function ResponsiveVignette() {
    return (
        <VignetteStage align="bottom">
            <div className="relative w-full max-w-[17rem]">
                <div className={cn('mr-10 overflow-hidden rounded-b-none border-b-0', vignetteCard)}>
                    <VignetteBar />
                    <div className="grid grid-cols-[1.2fr_1fr] gap-2.5 p-3 pb-6">
                        <div className="flex flex-col gap-1.5">
                            <span className="h-2 w-[85%] rounded-[2px] bg-foreground" />
                            <span className="h-2 w-[55%] rounded-[2px] bg-foreground" />
                            <TextBar className="mt-1 w-[80%]" />
                            <span className="mt-1.5 h-4 w-11 rounded-[3px] bg-foreground" />
                        </div>
                        <span className="rounded-[3px] bg-muted" />
                    </div>
                </div>
                <div className={cn('absolute right-0 bottom-0 w-[5.5rem] overflow-hidden rounded-[10px] rounded-b-none border-b-0 px-2 pt-3', vignetteCard)}>
                    <span className="mx-auto mb-2 block h-1 w-6 rounded-full bg-foreground/20" />
                    <span className="block h-1.5 w-[90%] rounded-[2px] bg-foreground" />
                    <span className="mt-1 block h-1.5 w-[60%] rounded-[2px] bg-foreground" />
                    <TextBar className="mt-2 h-1 w-[85%]" />
                    <span className="mt-2 block aspect-[4/3] rounded-[3px] bg-muted" />
                    <span className="mt-2 mb-3 block h-3 w-10 rounded-[3px] bg-foreground" />
                </div>
            </div>
        </VignetteStage>
    );
}

/** Szybkie ładowanie: the bento web tile's performance report. */
function SpeedVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('flex items-center gap-4 py-3 pr-5 pl-3', vignetteCard)}>
                <ScoreRing score="100" className="size-16" />
                <span className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium">{copy.performance}</span>
                    <span className="flex gap-1.5">
                        <span className={vignetteChip}>{copy.lcp}</span>
                        <span className={vignetteChip}>{copy.cls}</span>
                    </span>
                </span>
            </div>
        </VignetteStage>
    );
}

/** SEO od pierwszego dnia: how the page shows up in search results, its title and description written for them. */
function SearchResultVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[17rem] p-3.5', vignetteCard)}>
                <span className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="flex size-4 items-center justify-center rounded-full border text-[8px] font-semibold text-foreground">T</span>
                    <span className="truncate font-mono">{copy.url}</span>
                </span>
                <span className="mt-2 block truncate text-[13px] font-medium underline decoration-foreground/30 underline-offset-2">{copy.resultTitle}</span>
                <TextBar className="mt-2.5 w-full" />
                <TextBar className="mt-1.5 w-[75%]" />
                <span className="mt-3 flex gap-1.5">
                    <TextBar className="h-4 w-14 rounded-[3px] border bg-transparent" />
                    <TextBar className="h-4 w-12 rounded-[3px] border bg-transparent" />
                    <TextBar className="h-4 w-16 rounded-[3px] border bg-transparent" />
                </span>
            </div>
        </VignetteStage>
    );
}

/** Formularz i zapytania: an inquiry from the contact form, as it lands in the inbox. */
function InquiryVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className="flex w-full max-w-[17rem] flex-col gap-2">
                <div className={cn('flex items-start gap-2.5 p-2.5', vignetteCard)}>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                        <Mail aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block font-medium">{copy.inquiry}</span>
                        <span className="block truncate text-muted-foreground">{copy.from}</span>
                        <span className="mt-1 block truncate">{copy.message}</span>
                    </span>
                </div>
                <div className={cn('flex flex-col gap-1.5 p-2.5 opacity-60', vignetteCard)}>
                    <TextBar className="w-[40%] bg-foreground/30" />
                    <TextBar className="w-[85%]" />
                </div>
            </div>
        </VignetteStage>
    );
}

/** Domena, hosting i poczta: the domain's checklist and the renewal reminder from the client panel. */
function DomainVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[17rem] overflow-hidden', vignetteCard)}>
                <div className="flex items-center gap-2 border-b bg-muted/50 px-3 py-2">
                    <Globe aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                    <span className="font-mono text-[10px]">{copy.domain}</span>
                </div>
                <ul className="flex flex-col gap-1.5 px-3 py-2.5">
                    {copy.checks.map((check) => (
                        <li key={check} className="flex items-center gap-2">
                            <DoneTick />
                            <span className="flex-1">{check}</span>
                            <span className="text-[10px] text-muted-foreground">{copy.active}</span>
                        </li>
                    ))}
                </ul>
                <div className="border-t px-3 py-2 text-[10px] text-muted-foreground">{copy.renewal}</div>
            </div>
        </VignetteStage>
    );
}

/** The scope items' vignettes, in the order of WEBSITES_COPY's items. */
export const WEBSITES_VIGNETTES: ComponentType[] = [DesignVignette, ResponsiveVignette, SpeedVignette, SearchResultVignette, InquiryVignette, DomainVignette];
