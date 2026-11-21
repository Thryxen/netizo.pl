import { CalendarDays, Coins, ShieldBan, Users } from 'lucide-react';
import type { ComponentType } from 'react';
import { DoneTick, TextBar, UptimeBars, VignetteBar, vignetteCard, vignetteChip, VignetteStage } from '@/components/services/vignette-parts';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const COPY = localized({
    pl: {
        address: 'twojserwer.pl',
        tag: 'Wydarzenie',
        event: 'Podwójny EXP',
        eventDay: '20',
        eventTime: 'pt, 18:00',
        rank: ['I', 'II', 'III'],
        level: 'Poz. 99',
        packages: [
            { coins: '1000', price: '10 zł' },
            { coins: '2200', price: '20 zł', bonus: '+10%' },
        ],
        coins: 'monet',
        pay: 'Zapłać',
        method: 'BLIK',
        accounts: 'Konta',
        accountsValue: '1 846',
        online: 'Online',
        onlineValue: '156',
        bans: 'Bany',
        bansValue: '50',
    },
    en: {
        address: 'yourserver.com',
        tag: 'Event',
        event: 'Double EXP',
        eventDay: '20',
        eventTime: 'Fri, 6 pm',
        rank: ['I', 'II', 'III'],
        level: 'Lv. 99',
        packages: [
            { coins: '1000', price: 'PLN 10' },
            { coins: '2200', price: 'PLN 20', bonus: '+10%' },
        ],
        coins: 'coins',
        pay: 'Pay',
        method: 'BLIK',
        accounts: 'Accounts',
        accountsValue: '1,846',
        online: 'Online',
        onlineValue: '156',
        bans: 'Bans',
        bansValue: '50',
    },
});

/** A day of players online as a line (0–100 from the bottom): quiet before dawn, a peak in the evening. */
const ONLINE_LINE = [48, 52, 60, 72, 86, 78, 52, 30, 18, 16, 24, 38, 50];
const CHART_WIDTH = 200;
const CHART_HEIGHT = 36;
const LINE_PATH = ONLINE_LINE.map((value, index) => {
    const x = (index / (ONLINE_LINE.length - 1)) * CHART_WIDTH;
    const y = CHART_HEIGHT - (value / 100) * CHART_HEIGHT;

    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(' ');

/** Strona serwera: a window with the top of the ranking and the next event of the calendar. */
function ServerSiteVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage align="bottom">
            <div className={cn('w-full max-w-[19rem] overflow-hidden rounded-b-none border-b-0', vignetteCard)}>
                <VignetteBar>{copy.address}</VignetteBar>
                <div className="grid grid-cols-2 gap-3 p-3">
                    <ul className="flex flex-col gap-2">
                        {copy.rank.map((place, index) => (
                            <li key={place} className="flex items-center gap-2">
                                <span className="w-3 font-semibold tabular-nums">{place}</span>
                                <span className="size-4 shrink-0 rounded-full bg-foreground/15" />
                                <TextBar className={index === 1 ? 'w-9' : 'w-12'} />
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-col gap-2">
                        <span className={cn(vignetteChip, 'self-start')}>
                            <CalendarDays className="size-3" />
                            {copy.tag}
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-[3px] bg-foreground text-xs font-semibold text-background tabular-nums">{copy.eventDay}</span>
                            <span className="min-w-0">
                                <span className="block truncate font-medium">{copy.event}</span>
                                <span className="block text-[10px] text-muted-foreground">{copy.eventTime}</span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </VignetteStage>
    );
}

/** Panel gracza: two coin packages, the larger one chosen, and the way to pay. */
function PlayerPanelVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className="flex w-full max-w-[19rem] flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                    {copy.packages.map((item, index) => (
                        <div key={item.coins} className={cn('relative flex flex-col items-center gap-0.5 px-3 py-3', vignetteCard, index === 1 && 'border-foreground')}>
                            {item.bonus && <span className={cn(vignetteChip, 'absolute top-1.5 right-1.5 h-4 border-foreground bg-foreground px-1 text-[9px] text-background')}>{item.bonus}</span>}
                            <Coins className="size-3.5 text-muted-foreground" />
                            <span className="text-base leading-tight font-semibold tabular-nums">{item.coins}</span>
                            <span className="text-[10px] text-muted-foreground">{copy.coins}</span>
                            <span className="mt-1 font-medium tabular-nums">{item.price}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className={vignetteChip}>{copy.method}</span>
                    <span className="ml-auto flex h-6 items-center rounded-[3px] bg-foreground px-3 text-[10px] font-medium text-background">{copy.pay}</span>
                </div>
            </div>
        </VignetteStage>
    );
}

/** Panel administratora: the dashboard's figures and the day's players-online line. */
function AdminPanelVignette() {
    const copy = useCopy(COPY);
    const tiles = [
        { icon: Users, label: copy.accounts, value: copy.accountsValue },
        { icon: CalendarDays, label: copy.online, value: copy.onlineValue },
        { icon: ShieldBan, label: copy.bans, value: copy.bansValue },
    ];

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[19rem] p-3', vignetteCard)}>
                <ul className="grid grid-cols-3 gap-2">
                    {tiles.map(({ icon: Icon, label, value }) => (
                        <li key={label} className="flex flex-col gap-0.5 rounded-[3px] border px-2 py-1.5">
                            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Icon className="size-3" />
                                {label}
                            </span>
                            <span className="text-sm leading-tight font-semibold tabular-nums">{value}</span>
                        </li>
                    ))}
                </ul>
                <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none" className="mt-3 block h-9 w-full overflow-visible">
                    <path d={`${LINE_PATH} L${CHART_WIDTH} ${CHART_HEIGHT} L0 ${CHART_HEIGHT} Z`} className="fill-foreground/8" />
                    <path d={LINE_PATH} fill="none" strokeWidth={1.5} vectorEffect="non-scaling-stroke" className="stroke-foreground" />
                </svg>
            </div>
        </VignetteStage>
    );
}

