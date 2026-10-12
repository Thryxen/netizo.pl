import { Container, gutterClassName, Rivet } from '@/components/home/section';
import { CountUp } from '@/components/motion';
import { localized, useCopy } from '@/lib/i18n';
import { useCaseStudySections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import type { ProjectMetric } from '@/types/home';

const COPY = localized({
    pl: { title: 'Wyniki' },
    en: { title: 'Results' },
});

/** Columns from sm by the number of results, so every row is full where it can be (one column on phones). */
const COLUMNS: Record<number, string> = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * Wyniki (#wyniki, #results): the project's numbers under the hero, rail to rail, as large figures counting up once in
 * view, hairlines between them (the 1px gaps of the grid). Renders nothing for a project without numbers.
 */
export function CaseStudyResults({ metrics }: { metrics: ProjectMetric[] }) {
    const copy = useCopy(COPY);
    const sectionId = useCaseStudySections().results;

    if (metrics.length === 0) {
        return null;
    }

    return (
        <section id={sectionId} aria-labelledby={`${sectionId}-heading`} className="border-t border-border">
            <h2 id={`${sectionId}-heading`} className="sr-only">
                {copy.title}
            </h2>
            <Container className="px-0 sm:px-0 lg:px-0">
                <Rivet side="left" />
                <Rivet side="right" />
                <ul className={cn('grid gap-px bg-border', COLUMNS[metrics.length] ?? 'sm:grid-cols-3')}>
                    {metrics.map((metric) => (
                        <li key={`${metric.value}-${metric.label}`} className={cn('flex min-w-0 flex-col gap-3 bg-background py-8 sm:py-10 lg:py-12', gutterClassName)}>
                            <CountUp
                                value={metric.value}
                                className="text-[clamp(2.75rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.045em] tabular-nums [overflow-wrap:anywhere]"
                            />
                            <span className="max-w-[28ch] text-sm leading-snug text-pretty text-muted-foreground md:text-base">{metric.label}</span>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}
