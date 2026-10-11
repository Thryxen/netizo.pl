import { localized } from '@/lib/i18n';
import type { PhotoName } from '@/lib/photos';

export type Person = {
    firstName: string;
    lastName: string;
    /** Shown in the avatars (PersonAvatar): the hero heading, the badge on the photo, the shared band. */
    initials: string;
    role: string;
    bio: string;
    /** "Z nim omówisz": what you settle with this person. */
    topics: string[];
    /** The photo of their part of the work (hands and desk, not the person); the initials stay on it as a badge. */
    photo: PhotoName;
};

/** The co-owners. Their job titles in the JSON-LD come from lang/{pl,en}/about.php. */
export const PEOPLE = localized<Person[]>({
    pl: [
        {
            firstName: 'Damian',
            lastName: 'Idzik',
            initials: 'DI',
            photo: 'about-code',
            role: 'Współwłaściciel, technologia',
            bio: 'Zajmuje się kwestiami technicznymi projektów i kontaktem z klientami. Pilnuje, żeby strona lub aplikacja działała tak, jak się umówiliśmy.',
            topics: ['jak strona lub aplikacja ma działać', 'technologię, integracje i hosting', 'wdrożenie i opiekę techniczną'],
        },
        {
            firstName: 'Kamil',
            lastName: 'Nawrot',
            initials: 'KN',
            photo: 'about-planning',
            role: 'Współwłaściciel, organizacja',
            bio: 'Zajmuje się organizacją firmy i kontaktem z klientami. Pilnuje, żeby projekt szedł zgodnie z planem, a formalności nie stały na drodze.',
            topics: ['terminy i harmonogram', 'warunki współpracy i umowę', 'formalności i rozliczenia'],
        },
    ],
    en: [
        {
            firstName: 'Damian',
            lastName: 'Idzik',
            initials: 'DI',
            photo: 'about-code',
            role: 'Co-owner, technology',
            bio: 'Handles the technical side of our projects and talks to clients. He makes sure your website or app works the way we agreed.',
            topics: ['how your website or app should work', 'technology, integrations and hosting', 'the launch and technical care'],
        },
        {
            firstName: 'Kamil',
            lastName: 'Nawrot',
            initials: 'KN',
            photo: 'about-planning',
            role: 'Co-owner, operations',
            bio: 'Runs the organizational side of the company and talks to clients. He keeps the project on schedule and the paperwork out of the way.',
            topics: ['schedules and deadlines', 'terms of cooperation and the contract', 'paperwork and invoicing'],
        },
    ],
});

/** Full name, as used in the copy and the alt texts. */
export const fullName = (person: Person): string => `${person.firstName} ${person.lastName}`;

/** What the co-owners share: the band under PeopleSection. */
export const SHARED_DUTY = localized({
    pl: {
        topicsLabel: 'Z nim omówisz',
        focus: 'Obaj rozmawiamy z klientami.',
        detail: 'Rozmawiasz bezpośrednio z nami, od pierwszej rozmowy do wdrożenia. Bez pośredników i przekazywania sprawy dalej.',
    },
    en: {
        topicsLabel: 'Talk to him about',
        focus: 'We both talk to clients.',
        detail: 'You talk to us directly, from the first call to the launch. No go-betweens, no passing your project around.',
    },
});

/** The two ways we work, each with its photo (HowWeWorkSection). */
export const WORK_MODES = localized<{ term: string; title: string; detail: string; photo: PhotoName }[]>({
    pl: [
        {
            term: 'Zdalnie',
            title: 'Cała Polska',
            detail: 'Rozmawiamy na wideorozmowach i przez telefon, a w panelu klienta widzisz zadania, czas pracy i dokumenty.',
            photo: 'about-remote',
        },
        {
            term: 'Na miejscu',
            title: 'Leszno i okolice',
            detail: 'Tu możemy spotkać się osobiście: przyjeżdżamy do Twojej firmy, siadamy przy laptopie i omawiamy projekt na żywo.',
            photo: 'about-visit',
        },
    ],
    en: [
        {
            term: 'Remotely',
            title: 'All of Poland',
            detail: 'We talk over video calls and by phone, and in the client portal you see the tasks, the time spent and the documents.',
            photo: 'about-remote',
        },
        {
            term: 'In person',
            title: 'Leszno and around',
            detail: 'Here we can meet in person: we come to your company, sit down at the laptop and go through the project together.',
            photo: 'about-visit',
        },
    ],
});

/** The smaller print of how a project runs, under the map. */
export const WORK_NOTES = localized<{ term: string; detail: string }[]>({
    pl: [
        { term: 'Postępy', detail: 'Co dwa tygodnie pokazujemy postępy na wersji testowej, więc widzisz projekt, zanim trafi do sieci.' },
        { term: 'Biuro', detail: 'Nie mamy biura dla klientów. Kępno to adres rejestrowy firmy.' },
    ],
    en: [
        { term: 'Progress', detail: 'Every two weeks we show the progress on a staging version, so you see the project before it goes live.' },
        { term: 'Office', detail: 'We have no office for clients to visit. Kępno is our registered business address.' },
    ],
});

export type Town = {
    name: string;
    lat: number;
    lon: number;
    /** Side of the dot the name sits on: towards the inside of the outline, and clear of the names around Leszno. */
    labelSide: 'top' | 'right' | 'bottom' | 'left';
};

/** Towns where we meet clients in person (the map in HowWeWorkSection); the same as `areaServed` in HomeController. */
export const MEETING_TOWNS: Town[] = [
    { name: 'Leszno', lat: 51.8406, lon: 16.5749, labelSide: 'top' },
    { name: 'Rydzyna', lat: 51.7867, lon: 16.6614, labelSide: 'right' },
    { name: 'Wschowa', lat: 51.807, lon: 16.315, labelSide: 'right' },
    { name: 'Kościan', lat: 52.0866, lon: 16.6481, labelSide: 'bottom' },
    { name: 'Gostyń', lat: 51.88, lon: 17.0122, labelSide: 'left' },
    { name: 'Rawicz', lat: 51.6094, lon: 16.8586, labelSide: 'left' },
];

