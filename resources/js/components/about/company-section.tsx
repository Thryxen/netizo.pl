import { Check, Copy } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/home/logo';
import { Section, SectionHeading } from '@/components/home/section';
import { localized, useCopy } from '@/lib/i18n';
import { useAboutSections } from '@/lib/sections';
import { company, contact } from '@/lib/site';
import { cn } from '@/lib/utils';
import { fullName, PEOPLE } from './about-data';
import { CARD, CardRivets } from './card';

const COPY = localized({
    pl: {
        title: 'Dane firmy',
        lead: 'Wszystko, czego potrzebujesz do umowy i faktury. Skopiujesz je jednym kliknięciem.',
        cardLabel: 'Dane firmy Netizo',
        name: 'Nazwa',
        business: 'Przedsiębiorca',
        businessNote: 'działalność gospodarcza pod nazwą',
        founders: 'Współzałożyciele',
        address: 'Adres rejestrowy',
        addressNote: 'Bez biura dla klientów',
        nip: 'NIP',
        regon: 'REGON',
        email: 'E-mail',
        phone: 'Telefon',
        copy: 'Kopiuj',
        copied: 'Skopiowano',
        copiedAnnouncement: (label: string) => `Skopiowano: ${label}`,
    },
    en: {
        title: 'Company details',
        lead: 'Everything you need for a contract or an invoice. Copy any of it with one click.',
        cardLabel: 'Netizo company details',
        name: 'Name',
        business: 'Business owner',
        businessNote: 'sole proprietorship trading as',
        founders: 'Co-founders',
        address: 'Registered address',
        addressNote: 'No office for clients to visit',
        nip: 'Tax ID (NIP)',
        regon: 'REGON',
        email: 'Email',
        phone: 'Phone',
        copy: 'Copy',
        copied: 'Copied',
        copiedAnnouncement: (label: string) => `Copied: ${label}`,
    },
});

const COPIED_MS = 2000;

const focusRing = 'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

/**
 * Dane firmy (#dane-firmy, #company-details): the registry details on one card, like the letterhead of an invoice, with
 * the heading beside it from lg. The NIP is Kamil's sole proprietorship (as in the legal pages' letterhead), so the card
 * names him as the business owner and both of us as co-founders. Every value has a copy button; the confirmation is
 * announced to screen readers.
 */
export function CompanySection() {
    const copy = useCopy(COPY);
    const people = useCopy(PEOPLE);
    const sectionId = useAboutSections().company;
    const [announcement, setAnnouncement] = useState('');
    const address = `${company.street}, ${company.postalCode} ${company.city}`;
    const business = `${copy.businessNote} ${company.name}`;

    const rows: { label: string; value: ReactNode; copyText?: string; note?: string }[] = [
        { label: copy.name, value: company.name, copyText: company.name },
        { label: copy.business, value: company.owner, copyText: `${company.owner}, ${business}`, note: business },
        { label: copy.founders, value: people.map(fullName).join(', ') },
        { label: copy.address, value: address, copyText: address, note: copy.addressNote },
        { label: copy.nip, value: <span className="tabular-nums">{company.nip}</span>, copyText: company.nip },
        { label: copy.regon, value: <span className="tabular-nums">{company.regon}</span>, copyText: company.regon },
        {
            label: copy.email,
            value: (
                <a href={`mailto:${contact.email}`} className={cn('rounded-sm underline-offset-4 hover:underline', focusRing)}>
                    {contact.email}
                </a>
            ),
            copyText: contact.email,
        },
        {
            label: copy.phone,
            value: (
                <a href={contact.phone.href} className={cn('rounded-sm tabular-nums underline-offset-4 hover:underline', focusRing)}>
                    {contact.phone.display}
                </a>
            ),
            copyText: contact.phone.display,
        },
    ];

    return (
        <Section id={sectionId} labelledBy={`${sectionId}-heading`}>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
                <SectionHeading id={`${sectionId}-heading`} title={copy.title} lead={copy.lead} className="mb-0 md:mb-0 lg:col-span-4" />

                <div className="relative lg:col-span-8">
                    <CardRivets />
                    <section aria-label={copy.cardLabel} className={cn(CARD, 'overflow-hidden')}>

                        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-6 md:px-8">
                            <Logo className="h-8" />
                            <span className="text-sm text-muted-foreground tabular-nums">
                                {copy.nip} {company.nip}
                            </span>
                        </div>

                        <dl className="divide-y divide-border">
                            {rows.map((row) => (
                                <div key={row.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-6 py-4 sm:grid-cols-[11rem_1fr_auto] md:px-8">
                                    <dt className="col-span-2 text-sm text-muted-foreground sm:col-span-1">{row.label}</dt>
                                    <dd className="min-w-0">
                                        <span className="block text-lg leading-snug break-words">{row.value}</span>
                                        {row.note && <span className="mt-0.5 block text-sm text-muted-foreground">{row.note}</span>}
                                    </dd>
                                    <dd className="justify-self-end">
                                        {row.copyText && (
                                            <CopyButton
                                                text={row.copyText}
                                                label={row.label}
                                                copyLabel={copy.copy}
                                                copiedLabel={copy.copied}
                                                onCopied={() => setAnnouncement(copy.copiedAnnouncement(row.label))}
                                            />
                                        )}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <p role="status" className="sr-only">
                            {announcement}
                        </p>
                    </section>
                </div>
            </div>
        </Section>
    );
}

type CopyButtonProps = {
    text: string;
    /** What is copied, for the button's accessible name. */
    label: string;
    copyLabel: string;
    copiedLabel: string;
    onCopied: () => void;
};

/** Copies a value; for two seconds the icon turns into a check and the label into "Skopiowano". */
function CopyButton({ text, label, copyLabel, copiedLabel, onCopied }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);
    const timer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            return;
        }

        setCopied(true);
        onCopied();
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={`${copyLabel}: ${label}`}
            className={cn(
                'inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:min-h-9',
                copied && 'text-foreground',
                focusRing,
            )}
        >
            <span className="relative size-4">
                <Copy aria-hidden="true" className={cn('absolute inset-0 size-4 transition-[opacity,scale] duration-300 ease-expo-out', copied && 'scale-50 opacity-0')} />
                <Check aria-hidden="true" className={cn('absolute inset-0 size-4 transition-[opacity,scale] duration-300 ease-expo-out', !copied && 'scale-50 opacity-0')} />
            </span>
            <span className="hidden sm:inline">{copied ? copiedLabel : copyLabel}</span>
        </button>
    );
}
