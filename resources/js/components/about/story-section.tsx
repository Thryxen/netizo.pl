import { useScroll, useTransform } from 'motion/react';
import { type CSSProperties, useRef } from 'react';
import { Section, SectionHeading } from '@/components/home/section';
import { CountUp, useMotionStyle, useReducedMotionPreference } from '@/components/motion';
import { localized, useCopy } from '@/lib/i18n';
import { useAboutSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { NUMBERS, STORY, visibleItems } from './about-data';
import { CARD, CardRivets } from './card';

const COPY = localized({
    pl: {
        title: 'Historia',
        lead: 'Skąd się wzięliśmy i jak liczymy to, co pokazujemy w liczbach.',
        numbersLabel: 'Netizo w liczbach',
    },
    en: {
        title: 'Our story',
        lead: 'Where we come from, and how we count the figures we show.',
        numbersLabel: 'Netizo in numbers',
    },
});

/** Where each count starts, so a figure never reads as "0 projects" while it runs. */
const COUNT_FROM: Record<string, number> = { '150+': 120, '99,9%': 99, '99.9%': 99 };

/**
 * The rail fills with `--story` (0–1, written by scroll; 1 without JS and under reduced motion), and each entry's marker
 * and year light up as the fill passes it (`--at`: the entry's position on the rail).
 */
const STORY_CSS = `
[data-story] { --story: 1; }
@media (prefers-reduced-motion: no-preference) {
    .js [data-story] { --story: 0; }
}
[data-story-fill] { transform: scaleY(var(--story)); transform-origin: top; }
[data-story-entry] { --lit: clamp(0, calc((var(--story) - var(--at) + 0.06) / 0.12), 1); }
[data-story-dot] { background: color-mix(in oklab, var(--foreground) calc(var(--lit) * 100%), var(--background)); }
[data-story-year] { opacity: calc(0.25 + var(--lit) * 0.75); }
`;

type StorySectionProps = {
    previewSamples: boolean;
};

/**
 * Historia (#historia, #story): the heading stays beside the timeline while it scrolls past (lg); the rail draws itself
 * with the scroll and lights up each milestone, the years set large. Below, the figures count up with how each is
 * counted. Left out of the page while it has no real entries.
 */
export function StorySection({ previewSamples }: StorySectionProps) {
    const copy = useCopy(COPY);
    const story = visibleItems(useCopy(STORY), previewSamples);
    const numbers = visibleItems(useCopy(NUMBERS), previewSamples);
    const sectionId = useAboutSections().story;
    const listRef = useRef<HTMLOListElement>(null);
    const reduced = useReducedMotionPreference();
    const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 70%', 'end 55%'] });
    const progress = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [0, 1]);

    useMotionStyle(listRef, { '--story': progress });

    if (story.length === 0 && numbers.length === 0) {
        return null;
    }


    return (
        <Section id={sectionId} labelledBy={`${sectionId}-heading`}>
            <style>{STORY_CSS}</style>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
                <div className="lg:sticky lg:top-[calc(var(--header-height)+3rem)] lg:col-span-4 lg:self-start">
                    <SectionHeading id={`${sectionId}-heading`} title={copy.title} lead={copy.lead} className="mb-0 md:mb-0" />
                </div>

                {story.length > 0 && (
                    <ol ref={listRef} data-story="" className="relative lg:col-span-8">
                        <span aria-hidden="true" className="absolute top-3 bottom-3 left-[7px] w-px bg-border">
                            <span data-story-fill="" className="block size-full bg-foreground" />
                        </span>
                        {story.map((entry, index) => (
                            <li
                                key={`${entry.year}-${entry.title}`}
                                data-story-entry=""
                                style={{ '--at': story.length > 1 ? index / (story.length - 1) : 0 } as CSSProperties}
                                className="relative pb-16 pl-12 last:pb-0 md:pb-24 md:pl-16"
                            >
                                <span aria-hidden="true" data-story-dot="" className="absolute top-3 left-px size-[13px] border-2 border-foreground" />
                                <span data-story-year="" className="block text-[clamp(3.5rem,9vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.05em] tabular-nums">
                                    {entry.year}
                                </span>
                                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <h3 className="text-2xl leading-tight font-semibold tracking-[-0.02em]">{entry.title}</h3>
                                </div>
                                <p className="mt-3 max-w-[56ch] text-lg leading-relaxed text-pretty text-muted-foreground">{entry.detail}</p>
                            </li>
                        ))}
                    </ol>
                )}
            </div>

            {numbers.length > 0 && (
                <div className="relative mt-20 md:mt-28">
                    <CardRivets />
                    <ul aria-label={copy.numbersLabel} className={cn(CARD, 'grid divide-y divide-border overflow-hidden md:grid-cols-3 md:divide-x md:divide-y-0')}>
                        {numbers.map((entry) => (
                            <li key={entry.label} className="flex flex-col p-8 md:p-10">
                                <span className="flex items-start justify-between gap-3">
                                    <CountUp
                                        value={entry.value}
                                        from={COUNT_FROM[entry.value] ?? 0}
                                        className="text-[3.5rem] leading-none font-semibold tracking-[-0.05em] tabular-nums md:text-[4.5rem]"
                                    />
                                </span>
                                <span className="mt-4 text-lg font-medium">{entry.label}</span>
                                <span className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-pretty text-muted-foreground">{entry.source}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Section>
    );
}
