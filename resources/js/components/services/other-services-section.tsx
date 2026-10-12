import { bleedClassName, Section } from '@/components/home/section';
import { formatPln, localized, useCopy, useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { OtherService } from '@/types/services';

const COPY = localized({
    pl: { title: 'Pozostałe usługi', from: 'od' },
    en: { title: 'Other services', from: 'from' },
});

const HEADING_ID = 'other-services-heading';

/**
 * The other service pages as cells rail to rail (two per row from md), each a link over the whole cell: the name, one
 * sentence and the price it starts at. Between the FAQ and the contact section, so a visitor on the wrong page finds the
 * right one.
 */
export function OtherServicesSection({ services }: { services: OtherService[] }) {
    const copy = useCopy(COPY);
    const locale = useLocale();

    return (
        <Section labelledBy={HEADING_ID} containerClassName="py-0 md:py-0">
            <h2 id={HEADING_ID} className="sr-only">
                {copy.title}
            </h2>
            {/* An odd last card spans the row, so no cell is left showing the grid's hairline colour. */}
            <ul className={cn('grid gap-px bg-border md:grid-cols-2 md:[&>li:last-child:nth-child(odd)]:col-span-2', bleedClassName)}>
                {services.map((service) => (
                    <li key={service.key} className="group/service relative bg-background transition-colors hover:bg-muted/40">
                        <div className="flex h-full flex-col gap-3 px-4 py-9 sm:px-6 md:py-10 lg:px-10">
                            <h3 className="text-2xl font-semibold tracking-tight md:text-[1.75rem]">
                                <a
                                    href={service.url}
                                    className={cn(
                                        'rounded-sm underline-offset-4 outline-none group-hover/service:underline',
                                        "after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50 focus-visible:after:ring-inset",
                                    )}
                                >
                                    {service.name}
                                </a>
                            </h3>
                            <p className="max-w-[48ch] leading-relaxed text-pretty text-muted-foreground">{service.description}</p>
                            <p className="mt-auto flex items-baseline gap-1.5 pt-4">
                                <span className="text-muted-foreground">{copy.from}</span>
                                <span className="text-lg font-semibold tabular-nums">{formatPln(service.priceFrom, locale)}</span>
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </Section>
    );
}
