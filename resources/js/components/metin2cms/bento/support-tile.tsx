import { Check, LifeBuoy } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Appear, BentoTile, type BentoRivet, BentoTileText, type BentoService, liveVisualProps, tileGutterBottom, tileGutterTop, tileGutterX } from '@/components/home/bento/bento-tile';
import { useLiveLoop } from '@/components/motion/use-in-view-loop';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** the player's request → the admin types → the reply → answered (static frame) → fade out. */
const PHASE_MS = [900, 1100, 1500, 3000, 450] as const;
const TYPING = 1;
const REPLY = 2;
const ANSWERED = 3;
const RESET = 4;

const COPY = localized({
    pl: { request: 'Doładowanie nie doszło po 10 minutach.', reply: 'Sprawdzone u operatora, monety są już na koncie.', answered: 'Odpowiedziane' },
    en: { request: 'My top-up has not arrived after 10 minutes.', reply: 'Checked with the provider, the coins are on your account.', answered: 'Answered' },
});

/**
 * Support: a player's request and its answer, in the bento's chat language. The request arrives, the admin types, the
 * reply lands and the ticket is marked as answered.
 */
export function SupportTile({ service, rivets }: { service: BentoService; rivets?: BentoRivet[] }) {
    const { ref, step, active } = useLiveLoop<HTMLDivElement>(PHASE_MS, { staticStep: ANSWERED });
    const at = (phase: number): boolean => step >= phase && step !== RESET;
    const copy = useCopy(COPY);

    return (
        <BentoTile rivets={rivets}>
            <BentoTileText service={service} className={cn(tileGutterX, tileGutterTop)} />

            <div ref={ref} {...liveVisualProps(active)} className={cn('mt-auto flex flex-col gap-2 pt-7', tileGutterX, tileGutterBottom)}>
                <Appear show={step !== RESET} className="max-w-[88%] self-end rounded-lg rounded-br-[3px] bg-foreground px-3 py-2 text-xs leading-snug text-background">
                    {copy.request}
                </Appear>

                <div className="flex items-start gap-2">
                    <Appear show={at(TYPING)} from="none" className="flex size-6 shrink-0 items-center justify-center rounded-[3px] border">
                        <LifeBuoy className="size-3.5" strokeWidth={1.75} />
                    </Appear>
                    <div className="relative min-w-0">
                        <Appear show={at(REPLY)} className="rounded-lg rounded-tl-[3px] bg-muted px-3 py-2 text-xs leading-snug">
                            {copy.reply}
                        </Appear>
                        <Appear show={step === TYPING} from="none" className="absolute top-0 left-0 flex h-[30px] items-center gap-1 rounded-lg rounded-tl-[3px] bg-muted px-3">
                            {[0, 1, 2].map((dot) => (
                                <span key={dot} style={{ '--bento-delay': `${dot * 160}ms` } as CSSProperties} className={cn('size-1 bg-foreground/70', step === TYPING && 'nz-bento-blink')} />
                            ))}
                        </Appear>
                    </div>
                </div>

                <Appear show={at(ANSWERED)} className="ml-8 inline-flex w-fit items-center gap-1.5 rounded-[3px] border px-2 py-1 text-[11px] text-muted-foreground">
                    <Check className="size-3 text-foreground" strokeWidth={2.25} />
                    {copy.answered}
                </Appear>
            </div>
        </BentoTile>
    );
}