/**
 * Story, numbers and testimonials. Entries marked `sample` are placeholders that show the layout: the page renders them
 * only in local development (AboutController's `previewSamples`). Replace each with the real one (or confirm it) and
 * drop `sample`; a section without real entries is left out of the page.
 */
type MaybeSample = { sample?: boolean };

export type StoryEntry = MaybeSample & { year: string; title: string; detail: string };
export type NumberEntry = MaybeSample & { value: string; label: string; source: string };
export type Testimonial = MaybeSample & { quote: string; author: string; company: string };

/** The entries to render: the real ones, and the samples too while previewing. */
export function visibleItems<T extends MaybeSample>(items: T[], previewSamples: boolean): T[] {
    return items.filter((item) => previewSamples || !item.sample);
}

/**
 * 2023–2026, drafted from what the records show (netizo.pl registered 2023-11; the 2026 site, client portal, partner
 * programme and English version; care after launch as described in the FAQ). Still `sample` until the owners confirm
 * each line: drop the flag to publish it.
 */
export const STORY = localized<StoryEntry[]>({
    pl: [
        {
            sample: true,
            year: '2023',
            title: 'Pierwsze strony',
            detail: 'Rejestrujemy netizo.pl i oddajemy pierwsze strony firmowe dla lokalnych firm z okolic Leszna.',
        },
        {
            sample: true,
            year: '2024',
            title: 'Sklepy i aplikacje',
            detail: 'Do stron dochodzą sklepy internetowe i pierwsze aplikacje webowe. Coraz więcej projektów prowadzimy zdalnie, dla firm spoza regionu.',
        },
        {
            sample: true,
            year: '2025',
            title: 'Opieka po wdrożeniu',
            detail: 'Zostajemy z klientami po publikacji: dbamy o hosting, aktualizacje, kopie zapasowe i dalszy rozwój ich stron.',
        },
        {
            sample: true,
            year: '2026',
            title: 'Nowa odsłona Netizo',
            detail: 'Nowa strona po polsku i angielsku, panel klienta, w którym widzisz postępy, i program partnerski z 15% prowizji.',
        },
    ],
    en: [
        {
            sample: true,
            year: '2023',
            title: 'First websites',
            detail: 'We register netizo.pl and deliver our first company websites for local businesses around Leszno.',
        },
        {
            sample: true,
            year: '2024',
            title: 'Stores and web apps',
            detail: 'Online stores and our first web apps join the websites. More and more projects run remotely, for companies outside the region.',
        },
        {
            sample: true,
            year: '2025',
            title: 'Care after launch',
            detail: 'We stay with our clients after going live: hosting, updates, backups and the further development of their websites.',
        },
        {
            sample: true,
            year: '2026',
            title: 'A new Netizo',
            detail: 'A new website in Polish and English, a client portal where you follow the progress, and a partner program with a 15% commission.',
        },
    ],
});

/** The figures the home page shows, each with how it is counted. */
export const NUMBERS = localized<NumberEntry[]>({
    pl: [
        { sample: true, value: '150+', label: 'zrealizowanych projektów', source: 'Liczymy oddane strony, sklepy i aplikacje webowe.' },
        { sample: true, value: '8 lat', label: 'doświadczenia', source: 'Liczymy doświadczenie zespołu, także sprzed Netizo.' },
        { sample: true, value: '99,9%', label: 'dostępności wdrożeń', source: 'Średnia dostępność stron, którymi się opiekujemy, według monitoringu.' },
    ],
    en: [
        { sample: true, value: '150+', label: 'projects delivered', source: 'We count the websites, online stores and web apps we have delivered.' },
        { sample: true, value: '8 years', label: 'of experience', source: 'We count the team’s experience, including the years before Netizo.' },
        { sample: true, value: '99.9%', label: 'uptime of our launches', source: 'The average uptime of the websites in our care, from monitoring.' },
    ],
});

export const TESTIMONIALS = localized<Testimonial[]>({
    pl: [
        {
            sample: true,
            quote: 'Przykładowa opinia. Tu wpiszesz 2–3 zdania klienta: z czym do Was przyszedł, co zrobiliście i jaki był efekt.',
            author: 'Imię Nazwisko',
            company: 'Nazwa firmy, miasto',
        },
        {
            sample: true,
            quote: 'Przykładowa opinia o współpracy: jak wyglądał kontakt, czy terminy były dotrzymane i jak pracowało się w panelu klienta.',
            author: 'Imię Nazwisko',
            company: 'Nazwa firmy, miasto',
        },
        {
            sample: true,
            quote: 'Przykładowa opinia o opiece po wdrożeniu: aktualizacje, poprawki i czas reakcji na zgłoszenia.',
            author: 'Imię Nazwisko',
            company: 'Nazwa firmy, miasto',
        },
    ],
    en: [
        {
            sample: true,
            quote: 'Sample testimonial. Put 2–3 sentences from a client here: what they came with, what you built and what changed.',
            author: 'First Last',
            company: 'Company name, town',
        },
        {
            sample: true,
            quote: 'Sample testimonial about working together: how the communication went, whether deadlines were met and what the client portal was like.',
            author: 'First Last',
            company: 'Company name, town',
        },
        {
            sample: true,
            quote: 'Sample testimonial about care after launch: updates, fixes and how fast requests were handled.',
            author: 'First Last',
            company: 'Company name, town',
        },
    ],
});
