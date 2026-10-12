import { localized } from '@/lib/i18n';
import type { ServiceCopy } from './service-copy';

/** Tworzenie stron internetowych (/tworzenie-stron-internetowych, /en/website-development). */
export const WEBSITES_COPY = localized<ServiceCopy>({
    pl: {
        name: 'Strony internetowe',
        hero: {
            headingLines: ['Tworzenie stron', 'internetowych', 'dla firm'],
            wideLines: [[0, 1], [2]],
            lead: 'Projektujemy i budujemy strony, które szybko się ładują, dobrze wyglądają na telefonie i zbierają zapytania od klientów. Prosta strona kosztuje od 799\u00A0zł i powstaje zwykle w ciągu tygodnia.',
            quote: 'Wyceń stronę',
            quoteShort: 'Wycena',
            facts: [
                { prefix: 'od', value: '799\u00A0zł', label: 'prosta strona albo landing page' },
                { prefix: 'do', value: '1\u00A0tyg.', label: 'prosta strona od briefu do publikacji' },
                { prefix: 'do', value: '2\u00A0tyg.', label: 'rozbudowana strona z CMS i\u00A0blogiem' },
                { value: '0\u00A0zł', label: 'za wycenę i konsultację' },
            ],
        },
        scope: {
            title: 'Co dostajesz w standardzie',
            lead: 'Te elementy ma każda strona, którą budujemy, niezależnie od ceny. Różni się tylko zakres: liczba podstron, funkcje i integracje.',
            items: [
                {
                    title: 'Projekt w Figmie',
                    description: 'Zanim napiszemy pierwszą linijkę kodu, dostajesz klikalny prototyp strony. Zmiany nanosimy na projekcie, kiedy są najtańsze.',
                },
                {
                    title: 'Wersja na telefon',
                    description: 'Projektujemy najpierw na telefon, bo z niego coraz częściej wchodzą klienci. Na tablecie i komputerze układ dopasowuje się sam.',
                },
                {
                    title: 'Szybkie ładowanie',
                    description: 'Lekki kod, zoptymalizowane zdjęcia i dobre wyniki Core Web Vitals. Szybka strona lepiej wypada w Google i rzadziej traci odwiedzających.',
                },
                {
                    title: 'SEO od pierwszego dnia',
                    description: 'Tytuły i opisy do wyników wyszukiwania, poprawne nagłówki, dane strukturalne i mapa witryny są gotowe w dniu publikacji.',
                },
                {
                    title: 'Formularz i zapytania',
                    description: 'Formularz kontaktowy wysyła zgłoszenia prosto na Twój e-mail, a numer telefonu da się kliknąć i od razu zadzwonić.',
                },
                {
                    title: 'Domena, hosting i poczta',
                    description: 'Pomagamy wybrać i skonfigurować domenę, hosting i firmową pocztę albo pracujemy na tym, co już masz. Dostępy trzymasz w sejfie w panelu klienta.',
                },
            ],
        },
        pricing: {
            title: 'Ile kosztuje strona internetowa',
            lead: 'Cena zależy od liczby podstron, funkcji i integracji. Poniżej dwa progi, od których zaczynamy, i to, co zwykle się w nich mieści.',
        },
        process: {
            title: 'Jak powstaje strona',
            lead: 'Cztery etapy, te same co przy każdym naszym projekcie. Przy prostej stronie trwają razem zwykle do tygodnia, przy rozbudowanej do dwóch tygodni.',
            steps: [
                {
                    title: 'Brief i zakres',
                    description: 'Poznajemy firmę, klientów i konkurencję, a potem spisujemy zakres prac: podstrony, funkcje i treści. Dostajesz go do akceptacji razem z wyceną.',
                },
                {
                    title: 'Projekt i prototyp',
                    description: 'Projektujemy wygląd i układ każdej podstrony w Figmie. Klikasz prototyp na telefonie i komputerze, a poprawki nanosimy, zanim zaczniemy programować.',
                },
                {
                    title: 'Programowanie',
                    description: 'Budujemy stronę na wersji testowej, na której sprawdzasz ją przed publikacją. Zadania i etap każdego z nich widzisz w panelu klienta.',
                },
                {
                    title: 'Publikacja i opieka',
                    description: 'Podpinamy domenę, sprawdzamy stronę na prawdziwych urządzeniach i publikujemy. Potem możemy zostać z Tobą: hosting, aktualizacje, kopie i monitoring.',
                },
            ],
        },
        projects: { title: 'Strony, które zbudowaliśmy' },
        guide: {
            title: 'Strona, która pracuje na firmę',
            intro: 'Kilka rzeczy, o które warto zapytać każdego wykonawcę, zanim zamówisz stronę. U nas są częścią każdego projektu.',
            sections: [
                {
                    heading: 'Landing page czy strona firmowa?',
                    paragraphs: [
                        'Landing page to jedna długa strona z jednym celem, np. zebraniem zapytań o wycenę albo zapisów na usługę. Sprawdza się przy kampaniach reklamowych i nowych usługach. Strona firmowa ma kilka lub kilkanaście podstron: ofertę, realizacje, informacje o firmie i kontakt, a często też bloga.',
                        'Jeśli nie wiesz, co wybrać, zacznij od celu: **co ma zrobić osoba, która wejdzie na stronę**. Doradzimy po briefie, a gdy zaczniesz od landing page, rozbudujemy go później bez budowania od nowa.',
                    ],
                },
                {
                    heading: 'Szybkość to nie dodatek',
                    paragraphs: [
                        'Wolna strona traci odwiedzających, zanim przeczytają ofertę, i gorzej wypada w wynikach Google. Dlatego przed publikacją **mierzymy Core Web Vitals** (LCP, CLS i INP), zdjęcia zapisujemy w nowoczesnych formatach, a kod ładujemy tylko tam, gdzie jest potrzebny. Wyniki sprawdzamy na telefonie i na komputerze, bo to tam odwiedzający oceniają stronę.',
                    ],
                },
                {
                    heading: 'SEO zaczyna się w kodzie',
                    paragraphs: [
                        'Pozycjonowanie to nie tylko teksty. Wyszukiwarka musi szybko odczytać i zrozumieć stronę, a do tego potrzebuje **poprawnej struktury nagłówków, tytułów i opisów, danych strukturalnych i mapy witryny**. To wszystko dostajesz w dniu publikacji. Przy przebudowie przekierowujemy stare adresy na nowe, żeby nie stracić pozycji, na które firma pracowała latami.',
                    ],
                },
                {
                    heading: 'Twoja strona, Twoje dostępy',
                    paragraphs: [
                        'Domena, hosting i konta powinny być zapisane na Twoją firmę, a dostępy do nich trzymane w bezpiecznym miejscu. W panelu klienta masz je w **zaszyfrowanym sejfie**, dostajesz przypomnienia przed odnowieniem domeny i hostingu, a każda zmiana na stronie jest zadaniem z historią. Dzięki temu nie zależysz od jednej osoby, która „wie, jak to działa”.',
                    ],
                },
            ],
        },
        faq: { title: 'Częste pytania o strony internetowe' },
    },
    en: {
        name: 'Websites',
        hero: {
            headingLines: ['Website', 'development', 'for businesses'],
            wideLines: [[0, 1], [2]],
            lead: 'We design and build websites that load fast, look good on phones and bring in inquiries from customers. A simple website starts at PLN\u00A0799 and is usually ready within a week.',
            quote: 'Get a quote',
            quoteShort: 'Quote',
            facts: [
                { prefix: 'from', value: 'PLN\u00A0799', label: 'a simple website or landing page' },
                { prefix: 'up to', value: '1\u00A0wk', label: 'a simple website from brief to launch' },
                { prefix: 'up to', value: '2\u00A0wks', label: 'a larger website with a CMS and a blog' },
                { value: 'Free', label: 'quote and consultation' },
            ],
        },
        scope: {
            title: 'What you get as standard',
            lead: 'Every website we build has these, whatever its price. Only the scope changes: the number of pages, features and integrations.',
            items: [
                {
                    title: 'A Figma design',
                    description: 'Before we write the first line of code, you get a clickable prototype of the website. We make changes in the design, where they cost the least.',
                },
                {
                    title: 'Built for phones',
                    description: 'We design for phones first, because that’s where more and more customers come from. On tablets and desktops, the layout adapts by itself.',
                },
                {
                    title: 'Fast loading',
                    description: 'Lightweight code, optimized images and good Core Web Vitals. A fast website does better in Google and loses fewer visitors.',
                },
                {
                    title: 'SEO from day one',
                    description: 'Titles and descriptions for search results, proper headings, structured data and a sitemap are ready on launch day.',
                },
                {
                    title: 'Forms and inquiries',
                    description: 'The contact form sends inquiries straight to your email, and your phone number is one tap away on phones.',
                },
                {
                    title: 'Domain, hosting and email',
                    description: 'We help you choose and set up a domain, hosting and business email, or work with what you have. You keep the access details in a vault in the client portal.',
                },
            ],
        },
        pricing: {
            title: 'How much does a website cost',
            lead: 'The price depends on the number of pages, features and integrations. Below are the two tiers we start from and what they usually include.',
        },
        process: {
            title: 'How a website comes together',
            lead: 'Four stages, the same as in every project of ours. For a simple website they usually take up to a week in total, for a larger one up to two weeks.',
            steps: [
                {
                    title: 'Brief and scope',
                    description: 'We get to know your company, customers and competitors, then write down the scope of work: pages, features and content. You get it to approve together with the quote.',
                },
                {
                    title: 'Design and prototype',
                    description: 'We design the look and layout of every page in Figma. You click through the prototype on a phone and a desktop, and we make changes before we start coding.',
                },
                {
                    title: 'Development',
                    description: 'We build the website on a staging version, where you review it before launch. You see the tasks and the stage of each one in the client portal.',
                },
                {
                    title: 'Launch and support',
                    description: 'We connect the domain, test the website on real devices and launch it. After that, we can stay with you: hosting, updates, backups and monitoring.',
                },
            ],
        },
        projects: { title: 'Websites we’ve built' },
        guide: {
            title: 'A website that works for your business',
            intro: 'A few things worth asking any agency before you order a website. With us, they’re part of every project.',
            sections: [
                {
                    heading: 'Landing page or company website?',
                    paragraphs: [
                        'A landing page is one long page with one goal, such as collecting quote requests or sign-ups for a service. It works well for ad campaigns and new services. A company website has several pages or a dozen: your offer, projects, about and contact, often a blog too.',
                        'If you’re not sure which to choose, start from the goal: **what should a visitor do on the website**. We’ll advise you after the brief, and if you start with a landing page, we can grow it later without starting over.',
                    ],
                },
                {
                    heading: 'Speed isn’t an extra',
                    paragraphs: [
                        'A slow website loses visitors before they read your offer, and does worse in Google. That’s why we **measure Core Web Vitals** (LCP, CLS and INP) before launch, save images in modern formats and load code only where it’s needed. We check the results on phones and desktops, because that’s where visitors judge the website.',
                    ],
                },
                {
                    heading: 'SEO starts in the code',
                    paragraphs: [
                        'SEO isn’t only about copy. A search engine has to read and understand the website quickly, and for that it needs **a proper heading structure, titles and descriptions, structured data and a sitemap**. You get all of that on launch day. When we rebuild a website, we redirect old addresses to the new ones, so you don’t lose rankings your company has worked on for years.',
                    ],
                },
                {
                    heading: 'Your website, your access',
                    paragraphs: [
                        'Your domain, hosting and accounts should be registered to your company, and the access details kept somewhere safe. In the client portal you keep them in an **encrypted vault**, get reminders before your domain and hosting renew, and every change to the website is a task with its history. That way you don’t depend on one person who “knows how it works”.',
                    ],
                },
            ],
        },
        faq: { title: 'Common questions about websites' },
    },
});
