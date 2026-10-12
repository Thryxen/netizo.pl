import { localized } from '@/lib/i18n';
import type { ServiceCopy } from './service-copy';

/** Aplikacje webowe (/aplikacje-webowe, /en/web-applications). */
export const APPS_COPY = localized<ServiceCopy>({
    pl: {
        name: 'Aplikacje webowe',
        hero: {
            headingLines: ['Aplikacje', 'webowe', 'na zamówienie'],
            wideLines: [[0, 1], [2]],
            lead: 'Projektujemy i budujemy panele, systemy B2B i platformy SaaS, które porządkują procesy w firmie i łączą się z narzędziami, których już używasz. Aplikacja webowa kosztuje od 1\u00A0699\u00A0zł i powstaje zwykle w ciągu trzech tygodni.',
            quote: 'Wyceń aplikację',
            quoteShort: 'Wycena',
            facts: [
                { prefix: 'od', value: '1\u00A0699\u00A0zł', label: 'aplikacja webowa' },
                { prefix: 'do', value: '3\u00A0tyg.', label: 'aplikacja webowa od briefu do wdrożenia' },
                { value: '2\u00A0tyg.', label: 'co tyle pokazujemy demo na wersji testowej' },
                { value: '0\u00A0zł', label: 'za wycenę i konsultację' },
            ],
        },
        scope: {
            title: 'Co dostajesz w standardzie',
            lead: 'Każda aplikacja, którą budujemy, ma te fundamenty. Różnią się procesy, które obsługuje, i systemy, z którymi się łączy.',
            items: [
                {
                    title: 'Role i uprawnienia',
                    description: 'Każdy widzi to, czego potrzebuje do pracy: handlowiec swoje zamówienia, księgowość faktury, a administrator całość.',
                },
                {
                    title: 'Integracje przez API',
                    description: 'Łączymy aplikację z ERP, księgowością, płatnościami, kalendarzami i bramkami SMS, żeby nikt nie przepisywał danych ręcznie.',
                },
                {
                    title: 'Raporty i eksport',
                    description: 'Zestawienia, wykresy i eksport do PDF albo CSV, gotowe dla zarządu i księgowości bez ręcznego składania arkuszy.',
                },
                {
                    title: 'Dane na żywo',
                    description: 'Powiadomienia i odświeżanie bez przeładowania strony: nowe zamówienie, zmiana statusu albo pozycja pojazdu pojawiają się od razu.',
                },
                {
                    title: 'Bezpieczne logowanie',
                    description: 'Szyfrowane połączenia, kopie zapasowe i opcjonalny drugi składnik logowania, np. jednorazowy kod z e-maila.',
                },
                {
                    title: 'Wdrożenia i monitoring',
                    description: 'Automatyczne testy i wdrożenia bez przestojów, monitoring i historia zmian. O problemie dowiadujemy się od razu.',
                },
            ],
        },
        pricing: {
            title: 'Ile kosztuje aplikacja webowa',
            lead: 'Cena zależy od liczby ekranów i ról, integracji i wymagań co do bezpieczeństwa. Poniżej dwa progi, od których zaczynamy.',
        },
        process: {
            title: 'Jak powstaje aplikacja',
            lead: 'Cztery etapy, a w trzecim dwutygodniowe sprinty. Typowa aplikacja jest gotowa zwykle w ciągu trzech tygodni, duży system budujemy etapami.',
            steps: [
                {
                    title: 'Analiza procesu',
                    description: 'Rozmawiamy z osobami, które będą korzystać z aplikacji, rozpisujemy proces krok po kroku i spisujemy zakres: role, ekrany, integracje i dane.',
                },
                {
                    title: 'Prototyp w Figmie',
                    description: 'Projektujemy kluczowe ekrany i klikalny prototyp. Sprawdzasz go z zespołem, zanim powstanie pierwszy moduł, więc zmiany kosztują najmniej.',
                },
                {
                    title: 'Sprinty i demo',
                    description: 'Programujemy w dwutygodniowych sprintach. Po każdym pokazujemy działający fragment na wersji testowej, a zadania i czas pracy widzisz w panelu klienta.',
                },
                {
                    title: 'Wdrożenie i rozwój',
                    description: 'Przenosimy dane, szkolimy użytkowników i uruchamiamy aplikację. Potem monitorujemy jej działanie i rozwijamy ją o kolejne funkcje.',
                },
            ],
        },
        projects: { title: 'Aplikacje, które zbudowaliśmy' },
        guide: {
            title: 'Aplikacja, z której ludzie korzystają',
            intro: 'O co zadbać, zanim zamówisz aplikację, żeby nie skończyła jako kolejny arkusz, który wszyscy omijają.',
            sections: [
                {
                    heading: 'Zacznij od procesu, nie od funkcji',
                    paragraphs: [
                        'Lista funkcji szybko rośnie, a budżet razem z nią. Lepiej zacząć od jednego procesu, który dziś zabiera najwięcej czasu, np. przyjmowania zamówień albo rozliczania floty, i **zbudować go dobrze w pierwszej wersji**. Kolejne moduły dokładamy etapami, kiedy pierwsza wersja już pracuje i wiadomo, czego naprawdę brakuje.',
                    ],
                },
                {
                    heading: 'Integracje decydują o sukcesie',
                    paragraphs: [
                        'Aplikacja, do której trzeba przepisywać dane z innych systemów, szybko przestaje być używana. Dlatego od początku planujemy **wymianę danych z ERP, księgowością i płatnościami**. Łączymy się np. z Comarch ERP Optima, kalendarzem Google czy bramkami SMS.',
                    ],
                },
                {
                    heading: 'Prototyp oszczędza miesiące',
                    paragraphs: [
                        'Klikalny prototyp w Figmie pokazuje, jak będzie wyglądała praca w aplikacji, zanim powstanie kod. Sprawdzasz go z osobami, które będą z niej korzystać, a **zmiany na prototypie zajmują godziny, nie tygodnie**. Potem pracujemy w dwutygodniowych sprintach i po każdym pokazujemy działający fragment.',
                    ],
                },
                {
                    heading: 'Bezpieczeństwo od pierwszego dnia',
                    paragraphs: [
                        'Aplikacja przechowuje dane firmy i klientów, więc **role, uprawnienia i kopie zapasowe** projektujemy od samego początku. Logowanie może mieć drugi składnik, połączenia są szyfrowane, a działanie aplikacji monitorujemy po wdrożeniu. Dostępy do serwerów i domen trzymasz w zaszyfrowanym sejfie w panelu klienta.',
                    ],
                },
            ],
        },
        faq: { title: 'Częste pytania o aplikacje webowe' },
    },
    en: {
        name: 'Web applications',
        hero: {
            headingLines: ['Custom web', 'application', 'development'],
            wideLines: [[0, 1], [2]],
            lead: 'We design and build portals, B2B systems and SaaS platforms that organize the processes in your company and connect to the tools you already use. A web application starts at PLN\u00A01,699 and is usually ready within three weeks.',
            quote: 'Get a quote',
            quoteShort: 'Quote',
            facts: [
                { prefix: 'from', value: 'PLN\u00A01,699', label: 'a web application' },
                { prefix: 'up to', value: '3\u00A0wks', label: 'a web application from brief to launch' },
                { value: '2\u00A0wks', label: 'between demos on the staging version' },
                { value: 'Free', label: 'quote and consultation' },
            ],
        },
        scope: {
            title: 'What you get as standard',
            lead: 'Every application we build has these foundations. What varies is the processes it handles and the systems it connects to.',
            items: [
                {
                    title: 'Roles and permissions',
                    description: 'Everyone sees what they need for their work: a sales rep their orders, accounting the invoices, and an admin the whole picture.',
                },
                {
                    title: 'API integrations',
                    description: 'We connect the application to your ERP, accounting, payments, calendars and SMS gateways, so no one retypes data by hand.',
                },
                {
                    title: 'Reports and export',
                    description: 'Summaries, charts and export to PDF or CSV, ready for management and accounting without putting spreadsheets together by hand.',
                },
                {
                    title: 'Live data',
                    description: 'Notifications and updates without reloading the page: a new order, a status change or a vehicle’s position shows up right away.',
                },
                {
                    title: 'Secure log-in',
                    description: 'Encrypted connections, backups and an optional second log-in factor, such as a one-time code sent by email.',
                },
                {
                    title: 'Deployments and monitoring',
                    description: 'Automated tests, deployments without downtime, monitoring and a change history. We hear about a problem right away.',
                },
            ],
        },
        pricing: {
            title: 'How much does a web application cost',
            lead: 'The price depends on the number of screens and roles, the integrations and the security requirements. Below are the two tiers we start from.',
        },
        process: {
            title: 'How an application comes together',
            lead: 'Four stages, with two-week sprints in the third. A typical application is usually ready within three weeks, and we build a large system in stages.',
            steps: [
                {
                    title: 'Process analysis',
                    description: 'We talk to the people who will use the application, map the process step by step and write down the scope: roles, screens, integrations and data.',
                },
                {
                    title: 'A Figma prototype',
                    description: 'We design the key screens and a clickable prototype. You review it with your team before the first module is built, so changes cost the least.',
                },
                {
                    title: 'Sprints and demos',
                    description: 'We code in two-week sprints. After each one, we show you a working part on the staging version, and you see the tasks and hours in the client portal.',
                },
                {
                    title: 'Launch and growth',
                    description: 'We move your data, train your users and launch the application. After that, we monitor it and add new features.',
                },
            ],
        },
        projects: { title: 'Applications we’ve built' },
        guide: {
            title: 'An application people actually use',
            intro: 'What to take care of before you order an application, so it doesn’t end up as another spreadsheet everyone avoids.',
            sections: [
                {
                    heading: 'Start from the process, not the features',
                    paragraphs: [
                        'A feature list grows fast, and the budget grows with it. It’s better to start from the one process that takes the most time today, such as taking orders or settling fleet costs, and **build it well in the first version**. We add further modules in stages, once the first version is working and it’s clear what’s really missing.',
                    ],
                },
                {
                    heading: 'Integrations decide success',
                    paragraphs: [
                        'An application that needs data retyped from other systems soon stops being used. That’s why we plan **data exchange with your ERP, accounting and payments** from the start. We connect, for example, to Comarch ERP Optima, Google Calendar or SMS gateways.',
                    ],
                },
                {
                    heading: 'A prototype saves months',
                    paragraphs: [
                        'A clickable Figma prototype shows how working in the application will feel before any code exists. You review it with the people who will use it, and **changes in the prototype take hours, not weeks**. Then we work in two-week sprints and show you a working part after each one.',
                    ],
                },
                {
                    heading: 'Security from day one',
                    paragraphs: [
                        'The application stores your company’s and your customers’ data, so we design **roles, permissions and backups** from the very start. Log-in can have a second factor, connections are encrypted, and we monitor the application after launch. You keep the access details for servers and domains in an encrypted vault in the client portal.',
                    ],
                },
            ],
        },
        faq: { title: 'Common questions about web applications' },
    },
});
