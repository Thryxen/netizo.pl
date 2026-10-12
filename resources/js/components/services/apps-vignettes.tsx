import { Bell, Check, LoaderCircle } from 'lucide-react';
import type { ComponentType } from 'react';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { DoneTick, TextBar, UptimeBars, vignetteCard, vignetteChip, VignetteStage } from './vignette-parts';

const COPY = localized({
    pl: {
        users: [
            { initials: 'AK', role: 'Administrator' },
            { initials: 'MW', role: 'Handlowiec' },
            { initials: 'JN', role: 'Księgowość' },
        ],
        app: 'Twoja aplikacja',
        systems: ['ERP', 'Płatności', 'SMS'],
        report: 'Zamówienia, październik',
        export: ['PDF', 'CSV'],
        notifications: [
            { title: 'Nowe zamówienie B2B', detail: 'Hurtownia rolnicza, teraz' },
            { title: 'Status: wysłane', detail: 'Zamówienie #1187, 2 min' },
            { title: 'Faktura zaksięgowana', detail: 'FV/10/2026, 8 min' },
        ],
        code: 'Kod z e-maila',
        codeHint: 'Wysłaliśmy go na a…@firma.pl',
        logIn: 'Zaloguj',
        pipeline: ['Testy', 'Wdrożenie', 'Monitoring'],
        uptime: 'Dostępność',
        uptimeValue: '99,9%',
    },
    en: {
        users: [
            { initials: 'AK', role: 'Admin' },
            { initials: 'MW', role: 'Sales' },
            { initials: 'JN', role: 'Accounting' },
        ],
        app: 'Your application',
        systems: ['ERP', 'Payments', 'SMS'],
        report: 'Orders, October',
        export: ['PDF', 'CSV'],
        notifications: [
            { title: 'New B2B order', detail: 'A farm wholesaler, now' },
            { title: 'Status: shipped', detail: 'Order #1187, 2 min' },
            { title: 'Invoice posted', detail: 'INV/10/2026, 8 min' },
        ],
        code: 'Code from your email',
        codeHint: 'We sent it to a…@company.com',
        logIn: 'Log in',
        pipeline: ['Tests', 'Deploy', 'Monitoring'],
        uptime: 'Uptime',
        uptimeValue: '99.9%',
    },
});

/** A month of orders as a line, a point every few days (0–100 from the bottom). */
const ORDERS_LINE = [30, 38, 34, 46, 42, 55, 51, 63, 58, 70, 66, 78];
const CHART_WIDTH = 120;
const CHART_HEIGHT = 44;
const LINE_PATH = ORDERS_LINE.map((value, index) => {
    const x = (index / (ORDERS_LINE.length - 1)) * CHART_WIDTH;
    const y = CHART_HEIGHT - (value / 100) * CHART_HEIGHT;

    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(' ');

/** Role i uprawnienia: the users of the application, each with a role. */
function RolesVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <ul className={cn('w-full max-w-[16rem] divide-y', vignetteCard)}>
                {copy.users.map(({ initials, role }, index) => (
                    <li key={initials} className="flex items-center gap-2.5 px-3 py-2">
                        <span className={cn('flex size-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold', index === 0 ? 'bg-foreground text-background' : 'border')}>
                            {initials}
                        </span>
                        <TextBar className="w-16" />
                        <span className={cn(vignetteChip, 'ml-auto', index === 0 && 'border-foreground')}>{role}</span>
                    </li>
                ))}
            </ul>
        </VignetteStage>
    );
}

/** Integracje przez API: the application in the middle of the systems it exchanges data with. */
function IntegrationsVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className="relative flex w-full max-w-[16rem] items-center justify-between">
                <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 size-full text-foreground/30">
                    <path d="M30 30 H70 M30 30 L70 8 M30 30 L70 52" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 1.5" vectorEffect="non-scaling-stroke" />
                </svg>
                <span className={cn('relative z-10 flex flex-col items-center gap-1 px-3 py-2.5', vignetteCard)}>
                    <span className="flex size-6 items-center justify-center rounded-[3px] bg-foreground text-[9px] font-semibold text-background">N</span>
                    <span className="text-[10px] font-medium whitespace-nowrap">{copy.app}</span>
                </span>
                <span className="relative z-10 flex flex-col gap-2">
                    {copy.systems.map((system) => (
                        <span key={system} className={cn('flex items-center gap-1.5 px-2 py-1', vignetteCard)}>
                            <Check aria-hidden="true" className="size-3" strokeWidth={2.5} />
                            <span className="text-[10px] font-medium">{system}</span>
                        </span>
                    ))}
                </span>
            </div>
        </VignetteStage>
    );
}

