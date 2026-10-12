import { localized } from '@/lib/i18n';
import type { ServiceCopy } from './service-copy';

/**
 * Aplikacje mobilne (/aplikacje-mobilne, /en/mobile-apps). The store reviews add their own time to the timelines in
 * lang/{pl,en}/services.php.
 */
export const MOBILE_COPY = localized<ServiceCopy>({
    pl: {
        name: 'Aplikacje mobilne',
        hero: {
            headingLines: ['Aplikacje', 'mobilne na iOS', 'i Android'],
            wideLines: [[0, 1], [2]],
            lead: 'Projektujemy i budujemy aplikacje na iPhone’a i Androida z jednego kodu: zamówienia, rezerwacje, programy lojalnościowe i narzędzia dla zespołów w terenie. Aplikacja mobilna kosztuje od 999\u00A0zł, a publikację w App Store i Google Play bierzemy na siebie.',
            quote: 'Wyceń aplikację',
            quoteShort: 'Wycena',
            facts: [
                { prefix: 'od', value: '999\u00A0zł', label: 'aplikacja na iOS i Android' },
                { value: '2\u00A0tyg.', label: 'co tyle nowa wersja testowa na Twoim telefonie' },
                { value: '24\u00A0h', label: 'na odpowiedź po briefie' },
                { value: '0\u00A0zł', label: 'za wycenę i konsultację' },
            ],
        },
        scope: {
            title: 'Co dostajesz w standardzie',
            lead: 'Każda aplikacja, którą budujemy, ma te elementy. Różnią się funkcje, integracje i to, czy potrzebuje własnego backendu.',
            items: [
                {
                    title: 'iOS i Android z jednego kodu',
                    description: 'Budujemy w React Native albo Flutterze, więc jedna aplikacja działa na obu platformach. Krótsza praca, a każdą poprawkę wprowadzamy raz, dla obu systemów.',
                },
                {
                    title: 'Powiadomienia push',
                    description: 'Przypomnienie o wizycie, status zamówienia albo nowa promocja trafiają prosto na ekran telefonu, do wszystkich albo do wybranej grupy.',
                },
                {
                    title: 'Projekt pod kciuk',
                    description: 'Ekrany projektujemy w Figmie z myślą o jednej ręce i małym ekranie, zgodnie z wytycznymi Apple i Google. Prototyp klikasz na swoim telefonie.',
                },
                {
                    title: 'Logowanie i konta',
                    description: 'Logowanie e-mailem, przez Apple albo Google, a w aplikacji profil, historia zamówień i ustawienia powiadomień.',
                },
                {
                    title: 'Panel do zarządzania',
                    description: 'Treści, użytkowników i powiadomienia zmieniasz w panelu w przeglądarce, bez wydawania nowej wersji aplikacji.',
                },
                {
                    title: 'Publikacja w sklepach',
                    description: 'Przygotowujemy opisy, zrzuty ekranu i informacje o prywatności, przechodzimy weryfikację Apple i Google i publikujemy aplikację.',
                },
            ],
        },
        pricing: {
            title: 'Ile kosztuje aplikacja mobilna',
            lead: 'Cena zależy od liczby ekranów, funkcji i integracji oraz od tego, czy aplikacja potrzebuje własnego backendu. Poniżej dwa progi, od których zaczynamy.',
        },
        process: {
            title: 'Jak powstaje aplikacja mobilna',
            lead: 'Cztery etapy, a w trzecim dwutygodniowe sprinty z wersją testową na Twoim telefonie. Termin podajemy po briefie, razem z czasem na weryfikację w sklepach.',
            steps: [
                {
                    title: 'Brief i funkcje',
                    description: 'Ustalamy, kto i po co będzie otwierał aplikację, wybieramy funkcje na pierwszą wersję i spisujemy zakres: ekrany, role, integracje i powiadomienia.',
                },
                {
                    title: 'Prototyp w Figmie',
                    description: 'Projektujemy ekrany i klikalny prototyp, który otwierasz na swoim telefonie. Poprawki wprowadzamy, zanim powstanie kod.',
                },
                {
                    title: 'Sprinty i wersje testowe',
                    description: 'Programujemy w dwutygodniowych sprintach. Po każdym instalujesz nową wersję testową przez TestFlight albo Google Play, a zadania widzisz w panelu klienta.',
                },
                {
                    title: 'Publikacja i rozwój',
                    description: 'Przechodzimy weryfikację Apple i Google i publikujemy aplikację. Potem aktualizujemy ją pod nowe wersje systemów i rozwijamy o kolejne funkcje.',
                },
            ],
        },
        projects: { title: 'Aplikacje, które zbudowaliśmy' },
        guide: {
            title: 'Aplikacja, którą ludzie zostawiają w telefonie',
            intro: 'Na co zwrócić uwagę, zanim zamówisz aplikację mobilną, żeby nie wylądowała w folderze, którego nikt nie otwiera.',
            sections: [
                {
                    heading: 'Czy na pewno aplikacja, a nie strona?',
                    paragraphs: [
                        'Aplikację klienci instalują tylko wtedy, gdy wracają do niej regularnie: zamawiają, rezerwują, zbierają punkty albo pracują w niej w terenie. Jeśli ktoś zagląda raz na kilka miesięcy, lepiej sprawdzi się **szybka strona albo aplikacja webowa**. Doradzimy po briefie, a gdy aplikacja ma sens, zbudujemy ją na tym samym backendzie co wersję webową.',
                    ],
                },
                {
                    heading: 'Jeden kod, dwie platformy',
                    paragraphs: [
                        'React Native i Flutter pozwalają zbudować **jedną aplikację na iOS i Androida** z wydajnością bliską natywnej. To krótsza praca, niższy koszt utrzymania i te same funkcje na obu systemach. Kod natywny dopisujemy tylko tam, gdzie wymaga tego funkcja, np. nietypowa obsługa aparatu albo Bluetooth.',
                    ],
                },
                {
                    heading: 'Powiadomienia z umiarem',
                    paragraphs: [
                        'Push to najmocniejsze narzędzie aplikacji i najszybszy sposób, żeby ktoś ją odinstalował. Dlatego planujemy **powiadomienia, które coś dają**: przypomnienie o wizycie, status zamówienia, punkty do wykorzystania. Wysyłasz je z panelu do wszystkich albo do wybranej grupy, a użytkownik sam decyduje, co chce dostawać.',
                    ],
                },
                {
                    heading: 'Sklepy mają swoje zasady',
                    paragraphs: [
                        'Apple i Google weryfikują każdą aplikację i każdą aktualizację. Od początku projektujemy więc zgodnie z ich wytycznymi, przygotowujemy **opisy, zrzuty ekranu i informacje o prywatności**, a w planie uwzględniamy czas na weryfikację. Najlepiej publikować aplikację na koncie dewelopera Twojej firmy, żeby wpis w sklepie należał do Ciebie.',
                    ],
                },
            ],
        },
        faq: { title: 'Częste pytania o aplikacje mobilne' },
    },
    en: {
        name: 'Mobile apps',
        hero: {
            headingLines: ['iOS and Android', 'app development'],
            lead: 'We design and build iPhone and Android apps from one codebase: orders, bookings, loyalty programs and tools for teams in the field. A mobile app starts at PLN\u00A0999, and we take care of publishing it in the App Store and Google Play.',
            quote: 'Get a quote',
            quoteShort: 'Quote',
            facts: [
                { prefix: 'from', value: 'PLN\u00A0999', label: 'an app for iOS and Android' },
                { value: '2\u00A0wks', label: 'between test builds on your phone' },
                { value: '24\u00A0h', label: 'to reply to your brief' },
                { value: 'Free', label: 'quote and consultation' },
            ],
        },
        scope: {
            title: 'What you get as standard',
            lead: 'Every app we build has these. What varies is the features, the integrations and whether it needs its own backend.',
            items: [
                {
                    title: 'iOS and Android from one codebase',
                    description: 'We build in React Native or Flutter, so one app runs on both platforms. Less work, and we make every fix once, for both systems.',
                },
                {
                    title: 'Push notifications',
                    description: 'An appointment reminder, an order status or a new promotion lands right on the phone’s screen, for everyone or a chosen group.',
                },
                {
                    title: 'Designed for thumbs',
                    description: 'We design the screens in Figma for one hand and a small screen, following Apple’s and Google’s guidelines. You click through the prototype on your own phone.',
                },
                {
                    title: 'Log-in and accounts',
                    description: 'Log-in with email, Apple or Google, and in the app a profile, order history and notification settings.',
                },
                {
                    title: 'A panel to manage it',
                    description: 'You change content, users and notifications in a browser panel, without releasing a new version of the app.',
                },
                {
                    title: 'Store publishing',
                    description: 'We prepare descriptions, screenshots and privacy details, go through Apple’s and Google’s reviews and publish the app.',
                },
            ],
        },
        pricing: {
            title: 'How much does a mobile app cost',
            lead: 'The price depends on the number of screens, features and integrations, and on whether the app needs its own backend. Below are the two tiers we start from.',
        },
        process: {
            title: 'How a mobile app comes together',
            lead: 'Four stages, with two-week sprints and a test build on your phone in the third. We give you the timeline after the brief, including time for the store reviews.',
            steps: [
                {
                    title: 'Brief and features',
                    description: 'We work out who will open the app and why, choose the features for the first version and write down the scope: screens, roles, integrations and notifications.',
                },
                {
                    title: 'A Figma prototype',
                    description: 'We design the screens and a clickable prototype you open on your own phone. We make changes before any code exists.',
                },
                {
                    title: 'Sprints and test builds',
                    description: 'We code in two-week sprints. After each one, you install a new test build through TestFlight or Google Play, and you see the tasks in the client portal.',
                },
                {
                    title: 'Publishing and growth',
                    description: 'We go through Apple’s and Google’s reviews and publish the app. After that, we update it for new system versions and add new features.',
                },
            ],
        },
        projects: { title: 'Apps we’ve built' },
        guide: {
            title: 'An app people keep on their phones',
            intro: 'What to look at before you order a mobile app, so it doesn’t end up in a folder no one opens.',
            sections: [
                {
                    heading: 'Are you sure it’s an app, not a website?',
                    paragraphs: [
                        'Customers install an app only when they come back to it regularly: to order, book, collect points or work in the field. If someone drops by once every few months, **a fast website or a web application** will serve them better. We’ll advise you after the brief, and when an app makes sense, we build it on the same backend as the web version.',
                    ],
                },
                {
                    heading: 'One codebase, two platforms',
                    paragraphs: [
                        'React Native and Flutter let us build **one app for iOS and Android** with near-native performance. That means less work, lower maintenance costs and the same features on both systems. We add native code only where a feature needs it, such as unusual camera handling or Bluetooth.',
                    ],
                },
                {
                    heading: 'Notifications in moderation',
                    paragraphs: [
                        'Push is an app’s strongest tool, and the fastest way to get it uninstalled. That’s why we plan **notifications that give something**: an appointment reminder, an order status, points to use. You send them from the panel to everyone or a chosen group, and users decide what they want to get.',
                    ],
                },
                {
                    heading: 'The stores have their own rules',
                    paragraphs: [
                        'Apple and Google review every app and every update. So we design to their guidelines from the start, prepare **descriptions, screenshots and privacy details**, and plan time for the reviews. It’s best to publish the app on your company’s developer account, so the store listing belongs to you.',
                    ],
                },
            ],
        },
        faq: { title: 'Common questions about mobile apps' },
    },
});
