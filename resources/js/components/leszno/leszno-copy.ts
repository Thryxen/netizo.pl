import type { ServiceCopy } from '@/components/services/service-copy';
import { localized } from '@/lib/i18n';

export type LesznoCopy = Pick<ServiceCopy, 'name' | 'hero' | 'pricing' | 'faq'> & {
    /** Beside the phone number in the hero, in place of "Leszno, cała Polska". */
    area: string;
    /** The header's button (to the contact section) and its label on phones. */
    headerCta: { label: string; shortLabel: string };
    /** The home page's contact section, asking for a meeting. */
    contact: { title: string; lead: string; messagePlaceholder: string };
};

/**
 * The copy of the Leszno page (/tworzenie-stron-internetowych/leszno, /en/website-development/leszno) that its shared
 * sections take as props: the hero, the pricing's heading, the FAQ's heading and the contact section. The meta tags and
 * the FAQ are in lang/{pl,en}/leszno.php, the tiers in lang/{pl,en}/services.php (the websites page's).
 *
 * The towns in the lead are StructuredData::MEETING_TOWNS; the figures are the websites page's (App\Enums\Service).
 * Ranges keep together with no-break spaces (U+00A0) inside amounts and before units.
 */
export const LESZNO_COPY = localized<LesznoCopy>({
    pl: {
        name: 'Leszno i okolice',
        hero: {
            headingLines: ['Tworzenie stron', 'internetowych', 'w Lesznie'],
            wideLines: [[0, 1], [2]],
            lead: 'Przyjeżdżamy do Ciebie w Lesznie, Rydzynie, Wschowie, Kościanie, Gostyniu, Rawiczu i okolicach. Siadamy przy laptopie w Twojej firmie i omawiamy stronę na żywo. Prosta strona kosztuje od 799 zł i powstaje zwykle w ciągu tygodnia.',
            quote: 'Umów spotkanie u siebie w firmie',
            quoteShort: 'Umów spotkanie',
            facts: [
                { prefix: 'od', value: '799 zł', label: 'prosta strona albo landing page' },
                { prefix: 'do', value: '1 tyg.', label: 'prosta strona od briefu do publikacji' },
                { value: '6 miast', label: 'i okolice, do których przyjeżdżamy' },
                { value: '0 zł', label: 'za wycenę i konsultację' },
            ],
        },
        area: 'Przyjeżdżamy do Ciebie',
        headerCta: { label: 'Umów spotkanie', shortLabel: 'Spotkanie' },
        pricing: {
            title: 'Ile kosztuje strona internetowa w Lesznie',
            lead: 'Te same progi co przy każdej stronie, którą budujemy. Dokładną cenę podajemy bezpłatnie po spotkaniu albo po briefie.',
        },
        faq: { title: 'Pytania firm z Leszna i okolic' },
        contact: {
            title: 'Umów spotkanie u siebie w firmie',
            lead: 'Napisz, w jakiej miejscowości jest Twoja firma i kiedy Ci pasuje, albo wypełnij brief, jeśli chcesz od razu dokładnej wyceny. Odpowiadamy w ciągu 24 godzin.',
            messagePlaceholder: 'Np. warsztat w Rydzynie, potrzebujemy nowej strony. Pasuje nam wtorek przed południem.',
        },
    },
    en: {
        name: 'Leszno and around',
        hero: {
            headingLines: ['Website', 'development', 'in Leszno'],
            wideLines: [[0, 1], [2]],
            lead: 'We come to you in Leszno, Rydzyna, Wschowa, Kościan, Gostyń, Rawicz and the area around. We sit down at the laptop in your company and go through the website together. A simple website costs from PLN 799 and usually takes up to a week.',
            quote: 'Book a meeting at your company',
            quoteShort: 'Book a meeting',
            facts: [
                { prefix: 'from', value: 'PLN 799', label: 'a simple website or landing page' },
                { prefix: 'up to', value: '1 wk', label: 'a simple website from brief to launch' },
                { value: '6 towns', label: 'and the area around, where we come to you' },
                { value: 'Free', label: 'quote and consultation' },
            ],
        },
        area: 'We come to you',
        headerCta: { label: 'Book a meeting', shortLabel: 'Meeting' },
        pricing: {
            title: 'How much a website costs in Leszno',
            lead: 'The same price brackets as for every website we build. We give you the exact price for free after the meeting or the brief.',
        },
        faq: { title: 'Questions from businesses around Leszno' },
        contact: {
            title: 'Book a meeting at your company',
            lead: 'Tell us which town your company is in and when suits you, or fill in the brief if you want an exact quote straight away. We reply within 24 hours.',
            messagePlaceholder: 'E.g. a workshop in Rydzyna, we need a new website. Tuesday morning works for us.',
        },
    },
});
