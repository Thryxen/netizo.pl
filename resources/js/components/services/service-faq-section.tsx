import { FaqAnswer } from '@/components/home/faq-section';
import { useHomeUi } from '@/components/home/home-ui-context';
import { bleedClassName, gutterClassName, Section, SectionHeading } from '@/components/home/section';
import { Accordion, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useServiceSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/types/home';

const COPY = localized({
    pl: {
        lead: 'Nie ma tu Twojego pytania? Napisz, odpowiemy w ciągu 24 godzin.',
        write: 'Napisz do nas',
    },
    en: {
        lead: 'Don’t see your question here? Write to us and we’ll reply within 24 hours.',
        write: 'Write to us',
    },
});

type ServiceFaqSectionProps = {
    title: string;
    faq: FaqItem[];
};

/**
 * Częste pytania (#faq): one box rail to rail between the section hairlines, split by a hairline: the heading and the
 * way to write to us on the left (sticking from lg while the questions scroll), the questions on the right. The answers
 * are always in the server-rendered HTML (FaqAnswer), the same questions as the page's FAQPage JSON-LD.
 */
export function ServiceFaqSection({ title, faq }: ServiceFaqSectionProps) {
    const copy = useCopy(COPY);
    const id = useServiceSections().faq;
    const { openContact } = useHomeUi();

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="py-0 md:py-0">
            {/* The section's hairline is the box's top edge; the next section's is its bottom. */}
            <div className={cn('relative', bleedClassName)}>
                <div className="grid gap-px bg-border lg:grid-cols-12">
                    <div className={cn('bg-background py-12 lg:col-span-5 lg:py-16', gutterClassName)}>
                        <div className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)]">
                            <SectionHeading id={`${id}-heading`} title={title} lead={copy.lead} className="mb-0 md:mb-0">
                                <Button variant="outline" className="mt-8 max-md:h-11" onClick={() => openContact('quick')}>
                                    {copy.write}
                                </Button>
                            </SectionHeading>
                        </div>
                    </div>

                    <div className={cn('bg-background pt-2 pb-8 lg:col-span-7 lg:pt-10 lg:pb-14', gutterClassName)}>
                        <Accordion type="single" collapsible>
                            {faq.map((item, index) => (
                                <AccordionItem key={item.question} value={`faq-${index}`}>
                                    <AccordionTrigger className="gap-3 py-5 text-base leading-snug font-medium hover:text-foreground/75 hover:no-underline md:text-lg">
                                        <span className="flex-1">{item.question}</span>
                                    </AccordionTrigger>
                                    <FaqAnswer>{item.answer}</FaqAnswer>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </Section>
    );
}
