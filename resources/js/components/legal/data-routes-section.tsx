import type { ReactNode } from 'react';
import { CARD, CardRivets } from '@/components/about/card';
import { Section, SectionHeading } from '@/components/home/section';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type DataRoute = {
    form: string;
    fields: string;
    database: string;
    retention: string;
};

type Column = { title: string; detail: string };

/**
 * The forms of the site and where their data goes. Keep in step with the policy's text (privacy-policy-copy.tsx,
 * sections 2 and 8) and the Form Requests.
 */
const COPY = localized({
    pl: {
        id: 'dokad-trafiaja-dane',
        title: 'Dokąd trafiają dane z formularzy',
        lead: 'Pięć formularzy na stronie, każdy w swoim wierszu: co w nim wpisujesz, gdzie to zapisujemy i jak długo to trzymamy.',
        listLabel: 'Formularze i ich dane',
        columns: {
            form: { title: 'Formularz', detail: 'Co w nim wpisujesz' },
            database: { title: 'Baza danych', detail: 'Na naszym serwerze, w panelu administracyjnym' },
            retention: { title: 'Jak długo', detail: 'Potem usuwamy zgłoszenie' },
        } as Record<'form' | 'database' | 'retention', Column>,
        routes: [
            {
                form: 'Szybka wiadomość',
                fields: 'Imię i nazwisko, e-mail, temat, treść',
                database: 'Całe zgłoszenie',
                retention: '12 miesięcy od ostatniego kontaktu',
            },
            {
                form: 'Brief projektu',
                fields: 'Odpowiedzi o projekcie, imię i nazwisko, e-mail; opcjonalnie telefon, firma, stanowisko, strona',
                database: 'Całe zgłoszenie',
                retention: '12 miesięcy od ostatniego kontaktu',
            },
            {
                form: 'Oddzwonimy do Ciebie',
                fields: 'Numer telefonu',
                database: 'Numer telefonu',
                retention: '12 miesięcy od ostatniego kontaktu',
            },
            {
                form: 'Newsletter',
                fields: 'Adres e-mail',
                database: 'Adres e-mail',
                retention: 'Do wypisania się',
            },
            {
                form: 'Program partnerski',
                fields: 'Imię i nazwisko, e-mail, kim jesteś, kogo polecisz; opcjonalnie telefon',
                database: 'Całe zgłoszenie',
                retention: '12 miesięcy, a po przyjęciu do programu przez czas udziału',
            },
        ] as DataRoute[],
        footnote: 'Do każdego zgłoszenia dopisujemy język strony, z której je wysłano. Adresu IP przy zgłoszeniu nie zapisujemy. Podstawy prawne i szczegóły są w punktach 2 i 8.',
    },
    en: {
        id: 'where-your-data-goes',
        title: 'Where your form data goes',
        lead: 'The five forms on the site, one row each: what you enter, where we store it and how long we keep it.',
        listLabel: 'Forms and their data',
        columns: {
            form: { title: 'Form', detail: 'What you enter' },
            database: { title: 'Database', detail: 'On our server, in our admin panel' },
            retention: { title: 'How long', detail: 'Then we delete the submission' },
        },
        routes: [
            {
                form: 'Quick message',
                fields: 'Name, email, subject, message',
                database: 'The whole submission',
                retention: '12 months after our last contact',
            },
            {
                form: 'Project brief',
                fields: 'Answers about your project, name, email; optionally phone, company, job title, website',
                database: 'The whole submission',
                retention: '12 months after our last contact',
            },
            {
                form: 'We’ll call you back',
                fields: 'Phone number',
                database: 'Phone number',
                retention: '12 months after our last contact',
            },
            {
                form: 'Newsletter',
                fields: 'Email address',
                database: 'Email address',
                retention: 'Until you unsubscribe',
            },
            {
                form: 'Partner program',
                fields: 'Name, email, who you are, who you’ll refer; optionally phone',
                database: 'The whole submission',
                retention: '12 months, or for as long as you take part in the program',
            },
        ],
        footnote: 'Every submission also records the language of the site it came from. We don’t store your IP address with it. The legal bases and details are in sections 2 and 8.',
    },
});

/** The three columns from lg; each row's cells share them through a subgrid, so the rails line up with the header. */
const COLUMNS = 'lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,1.1fr)]';

/** One value of a row: below lg its label beside it, from lg a column under the header (the label only for screen readers). */
function Cell({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 lg:block lg:border-l lg:border-border lg:p-6">
            <dt className="text-sm text-muted-foreground lg:sr-only">{label}</dt>
            <dd className="text-sm leading-snug text-foreground lg:mt-1">{children}</dd>
        </div>
    );
}

/**
 * Dokąd trafiają dane (#dokad-trafiaja-dane, #where-your-data-goes): the privacy policy at a glance, a row per form with
 * what you enter, where we store it and how long we keep it. From lg the values are columns under one header; below lg
 * each row lists them with their labels.
 */
export function DataRoutesSection() {
    const copy = useCopy(COPY);
    const { columns } = copy;

    return (
        <Section id={copy.id} labelledBy={`${copy.id}-heading`}>
            <SectionHeading id={`${copy.id}-heading`} title={copy.title} lead={copy.lead} />

            <div className="relative">
                <CardRivets />
                <div className={CARD}>
                    <div aria-hidden="true" className={cn('hidden border-b border-border lg:grid', COLUMNS)}>
                        {[columns.form, columns.database, columns.retention].map((column, index) => (
                            <div key={column.title} className={cn('px-6 py-5', index > 0 && 'border-l border-border')}>
                                <p className="font-medium">{column.title}</p>
                                <p className="mt-1 text-sm leading-snug text-muted-foreground">{column.detail}</p>
                            </div>
                        ))}
                    </div>

                    <ol aria-label={copy.listLabel} className="divide-y divide-border">
                        {copy.routes.map((route) => (
                            <li key={route.form} className={cn('lg:grid', COLUMNS)}>
                                <div className="px-5 pt-5 sm:px-6 lg:py-6">
                                    <h3 className="text-lg leading-7 font-semibold tracking-[-0.01em]">{route.form}</h3>
                                    <p className="mt-1 text-sm leading-snug text-pretty text-muted-foreground">{route.fields}</p>
                                </div>

                                <dl className="grid gap-2 px-5 pt-4 pb-5 sm:px-6 lg:col-span-2 lg:grid-cols-subgrid lg:gap-0 lg:p-0">
                                    <Cell label={columns.database.title}>{route.database}</Cell>
                                    <Cell label={columns.retention.title}>{route.retention}</Cell>
                                </dl>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-relaxed text-pretty text-muted-foreground">{copy.footnote}</p>
        </Section>
    );
}
