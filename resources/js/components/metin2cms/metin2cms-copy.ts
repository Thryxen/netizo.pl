/**
 * The copy of the Metin2 CMS page that sits next to its components (lang/{pl,en}/metin2cms.php holds the meta tags and
 * the FAQ). What the page says the system does is what the first deployment (Sherkan) does: the cache times are its
 * defaults (ranking 30 minutes, the signed-in account 60 seconds, the online chart 5 minutes), the login locks after
 * five failed attempts, the logs page reads 19 kinds of game logs. The FAQ quotes the same figures.
 */

import type { ServiceCopy } from '@/components/services/service-copy';
import { localized } from '@/lib/i18n';

/**
 * The screens of the deployment's showcase, in the order of `caseStudy.groups` and their `screens`: the address the
 * browser window shows and the screen's file (screen-{file}.webp); `home` is the clip of the home page.
 */
export const SHOWCASE_SCREENS = [
    [
        { key: 'home', path: '', file: null },
        { key: 'ranking', path: 'ranking', file: 'site-ranking' },
        { key: 'top-up', path: 'doladuj', file: 'site-top-up' },
        { key: 'support', path: 'support', file: 'site-support' },
    ],
    [
        { key: 'dashboard', path: 'admin', file: 'admin-dashboard' },
        { key: 'accounts', path: 'admin/konta', file: 'admin-accounts' },
        { key: 'character', path: 'admin/postacie/1', file: 'admin-character' },
        { key: 'logs', path: 'admin/logi', file: 'admin-logs' },
        { key: 'bans', path: 'admin/bany', file: 'admin-bans' },
        { key: 'payments', path: 'admin/doladowania', file: 'admin-top-up' },
        { key: 'news', path: 'admin/aktualnosci', file: 'admin-news' },
        { key: 'tickets', path: 'admin/support', file: 'admin-support' },
    ],
] as const;

export type Metin2CmsCopy = {
    /** Beside the logo in the header, and the breadcrumb's last crumb. */
    name: string;
    hero: ServiceCopy['hero'] & {
        /** The second button, down to the system section. */
        secondary: string;
        /** Beside the phone number: where we work. */
        area: string;
        /** The chips over the stage. */
        chips: { deploy: string; deployDetail: string; cache: string; cacheDetail: string; payment: string; paymentDetail: string; now: string };
    };
    header: { system: string; features: string; performance: string; caseStudy: string; faq: string };
    system: { title: string; lead: string; parts: { title: string; description: string; points: string[] }[] };
    features: {
        title: string;
        lead: string;
        included: string;
        groups: { title: string; items: string[] }[];
        custom: string;
        customLead: string;
        customItems: string[];
    };
    pillars: {
        title: string;
        lead: string;
        items: { title: string; description: string }[];
        /** `stack`: what the system is built with, as tech tags. */
        ownership: { title: string; description: string; stack: string[] };
    };
    performance: {
        title: string;
        lead: string;
        example: string;
        visits: string;
        visitsValue: string;
        queries: string;
        queriesValue: string;
        points: string[];
        facts: { value: string; label: string }[];
        note: string;
    };
    /** `defence`: the system's answer in a few words, beside a shield under the sentence. */
    threats: { title: string; lead: string; items: { threat: string; defence: string; answer: string }[] };
    caseStudy: {
        title: string;
        lead: string;
        facts: { label: string; value: string }[];
        note: string;
        /** Names the tab list. */
        pick: string;
        /** The screens of the showcase in two groups (SHOWCASE_SCREENS): the site and player panel, the admin panel. */
        groups: { title: string; screens: { label: string; description: string }[] }[];
    };
    launch: { title: string; lead: string; steps: { title: string; description: string }[] };
    faq: { title: string };
    contact: { title: string; lead: string; messagePlaceholder: string };
};

