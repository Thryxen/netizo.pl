import type { ComponentType } from 'react';
import { bleedClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useServiceSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import type { ServiceCopy } from './service-copy';

/**
 * Where a cell's top hairline meets a rail (rivets are md+): two columns from md (a row starts at every odd cell), three
 * from lg (the second row starts at the fourth cell and ends at the sixth).
 */
const CELL_RIVETS: { side: 'left' | 'right'; className?: string }[][] = [
    [],
    [],
    [{ side: 'left', className: 'lg:hidden' }],
    [
        { side: 'right', className: 'lg:hidden' },
        { side: 'left', className: 'md:hidden lg:block' },
    ],
    [{ side: 'left', className: 'lg:hidden' }],
    [{ side: 'right' }],
];

type ScopeSectionProps = {
    scope: ServiceCopy['scope'];
    /** One vignette per item, in the items' order. */
    vignettes: ComponentType[];
};

/**
 * Co dostajesz w standardzie (#zakres, #whats-included): six items on the shared-border grid rail to rail, one column on
 * phones, two from md, three from lg. Each cell shows its item in use (a vignette on a muted stage), then the title and
 * two sentences. The grid leaves its bottom hairline to the next section.
 */
export function ScopeSection({ scope, vignettes }: ScopeSectionProps) {
    const id = useServiceSections().scope;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={scope.title} lead={scope.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <ul className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
                    {scope.items.map((item, index) => {
                        const Vignette = vignettes[index];

                        return (
                            <li key={item.title} className="relative flex min-w-0 flex-col bg-background px-4 pt-4 pb-8 sm:px-6 sm:pt-6 lg:px-7 lg:pt-7 lg:pb-9">
                                {CELL_RIVETS[index]?.map((rivet) => <Rivet key={`${rivet.side}-${rivet.className ?? 'all'}`} side={rivet.side} className={rivet.className} />)}
                                {Vignette && <Vignette />}
                                <h3 className="mt-6 text-lg font-semibold tracking-tight text-balance sm:text-xl">{item.title}</h3>
                                <p className="mt-2 max-w-[44ch] leading-relaxed text-pretty text-muted-foreground">{item.description}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Section>
    );
}
