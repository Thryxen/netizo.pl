import { CalendarDays, Download, Swords, Trophy } from 'lucide-react';
import { Appear, BentoTile, BentoTileText, type BentoService, liveVisualProps, tileGutterTop, tileGutterX } from '@/components/home/bento/bento-tile';
import { useLiveLoop } from '@/components/motion/use-in-view-loop';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BENTO_INK } from '../metin2cms-images';

/** the window → the ranking fills in → the news arrives → the next event (static frame) → fade out. */
const PHASE_MS = [700, 1300, 1200, 3400, 450] as const;
const RANKING = 1;
const NEWS = 2;
const EVENT = 3;
const RESET = 4;

/** Invented nicknames, the same in both languages. */
const PLAYERS = ['NocnyKruk', 'LekkiRolnik', 'SprytnyWilk', 'PustyKupiec', 'BialyRybak', 'CichyLucznik', 'ZlotyFeniks'] as const;
const PLACES = ['I', 'II', 'III', '4', '5', '6', '7'] as const;
/** The game's three kingdoms as three greys: each player's dot. */
const KINGDOMS = ['bg-foreground/80', 'bg-foreground/40', 'bg-foreground/15'] as const;

const COPY = localized({
    pl: {
        address: 'twojserwer.pl',
        name: 'Twój Serwer',
        tagline: 'Serwer Metin2',
        nav: ['Start', 'Pobierz', 'Ranking', 'Support'],
        download: 'Pobierz klienta',
        register: 'Załóż konto',
        online: 'online',
        ranking: 'Ranking',
        level: 'Poz.',
        tag: 'Aktualność',
        news: 'Weekend z podwójnym EXP',
        event: 'Turniej gildii',
        eventTime: 'sob., 20:00',
        client: 'Klient 1.0.2',
        clientSize: '1,2 GB',
    },
    en: {
        address: 'yourserver.com',
        name: 'Your Server',
        tagline: 'Metin2 server',
        nav: ['Home', 'Download', 'Ranking', 'Support'],
        download: 'Download client',
        register: 'Sign up',
        online: 'online',
        ranking: 'Ranking',
        level: 'Lv.',
        tag: 'News',
        news: 'Double EXP weekend',
        event: 'Guild tournament',
        eventTime: 'Sat, 8 pm',
        client: 'Client 1.0.2',
        clientSize: '1.2 GB',
    },
});

/**
 * Strona serwera: the server's website in a browser window, filling in while in view: the ranking row by row, then the
 * latest news, then the next event of the calendar and the client to download. The static frame is the finished page.
 * Its grey banner carries the server's logo (a stand-in) and an ink drawing, blended into the grey like the hero's.
 */
