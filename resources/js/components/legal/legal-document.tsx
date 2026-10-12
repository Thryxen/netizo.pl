import { ChevronDown } from 'lucide-react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Section } from '@/components/home/section';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const COPY = localized({
    pl: {
        contents: 'Spis treści',
    },
    en: {
        contents: 'Contents',
    },
});

/** One numbered part of a legal document; `body` is the text, set by `.legal-prose` (app.css). */
export type LegalSection = {
    /** Anchor id in the page's language; the heading gets `${id}-heading`. */
    id: string;
    title: string;
    body: ReactNode;
};

/** A legal document in one language: the page's header and hero copy, and its sections. */
export type LegalDocumentCopy = {
    /** Shown beside the logo in the header. */
    pageName: string;
    title: string;
    lead: string;
    /** Who the hero's card names: the data controller (privacy policy) or the service provider (terms). */
    partyLabel: string;
    /** A line under the lead; on the English pages, that the Polish text is the binding one. */
    note: ReactNode;
    /** The sections linked from the header, from lg. */
    headerSections: { id: string; label: string }[];
    sections: LegalSection[];
};

/** The terms number their parts like a Polish regulamin ("§ 3"), the privacy policy plainly ("3."). */
export type LegalNumbering = 'paragraph' | 'decimal';

const focusRing = 'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

function sectionNumber(index: number, numbering: LegalNumbering): string {
    return numbering === 'paragraph' ? `§ ${index + 1}` : `${index + 1}.`;
}

/**
 * The section in the reading band near the top of the window (the first one when several are), for the contents list.
 * Null before the document is reached, and on the server.
 */
function useCurrentSection(ids: string[]): string | null {
    const [current, setCurrent] = useState<string | null>(null);

    useEffect(() => {
        const elements = ids.map((id) => document.getElementById(id)).filter((element) => element !== null);

        if (elements.length === 0 || typeof IntersectionObserver === 'undefined') {
            return;
        }

        const inBand = new Set<string>();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => (entry.isIntersecting ? inBand.add(entry.target.id) : inBand.delete(entry.target.id)));

                const first = ids.find((id) => inBand.has(id));

                if (first) {
                    setCurrent(first);
                }
            },
            { rootMargin: '-20% 0px -65% 0px' },
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, [ids]);

    return current;
}

type ContentsListProps = {
    sections: LegalSection[];
    numbering: LegalNumbering;
    current: string | null;
    className?: string;
};

function ContentsList({ sections, numbering, current, className }: ContentsListProps) {
    return (
        <ol className={cn('grid border-l border-border text-sm', className)}>
            {sections.map((section, index) => {
                const isCurrent = section.id === current;

                return (
                    <li key={section.id}>
                        <a
                            href={`#${section.id}`}
                            aria-current={isCurrent ? 'location' : undefined}
                            className={cn(
                                '-ml-px flex min-h-11 items-baseline gap-3 rounded-r-sm border-l py-2 pr-2 pl-4 leading-snug transition-colors lg:min-h-0 lg:py-1.5',
                                isCurrent ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
                                focusRing,
                            )}
                        >
                            <span className="min-w-7 shrink-0 tabular-nums">{sectionNumber(index, numbering)}</span>
                            <span>{section.title}</span>
                        </a>
                    </li>
                );
            })}
        </ol>
    );
}

type LegalDocumentProps = {
    sections: LegalSection[];
    numbering: LegalNumbering;
};

/**
 * The text of a legal document: numbered sections with the number hanging beside the heading, the text kept to a
 * reading measure. The contents list sits in the left margin from lg (sticky, following the section being read) and
 * opens from a disclosure above the text below lg. Printing leaves the text alone.
 */
export function LegalDocument({ sections, numbering }: LegalDocumentProps) {
    const copy = useCopy(COPY);
    const ids = useMemo(() => sections.map((section) => section.id), [sections]);
    const current = useCurrentSection(ids);

    return (
        <Section containerClassName="py-14 md:py-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-10">
                <nav aria-label={copy.contents} className="print:hidden lg:col-span-3">
                    <details className="group border border-border bg-card lg:hidden">
                        <summary className={cn('flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 font-medium [&::-webkit-details-marker]:hidden', focusRing)}>
                            {copy.contents}
                            <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground transition-transform duration-300 ease-expo-out group-open:rotate-180" />
                        </summary>
                        <ContentsList sections={sections} numbering={numbering} current={current} className="mx-4 mb-4" />
                    </details>

                    <div className="sticky top-[calc(var(--header-height)+2.5rem)] hidden max-h-[calc(100dvh-var(--header-height)-5rem)] overflow-y-auto pb-2 lg:block">
                        <p className="mb-4 text-sm font-medium">{copy.contents}</p>
                        <ContentsList sections={sections} numbering={numbering} current={current} />
                    </div>
                </nav>

                <div className="min-w-0 lg:col-span-9">
                    {sections.map((section, index) => (
                        <section
                            key={section.id}
                            id={section.id}
                            aria-labelledby={`${section.id}-heading`}
                            className="border-t border-border py-10 first:border-t-0 first:pt-0 last:pb-0 md:py-12"
                        >
                            <h2
                                id={`${section.id}-heading`}
                                tabIndex={-1}
                                className="flex gap-3 text-2xl leading-tight font-semibold tracking-[-0.025em] text-balance outline-none sm:grid sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-0 md:text-[1.75rem]"
                            >
                                <span className="shrink-0 font-medium text-muted-foreground tabular-nums">{sectionNumber(index, numbering)}</span>
                                <span>{section.title}</span>
                            </h2>
                            <div className="mt-5 sm:pl-[4.5rem]">
                                <div className="legal-prose max-w-[68ch]">{section.body}</div>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </Section>
    );
}