/** Raporty i eksport: a month's orders as a chart, ready to export. */
function ReportVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] p-3', vignetteCard)}>
                <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">{copy.report}</span>
                    <span className="flex gap-1">
                        {copy.export.map((format) => (
                            <span key={format} className={vignetteChip}>
                                {format}
                            </span>
                        ))}
                    </span>
                </span>
                <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="mt-3 h-14 w-full overflow-visible" preserveAspectRatio="none">
                    <path d={`${LINE_PATH} L${CHART_WIDTH} ${CHART_HEIGHT} L0 ${CHART_HEIGHT} Z`} className="fill-foreground/10" />
                    <path d={LINE_PATH} fill="none" className="stroke-foreground" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </VignetteStage>
    );
}

/** Dane na żywo: notifications arriving as things happen, the newest on top. */
function LiveVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <ul className="flex w-full max-w-[16rem] flex-col gap-1.5">
                {copy.notifications.map(({ title, detail }, index) => (
                    <li key={title} style={{ opacity: 1 - index * 0.3 }} className={cn('flex items-center gap-2.5 px-2.5 py-2', vignetteCard)}>
                        <span className={cn('flex size-6 shrink-0 items-center justify-center rounded-md', index === 0 ? 'bg-foreground text-background' : 'border')}>
                            <Bell aria-hidden="true" className="size-3" strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate font-medium">{title}</span>
                            <span className="block truncate text-[10px] text-muted-foreground">{detail}</span>
                        </span>
                    </li>
                ))}
            </ul>
        </VignetteStage>
    );
}

/** Bezpieczne logowanie: the second step of the log-in, a one-time code from an email. */
function LoginVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[15rem] p-3', vignetteCard)}>
                <span className="block font-medium">{copy.code}</span>
                <span className="block truncate text-[10px] text-muted-foreground">{copy.codeHint}</span>
                <span className="mt-3 grid grid-cols-6 gap-1.5">
                    {['4', '8', '1', '5', '', ''].map((digit, index) => (
                        <span key={index} className={cn('flex h-7 items-center justify-center rounded-[3px] border text-xs font-semibold tabular-nums', index === 4 && 'border-foreground')}>
                            {digit}
                        </span>
                    ))}
                </span>
                <span className="mt-3 flex h-6 items-center justify-center rounded-[3px] bg-foreground text-[10px] font-medium text-background">{copy.logIn}</span>
            </div>
        </VignetteStage>
    );
}

/** Wdrożenia i monitoring: the release pipeline, all green, and a month of availability. */
function DeployVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] p-3', vignetteCard)}>
                <ul className="flex items-center justify-between gap-2">
                    {copy.pipeline.map((stage, index) => (
                        <li key={stage} className="flex items-center gap-1.5">
                            {index < copy.pipeline.length - 1 ? <DoneTick /> : <LoaderCircle aria-hidden="true" className="size-3.5" strokeWidth={2.25} />}
                            <span className="text-[10px] font-medium">{stage}</span>
                        </li>
                    ))}
                </ul>
                <span className="mt-3 flex items-baseline justify-between border-t pt-2.5">
                    <span className="text-muted-foreground">{copy.uptime}</span>
                    <span className="font-semibold tabular-nums">{copy.uptimeValue}</span>
                </span>
                <UptimeBars className="mt-2" />
            </div>
        </VignetteStage>
    );
}

/** The scope items' vignettes, in the order of APPS_COPY's items. */
export const APPS_VIGNETTES: ComponentType[] = [RolesVignette, IntegrationsVignette, ReportVignette, LiveVignette, LoginVignette, DeployVignette];
