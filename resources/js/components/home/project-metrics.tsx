import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { ProjectMetric } from '@/types/home';

const COPY = localized({
    pl: { metrics: 'Projekt w liczbach' },
    en: { metrics: 'The project in numbers' },
});

type ProjectMetricsProps = {
    metrics: ProjectMetric[];
    className?: string;
};

/**
 * Project numbers as a shared-border row (value over label). Renders nothing without metrics.
 */
export function ProjectMetrics({ metrics, className }: ProjectMetricsProps) {
    const copy = useCopy(COPY);

    if (metrics.length === 0) {
        return null;
    }

    const columns = metrics.length === 1 ? 'grid-cols-1' : metrics.length === 2 ? 'grid-cols-2' : 'grid-cols-3';

    return (
        <ul aria-label={copy.metrics} className={cn('grid border-t border-l', columns, className)}>
            {metrics.map((metric) => (
                <li key={`${metric.value}-${metric.label}`} className="flex min-w-0 flex-col gap-1 border-r border-b p-3 md:p-4">
                    <span className="text-lg font-semibold tracking-tight tabular-nums [overflow-wrap:anywhere]">{metric.value}</span>
                    <span className="text-xs leading-snug hyphens-auto text-muted-foreground [overflow-wrap:anywhere] md:text-sm">{metric.label}</span>
                </li>
            ))}
        </ul>
    );
}
