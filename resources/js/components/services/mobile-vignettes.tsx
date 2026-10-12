import { Bell, Check } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { DoneTick, TextBar, VignetteBar, vignetteCard, vignetteChip, VignetteStage } from './vignette-parts';

const COPY = localized({
    pl: {
        time: '9:41',
        date: 'wtorek, 14 października',
        reminder: 'Przypomnienie o wizycie',
        reminderDetail: 'Jutro o 10:00, gabinet 2',
        order: 'Zamów',
        prototype: 'Prototyp: ekran zamówienia',
        signIn: 'Zaloguj się',
        apple: 'Kontynuuj z Apple',
        google: 'Kontynuuj z Google',
        email: 'Użyj adresu e-mail',
        panel: 'panel.twojaaplikacja.pl',
        push: 'Nowa promocja w tym tygodniu',
        audience: 'Odbiorcy: 1\u00A0240',
        send: 'Wyślij',
        version: 'Wersja 1.4',
        stores: [
            { store: 'App Store', status: 'zatwierdzona' },
            { store: 'Google Play', status: 'opublikowana' },
        ],
    },
    en: {
        time: '9:41',
        date: 'Tuesday, October 14',
        reminder: 'Appointment reminder',
        reminderDetail: 'Tomorrow at 10:00 AM, room 2',
        order: 'Order',
        prototype: 'Prototype: order screen',
        signIn: 'Sign in',
        apple: 'Continue with Apple',
        google: 'Continue with Google',
        email: 'Use an email address',
        panel: 'panel.yourapp.com',
        push: 'A new promotion this week',
        audience: 'Recipients: 1,240',
        send: 'Send',
        version: 'Version 1.4',
        stores: [
            { store: 'App Store', status: 'approved' },
            { store: 'Google Play', status: 'published' },
        ],
    },
});

/** A phone's outline: rounded body, the camera as a pill (`island`) or a dot (`hole`), the screen inside. */
function Phone({ camera, children, className }: { camera: 'island' | 'hole'; children: ReactNode; className?: string }) {
    return (
        <div className={cn('relative w-[5.75rem] rounded-[14px] rounded-b-none border-b-0 px-2 pt-3', vignetteCard, className)}>
            {camera === 'island' ? <span className="mx-auto mb-2 block h-1.5 w-7 rounded-full bg-foreground" /> : <span className="mx-auto mb-2 block size-1.5 rounded-full bg-foreground" />}
            {children}
        </div>
    );
}

/** The same simple screen, as both phones show it. */
function AppScreen() {
    return (
        <>
            <span className="block aspect-[4/3] rounded-[4px] bg-muted" />
            <span className="mt-2 block h-1.5 w-[80%] rounded-[2px] bg-foreground" />
            <TextBar className="mt-1.5 h-1 w-[90%]" />
            <TextBar className="mt-1 h-1 w-[65%]" />
            <span className="mt-2.5 mb-3 block h-3.5 rounded-[3px] bg-foreground" />
        </>
    );
}

/** iOS i Android z jednego kodu: one screen on both phones. */
function CrossPlatformVignette() {
    return (
        <VignetteStage align="bottom">
            <div className="flex items-end gap-4">
                <Phone camera="island">
                    <AppScreen />
                </Phone>
                <Phone camera="hole">
                    <AppScreen />
                </Phone>
            </div>
        </VignetteStage>
    );
}

/** Powiadomienia push: a reminder on the lock screen. */
function PushVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className="flex w-full max-w-[16rem] flex-col items-center">
                <span className="text-2xl leading-none font-semibold tabular-nums">{copy.time}</span>
                <span className="mt-1 text-[10px] text-muted-foreground">{copy.date}</span>
                <span className={cn('mt-3 flex w-full items-center gap-2.5 p-2.5', vignetteCard)}>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                        <Bell aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate font-medium">{copy.reminder}</span>
                        <span className="block truncate text-[10px] text-muted-foreground">{copy.reminderDetail}</span>
                    </span>
                </span>
            </div>
        </VignetteStage>
    );
}

/** Projekt pod kciuk: the order screen in the prototype, its main action within the thumb's reach. */
function ThumbVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage align="top">
            <div className="flex w-full max-w-[16rem] items-start justify-center gap-3">
                <Phone camera="island" className="w-[6.5rem]">
                    <span className="flex flex-col gap-1.5">
                        {[0, 1, 2].map((row) => (
                            <span key={row} className="flex items-center gap-1.5">
                                <span className="size-4 shrink-0 rounded-[3px] bg-muted" />
                                <TextBar className="h-1 flex-1" />
                            </span>
                        ))}
                    </span>
                    <span className="mt-3 flex h-5 items-center justify-center rounded-[4px] bg-foreground text-[9px] font-medium text-background">{copy.order}</span>
                    <span className="mt-2.5 mb-3 flex justify-between px-1">
                        {[0, 1, 2, 3].map((tab) => (
                            <span key={tab} className={cn('size-2 rounded-[2px]', tab === 0 ? 'bg-foreground' : 'bg-foreground/25')} />
                        ))}
                    </span>
                </Phone>
                <span className={cn(vignetteChip, 'mt-6 bg-background')}>{copy.prototype}</span>
            </div>
        </VignetteStage>
    );
}

/** Logowanie i konta: the sign-in screen with Apple, Google and email. */
function SignInVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('flex w-full max-w-[14.5rem] flex-col gap-1.5 p-3', vignetteCard)}>
                <span className="mb-1 font-medium">{copy.signIn}</span>
                <span className="flex h-6 items-center justify-center rounded-[3px] bg-foreground text-[10px] font-medium text-background">{copy.apple}</span>
                <span className="flex h-6 items-center justify-center rounded-[3px] border text-[10px] font-medium">{copy.google}</span>
                <span className="flex h-6 items-center justify-center rounded-[3px] border text-[10px] text-muted-foreground">{copy.email}</span>
            </div>
        </VignetteStage>
    );
}

/** Panel do zarządzania: a push notification sent from the browser panel, no new app version needed. */
function PanelVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] overflow-hidden', vignetteCard)}>
                <VignetteBar>{copy.panel}</VignetteBar>
                <div className="p-3">
                    <span className="block font-medium">{copy.push}</span>
                    <TextBar className="mt-2 w-[85%]" />
                    <span className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">{copy.audience}</span>
                        <span className="flex h-5 items-center rounded-[3px] bg-foreground px-2 text-[10px] font-medium text-background">{copy.send}</span>
                    </span>
                </div>
            </div>
        </VignetteStage>
    );
}

/** Publikacja w sklepach: the new version through both stores' reviews. */
function StoresVignette() {
    const copy = useCopy(COPY);

    return (
        <VignetteStage>
            <div className={cn('w-full max-w-[16rem] overflow-hidden', vignetteCard)}>
                <span className="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
                    <span className="font-medium">{copy.version}</span>
                    <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                </span>
                <ul className="divide-y">
                    {copy.stores.map(({ store, status }) => (
                        <li key={store} className="flex items-center gap-2 px-3 py-2">
                            <DoneTick />
                            <span className="flex-1 font-medium">{store}</span>
                            <span className="text-[10px] text-muted-foreground">{status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </VignetteStage>
    );
}

/** The scope items' vignettes, in the order of MOBILE_COPY's items. */
export const MOBILE_VIGNETTES: ComponentType[] = [CrossPlatformVignette, PushVignette, ThumbVignette, SignInVignette, PanelVignette, StoresVignette];
