import { Phone } from 'lucide-react';
import { Section, SectionHeading } from '@/components/home/section';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useHomeSections } from '@/lib/sections';
import { contact, usePageUrls } from '@/lib/site';

const COPY = localized({
    pl: {
        title: 'Opowiedz nam o swoim projekcie',
        lead: 'Napisz, czego potrzebujesz, albo zadzwoń. Odpowiadamy w ciągu 24 godzin, a pierwsza wycena jest bezpłatna.',
        quote: 'Wyceń projekt',
        call: 'Zadzwoń',
    },
    en: {
        title: 'Tell us about your project',
        lead: 'Write what you need, or give us a call. We reply within 24 hours, and the first quote is free.',
        quote: 'Get a quote',
        call: 'Call',
    },
});

const HEADING_ID = 'projects-cta-heading';

/**
 * Closing call to action of the project pages: the heading and lead on the left, the two ways to get in touch (the
 * contact form on the home page, the phone) on the right, under the last hairline before the footer.
 */
export function ProjectsCtaSection() {
    const copy = useCopy(COPY);
    const homeSections = useHomeSections();
    const pageUrls = usePageUrls();

    return (
        <Section labelledBy={HEADING_ID}>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
                <SectionHeading id={HEADING_ID} title={copy.title} lead={copy.lead} className="mb-0 md:mb-0 lg:col-span-8" />
                <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
                    <Button size="lg" className="max-md:h-11" asChild>
                        <a href={`${pageUrls.home}#${homeSections.contact}`}>{copy.quote}</a>
                    </Button>
                    <Button size="lg" variant="outline" className="max-md:h-11" asChild>
                        <a href={contact.phone.href}>
                            <Phone aria-hidden="true" />
                            <span className="sr-only">{copy.call}: </span>
                            <span className="tabular-nums">{contact.phone.display}</span>
                        </a>
                    </Button>
                </div>
            </div>
        </Section>
    );
}