export const METIN2CMS_COPY = localized<Metin2CmsCopy>({
    pl: {
        name: 'Metin2 CMS',
        hero: {
            headingLines: ['Strona i panel', 'dla serwera', 'Metin2'],
            wideLines: [[0, 1], [2]],
            lead: 'Budujemy strony serwerów Metin2 z panelem gracza i panelem administratora. Podpinamy system pod Twoją bazę gry, stawiamy cache na Redisie, wdrażamy przez zero-downtime deploy i przekazujemy kod na własność.',
            quote: 'Zapytaj o wdrożenie',
            quoteShort: 'Zapytaj',
            secondary: 'Zobacz system',
            area: 'Wdrożenie zdalne, cała Polska',
            facts: [
                { value: '3 w 1', label: 'strona serwera, panel gracza i panel administratora' },
                { value: '0 s', label: 'downtime przy deployu nowej wersji' },
                { prefix: 'tylko', value: '2 / godz.', label: 'zapytania o ranking do bazy gry, reszta idzie z cache' },
                { value: '100%', label: 'kodu na własność, w Twoim repozytorium' },
            ],
            chips: {
                deploy: 'Deploy zakończony',
                deployDetail: 'Downtime: 0 s',
                cache: 'Ranking: cache hit',
                cacheDetail: '0 zapytań do bazy gry',
                payment: 'Doładowanie zaksięgowane',
                paymentDetail: '2200 SM na koncie gracza',
                now: 'teraz',
            },
        },
        header: { system: 'System', features: 'Funkcje', performance: 'Wydajność', caseStudy: 'Realizacja', faq: 'FAQ' },
        system: {
            title: 'Co dostajesz w standardzie',
            lead: 'Każde wdrożenie ma te trzy części. Gracz loguje się tym samym loginem, hasłem i PIN-em co w grze, a system działa na Twojej bazie, bez kopiowania kont.',
            parts: [
                {
                    title: 'Strona serwera',
                    description: 'Pierwsze miejsce, które widzi nowy gracz: prezentacja serwera, pobieranie klienta i ranking.',
                    points: ['Aktualności z okładkami i kalendarz eventów', 'Ranking graczy i gildii', 'Pobieranie klienta z kilku źródeł', 'Regulamin i polityka edytowane w panelu'],
                },
                {
                    title: 'Panel gracza',
                    description: 'Konto gracza bez pisania do administratora: rejestracja, doładowanie i zmiana danych.',
                    points: ['Rejestracja z potwierdzeniem e-mail', 'Doładowania z płatnością online', 'Zmiana hasła, PIN-u i adresu e-mail', 'Zgłoszenia do supportu z załącznikami'],
                },
                {
                    title: 'Panel administratora',
                    description: 'Zarządzanie serwerem z przeglądarki, bez zaglądania do bazy.',
                    points: ['Konta, postacie i ekwipunek', 'Logi gry i graf powiązań kont', 'Bany kont i sprzętu (HWID)', 'Wpłaty, pakiety i promocje'],
                },
            ],
        },
        features: {
            title: 'Funkcje w standardzie i na zamówienie',
            lead: 'Standard wystarcza, żeby wystartować. Resztę robimy pod Twój serwer, zwykle w kilka dni.',
            included: 'W standardzie',
            groups: [
                {
                    title: 'Dla gracza',
                    items: ['Logowanie kontem z gry', 'Rejestracja z hCaptcha i potwierdzeniem e-mail', 'Odzyskiwanie hasła i PIN-u', 'Doładowania przez CashBill', 'Ranking graczy i gildii', 'Zgłoszenia do supportu', 'Zmiana danych konta'],
                },
                {
                    title: 'Dla administratora',
                    items: ['Pulpit z wykresem online i zarobkami', 'Konta, postacie i ekwipunek', 'Logi gry w 19 kategoriach', 'Graf powiązań kont, IP i HWID', 'Bany kont i HWID', 'Pakiety, promocje i historia wpłat', 'Aktualności, eventy i pobieranie', 'Reflinki z nagrodami', 'Wyłączanie podstron jednym przełącznikiem'],
                },
                {
                    title: 'Pod maską',
                    items: ['Cache zapytań do bazy gry (Redis)', 'Zero-downtime deploy z rollbackiem', 'Rate limiting logowania i formularzy', 'Import ikon przedmiotów z klienta (TGA → PNG)', 'Kolejki i sesje na Redisie', 'SSR, sitemap.xml i meta tagi pod SEO'],
                },
            ],
            custom: 'Na zamówienie',
            customLead: 'Najczęstsze prośby właścicieli serwerów. Każdą z nich dopisujemy do Twojej wersji systemu.',
            customItems: ['Itemshop w przeglądarce', 'Vote4Coins', 'Koło fortuny', 'Wiki przedmiotów i potworów', 'Kolejne wersje językowe', 'PayPal, Stripe, paysafecard', 'Logowanie przez Discord', 'Powiadomienia na Discordzie', 'Kody promocyjne', 'Statystyki serwera na żywo', 'API dla launchera i patchera', 'Własny wygląd strony'],
        },
        pillars: {
            title: 'Na czym opiera się system',
            lead: 'Cztery rzeczy, które są takie same w każdym wdrożeniu, bez względu na pliki serwera.',
            items: [
                { title: 'Cache zapytań', description: 'Ranking, wykresy i dane konta idą z Redisa. Ranking ma TTL 30 minut, więc baza gry dostaje 2 zapytania na godzinę bez względu na ruch.' },
                { title: 'Zero-downtime deploy', description: 'Nowy release budujemy obok działającego i przełączamy atomowo. Bez maintenance mode, bez wylogowania graczy, z rollbackiem do poprzedniej wersji.' },
                { title: 'Custom moduły', description: 'Masz własny system w grze? Dopisujemy do niego model, ekran w panelu albo podstronę. Mniejsze zmiany zajmują zwykle kilka dni.' },
                { title: 'Utrzymanie', description: 'Backupy, aktualizacje zależności i patche bezpieczeństwa są po naszej stronie. Ty zajmujesz się grą i społecznością.' },
            ],
            ownership: {
                title: 'Kod na własność',
                description: 'Po wdrożeniu przekazujemy repozytorium z całym kodem. Możesz rozwijać system z nami, z własnym programistą albo samodzielnie.',
                stack: ['Laravel 13', 'React 19', 'Inertia', 'Tailwind CSS 4', 'Redis', 'MariaDB'],
            },
        },
        performance: {
            title: 'Strona, która nie obciąża bazy gry',
            lead: 'W Metinie płynność gry zależy od bazy danych. Dlatego strona odpytuje ją tak rzadko, jak to możliwe: wyniki trzyma w cache, a każde zapytanie idzie po indeksie.',
            example: 'Przykład: godzina po starcie serwera',
            visits: 'Odwiedziny rankingu',
            visitsValue: '12 480',
            queries: 'Zapytania do bazy gry',
            queriesValue: '2',
            points: ['Cache w Redisie, wspólny dla wszystkich requestów', 'Jedno zapytanie z GROUP BY zamiast N+1', 'Logi czytane po indeksie i tylko z partycji wybranego okresu'],
            facts: [
                { value: '30 min', label: 'TTL cache rankingu graczy i gildii' },
                { value: '60 s', label: 'TTL cache zalogowanego konta i jego postaci' },
                { value: '5 min', label: 'odświeżanie wykresu online, doczytuje tylko nowe wiersze po kluczu głównym' },
            ],
            note: 'To wartości domyślne. TTL dobieramy pod Twój serwer.',
        },
        threats: {
            title: 'Z czym mierzy się każdy serwer',
            lead: 'Te problemy przychodzą razem z popularnością. System ma na każdy z nich gotową odpowiedź.',
            items: [
                { threat: 'Boty zakładające konta', defence: 'hCaptcha i potwierdzenie e-mail', answer: 'Rejestracja z hCaptcha, potwierdzeniem e-mail i limitem prób z jednego adresu.' },
                { threat: 'Zgadywanie haseł', defence: 'Rate limit: 5 prób na login i IP', answer: 'Po pięciu nieudanych próbach logowanie blokuje się na minutę, a do wejścia potrzebny jest też PIN.' },
                { threat: 'Multikonta i handel między nimi', defence: 'Wspólne IP i HWID na grafie', answer: 'Graf powiązań pokazuje konta ze wspólnym IP i sprzętem oraz ich handel, sklepy i walki.' },
                { threat: 'Zbanowani, którzy wracają', defence: 'Blokada HWID', answer: 'Blokada sprzętu (HWID) zamyka dostęp do gry z danego komputera, nie tylko z jednego konta.' },
                { threat: 'Wpłaty, które utknęły', defence: 'Weryfikacja statusu u operatora', answer: 'Każdą płatność porównujemy ze statusem u operatora. Te do sprawdzenia trafiają na osobną listę.' },
                { threat: 'Ciężkie zapytania w godzinach szczytu', defence: 'Pamięć podręczna', answer: 'Ranking, wykresy i listy korzystają z pamięci podręcznej, więc ruch na stronie nie dociąża bazy gry.' },
            ],
        },
        caseStudy: {
            title: 'Wdrożenie: serwer Sherkan',
            lead: 'Oldschoolowy serwer Metin2, dla którego zbudowaliśmy stronę, panel gracza i panel administratora. Wygląd jest w całości jego: grafiki, kolory i animowany nagłówek powstały pod ten projekt. Wybierz ekran i zobacz system w działaniu.',
            facts: [
                { label: 'Zakres', value: 'Strona, panel gracza, panel administratora' },
                { label: 'Płatności', value: 'CashBill' },
                { label: 'Na zamówienie', value: 'Graf powiązań kont, reflinki, kalendarz eventów' },
            ],
            note: 'Dane graczy widoczne na nagraniu i zrzutach są zmyślone.',
            pick: 'Ekrany wdrożenia',
            groups: [
                {
                    title: 'Strona i panel gracza',
                    screens: [
                        { label: 'Strona główna', description: 'Animowany nagłówek, ranking, aktualności, kalendarz eventów i panel gracza. Nagranie strony głównej.' },
                        { label: 'Ranking', description: 'Stu najlepszych graczy i gildie, z klasą, poziomem i królestwem.' },
                        { label: 'Doładowania', description: 'Pakiety monet z bonusem i płatność online. Monety trafiają na konto od razu po wpłacie.' },
                        { label: 'Support', description: 'Zgłoszenia gracza z kategorią i załącznikami, z odpowiedziami w jednym wątku.' },
                    ],
                },
                {
                    title: 'Panel administratora',
                    screens: [
                        { label: 'Pulpit', description: 'Konta, gracze online z ostatniej doby i zarobki z doładowań na jednym ekranie.' },
                        { label: 'Konta', description: 'Wyszukiwanie po loginie lub e-mailu, status konta i ostatnie logowanie.' },
                        { label: 'Postać i ekwipunek', description: 'Statystyki, ekwipunek i magazyn postaci, z opisami przedmiotów jak w kliencie gry.' },
                        { label: 'Logi i powiązania', description: 'Handel, sklepy i PvP na jednym grafie, ze wspólnym IP i sprzętem. Multikonto widać od razu.' },
                        { label: 'Bany', description: 'Blokada konta albo całego komputera (HWID), z podglądem powiązanych kont.' },
                        { label: 'Wpłaty', description: 'Każda wpłata ze statusem u operatora, pakiety monet i promocje czasowe.' },
                        { label: 'Aktualności', description: 'Wpisy z edytorem tekstu i okładką, widoczne na stronie głównej.' },
                        { label: 'Zgłoszenia', description: 'Zgłoszenia graczy w kolejce, z kategorią, załącznikami i przydzielonym administratorem.' },
                    ],
                },
            ],
        },
        launch: {
            title: 'Jak wygląda wdrożenie',
            lead: 'Cztery kroki. Twój serwer może w tym czasie normalnie działać.',
            steps: [
                { title: 'Rozmowa i dostęp', description: 'Opowiadasz o serwerze i plikach. Dostajemy osobnego użytkownika bazy z uprawnieniami tylko dla strony.' },
                { title: 'Podpięcie pod bazę', description: 'Łączymy system z Twoimi bazami account, player, common i log i sprawdzamy każdy ekran na prawdziwych danych.' },
                { title: 'Wygląd i treści', description: 'Projektujemy stronę pod Twój serwer: grafiki, kolory, teksty i maile.' },
                { title: 'Deploy i utrzymanie', description: 'Zero-downtime deploy na produkcję, przekazanie repozytorium i dalsze utrzymanie.' },
            ],
        },
        faq: { title: 'Częste pytania' },
        contact: {
            title: 'Porozmawiajmy o Twoim serwerze',
            lead: 'Napisz, na jakich plikach działasz i kiedy planujesz start. Odpowiemy w ciągu 24 godzin.',
            messagePlaceholder: 'Np. serwer na plikach Marty Sama, start za miesiąc, potrzebuję strony z itemshopem.',
        },
    },
    en: {
        name: 'Metin2 CMS',
        hero: {
            headingLines: ['Website and', 'panel for your', 'Metin2 server'],
            wideLines: [[0, 1], [2]],
            lead: 'We build Metin2 server websites with a player panel and an admin panel. We connect the system to your game database, put a Redis cache in front of it, ship with zero-downtime deploys and hand the code over to you.',
            quote: 'Ask about a deployment',
            quoteShort: 'Ask',
            secondary: 'See the system',
            area: 'Remote deployment, anywhere',
            facts: [
                { value: '3 in 1', label: 'the server website, the player panel and the admin panel' },
                { value: '0 s', label: 'of downtime on every deploy' },
                { prefix: 'only', value: '2 / hour', label: 'ranking queries to the game database, the rest comes from cache' },
                { value: '100%', label: 'of the code is yours, in your repository' },
            ],
            chips: {
                deploy: 'Deploy finished',
                deployDetail: 'Downtime: 0 s',
                cache: 'Ranking: cache hit',
                cacheDetail: '0 queries to the game database',
                payment: 'Top-up credited',
                paymentDetail: '2200 coins on the account',
                now: 'now',
            },
        },
        header: { system: 'System', features: 'Features', performance: 'Performance', caseStudy: 'Case study', faq: 'FAQ' },
        system: {
            title: 'What’s included',
            lead: 'Every deployment has these three parts. A player signs in with the same login, password and PIN as in the game, and the system runs on your database, with no copies of the accounts.',
            parts: [
                {
                    title: 'Server website',
                    description: 'The first place a new player sees: what the server is, the client download and the ranking.',
                    points: ['News with covers and an event calendar', 'Player and guild rankings', 'Client downloads from several sources', 'Terms and privacy policy edited in the panel'],
                },
                {
                    title: 'Player panel',
                    description: 'A player account without writing to an admin: sign-up, top-up and changing the details.',
                    points: ['Sign-up with email confirmation', 'Top-ups with online payment', 'Password, PIN and email changes', 'Support requests with attachments'],
                },
                {
                    title: 'Admin panel',
                    description: 'Running the server from a browser, without opening the database.',
                    points: ['Accounts, characters and equipment', 'Game logs and the account connection graph', 'Account and hardware (HWID) bans', 'Payments, packages and promotions'],
                },
            ],
        },
        features: {
            title: 'Features included and made to order',
            lead: 'What is included is enough to launch. The rest we build for your server, usually in a few days.',
            included: 'Included',
            groups: [
                {
                    title: 'For the player',
                    items: ['Sign-in with the game account', 'Sign-up with hCaptcha and email confirmation', 'Password and PIN recovery', 'Top-ups through CashBill', 'Player and guild rankings', 'Support requests', 'Account detail changes'],
                },
                {
                    title: 'For the admin',
                    items: ['Dashboard with the online chart and earnings', 'Accounts, characters and equipment', 'Game logs in 19 categories', 'Connection graph of accounts, IPs and HWIDs', 'Account and HWID bans', 'Packages, promotions and payment history', 'News, events and downloads', 'Referral links with rewards', 'Pages switched off with one toggle'],
                },
                {
                    title: 'Under the hood',
                    items: ['Cache for game database queries (Redis)', 'Zero-downtime deploys with rollback', 'Rate limiting on login and forms', 'Item icon import from the client (TGA → PNG)', 'Queues and sessions on Redis', 'SSR, sitemap.xml and meta tags for SEO'],
                },
            ],
            custom: 'Made to order',
            customLead: 'What server owners ask for most often. We add each of them to your version of the system.',
            customItems: ['Item shop in the browser', 'Vote4Coins', 'Wheel of fortune', 'Item and monster wiki', 'More languages', 'PayPal, Stripe, paysafecard', 'Sign-in with Discord', 'Discord notifications', 'Promo codes', 'Live server statistics', 'API for the launcher and patcher', 'Your own look of the website'],
        },
        pillars: {
            title: 'What the system is built on',
            lead: 'Four things that are the same in every deployment, whatever the server files.',
            items: [
                { title: 'Query cache', description: 'The ranking, the charts and the account data come from Redis. The ranking has a 30-minute TTL, so the game database gets 2 queries an hour whatever the traffic.' },
                { title: 'Zero-downtime deploys', description: 'We build the new release beside the running one and switch atomically. No maintenance mode, no players signed out, with a rollback to the previous version.' },
                { title: 'Custom modules', description: 'Have a system of your own in the game? We add a model, a panel screen or a page for it. Smaller changes usually take a few days.' },
                { title: 'Maintenance', description: 'Backups, dependency updates and security patches are on our side. You look after the game and the community.' },
            ],
            ownership: {
                title: 'Code you own',
                description: 'After the deployment we hand over the repository with all the code. You can develop the system with us, with your own developer or on your own.',
                stack: ['Laravel 13', 'React 19', 'Inertia', 'Tailwind CSS 4', 'Redis', 'MariaDB'],
            },
        },
        performance: {
            title: 'A website that puts no load on the game database',
            lead: 'In Metin the game runs only as smoothly as its database. So the website asks it as rarely as possible, and every query uses an index.',
            example: 'Example: an hour after the server opens',
            visits: 'Visits to the ranking',
            visitsValue: '12,480',
            queries: 'Queries to the game database',
            queriesValue: '2',
            points: ['A Redis cache shared by every request', 'One GROUP BY query in place of N+1', 'Logs read on an index and only from the partition of the chosen period'],
            facts: [
                { value: '30 min', label: 'cache TTL of the player and guild rankings' },
                { value: '60 s', label: 'cache TTL of the signed-in account and its characters' },
                { value: '5 min', label: 'refresh of the online chart, reading only the new rows by primary key' },
            ],
            note: 'These are the defaults. We tune the TTLs to your server.',
        },
        threats: {
            title: 'What every server has to face',
            lead: 'These problems come with popularity. The system has an answer ready for each of them.',
            items: [
                { threat: 'Bots creating accounts', defence: 'hCaptcha and email confirmation', answer: 'Sign-up with hCaptcha, email confirmation and a limit on attempts from one address.' },
                { threat: 'Password guessing', defence: 'Rate limit: 5 attempts per login and IP', answer: 'After five failed attempts the login locks for a minute, and getting in takes the PIN too.' },
                { threat: 'Multi-accounts trading with each other', defence: 'Shared IP and HWID on the graph', answer: 'The connection graph shows accounts with a shared IP and hardware, and their trades, shops and fights.' },
                { threat: 'Banned players coming back', defence: 'HWID ban', answer: 'A hardware (HWID) ban closes the game to a computer, not just to one account.' },
                { threat: 'Payments that got stuck', defence: 'Status check with the provider', answer: 'We compare every payment with its status at the provider. The ones to check go on a list of their own.' },
                { threat: 'Heavy queries at peak hours', defence: 'Cache', answer: 'The ranking, charts and lists come from the cache, so traffic on the website adds no load to the game database.' },
            ],
        },
        caseStudy: {
            title: 'A deployment: the Sherkan server',
            lead: 'An old-school Metin2 server for which we built the website, the player panel and the admin panel. The look is entirely its own: the art, the colors and the animated header were made for this project. Pick a screen and see the system at work.',
            facts: [
                { label: 'Scope', value: 'Website, player panel, admin panel' },
                { label: 'Payments', value: 'CashBill' },
                { label: 'Made to order', value: 'Account connection graph, referral links, event calendar' },
            ],
            note: 'The player data in the clip and the screenshots is invented.',
            pick: 'Screens of the deployment',
            groups: [
                {
                    title: 'Website and player panel',
                    screens: [
                        { label: 'Home page', description: 'The animated header, the ranking, the news, the event calendar and the player panel. A recording of the home page.' },
                        { label: 'Ranking', description: 'The hundred best players and the guilds, with class, level and kingdom.' },
                        { label: 'Top-ups', description: 'Coin packages with a bonus and online payment. The coins reach the account as soon as the payment clears.' },
                        { label: 'Support', description: 'A player’s requests with a category and attachments, the replies in one thread.' },
                    ],
                },
                {
                    title: 'Admin panel',
                    screens: [
                        { label: 'Dashboard', description: 'Accounts, players online over the last day and top-up earnings on one screen.' },
                        { label: 'Accounts', description: 'Search by login or email, the account’s status and its last login.' },
                        { label: 'Character and equipment', description: 'A character’s stats, equipment and storage, with item descriptions as in the game client.' },
                        { label: 'Logs and connections', description: 'Trades, shops and PvP on one graph, with shared IPs and hardware. A multi-account shows at once.' },
                        { label: 'Bans', description: 'Block an account or a whole computer (HWID), with a view of the connected accounts.' },
                        { label: 'Payments', description: 'Every payment with its status at the provider, coin packages and time-limited promotions.' },
                        { label: 'News', description: 'Posts with a text editor and a cover, shown on the home page.' },
                        { label: 'Requests', description: 'Player requests in a queue, with a category, attachments and the admin they are assigned to.' },
                    ],
                },
            ],
        },
        launch: {
            title: 'How a deployment goes',
            lead: 'Four steps. Your server can keep running the whole time.',
            steps: [
                { title: 'A call and access', description: 'You tell us about the server and its files. We get a separate database user with rights for the website only.' },
                { title: 'Connecting the database', description: 'We connect the system to your account, player, common and log databases and check every screen on real data.' },
                { title: 'Look and content', description: 'We design the website for your server: the art, the colors, the copy and the emails.' },
                { title: 'Deploy and maintenance', description: 'A zero-downtime deploy to production, the repository handed over, and maintenance from then on.' },
            ],
        },
        faq: { title: 'Common questions' },
        contact: {
            title: 'Let’s talk about your server',
            lead: 'Tell us which files you run and when you plan to launch. We’ll reply within 24 hours.',
            messagePlaceholder: 'E.g. a server on the Marty Sama files, launching in a month, I need a website with an item shop.',
        },
    },
});
