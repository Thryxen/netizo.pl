import { FileText, Mail, Phone } from 'lucide-react';
import { Section, SectionHeading } from '@/components/home/section';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { contact } from '@/lib/site';

const COPY = localized({
    pl: {
        title: 'Pytanie o dane albo zasady?',
        lead: 'Napisz albo zadzwoń. Wnioski w sprawie Twoich danych realizujemy bezpłatnie, najpóźniej w ciągu miesiąca.',
        call: 'Zadzwoń',
    },
    en: {
        title: 'A question about your data or the terms?',
        lead: 'Email or call us. We handle requests about your data free of charge, within a month at the latest.',
        call: 'Call',
    },
});

type LegalContactSectionProps = {
    /** The other legal document, linked under the buttons. */
    otherDocument: { href: string; label: string };
};

/** Closing band of a legal page: how to reach us about the document, and the way to the other one. */
export function LegalContactSection({ otherDocument }: LegalContactSectionProps) {
    const copy = useCopy(COPY);

    return (
        <Section labelledBy="legal-contact-heading" className="print:hidden" containerClassName="py-16 md:py-24">
            <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-x-10">
                <SectionHeading id="legal-contact-heading" title={copy.title} lead={copy.lead} className="mb-0 md:mb-0 lg:col-span-7" />

                <div className="grid gap-5 lg:col-span-5 lg:justify-items-end">
                    <div className="flex flex-wrap gap-3">
                        <Button size="lg" className="max-md:h-11" asChild>
                            <a href={`mailto:${contact.email}`}>
                                <Mail aria-hidden="true" />
                                {contact.email}
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" className="max-md:h-11" asChild>
                            <a href={contact.phone.href}>
                                <Phone aria-hidden="true" />
                                <span className="sr-only">{copy.call}: </span>
                                <span className="tabular-nums">{contact.phone.display}</span>
                            </a>
                        </Button>
                    </div>
                    <a
                        href={otherDocument.href}
                        className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm text-muted-foreground underline-offset-4 transition-colors outline-none hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 md:min-h-0"
                    >
                        <FileText aria-hidden="true" className="size-4" />
                        {otherDocument.label}
                    </a>
                </div>
            </div>
        </Section>
    );
}
