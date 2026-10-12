import { CalendarCheck, Printer } from 'lucide-react';
import type { ReactNode } from 'react';
import { CARD, CardRivets } from '@/components/about/card';
import { Logo } from '@/components/home/logo';
import { Container } from '@/components/home/section';
import { Button } from '@/components/ui/button';
import { localized, useCopy, useLocale } from '@/lib/i18n';
import { company, contact } from '@/lib/site';
import { cn } from '@/lib/utils';
import { formatLegalDate } from './legal-format';

const COPY = localized({
    pl: {
        effectiveFrom: 'Obowiązuje od',
        print: 'Drukuj',
        business: 'działalność gospodarcza pod nazwą',
        address: 'Adres',
        nip: 'NIP',
        regon: 'REGON',
        contact: 'Kontakt',
    },
    en: {
        effectiveFrom: 'Effective',
        print: 'Print',
        business: 'sole proprietorship trading as',
        address: 'Address',
        nip: 'Tax ID (NIP)',
        regon: 'REGON',
        contact: 'Contact',
    },
});

const linkClass = 'rounded-sm underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50';

type LegalHeroProps = {
    title: string;
    lead: string;
    /** Who the card names: "Administrator danych" (privacy policy) or "Usługodawca" (terms). */
    partyLabel: string;
    /** The day the document took effect, `YYYY-MM-DD`. */
    effectiveDate: string;
    /** A line under the lead, e.g. that the English text is a translation. */
    note?: ReactNode;
    /** Buttons beside "Print". */
    actions?: ReactNode;
};

/**
 * First screen of a legal document: the title set large, a plain-language lead, the effective date and the print button
 * on the left; on the right the party the document names, as a letterhead card (the about page's company card), so the
 * reader knows from the start who is responsible.
 */
export function LegalHero({ title, lead, partyLabel, effectiveDate, note, actions }: LegalHeroProps) {
    const copy = useCopy(COPY);
    const locale = useLocale();

    const rows: { label: string; value: ReactNode }[] = [
        { label: copy.address, value: `${company.street}, ${company.postalCode} ${company.city}` },
        { label: copy.nip, value: <span className="tabular-nums">{company.nip}</span> },
        { label: copy.regon, value: <span className="tabular-nums">{company.regon}</span> },
        {
            label: copy.contact,
            value: (
                <span className="grid">
                    <a href={`mailto:${contact.email}`} className={cn(linkClass, 'justify-self-start')}>
                        {contact.email}
                    </a>
                    <a href={contact.phone.href} className={cn(linkClass, 'justify-self-start tabular-nums')}>
                        {contact.phone.display}
                    </a>
                </span>
            ),
        },
    ];

    return (
        <section aria-labelledby="legal-heading">
            <Container className="pt-10 pb-14 sm:pt-14 md:pb-20 lg:pt-20">
                <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-7">
                        <h1 id="legal-heading" className="text-[clamp(2.75rem,8vw,4.75rem)] leading-[1] font-semibold tracking-[-0.05em] text-balance">
                            {title}
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl md:leading-relaxed">{lead}</p>
                        {note && (
                            <p className="mt-4 max-w-xl text-sm leading-relaxed text-pretty text-muted-foreground [&_a]:rounded-sm [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:outline-none [&_a]:focus-visible:ring-[3px] [&_a]:focus-visible:ring-ring/50">
                                {note}
                            </p>
                        )}

                        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                            <p className="flex items-center gap-2 text-sm">
                                <CalendarCheck aria-hidden="true" className="size-4" />
                                <span className="text-muted-foreground">{copy.effectiveFrom}</span>
                                <time dateTime={effectiveDate} className="font-medium">
                                    {formatLegalDate(effectiveDate, locale)}
                                </time>
                            </p>
                            <div className="flex flex-wrap gap-2 print:hidden">
                                <Button type="button" variant="outline" className="max-md:h-11" onClick={() => window.print()}>
                                    <Printer aria-hidden="true" />
                                    {copy.print}
                                </Button>
                                {actions}
                            </div>
                        </div>
                    </div>

                    <div className="relative lg:col-span-5 lg:mt-3">
                        <CardRivets />
                        <section aria-label={partyLabel} className={cn(CARD, 'overflow-hidden')}>
                            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
                                <Logo className="h-7" />
                                <span className="text-sm text-muted-foreground">{partyLabel}</span>
                            </div>

                            <div className="border-b border-border px-6 py-5">
                                <p className="text-xl font-semibold tracking-[-0.02em]">{company.owner}</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {copy.business} {company.name}
                                </p>
                            </div>

                            <dl className="divide-y divide-border text-sm">
                                {rows.map((row) => (
                                    <div key={row.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 px-6 py-3.5">
                                        <dt className="text-muted-foreground">{row.label}</dt>
                                        <dd className="min-w-0 break-words">{row.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    </div>
                </div>
            </Container>
        </section>
    );
}
