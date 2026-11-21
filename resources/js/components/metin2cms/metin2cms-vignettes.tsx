import type { ComponentType } from 'react';
import { DoneTick, TextBar, UptimeBars, vignetteCard, vignetteChip, VignetteStage } from '@/components/services/vignette-parts';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';

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

/** The pillars' vignettes, in the order of the copy's `pillars.items`: cache, custom modules, then the optional care and its deploys. */
export const PILLAR_VIGNETTES: ComponentType[] = [CacheVignette, CustomVignette, CareVignette, DeployVignette];
