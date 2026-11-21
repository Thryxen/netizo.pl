import { Check, Mail } from 'lucide-react';
import { Appear, BentoTile, type BentoRivet, BentoTileText, type BentoService, liveVisualProps, tileGutterBottom, tileGutterX } from '@/components/home/bento/bento-tile';
import { useLiveLoop } from '@/components/motion/use-in-view-loop';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BENTO_INK } from '../metin2cms-images';

/** the drawing alone → the e-mail with the PIN arrives, digit by digit → the account is active (static frame) → fade out. */
const PHASE_MS = [900, 1900, 3200, 450] as const;
const PIN = 1;
const ACTIVE = 2;
const RESET = 3;

const PIN_DIGITS = ['4', '8', '2', '7'] as const;

const COPY = localized({
    pl: { mail: 'Twój PIN do gry', to: 'kazuhiro@poczta.pl', active: 'Konto aktywne' },
    en: { mail: 'Your game PIN', to: 'kazuhiro@mail.com', active: 'Account active' },
});

/**
 * Panel gracza: the bento's picture tile, as the home page's bento has its photo tiles. An ink drawing of the game's
 * four classes fills it down to the text (black on white, inverted in the dark theme); over the figures' feet, so the
 * faces stay clear, the e-mail with the game PIN arrives digit by digit and the account turns active.
 */
export function PlayerTile({ service, rivets }: { service: BentoService; rivets?: BentoRivet[] }) {
    const { ref, step, active } = useLiveLoop<HTMLDivElement>(PHASE_MS, { staticStep: ACTIVE });
    const at = (phase: number): boolean => step >= phase && step !== RESET;
    const copy = useCopy(COPY);

    return (
        <BentoTile className="lg:row-span-2" rivets={rivets}>
            <div ref={ref} {...liveVisualProps(active)} className="relative min-h-[26rem] flex-1 overflow-hidden lg:min-h-80">
                <img
                    {...BENTO_INK.party}
                    sizes="(min-width: 1024px) 500px, (min-width: 768px) 50vw, 100vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 size-full object-cover object-[46%_50%] dark:invert"
                />
                <div className="absolute inset-x-3 bottom-3 flex flex-col-reverse items-start gap-2 sm:inset-x-4 sm:bottom-4">
                    <Appear show={at(PIN)} from="none" className="w-full rounded-lg border bg-background/95 p-3 duration-600 data-[show=false]:translate-y-[130%]">
                        <span className="flex items-center gap-3">
                            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                                <Mail className="size-4" strokeWidth={1.75} />
                            </span>
                            <span className="min-w-0 text-xs leading-snug">
                                <span className="block truncate font-medium">{copy.mail}</span>
                                <span className="block truncate text-muted-foreground">{copy.to}</span>
                            </span>
                        </span>
                        <span className="mt-2.5 flex gap-1.5">
                            {PIN_DIGITS.map((digit, index) => (
                                <Appear key={index} show={at(PIN)} delay={450 + index * 160} className="flex size-8 items-center justify-center rounded-[5px] border text-sm font-semibold tabular-nums">
                                    {digit}
                                </Appear>
                            ))}
                        </span>
                    </Appear>
                    <Appear show={at(ACTIVE)} className="inline-flex items-center gap-1.5 rounded-[3px] bg-foreground px-2 py-1 text-[11px] font-medium text-background">
                        <Check className="size-3" strokeWidth={2.5} />
                        {copy.active}
                    </Appear>
                </div>
            </div>

            <div className={cn('border-t pt-5 sm:pt-6', tileGutterX, tileGutterBottom)}>
                <BentoTileText service={service} />
            </div>
        </BentoTile>
    );
}
