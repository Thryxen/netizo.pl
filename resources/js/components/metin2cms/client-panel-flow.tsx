import { Check, Download, FileArchive, FolderDown, Paperclip, Plus, Send } from 'lucide-react';
import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from 'react';
import { PANEL_TEXT } from '@/components/home/panel/panel-data';
import { PanelStyles } from '@/components/home/panel/panel-styles';
import { PanelMark, PanelWindow } from '@/components/home/panel/panel-window';
import { WINDOW_SHADOW } from '@/components/home/scenes/scene-parts';
import { useLiveLoop } from '@/components/motion/use-in-view-loop';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * The bug: reported → taken → fixed. The idea: added → quoted → the quote accepted → taken → done (static frame). Then
 * the client opens "Pliki" and downloads the new version of the code → fade out. The steps up to the done idea also
 * post their message in the chat.
 */
const PHASE_MS = [1900, 2000, 2000, 2000, 2200, 1800, 1800, 2800, 2200, 3800, 900] as const;
const BUG_DOING = 1;
const BUG_DONE = 2;
const IDEA_NEW = 3;
const IDEA_QUOTED = 4;
const IDEA_ACCEPTED = 5;
const IDEA_DOING = 6;
const IDEA_DONE = 7;
const FILES = 8;
const DOWNLOADED = 9;
const RESET = 10;

/** Three columns at every width, unlike the home page's board (its "Pilne" column is left out). */
const BOARD_VARIABLES = { '--panel-cols': 3, '--panel-col-shift': 0 } as CSSProperties;

const COPY = localized({
    pl: {
        label: 'Podgląd panelu klienta: błąd zgłoszony jako zadanie przechodzi do kolumny Gotowe, a pomysł na nową funkcję dostaje wycenę i po akceptacji trafia do realizacji; obok czat z zespołem. Na końcu klient otwiera zakładkę Pliki i pobiera nową wersję kodu.',
        columns: ['Do zrobienia', 'W trakcie', 'Gotowe'],
        bug: { title: 'Ranking gildii nie pokazuje nowych gildii', category: 'Błąd', file: 'zrzut.png' },
        idea: { title: 'Koło fortuny dla graczy', category: 'Nowa funkcja', toQuote: 'Do wyceny', quote: '220 zł · 3 dni', accept: 'Akceptuj', accepted: 'Zaakceptowano' },
        online: 'online',
        placeholder: 'Napisz wiadomość',
        messages: [
            { own: true, text: 'Ranking gildii nie pokazuje nowych gildii. Zrzut dodałem do zadania.' },
            { own: false, text: 'Mamy to. Ranking czytał stary cache, poprawiamy.' },
            { own: false, text: 'Poprawka wdrożona. Sprawdź, proszę.' },
            { own: true, text: 'Mam pomysł: koło fortuny dla graczy.' },
            { own: false, text: 'Wyceniliśmy: 220 zł netto, 3 dni robocze.' },
            { own: true, text: 'Akceptuję, działajcie.' },
            { own: false, text: 'Zaczynamy. Damy znać, gdy będzie gotowe.' },
            { own: false, text: 'Gotowe i wdrożone. Nowa wersja kodu czeka w zakładce Pliki.' },
        ],
        files: { title: 'Pliki', count: '3 pliki', kind: 'Kod źródłowy', fresh: 'nowa', download: 'Pobierz', downloaded: 'Pobrano' },
    },
    en: {
        label: 'Client portal preview: a bug reported as a task moves to the Done column, and an idea for a new feature gets a quote and, once accepted, goes into work; beside them the team chat. At the end the client opens Files and downloads the new version of the code.',
        columns: ['To do', 'In progress', 'Done'],
        bug: { title: 'The guild ranking does not show new guilds', category: 'Bug', file: 'screenshot.png' },
        idea: { title: 'A wheel of fortune for players', category: 'New feature', toQuote: 'To be quoted', quote: 'PLN 220 · 3 days', accept: 'Accept', accepted: 'Accepted' },
        online: 'online',
        placeholder: 'Write a message',
        messages: [
            { own: true, text: 'The guild ranking does not show new guilds. I added a screenshot to the task.' },
            { own: false, text: 'On it. The ranking was reading a stale cache, we are fixing it.' },
            { own: false, text: 'The fix is deployed. Please take a look.' },
            { own: true, text: 'I have an idea: a wheel of fortune for players.' },
            { own: false, text: 'Our quote: PLN 220 net, 3 working days.' },
            { own: true, text: 'Accepted, go ahead.' },
            { own: false, text: 'Starting. We will let you know when it is ready.' },
            { own: false, text: 'Done and deployed. The new version of the code is under Files.' },
        ],
        files: { title: 'Files', count: '3 files', kind: 'Source code', fresh: 'new', download: 'Download', downloaded: 'Downloaded' },
    },
});

