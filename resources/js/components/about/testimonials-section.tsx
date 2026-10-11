import { Section, SectionHeading } from '@/components/home/section';
import { Marquee } from '@/components/motion';
import { localized, useCopy } from '@/lib/i18n';
import { useAboutSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { type Testimonial, TESTIMONIALS, visibleItems } from './about-data';
import { CARD } from './card';

const COPY = localized({
    pl: {
        title: 'Opinie klientów',
        lead: 'Co mówią firmy, z którymi pracowaliśmy.',
        openQuote: '„',
        closeQuote: '”',
    },
    en: {
        title: 'What clients say',
        lead: 'In the words of the companies we have worked with.',
        openQuote: '“',
        closeQuote: '”',
    },
});

type TestimonialsSectionProps = {
    previewSamples: boolean;
};

/**
 * Opinie (#opinie, #reviews): client testimonials as a slow loop of cards (it pauses on hover and focus; a static grid
 * under reduced motion). Real testimonials only, with the client's name and company and their consent;
 * left out of the page while there are none (no review markup either).
 */
export function TestimonialsSection({ previewSamples }: TestimonialsSectionProps) {
    const copy = useCopy(COPY);
    const testimonials = visibleItems(useCopy(TESTIMONIALS), previewSamples);
    const sectionId = useAboutSections().reviews;

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <Section id={sectionId} labelledBy={`${sectionId}-heading`}>
            <SectionHeading id={`${sectionId}-heading`} title={copy.title} lead={copy.lead} />

            <Marquee
                duration={70}
                fallback={<TestimonialGrid testimonials={testimonials} copy={copy} />}
                className="-mx-4 [--marquee-gap:1.5rem] [--mask-fade:4rem] sm:-mx-6 lg:-mx-10"
                rowClassName="py-2"
            >
                <ul className="flex gap-[var(--marquee-gap)]">
                    {testimonials.map((testimonial, index) => (
                        <li key={index} className={cn(CARD, 'flex w-[19rem] shrink-0 sm:w-[24rem]')}>
                            <TestimonialCard testimonial={testimonial} copy={copy} />
                        </li>
                    ))}
                </ul>
            </Marquee>
        </Section>
    );
}

type QuoteMarks = { openQuote: string; closeQuote: string };

function TestimonialCard({ testimonial, copy }: { testimonial: Testimonial; copy: QuoteMarks }) {
    return (
        <figure className="flex flex-1 flex-col gap-6 p-8">
            <blockquote className="text-lg leading-relaxed text-pretty">
                {copy.openQuote}
                {testimonial.quote}
                {copy.closeQuote}
            </blockquote>
            <figcaption className="mt-auto border-t border-border pt-5 text-sm">
                <span className="block font-medium">{testimonial.author}</span>
                <span className="block text-muted-foreground">{testimonial.company}</span>
            </figcaption>
        </figure>
    );
}

/** Reduced motion and no-JS: the testimonials as a grid of cards. */
function TestimonialGrid({ testimonials, copy }: { testimonials: Testimonial[]; copy: QuoteMarks }) {
    return (
        <ul className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
                <li key={index} className={cn(CARD, 'flex')}>
                    <TestimonialCard testimonial={testimonial} copy={copy} />
                </li>
            ))}
        </ul>
    );
}