/** The system section's vignettes, in the order of its parts: the server website, the player panel, the admin panel. */
export const METIN2CMS_VIGNETTES: ComponentType[] = [ServerSiteVignette, PlayerPanelVignette, AdminPanelVignette];

const PILLARS = localized({
    pl: {
        visits: 'Requesty',
        visitsValue: '12 480',
        queries: 'Zapytania do bazy gry',
        queriesValue: '2',
        steps: ['Build', 'Testy', 'Release'],
        downtime: 'Downtime: 0 s',
        modules: ['Ranking', 'Doładowania'],
        yours: 'Twój moduł',
        added: 'merged',
        uptime: 'Uptime',
        uptimeValue: '99,9%',
        backup: 'Backup, 03:00',
    },
    en: {
        visits: 'Requests',
        visitsValue: '12,480',
        queries: 'Game database queries',
        queriesValue: '2',
        steps: ['Build', 'Tests', 'Release'],
        downtime: 'Downtime: 0 s',
        modules: ['Ranking', 'Top-ups'],
        yours: 'Your module',
        added: 'merged',
        uptime: 'Uptime',
        uptimeValue: '99.9%',
        backup: 'Backup, 3:00 am',
    },
});

/** Pamięć podręczna: an hour of visits against the queries they cost the game database. */
function CacheVignette() {
    const copy = useCopy(PILLARS);

    return (
        <VignetteStage>
            <dl className={cn('flex w-full max-w-[16rem] flex-col gap-2.5 p-3', vignetteCard)}>
                <div>
                    <dt className="flex justify-between text-[10px] text-muted-foreground">
                        {copy.visits}
                        <span className="font-semibold text-foreground tabular-nums">{copy.visitsValue}</span>
                    </dt>
                    <dd className="mt-1 h-2 rounded-[2px] bg-foreground" />
                </div>
                <div>
                    <dt className="flex justify-between text-[10px] text-muted-foreground">
                        {copy.queries}
                        <span className="font-semibold text-foreground tabular-nums">{copy.queriesValue}</span>
                    </dt>
                    <dd className="mt-1 h-2 rounded-[2px] bg-foreground/10">
                        <span className="block h-full w-1 rounded-[2px] bg-foreground" />
                    </dd>
                </div>
            </dl>
        </VignetteStage>
    );
}

/** Wdrożenia bez przerwy: the three steps of a deploy, all done, and the downtime it cost. */
function DeployVignette() {
    const copy = useCopy(PILLARS);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] p-3', vignetteCard)}>
                <ol className="flex items-start">
                    {copy.steps.map((step, index) => (
                        <li key={step} className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <span className="flex items-center">
                                <DoneTick className="size-4" />
                                {index < copy.steps.length - 1 && <span className="h-px flex-1 bg-foreground/30" />}
                            </span>
                            <span className="truncate pr-1 text-[10px] font-medium">{step}</span>
                        </li>
                    ))}
                </ol>
                <span className={cn(vignetteChip, 'mt-3 border-foreground')}>{copy.downtime}</span>
            </div>
        </VignetteStage>
    );
}

/** Moduły na zamówienie: the modules of a deployment with one of the owner's own just added. */
function CustomVignette() {
    const copy = useCopy(PILLARS);

    return (
        <VignetteStage>
            <ul className={cn('w-full max-w-[16rem] divide-y', vignetteCard)}>
                {copy.modules.map((module) => (
                    <li key={module} className="flex items-center gap-2.5 px-3 py-2">
                        <DoneTick />
                        <span className="font-medium">{module}</span>
                        <TextBar className="ml-auto w-10" />
                    </li>
                ))}
                <li className="flex items-center gap-2.5 px-3 py-2">
                    <span className="flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border border-dashed border-foreground/60 text-[10px] leading-none">+</span>
                    <span className="font-medium">{copy.yours}</span>
                    <span className={cn(vignetteChip, 'ml-auto border-foreground')}>{copy.added}</span>
                </li>
            </ul>
        </VignetteStage>
    );
}

/** Opieka po starcie: a month of uptime and last night's backup. */
function CareVignette() {
    const copy = useCopy(PILLARS);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] p-3', vignetteCard)}>
                <span className="flex items-baseline justify-between">
                    <span className="text-[10px] text-muted-foreground">{copy.uptime}</span>
                    <span className="text-sm font-semibold tabular-nums">{copy.uptimeValue}</span>
                </span>
                <UptimeBars className="mt-2 w-full justify-between" />
                <span className="mt-3 flex items-center gap-2 border-t pt-2.5 font-medium">
                    <DoneTick />
                    {copy.backup}
                </span>
            </div>
        </VignetteStage>
    );
}

/** The pillars' vignettes, in the order of the copy's `pillars.items`: cache, deploys, custom modules, care. */
export const PILLAR_VIGNETTES: ComponentType[] = [CacheVignette, DeployVignette, CustomVignette, CareVignette];