/** The archives on the panel's "Pliki" page, the newest first (the names are the same in both languages). */
const ARCHIVES = ['metin2cms-v1.0.5.zip', 'metin2cms-v1.0.4.zip', 'metin2cms-v1.0.3.zip'] as const;

/** The column a task sits in: to do until `doing`, in progress until `done`, then done. */
const columnAt = (step: number, doing: number, done: number): number => (step >= done ? 2 : step >= doing ? 1 : 0);

/**
 * The client panel looking after a server, in the home page's panel window (its real chrome: address, sidebar, top
 * bar), while in view. Two tasks cross the board: a bug the client reports goes from to do to done, then an idea for a
 * new feature is added in its category, gets a quote, the client accepts it and it goes into work. The team chat
 * beside the board says each step. At the end the client opens the "Pliki" page (an extra item of the sidebar) and
 * downloads the new version of the code (the code is handed over in the panel, not as a repository). Amounts, tasks
 * and files are examples (the caption says so). The static frame is the board with both tasks done.
 */
export function ClientPanelFlow({ className }: { className?: string }) {
    const { ref, step, active } = useLiveLoop<HTMLElement>(PHASE_MS, { staticStep: IDEA_DONE });
    const copy = useCopy(COPY);
    const text = useCopy(PANEL_TEXT);
    const visible = step !== RESET;
    const filesOpen = step === FILES || step === DOWNLOADED;
    const ideaShown = visible && step >= IDEA_NEW;
    /* While faded out the tasks are already back in the first column. */
    const bugColumn = visible ? columnAt(step, BUG_DOING, BUG_DONE) : 0;
    const ideaColumn = visible ? columnAt(step, IDEA_DOING, IDEA_DONE) : 0;
    const tasksIn = (column: number): number => (visible && bugColumn === column ? 1 : 0) + (ideaShown && ideaColumn === column ? 1 : 0);
    /* While faded out the chat keeps its messages, so it fades as a whole. */
    const messageCount = visible ? Math.min(step + 1, copy.messages.length) : copy.messages.length;
    const chatRef = useRef<HTMLDivElement>(null);

    /* The chat is bottom-anchored: a new message would make the older ones jump up, so the list starts one message lower and glides into place. */
    useLayoutEffect(() => {
        const list = chatRef.current;
        const latest = list?.lastElementChild;

        if (!active || !visible || !list || !(latest instanceof HTMLElement)) {
            return;
        }

        const shift = latest.offsetHeight + (parseFloat(getComputedStyle(list).rowGap) || 0);
        const glide = list.animate([{ transform: `translateY(${shift}px)` }, { transform: 'none' }], { duration: 640, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });

        return () => glide.cancel();
    }, [active, visible, messageCount]);

    return (
        <figure
            ref={ref}
            data-panel-stage=""
            data-panel-live={active ? '' : undefined}
            className={cn('@container/panel relative overflow-hidden rounded-lg bg-muted select-none', className)}
        >
            <PanelStyles />

            <div data-panel-viewport="" className="relative">
                <div role="img" aria-label={copy.label} className={WINDOW_SHADOW}>
                    <PanelWindow mode="project" extra={{ icon: FolderDown, label: copy.files.title, active: filesOpen }} notify={step === BUG_DONE || step === IDEA_QUOTED || step === IDEA_DONE}>
                        <div className="flex flex-col gap-[1.2em] @min-[41.25rem]/panel:flex-row">
                            {/* The board and the files page share one cell, so opening "Pliki" never changes the window's size. */}
                            <div className="grid min-w-0 flex-1">
                                <div data-show={!filesOpen} className="col-start-1 row-start-1 flex min-w-0 flex-col transition-opacity duration-500 data-[show=false]:opacity-0">
                                    <div className="flex h-[2.6em] items-center justify-between gap-[1em]">
                                        <span className="text-[1.45em] leading-none font-semibold tracking-tight">{text.pages.project}</span>
                                        <span
                                            key={step === IDEA_NEW ? 'pressed' : 'idle'}
                                            className={cn(
                                                'flex h-[2.6em] shrink-0 items-center gap-[0.45em] rounded-[0.45em] bg-foreground px-[0.95em] text-background',
                                                step === IDEA_NEW && 'nz-panel-press',
                                            )}
                                        >
                                            <Plus className="size-[1.1em]" strokeWidth={2.25} />
                                            <span className="text-[1.02em] font-medium whitespace-nowrap">{text.addTask}</span>
                                        </span>
                                    </div>

                                    <div style={BOARD_VARIABLES} className="relative mt-[1.2em]">
                                        <div data-panel-columns="" className="grid">
                                            {copy.columns.map((name, index) => (
                                                <div key={name} className="flex min-w-0 flex-col">
                                                    <div className="flex h-[2.3em] items-center gap-[0.55em] px-[0.2em]">
                                                        <span className={cn('size-[0.55em] shrink-0 rounded-[0.1em]', index === 1 ? 'bg-foreground' : 'bg-foreground/30')} />
                                                        <span className="truncate text-[1em] font-medium">{name}</span>
                                                        <span className="ml-auto text-[0.92em] text-muted-foreground tabular-nums">{tasksIn(index)}</span>
                                                    </div>
                                                    <div className="h-[19em] rounded-[0.6em] bg-muted/70 dark:bg-muted/45" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* The tasks live in one layer over the column bodies, so moving between columns is a transform. */}
                                        <div className="pointer-events-none absolute inset-x-0 top-[2.3em]">
                                            <TaskSlot column={bugColumn} slot={ideaShown && ideaColumn === bugColumn ? 1 : 0}>
                                                <TaskCard id={27} title={copy.bug.title} category={copy.bug.category} shown={visible} done={step >= BUG_DONE} taken={step >= BUG_DOING}>
                                                    <span className="flex min-w-0 items-center gap-[0.3em] rounded-[0.3em] border px-[0.4em] py-[0.15em] text-foreground/80">
                                                        <Paperclip className="size-[1em] shrink-0" strokeWidth={2} />
                                                        <span className="truncate">{copy.bug.file}</span>
                                                    </span>
                                                </TaskCard>
                                            </TaskSlot>
                                            <TaskSlot column={ideaColumn} slot={0}>
                                                <TaskCard id={28} title={copy.idea.title} category={copy.idea.category} shown={ideaShown} done={step >= IDEA_DONE} taken={step >= IDEA_DOING}>
                                                    {step < IDEA_QUOTED && <span className="nz-panel-roll truncate rounded-[0.3em] border border-dashed px-[0.4em] py-[0.15em]">{copy.idea.toQuote}</span>}
                                                    {step === IDEA_QUOTED && (
                                                        <span className="nz-panel-roll flex min-w-0 items-center gap-[0.45em]">
                                                            <span className="truncate font-medium text-foreground tabular-nums">{copy.idea.quote}</span>
                                                            <span className="shrink-0 rounded-[0.3em] bg-foreground px-[0.5em] py-[0.15em] font-medium text-background">{copy.idea.accept}</span>
                                                        </span>
                                                    )}
                                                    {step >= IDEA_ACCEPTED && (
                                                        <span className="nz-panel-roll flex min-w-0 items-center gap-[0.3em] text-foreground">
                                                            <Check className="size-[1em] shrink-0" strokeWidth={2.5} />
                                                            <span className="truncate">{copy.idea.accepted}</span>
                                                        </span>
                                                    )}
                                                </TaskCard>
                                            </TaskSlot>
                                        </div>
                                    </div>

                                </div>
                                <FilesPage show={filesOpen} downloaded={step === DOWNLOADED} />
                            </div>

                            <div className="flex flex-col rounded-[0.6em] border @min-[41.25rem]/panel:w-[21em] @min-[41.25rem]/panel:shrink-0">
                                <div className="flex h-[3em] shrink-0 items-center gap-[0.6em] border-b px-[0.9em]">
                                    <PanelMark className="size-[1.7em]" />
                                    <span className="truncate text-[1.02em] font-medium">{text.teamChat}</span>
                                    <span className="ml-auto flex shrink-0 items-center gap-[0.4em] text-[0.9em] text-muted-foreground">
                                        <span className="nz-panel-pulse size-[0.5em] rounded-full bg-foreground" />
                                        {copy.online}
                                    </span>
                                </div>
                                {/* Bottom-anchored: older messages leave through the top edge. */}
                                <div className="flex h-[15em] flex-col justify-end overflow-hidden p-[0.8em] @min-[41.25rem]/panel:h-auto @min-[41.25rem]/panel:min-h-0 @min-[41.25rem]/panel:flex-1 @min-[41.25rem]/panel:basis-0">
                                    <div ref={chatRef} data-show={visible} className="flex shrink-0 flex-col gap-[0.55em] transition-opacity duration-500 data-[show=false]:opacity-0">
                                        {copy.messages.slice(0, messageCount).map((message) => (
                                            <span
                                                key={message.text}
                                                className={cn(
                                                    'max-w-[88%] shrink-0 rounded-[0.7em] px-[0.8em] py-[0.55em] text-[0.98em] leading-[1.35]',
                                                    message.own ? 'self-end rounded-br-[0.2em] bg-foreground text-background' : 'self-start rounded-bl-[0.2em] bg-muted',
                                                )}
                                            >
                                                {message.text}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex h-[3em] shrink-0 items-center gap-[0.6em] border-t px-[0.9em] text-[0.95em] text-muted-foreground">
                                    <span className="truncate">{copy.placeholder}</span>
                                    <Send className="ml-auto size-[1.1em] shrink-0" strokeWidth={1.75} />
                                </div>
                            </div>
                        </div>
                    </PanelWindow>
                </div>

                <figcaption className="mt-[1.6em] w-fit rounded-[3px] border bg-background px-2 py-1 text-xs leading-none text-muted-foreground">{text.sampleData}</figcaption>
            </div>
        </figure>
    );
}

/**
 * The panel's "Pliki" page: the code of each released version as an archive, the newest on top. The client downloads
 * the new one (its button turns into "Pobrano").
 */
function FilesPage({ show, downloaded }: { show: boolean; downloaded: boolean }) {
    const copy = useCopy(COPY).files;

    return (
        <div data-show={show} className="col-start-1 row-start-1 flex min-w-0 flex-col transition-opacity duration-500 data-[show=false]:opacity-0">
            <div className="flex h-[2.6em] items-center justify-between gap-[1em]">
                <span className="text-[1.45em] leading-none font-semibold tracking-tight">{copy.title}</span>
                <span className="text-[0.95em] text-muted-foreground">{copy.count}</span>
            </div>

            <ul className="mt-[1.2em] flex flex-col rounded-[0.6em] border">
                {ARCHIVES.map((name, index) => (
                    <li key={name} className="flex items-center gap-[0.9em] border-b px-[0.9em] py-[0.85em] last:border-b-0">
                        <span className="flex size-[2.6em] shrink-0 items-center justify-center rounded-[0.45em] bg-muted">
                            <FileArchive className="size-[1.25em]" strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-[0.5em]">
                                <span className="truncate text-[1.02em] font-medium">{name}</span>
                                {index === 0 && <span className="shrink-0 rounded-[0.3em] bg-foreground px-[0.45em] py-[0.1em] text-[0.82em] font-medium text-background">{copy.fresh}</span>}
                            </span>
                            <span className="block truncate text-[0.92em] text-muted-foreground">{copy.kind}</span>
                        </span>
                        {index === 0 && downloaded ? (
                            <span className="nz-panel-roll flex h-[2.4em] shrink-0 items-center gap-[0.45em] rounded-[0.45em] border px-[0.8em] text-[0.95em] font-medium whitespace-nowrap">
                                <Check className="size-[1.05em]" strokeWidth={2.5} />
                                {copy.downloaded}
                            </span>
                        ) : (
                            <span className={cn('flex h-[2.4em] shrink-0 items-center gap-[0.45em] rounded-[0.45em] px-[0.8em] text-[0.95em] font-medium whitespace-nowrap', index === 0 ? 'bg-foreground text-background' : 'border')}>
                                <Download className="size-[1.05em]" strokeWidth={2} />
                                {copy.download}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** One column wide, positioned by column and slot (styles: [data-panel-card], as on the home page's board). */
function TaskSlot({ column, slot, children }: { column: number; slot: number; children: ReactNode }) {
    return (
        <div data-panel-card="" style={{ '--col': column, '--slot': slot } as CSSProperties} className="absolute top-[0.4em] left-0 px-[0.4em]">
            {children}
        </div>
    );
}

type TaskCardProps = {
    id: number;
    title: string;
    category: string;
    shown: boolean;
    done: boolean;
    /** Netizo is on it (the team's mark shows). */
    taken: boolean;
    /** The card's footer: an attachment, or where the quote stands. */
    children: ReactNode;
};

/** A task of the board, drawn like the home page's cards, with its category in place of the priority. */
function TaskCard({ id, title, category, shown, done, taken, children }: TaskCardProps) {
    return (
        <div
            data-show={shown}
            className="flex h-(--panel-card-h) flex-col rounded-[0.55em] border bg-background px-[0.62em] pt-[0.6em] pb-[0.55em] shadow-[0_0.06em_0.15em_rgb(0_0_0/0.05)] transition-opacity duration-500 data-[show=false]:opacity-0 dark:shadow-none"
        >
            <div className="flex h-[1.5em] items-center justify-between gap-[0.5em]">
                <span className="flex items-center gap-[0.35em] text-[0.92em] text-muted-foreground tabular-nums">
                    {done && (
                        <span className="flex size-[1.05em] items-center justify-center rounded-[0.2em] bg-foreground text-background">
                            <Check className="size-[0.8em]" strokeWidth={3} />
                        </span>
                    )}
                    #{id}
                </span>
                <span className="flex h-[1.6em] min-w-0 items-center rounded-[0.3em] border px-[0.4em] text-[0.86em] text-foreground/80">
                    <span className="truncate">{category}</span>
                </span>
            </div>
            <p className="mt-[0.3em] line-clamp-2 text-[1.04em] leading-[1.3] font-medium">{title}</p>
            <div className="mt-auto flex h-[1.8em] items-center justify-between gap-[0.5em] text-[0.88em] text-muted-foreground">
                {children}
                <span data-show={taken} className="ml-auto flex shrink-0 transition-[opacity,scale] duration-500 ease-expo-out data-[show=false]:scale-50 data-[show=false]:opacity-0">
                    <PanelMark className="size-[1.6em] rounded-[0.25em]" />
                </span>
            </div>
        </div>
    );
}
