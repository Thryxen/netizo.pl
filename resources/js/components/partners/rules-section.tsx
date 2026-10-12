import { FileText } from 'lucide-react';
import { Section, SectionHeading } from '@/components/home/section';
import { localized, useCopy } from '@/lib/i18n';
import { usePartnerSections } from '@/lib/sections';
import { usePageUrls } from '@/lib/site';
import { RULES } from './partner-data';

const COPY = localized({
    pl: {
        title: 'Zasady programu',
        lead: 'Program działa według regulaminu, który akceptujesz w zgłoszeniu. Najważniejsze punkty są tutaj.',
        fullTerms: 'Przeczytaj pełny regulamin',
    },
    en: {
        title: 'Program terms',
        lead: 'The program runs on the terms you accept when you apply. Here are the key points.',
        fullTerms: 'Read the full terms',
    },
});

/**
 * Zasady (#zasady, #terms): the terms as a definition list, the heading beside them from lg (the FAQ's layout), and the
 * way to the full regulamin under them.
 */
export function RulesSection() {
    const copy = useCopy(COPY);
    const rules = useCopy(RULES);
    const sectionId = usePartnerSections().rules;
    const pageUrls = usePageUrls();

    return (
        <Section id={sectionId} labelledBy={`${sectionId}-heading`}>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
                <SectionHeading id={`${sectionId}-heading`} title={copy.title} lead={copy.lead} className="mb-0 md:mb-0 lg:col-span-4" />

                <div className="lg:col-span-8">
                    <dl className="border-t border-border">
                        {rules.map((rule) => (
                            <div key={rule.term} className="grid gap-1 border-b border-border py-5 sm:grid-cols-[11rem_1fr] sm:gap-8">
                                <dt className="font-medium">{rule.term}</dt>
                                <dd className="max-w-[60ch] leading-relaxed text-pretty text-muted-foreground">{rule.detail}</dd>
                            </div>
                        ))}
                    </dl>
                    <a
                        href={pageUrls.partnerTerms}
                        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 md:min-h-0"
                    >
                        <FileText aria-hidden="true" className="size-4" />
                        {copy.fullTerms}
                    </a>
                </div>
            </div>
        </Section>
    );
}
