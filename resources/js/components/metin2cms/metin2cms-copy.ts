/**
 * The copy of the Metin2 CMS page that sits next to its components (lang/{pl,en}/metin2cms.php holds the meta tags and
 * the FAQ). What the page says the system does is what the first deployment (Sherkan) does: the cache times are its
 * defaults (ranking 30 minutes, the signed-in account 60 seconds, the online chart 5 minutes), the login locks after
 * five failed attempts, the logs page reads 19 kinds of game logs. The FAQ quotes the same figures.
 */

import type { BentoService } from '@/components/home/bento/bento-tile';
import type { ServiceCopy } from '@/components/services/service-copy';
import { localized } from '@/lib/i18n';
import type { LogoName } from './metin2cms-images';

/** A screen of a deployment: `bar` is what the window's bar shows (the address, or an e-mail's subject), `file` its image (screen-{file}.webp; null for the clip of the home page). */
type DeploymentScreen = { key: string; bar: string; file: string | null };

/**
 * The deployments of the showcase, in the order of `caseStudy.deployments`, each with its screens in the order of that
 * entry's `groups` and their `screens`: the site and player panel, the admin panel, the e-mails it sends.
 */
export const DEPLOYMENTS: { key: string; logo: LogoName; groups: DeploymentScreen[][] }[] = [
    {
        key: 'sherkan',
        logo: 'sherkan',
        groups: [
            [
                { key: 'home', bar: 'sherkan', file: null },
                { key: 'ranking', bar: 'sherkan/ranking', file: 'site-ranking' },
                { key: 'top-up', bar: 'sherkan/doladuj', file: 'site-top-up' },
                { key: 'support', bar: 'sherkan/support', file: 'site-support' },
            ],
            [
                { key: 'dashboard', bar: 'sherkan/admin', file: 'admin-dashboard' },
                { key: 'accounts', bar: 'sherkan/admin/konta', file: 'admin-accounts' },
                { key: 'character', bar: 'sherkan/admin/postacie/1', file: 'admin-character' },
                { key: 'logs', bar: 'sherkan/admin/logi', file: 'admin-logs' },
                { key: 'bans', bar: 'sherkan/admin/bany', file: 'admin-bans' },
                { key: 'payments', bar: 'sherkan/admin/doladowania', file: 'admin-top-up' },
                { key: 'news', bar: 'sherkan/admin/aktualnosci', file: 'admin-news' },
                { key: 'tickets', bar: 'sherkan/admin/support', file: 'admin-support' },
            ],
            [
                { key: 'mail-confirmation', bar: 'Potwierdź swoje konto na Sherkan', file: 'mail-account-confirmation' },
                { key: 'mail-password', bar: 'Ustaw nowe hasło na Sherkan', file: 'mail-password-reset' },
                { key: 'mail-pin', bar: 'Twój nowy PIN na Sherkan', file: 'mail-new-pin' },
                { key: 'mail-change', bar: 'Potwierdź zmianę hasła na Sherkan', file: 'mail-password-change' },
            ],
        ],
    },
];

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
    /** The six parts of the system, one per tile of its bento; `tags` are what the part covers. */
    system: { title: string; lead: string; tiles: Record<'site' | 'player' | 'payments' | 'support' | 'admin' | 'logs', BentoService> };
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
    /** Whose logos the page shows under the hero. */
    trusted: { title: string; lead: string };
    caseStudy: {
        title: string;
        lead: string;
        note: string;
        /** Names the list of deployments (shown from the second one on). */
        choose: string;
        /** Names a deployment's list of screens. */
        pick: string;
        /** One entry per deployment (DEPLOYMENTS): a sentence on it, its facts and its screens in groups. */
        deployments: {
            description: string;
            facts: { label: string; value: string }[];
            groups: { title: string; screens: { label: string; description: string }[] }[];
        }[];
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
        header: { system: 'System', features: 'Funkcje', performance: 'Wydajność', caseStudy: 'Wdrożenia', faq: 'FAQ' },
        trusted: { title: 'Zaufali nam', lead: 'Serwery, dla których budujemy strony i panele.' },
        system: {
            title: 'Co dostajesz w standardzie',
            lead: 'Sześć części jednego systemu. Gracz loguje się tym samym loginem, hasłem i PIN-em co w grze, a wszystko działa na Twojej bazie, bez kopiowania kont.',
            tiles: {
                site: { title: 'Strona serwera', description: 'Prezentacja serwera, ranking, aktualności i pobieranie klienta, renderowane po stronie serwera pod SEO.', tags: ['Ranking', 'Aktualności', 'Eventy', 'Pobieranie', 'SSR'] },
                player: { title: 'Panel gracza', description: 'Rejestracja z potwierdzeniem e-mail, PIN, zmiana danych i lista postaci.', tags: ['Rejestracja', 'PIN', 'hCaptcha', 'E-maile'] },
                payments: { title: 'Doładowania', description: 'Pakiety monet, promocje czasowe i płatności online.', tags: ['CashBill', 'BLIK', 'Promocje'] },
                support: { title: 'Support', description: 'Zgłoszenia graczy z kategorią, załącznikami i przydzielonym administratorem.', tags: ['Tickety', 'Załączniki'] },
                admin: { title: 'Panel administratora', description: 'Konta, postacie z ekwipunkiem, wpłaty i treści strony w jednym panelu, bez zaglądania do bazy.', tags: ['Pulpit', 'Konta', 'Postacie', 'Wpłaty', 'Aktualności'] },
                logs: { title: 'Logi i bany', description: 'Logi gry w 19 kategoriach, graf powiązań kont i blokady sprzętu.', tags: ['Graf powiązań', 'HWID', 'Multikonta', 'Bany'] },
            },
        },
        features: {
            title: 'Funkcje w standardzie i na zamówienie',
            lead: 'Standard wystarcza, żeby wystartować. Resztę robimy pod Twój serwer, zwykle w kilka dni.',
            included: 'W standardzie',
            groups: [
                {
                    title: 'Dla gracza',
                    items: ['Logowanie kontem z gry', 'Rejestracja z hCaptcha i potwierdzeniem e-mail', 'Odzyskiwanie hasła i PIN-u', 'Doładowania przez CashBill', 'Ranking graczy i gildii', 'Zgłoszenia do supportu', 'Zmiana danych konta', 'Maile systemowe w wyglądzie serwera'],
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
            title: 'Wdrożenia',
            lead: 'Zobacz system na działającym serwerze: stronę, panele i maile, które wysyła.',
            note: 'Dane graczy widoczne na nagraniu i zrzutach są zmyślone.',
            choose: 'Wdrożenia',
            pick: 'Ekrany wdrożenia',
            deployments: [
                {
                    description: 'Oldschoolowy serwer Metin2, dla którego zbudowaliśmy stronę i panel.',
                    facts: [
                        { label: 'Zakres', value: 'Strona, panel gracza, panel administratora' },
                        { label: 'Płatności', value: 'CashBill' },
                        { label: 'Na zamówienie', value: 'Graf powiązań kont, reflinki, kalendarz eventów' },
                    ],
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
                        {
                            title: 'E-maile',
                            screens: [
                                { label: 'Potwierdzenie konta', description: 'Po rejestracji: PIN do gry i przycisk, który aktywuje konto.' },
                                { label: 'Nowe hasło', description: 'Link do ustawienia nowego hasła, ważny 60 minut.' },
                                { label: 'Nowy PIN', description: 'Wylosowany PIN po prośbie o przypomnienie danych.' },
                                { label: 'Zmiana hasła', description: 'Potwierdzenie zmiany hasła z ustawień konta, z ostrzeżeniem dla właściciela.' },
                            ],
                        },
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
        header: { system: 'System', features: 'Features', performance: 'Performance', caseStudy: 'Deployments', faq: 'FAQ' },
        trusted: { title: 'Trusted by', lead: 'Servers we build websites and panels for.' },
        system: {
            title: 'What’s included',
            lead: 'Six parts of one system. A player signs in with the same login, password and PIN as in the game, and everything runs on your database, with no copies of the accounts.',
            tiles: {
                site: { title: 'Server website', description: 'What the server is, the ranking, the news and the client download, server-rendered for SEO.', tags: ['Ranking', 'News', 'Events', 'Downloads', 'SSR'] },
                player: { title: 'Player panel', description: 'Sign-up with email confirmation, the PIN, account changes and the list of characters.', tags: ['Sign-up', 'PIN', 'hCaptcha', 'E-mails'] },
                payments: { title: 'Top-ups', description: 'Coin packages, time-limited promotions and online payments.', tags: ['CashBill', 'BLIK', 'Promotions'] },
                support: { title: 'Support', description: 'Player requests with a category, attachments and the admin they are assigned to.', tags: ['Tickets', 'Attachments'] },
                admin: { title: 'Admin panel', description: 'Accounts, characters with their equipment, payments and the site’s content in one panel, without opening the database.', tags: ['Dashboard', 'Accounts', 'Characters', 'Payments', 'News'] },
                logs: { title: 'Logs and bans', description: 'Game logs in 19 categories, the account connection graph and hardware bans.', tags: ['Connection graph', 'HWID', 'Multi-accounts', 'Bans'] },
            },
        },
        features: {
            title: 'Features included and made to order',
            lead: 'What is included is enough to launch. The rest we build for your server, usually in a few days.',
            included: 'Included',
            groups: [
                {
                    title: 'For the player',
                    items: ['Sign-in with the game account', 'Sign-up with hCaptcha and email confirmation', 'Password and PIN recovery', 'Top-ups through CashBill', 'Player and guild rankings', 'Support requests', 'Account detail changes', 'System e-mails in the server’s look'],
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
            title: 'Deployments',
            lead: 'See the system on a running server: the website, the panels and the e-mails it sends.',
            note: 'The player data in the clip and the screenshots is invented.',
            choose: 'Deployments',
            pick: 'Screens of the deployment',
            deployments: [
                {
                    description: 'An old-school Metin2 server we built the website and the panel for.',
                    facts: [
                        { label: 'Scope', value: 'Website, player panel, admin panel' },
                        { label: 'Payments', value: 'CashBill' },
                        { label: 'Made to order', value: 'Account connection graph, referral links, event calendar' },
                    ],
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
                        {
                            title: 'E-mails',
                            screens: [
                                { label: 'Account confirmation', description: 'After sign-up: the game PIN and the button that activates the account.' },
                                { label: 'New password', description: 'A link to set a new password, valid for 60 minutes.' },
                                { label: 'New PIN', description: 'The PIN drawn after a request to recover the account.' },
                                { label: 'Password change', description: 'Confirms a password change from the account settings, with a warning for the owner.' },
                            ],
                        },
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