export function SiteTile({ service }: { service: BentoService }) {
    const { ref, step, active } = useLiveLoop<HTMLDivElement>(PHASE_MS, { staticStep: EVENT });
    const at = (phase: number): boolean => step >= phase && step !== RESET;
    const copy = useCopy(COPY);

    return (
        <BentoTile className="md:col-span-2 lg:row-span-2">
            <BentoTileText service={service} size="lg" className={cn(tileGutterX, tileGutterTop)} />

            <div ref={ref} {...liveVisualProps(active)} className={cn('flex flex-1 flex-col pt-8 text-xs leading-snug', tileGutterX)}>
                <div className="flex flex-1 flex-col overflow-hidden rounded-t-lg border border-b-0 bg-background shadow-[0_-8px_32px_-18px_rgb(0_0_0/0.35)] dark:shadow-none">
                    <div className="flex h-8 items-center gap-2.5 border-b bg-muted/60 px-3">
                        <span className="flex gap-1">
                            {[0, 1, 2].map((dot) => (
                                <span key={dot} className="size-1.5 rounded-full bg-foreground/20" />
                            ))}
                        </span>
                        <span className="flex h-5 w-44 items-center rounded-[5px] border bg-background px-2 font-mono text-[10px] text-muted-foreground">{copy.address}</span>
                    </div>

                    <div className="relative isolate flex min-h-44 flex-1 flex-col overflow-hidden bg-muted px-4 pt-3 pb-5">
                        <img
                            {...BENTO_INK.dragon}
                            sizes="(min-width: 1024px) 380px, 70vw"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            className="absolute inset-y-0 right-0 -z-10 h-full w-2/3 [mask-image:linear-gradient(to_right,transparent,black_55%)] object-cover object-[50%_22%] mix-blend-multiply dark:mix-blend-screen dark:invert"
                        />
                        <div className="mb-5 flex items-center gap-4 text-[11px]">
                            {copy.nav.map((item) => (
                                <span key={item} className="text-foreground/70">
                                    {item}
                                </span>
                            ))}
                            <span className="ml-auto flex h-5 items-center gap-1.5 rounded-[3px] border bg-background/90 px-1.5 tabular-nums">
                                <span className="nz-bento-blink nz-bento-loop size-1.5 rounded-full bg-foreground" />
                                156 {copy.online}
                            </span>
                        </div>
                        <span className="mt-auto flex items-center gap-2.5">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                                <Swords className="size-5" strokeWidth={1.75} />
                            </span>
                            <span>
                                <span className="block text-lg leading-none font-semibold tracking-tight">{copy.name}</span>
                                <span className="mt-1 block text-[11px] leading-none text-muted-foreground">{copy.tagline}</span>
                            </span>
                        </span>
                        <div className="mt-4 flex gap-2 text-[11px] font-medium">
                            <span className="flex h-7 items-center gap-1.5 rounded-[5px] bg-foreground px-3 text-background">
                                <Download className="size-3" />
                                {copy.download}
                            </span>
                            <span className="flex h-7 items-center rounded-[5px] border border-foreground/25 bg-background/60 px-3">{copy.register}</span>
                        </div>
                    </div>

                    <div className="grid gap-3 p-3 sm:grid-cols-[1.25fr_1fr] sm:p-4">
                        <div className="rounded-md border p-3">
                            <span className="flex items-center gap-1.5 font-medium">
                                <Trophy className="size-3.5" />
                                {copy.ranking}
                            </span>
                            <ul className="mt-2.5 flex flex-col gap-2">
                                {PLAYERS.map((player, index) => (
                                    <li key={player}>
                                        <Appear show={at(RANKING)} delay={index * 110} className="flex items-center gap-2">
                                            <span className="w-4 font-semibold tabular-nums">{PLACES[index]}</span>
                                            <span className={cn('size-4 shrink-0 rounded-full', KINGDOMS[index % KINGDOMS.length])} />
                                            <span className="truncate">{player}</span>
                                            <span className="ml-auto shrink-0 text-[11px] text-muted-foreground tabular-nums">
                                                {copy.level} {99 - Math.floor(index / 2)}
                                            </span>
                                        </Appear>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Appear show={at(NEWS)} className="rounded-md border p-3">
                                <span className="inline-flex h-[1.125rem] items-center rounded-[3px] bg-foreground px-1.5 text-[10px] font-medium text-background">{copy.tag}</span>
                                <span className="mt-2 block font-medium">{copy.news}</span>
                                <span className="mt-2 block h-1.5 w-full rounded-full bg-foreground/12" />
                                <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-foreground/12" />
                            </Appear>
                            <Appear show={at(EVENT)} className="flex items-center gap-2.5 rounded-md border p-3">
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-[5px] bg-muted">
                                    <CalendarDays className="size-3.5" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate font-medium">{copy.event}</span>
                                    <span className="block text-[11px] text-muted-foreground">{copy.eventTime}</span>
                                </span>
                            </Appear>
                            <Appear show={at(EVENT)} delay={160} className="flex items-center gap-2.5 rounded-md border p-3">
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-[5px] bg-muted">
                                    <Download className="size-3.5" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block truncate font-medium">{copy.client}</span>
                                    <span className="block text-[11px] text-muted-foreground tabular-nums">{copy.clientSize}</span>
                                </span>
                            </Appear>
                        </div>
                    </div>
                </div>
            </div>
        </BentoTile>
    );
}
