import { Globe, Lock, ShieldCheck } from 'lucide-react';
import type { ComponentType } from 'react';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { DoneTick, UptimeBars, vignetteCard, vignetteChip, VignetteStage } from './vignette-parts';

const COPY = localized({
    pl: {
        stages: ['Build', 'Testy', 'Deploy'],
        log: 'git push origin main',
        deployed: 'Wdrożono w 2 min 21 s',
        backups: [
            { when: 'Dziś, 03:00', size: '1,2 GB' },
            { when: 'Wczoraj, 03:00', size: '1,2 GB' },
            { when: '10.10, 03:00', size: '1,1 GB' },
        ],
        restore: 'Test odtworzenia: zaliczony',
        uptime: 'Dostępność, 30 dni',
        uptimeValue: '99,9%',
        p95: 'p95: 42 ms',
        checks: ['Certyfikat SSL', 'Firewall', 'Aktualizacje', 'Logowanie 2FA'],
        valid: 'aktywne',
        traffic: 'Ruch dziś',
        instances: 'Serwery: 2 → 4',
        cdn: 'CDN: 94% z cache',
        costs: 'Koszt w październiku',
        costItems: [
            { item: 'Serwery', amount: '210\u00A0zł' },
            { item: 'Baza danych', amount: '90\u00A0zł' },
            { item: 'CDN i kopie', amount: '40\u00A0zł' },
        ],
        totalLabel: 'Razem',
        total: '340\u00A0zł',
    },
    en: {
        stages: ['Build', 'Tests', 'Deploy'],
        log: 'git push origin main',
        deployed: 'Deployed in 2 min 21 s',
        backups: [
            { when: 'Today, 3:00 AM', size: '1.2 GB' },
            { when: 'Yesterday, 3:00 AM', size: '1.2 GB' },
            { when: 'Oct 10, 3:00 AM', size: '1.1 GB' },
        ],
        restore: 'Restore test: passed',
        uptime: 'Uptime, 30 days',
        uptimeValue: '99.9%',
        p95: 'p95: 42 ms',
        checks: ['SSL certificate', 'Firewall', 'Updates', '2FA log-in'],
        valid: 'active',
        traffic: 'Traffic today',
        instances: 'Servers: 2 → 4',
        cdn: 'CDN: 94% from cache',
        costs: 'Cost in October',
        costItems: [
            { item: 'Servers', amount: 'PLN\u00A0210' },
            { item: 'Database', amount: 'PLN\u00A090' },
            { item: 'CDN and backups', amount: 'PLN\u00A040' },
        ],
        totalLabel: 'Total',
        total: 'PLN\u00A0340',
    },
});

/** Traffic over the day (relative); the servers double at the peak. */
const TRAFFIC = [18, 16, 15, 22, 38, 54, 62, 70, 88, 96, 84, 66] as const;
const SCALE_UP_FROM = 8;

/** Wdrożenia bez stresu: the pipeline after a push, all green. */
function PipelineVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] p-3', vignetteCard)}>
                <span className="block font-mono text-[10px] text-muted-foreground">$ {copy.log}</span>
                <ul className="mt-2.5 flex items-center justify-between gap-2">
                    {copy.stages.map((stage) => (
                        <li key={stage} className="flex items-center gap-1.5 font-medium">
                            <DoneTick />
                            {stage}
                        </li>
                    ))}
                </ul>
                <span className="mt-2.5 block border-t pt-2 text-[10px] text-muted-foreground">{copy.deployed}</span>
            </div>
        </VignetteStage>
    );
}

/** Kopie zapasowe: the last nightly backups and the restore test. */
function BackupsVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] overflow-hidden', vignetteCard)}>
                <ul className="divide-y">
                    {copy.backups.map(({ when, size }) => (
                        <li key={when} className="flex items-center gap-2 px-3 py-1.5">
                            <DoneTick />
                            <span className="flex-1">{when}</span>
                            <span className="text-[10px] text-muted-foreground tabular-nums">{size}</span>
                        </li>
                    ))}
                </ul>
                <span className="flex items-center gap-1.5 border-t bg-muted/50 px-3 py-1.5 text-[10px] font-medium">
                    <ShieldCheck aria-hidden="true" className="size-3" strokeWidth={2} />
                    {copy.restore}
                </span>
            </div>
        </VignetteStage>
    );
}

/** Monitoring 24/7: a month of uptime and the response time. */
function UptimeVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] p-3', vignetteCard)}>
                <span className="flex items-baseline justify-between">
                    <span className="text-muted-foreground">{copy.uptime}</span>
                    <span className="font-semibold tabular-nums">{copy.uptimeValue}</span>
                </span>
                <UptimeBars className="mt-2.5" />
                <span className="mt-2 block text-[10px] text-muted-foreground">{copy.p95}</span>
            </div>
        </VignetteStage>
    );
}

/** Bezpieczny serwer: the security checklist. */
function SecurityVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <ul className={cn('w-full max-w-[15rem] divide-y', vignetteCard)}>
                {copy.checks.map((check, index) => (
                    <li key={check} className="flex items-center gap-2 px-3 py-1.5">
                        {index === 0 ? <Lock aria-hidden="true" className="size-3.5" strokeWidth={2} /> : <DoneTick />}
                        <span className="flex-1">{check}</span>
                        <span className="text-[10px] text-muted-foreground">{copy.valid}</span>
                    </li>
                ))}
            </ul>
        </VignetteStage>
    );
}

/** Wydajność i skalowanie: today's traffic, with the servers doubled at the peak. */
function ScalingVignette() {
    const copy = useCopy(COPY);
    const peak = Math.max(...TRAFFIC);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] p-3', vignetteCard)}>
                <span className="flex items-baseline justify-between gap-2">
                    <span className="text-muted-foreground">{copy.traffic}</span>
                    <span className={vignetteChip}>{copy.instances}</span>
                </span>
                <span className="mt-2.5 grid h-12 grid-cols-12 items-end gap-1">
                    {TRAFFIC.map((value, hour) => (
                        <span key={hour} style={{ height: `${(value / peak) * 100}%` }} className={cn('rounded-[1px] bg-foreground', hour < SCALE_UP_FROM && 'opacity-30')} />
                    ))}
                </span>
                <span className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Globe aria-hidden="true" className="size-3" strokeWidth={2} />
                    {copy.cdn}
                </span>
            </div>
        </VignetteStage>
    );
}

/** Koszty pod kontrolą: this month's infrastructure bill, item by item. */
function CostsVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[15rem] overflow-hidden', vignetteCard)}>
                <span className="block border-b bg-muted/50 px-3 py-2 font-medium">{copy.costs}</span>
                <ul className="flex flex-col gap-1 px-3 py-2">
                    {copy.costItems.map(({ item, amount }) => (
                        <li key={item} className="flex justify-between gap-2">
                            <span className="text-muted-foreground">{item}</span>
                            <span className="tabular-nums">{amount}</span>
                        </li>
                    ))}
                </ul>
                <span className="flex justify-between gap-2 border-t px-3 py-1.5 font-semibold">
                    <span>{copy.totalLabel}</span>
                    <span className="tabular-nums">{copy.total}</span>
                </span>
            </div>
        </VignetteStage>
    );
}

/** The scope items' vignettes, in the order of DEVOPS_COPY's items. */
export const DEVOPS_VIGNETTES: ComponentType[] = [PipelineVignette, BackupsVignette, UptimeVignette, SecurityVignette, ScalingVignette, CostsVignette];
