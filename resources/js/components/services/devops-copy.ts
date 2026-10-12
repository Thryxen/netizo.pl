import { localized } from '@/lib/i18n';
import type { ServiceCopy } from './service-copy';

/** DevOps & Cloud (/devops-i-chmura, /en/devops-cloud). No timelines: the audit sets them. */
export const DEVOPS_COPY = localized<ServiceCopy>({
    pl: {
        name: 'DevOps & Cloud',
        hero: {
            headingLines: ['DevOps i chmura', 'dla firm'],
            lead: 'Porządkujemy serwery i chmurę, żeby strona albo aplikacja działała szybko i bez przerw: automatyczne wdrożenia, kopie zapasowe, które da się odtworzyć, monitoring 24/7 i bezpieczeństwo. Konfiguracja z CI/CD kosztuje od 499\u00A0zł.',
            quote: 'Wyceń wdrożenie',
            quoteShort: 'Wycena',
            facts: [
                { prefix: 'od', value: '499\u00A0zł', label: 'konfiguracja serwera i CI/CD' },
                { prefix: 'od', value: '5\u00A0000\u00A0zł', label: 'infrastruktura jako kod i migracja' },
                { value: '24/7', label: 'monitoring i alerty' },
                { value: '0\u00A0zł', label: 'za wycenę i konsultację' },
            ],
        },
        scope: {
            title: 'Co dostajesz w standardzie',
            lead: 'Każde wdrożenie, które robimy, ma te elementy. Różnią się skala, liczba usług i to, czy przenosimy system z innego miejsca.',
            items: [
                {
                    title: 'Wdrożenia bez stresu',
                    description: 'Każda zmiana w repozytorium przechodzi testy i trafia na serwer automatycznie. Koniec z ręcznym wgrywaniem plików przez FTP.',
                },
                {
                    title: 'Kopie zapasowe',
                    description: 'Automatyczne kopie bazy i plików w osobnej lokalizacji, regularnie sprawdzane odtworzeniem, a nie tylko „zrobione”.',
                },
                {
                    title: 'Monitoring 24/7',
                    description: 'Sprawdzamy dostępność, czas odpowiedzi i błędy. O problemie dowiadujemy się od razu z alertu, a nie od klienta.',
                },
                {
                    title: 'Bezpieczny serwer',
                    description: 'Aktualizacje, firewall, certyfikaty SSL i dostęp tylko dla osób, które go potrzebują. Hasła i klucze trzymamy w zaszyfrowanym sejfie.',
                },
                {
                    title: 'Wydajność i skalowanie',
                    description: 'Cache, CDN i serwer dobrany do ruchu, a w chmurze automatyczne skalowanie, gdy przychodzi więcej odwiedzających.',
                },
                {
                    title: 'Koszty pod kontrolą',
                    description: 'Dobieramy usługi do potrzeb i pokazujemy miesięczny koszt infrastruktury, żeby rachunek za chmurę nie zaskakiwał.',
                },
            ],
        },
        pricing: {
            title: 'Ile kosztuje DevOps i chmura',
            lead: 'Cena zależy od liczby serwerów i usług, wymagań co do dostępności i tego, czy przenosimy system z innego miejsca. Do tego dochodzi miesięczny koszt serwerów albo chmury, który szacujemy z góry.',
        },
        process: {
            title: 'Jak porządkujemy infrastrukturę',
            lead: 'Cztery etapy, a zaczynamy od przeglądu tego, co już działa. Termin podajemy po audycie.',
            steps: [
                {
                    title: 'Audyt',
                    description: 'Sprawdzamy serwery, kopie zapasowe, wdrożenia i bezpieczeństwo, a potem opisujemy, co działa, co jest ryzykiem i od czego zacząć.',
                },
                {
                    title: 'Plan i koszty',
                    description: 'Proponujemy docelową infrastrukturę: serwer albo chmurę, sposób wdrożeń i monitoring, razem z miesięcznym kosztem utrzymania.',
                },
                {
                    title: 'Wdrożenie',
                    description: 'Konfigurujemy środowiska, CI/CD i kopie zapasowe, a migrację planujemy tak, żeby strona albo aplikacja działała bez przerwy.',
                },
                {
                    title: 'Monitoring i opieka',
                    description: 'Po wdrożeniu monitorujemy system, aktualizujemy go i reagujemy na alerty. Zadania i ich etapy widzisz w panelu klienta.',
                },
            ],
        },
        projects: { title: 'Wdrożenia, które zrobiliśmy' },
        guide: {
            title: 'Infrastruktura, o której nie musisz myśleć',
            intro: 'Na co zwrócić uwagę, zanim strona albo aplikacja zacznie zarabiać, żeby awaria serwera nie zatrzymała firmy.',
            sections: [
                {
                    heading: 'Kopia, której nikt nie sprawdził, nie istnieje',
                    paragraphs: [
                        'Wiele firm ma kopie zapasowe tylko z nazwy: robią się, ale nikt nigdy nie próbował ich odtworzyć. Dlatego **testujemy odtwarzanie kopii** i trzymamy je w innej lokalizacji niż serwer, żeby awaria albo pomyłka nie zabrała danych na zawsze.',
                    ],
                },
                {
                    heading: 'Wdrożenie nie powinno być stresem',
                    paragraphs: [
                        'Ręczne wgrywanie plików na serwer kończy się błędami i nocnymi poprawkami. Z **CI/CD** każda zmiana przechodzi automatyczne testy i trafia na serwer zawsze w ten sam sposób, a w razie problemu wracamy do poprzedniej wersji jednym kliknięciem.',
                    ],
                },
                {
                    heading: 'Chmura czy własny serwer?',
                    paragraphs: [
                        'Chmura opłaca się, gdy ruch zmienia się w ciągu dnia albo sezonu, a system musi rosnąć bez przerw w działaniu. Przy stałym, przewidywalnym ruchu często wystarczy **dobrze skonfigurowany serwer**, który kosztuje mniej. Liczymy oba warianty, zanim coś zaproponujemy.',
                    ],
                },
                {
                    heading: 'Monitoring, który budzi właściwą osobę',
                    paragraphs: [
                        'Sam wykres dostępności nie wystarczy. Ustawiamy **alerty na to, co naprawdę ważne**: niedostępność, wolne odpowiedzi, błędy i kończące się miejsce na dysku, żeby reagować, zanim problem zauważą klienci.',
                    ],
                },
            ],
        },
        faq: { title: 'Częste pytania o DevOps i chmurę' },
    },
    en: {
        name: 'DevOps & cloud',
        hero: {
            headingLines: ['DevOps and cloud', 'for businesses'],
            lead: 'We put your servers and cloud in order, so your website or app runs fast and without interruptions: automated deployments, backups that actually restore, 24/7 monitoring and security. A setup with CI/CD starts at PLN\u00A0499.',
            quote: 'Get a quote',
            quoteShort: 'Quote',
            facts: [
                { prefix: 'from', value: 'PLN\u00A0499', label: 'server setup and CI/CD' },
                { prefix: 'from', value: 'PLN\u00A05,000', label: 'infrastructure as code and migration' },
                { value: '24/7', label: 'monitoring and alerts' },
                { value: 'Free', label: 'quote and consultation' },
            ],
        },
        scope: {
            title: 'What you get as standard',
            lead: 'Every rollout we do has these. What varies is the scale, the number of services and whether we move your system from somewhere else.',
            items: [
                {
                    title: 'Stress-free deployments',
                    description: 'Every change in the repository goes through tests and reaches the server automatically. No more uploading files by hand over FTP.',
                },
                {
                    title: 'Backups',
                    description: 'Automatic backups of the database and files in a separate location, regularly checked by restoring them, not just “made”.',
                },
                {
                    title: '24/7 monitoring',
                    description: 'We check uptime, response times and errors. We learn about a problem right away from an alert, not from a customer.',
                },
                {
                    title: 'A secure server',
                    description: 'Updates, a firewall, SSL certificates and access only for the people who need it. We keep passwords and keys in an encrypted vault.',
                },
                {
                    title: 'Performance and scaling',
                    description: 'Caching, a CDN and a server sized to your traffic, and in the cloud automatic scaling when more visitors arrive.',
                },
                {
                    title: 'Costs under control',
                    description: 'We choose services for your needs and show you the monthly cost of the infrastructure, so the cloud bill never surprises you.',
                },
            ],
        },
        pricing: {
            title: 'How much do DevOps and cloud work cost',
            lead: 'The price depends on the number of servers and services, the uptime requirements and whether we move your system from somewhere else. On top of that comes the monthly cost of the servers or the cloud, which we estimate up front.',
        },
        process: {
            title: 'How we put infrastructure in order',
            lead: 'Four stages, and we start by reviewing what already works. We give you the timeline after the audit.',
            steps: [
                {
                    title: 'Audit',
                    description: 'We check the servers, backups, deployments and security, then describe what works, what’s a risk and where to start.',
                },
                {
                    title: 'Plan and costs',
                    description: 'We propose the target infrastructure: a server or the cloud, the way of deploying and monitoring, together with the monthly running cost.',
                },
                {
                    title: 'Rollout',
                    description: 'We set up the environments, CI/CD and backups, and plan the migration so your website or app keeps running without interruption.',
                },
                {
                    title: 'Monitoring and support',
                    description: 'After the rollout, we monitor the system, keep it updated and act on alerts. You see the tasks and their stages in the client portal.',
                },
            ],
        },
        projects: { title: 'Rollouts we’ve done' },
        guide: {
            title: 'Infrastructure you don’t have to think about',
            intro: 'What to look at before your website or app starts earning, so a server failure doesn’t stop your company.',
            sections: [
                {
                    heading: 'A backup no one has tested doesn’t exist',
                    paragraphs: [
                        'Many companies have backups in name only: they get made, but no one has ever tried to restore them. That’s why we **test restoring the backups** and keep them in a different location from the server, so a failure or a mistake can’t take your data for good.',
                    ],
                },
                {
                    heading: 'Deployments shouldn’t be stressful',
                    paragraphs: [
                        'Uploading files to a server by hand ends in errors and late-night fixes. With **CI/CD**, every change goes through automated tests and reaches the server the same way every time, and if something goes wrong, we roll back to the previous version with one click.',
                    ],
                },
                {
                    heading: 'The cloud or your own server?',
                    paragraphs: [
                        'The cloud pays off when traffic changes over the day or the season, and the system has to grow without downtime. With steady, predictable traffic, **a well-configured server** that costs less is often enough. We price both options before we propose anything.',
                    ],
                },
                {
                    heading: 'Monitoring that wakes the right person',
                    paragraphs: [
                        'An uptime chart alone isn’t enough. We set up **alerts for what really matters**: downtime, slow responses, errors and disks running out of space, so we can act before customers notice a problem.',
                    ],
                },
            ],
        },
        faq: { title: 'Common questions about DevOps and the cloud' },
    },
});
