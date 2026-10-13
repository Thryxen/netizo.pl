import { Quote } from 'lucide-react';
import { type Testimonial, TESTIMONIALS, visibleItems } from '@/components/about/about-data';
import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { localized, useCopy } from '@/lib/i18n';
import { useLesznoSections } from '@/lib/sections';
import { cn } from '@/lib/utils';

const COPY = localized({
    pl: {
        title: 'Co mówią klienci',
        lead: 'Prawdziwe opinie, które klienci zatwierdzili do publikacji, podpisane nazwą ich firmy.',
        openQuote: '„',
        closeQuote: '”',
    },
    en: {
        title: 'What clients say',
        lead: 'Real testimonials our clients approved for publication, signed with the name of their company.',
        openQuote: '“',
        closeQuote: '”',
    },
});

type QuoteMarks = { openQuote: string; closeQuote: string };

/**
 * Opinie (#opinie, #reviews): the about page's testimonials (real ones only, approved by each client) on the
 * shared-border grid, rail to rail. The first, Treepro's, from the region, is the large one over two columns. No review
 * markup: the page carries no rating of its own.
 */
export function ReviewsSection() {
    const copy = useCopy(COPY);
    const testimonials = visibleItems(useCopy(TESTIMONIALS), false);
    const id = useLesznoSections().reviews;

    if (testimonials.length === 0) {
        return null;
    }

    const [featured, ...others] = testimonials;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                {/* An odd last card spans the row (md), so no cell is left showing the grid's hairline colour. */}
                <ul className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3 max-lg:md:[&>li:last-child:nth-child(even)]:col-span-2">
                    <li className="flex bg-background md:col-span-2">
                        <TestimonialFigure testimonial={featured} copy={copy} featured />
                    </li>
                    {others.map((testimonial) => (
                        <li key={testimonial.author} className="flex bg-background">
                            <TestimonialFigure testimonial={testimonial} copy={copy} />
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
}

function TestimonialFigure({ testimonial, copy, featured = false }: { testimonial: Testimonial; copy: QuoteMarks; featured?: boolean }) {
    return (
        <figure className={cn('flex flex-1 flex-col gap-8 pt-8 pb-10 lg:pt-10 lg:pb-12', gutterClassName)}>
            {featured && <Quote aria-hidden="true" className="size-8 text-muted-foreground" strokeWidth={1.5} />}
            <blockquote
                className={cn(
                    'text-pretty',
                    featured ? 'max-w-[34ch] text-[clamp(1.375rem,2.4vw,2rem)] leading-[1.3] font-medium tracking-[-0.02em]' : 'text-lg leading-relaxed',
                )}
            >
                {copy.openQuote}
                {testimonial.quote}
                {copy.closeQuote}
            </blockquote>
            <figcaption className="mt-auto text-sm">
                <span className="block font-medium">{testimonial.author}</span>
                <span className="block text-muted-foreground">{testimonial.company}</span>
            </figcaption>
        </figure>
    );
}
