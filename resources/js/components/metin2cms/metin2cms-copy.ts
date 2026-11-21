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
        /** What comes after launch: custom modules, the optional maintenance and its deploys. `note`: whether the part is made to order, optional or comes with the maintenance (a tag under the title). The descriptions are about as long as each other, so the three cells stay level. */
        items: { title: string; note: string; description: string }[];
        /** The band under the cells, over the client panel's flow (ClientPanelFlow): fixes and ideas go into the panel as tasks (a new feature is quoted and starts once the quote is accepted), the team is on the chat, and the code is downloaded there (no repository is handed over). `stack`: what the system is built with, as tech tags. */
        ownership: { title: string; description: string; points: string[]; stack: string[] };
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
    /** The longer read before the steps to launch: how to choose a CMS for a server (the service pages' guide, without a photo). */
    guide: ServiceCopy['guide'];
    faq: { title: string };
    contact: { title: string; lead: string; messagePlaceholder: string };
};

export const METIN2CMS_COPY = localized<Metin2CmsCopy>({
    pl: {
        name: 'Metin2 CMS',
        hero: {
            headingLines: ['Strona i panel', 'dla serwera', 'Metin2'],
            wideLines: [[0, 1], [2]],
            lead: 'Gotowy CMS dla prywatnych serwerów Metin2: strona serwera, panel gracza i panel administratora. Podpinamy system pod Twoją bazę gry, stawiamy cache na Redisie i przekazujemy kod na własność. Utrzymanie z zero-downtime deployem bierzesz, jeśli chcesz.',
            quote: 'Zapytaj o wdrożenie',
            quoteShort: 'Zapytaj',
            secondary: 'Zobacz system',
            area: 'Wdrożenie zdalne, cała Polska',
            facts: [
                { value: '3 w 1', label: 'strona serwera, panel gracza i panel administratora' },
                { value: '0 s', label: 'downtime przy deployu, jeśli utrzymujemy stronę' },
                { prefix: 'tylko', value: '2 / godz.', label: 'zapytania o ranking do bazy gry, reszta idzie z cache' },
                { value: '100%', label: 'kodu na własność, do pobrania w panelu klienta' },
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
            title: 'CMS Metin2: co dostajesz w standardzie',
            lead: 'Sześć części jednego systemu. Gracz loguje się tym samym loginem, hasłem i PIN-em co w grze, a wszystko działa na Twojej bazie, bez kopiowania kont.',
            tiles: {
                site: { title: 'Strona serwera', description: 'Prezentacja serwera, ranking, aktualności i pobieranie klienta, renderowane po stronie serwera pod SEO.', tags: ['Ranking', 'Aktualności', 'Eventy', 'Pobieranie', 'SSR'] },
                player: { title: 'Panel gracza', description: 'Rejestracja z potwierdzeniem e-mail, PIN, zmiana danych i lista postaci.', tags: ['Rejestracja', 'PIN', 'hCaptcha', 'E-maile'] },
                payments: { title: 'Doładowania', description: 'Pakiety monet, promocje czasowe i płatności online.', tags: ['Operator do wyboru', 'BLIK', 'Promocje'] },
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
                    items: ['Logowanie kontem z gry', 'Rejestracja z hCaptcha i potwierdzeniem e-mail', 'Odzyskiwanie hasła i PIN-u', 'Doładowania przez jednego wybranego operatora', 'Ranking graczy i gildii', 'Zgłoszenia do supportu', 'Zmiana hasła, PIN-u i e-maila z potwierdzeniem mailem', 'Maile systemowe w wyglądzie serwera'],
                },
                {
                    title: 'Dla administratora',
                    items: ['Pulpit z wykresem online i zarobkami', 'Konta, postacie i ekwipunek', 'Logi gry w 19 kategoriach', 'Graf powiązań kont, IP i HWID', 'Bany kont i HWID', 'Pakiety, promocje i historia wpłat', 'Aktualności, eventy i pobieranie', 'Reflinki z nagrodami', 'Wyłączanie podstron jednym przełącznikiem'],
                },
                {
                    title: 'Pod maską',
                    items: ['Cache zapytań do bazy gry (Redis)', 'Rate limiting logowania i formularzy', 'Import ikon przedmiotów z klienta (TGA → PNG)', 'Kolejki i sesje na Redisie', 'SSR, sitemap.xml i meta tagi pod SEO'],
                },
            ],
            custom: 'Na zamówienie',
            customLead: 'Najczęstsze prośby właścicieli serwerów, ale to tylko przykłady. Zrealizujemy każdy Twój pomysł: opisz go, a my go wycenimy i dopiszemy do Twojej wersji systemu.',
            customItems: ['Itemshop w przeglądarce', 'Vote4Coins', 'Koło fortuny', 'Wiki przedmiotów i potworów', 'Kolejne wersje językowe', 'PayPal, Stripe, paysafecard', 'Logowanie przez Discord', 'Powiadomienia na Discordzie', 'Kody promocyjne', 'Statystyki serwera na żywo', 'API dla launchera i patchera', 'Własny wygląd strony'],
        },
        pillars: {
            title: 'Rozwój i utrzymanie CMS-a po starcie',
            lead: 'System rośnie razem z serwerem: nowe moduły dopisujemy na zamówienie, a utrzymanie z deployem bez przerwy bierzesz, jeśli chcesz. Wszystko zlecasz w panelu klienta.',
            items: [
                { title: 'Custom moduły', note: 'Na zamówienie', description: 'Masz własny system w grze? Dopisujemy do niego model, ekran w panelu albo podstronę. Mniejsze zmiany zajmują zwykle tylko kilka dni.' },
                { title: 'Utrzymanie', note: 'Opcjonalnie', description: 'Jeśli chcesz, zostajemy po starcie: backupy, aktualizacje i patche bezpieczeństwa są wtedy po naszej stronie, a Ty zajmujesz się grą.' },
                { title: 'Zero-downtime deploy', note: 'Z utrzymaniem', description: 'Gdy utrzymujemy stronę, nowy release budujemy obok działającego i przełączamy atomowo: bez wylogowania graczy, z rollbackiem.' },
            ],
            ownership: {
                title: 'Kod i opieka w panelu klienta',
                description: 'Po wdrożeniu dostajesz dostęp do panelu klienta Netizo. Ty spisujesz poprawki i pomysły, a my zajmujemy się resztą: od zgłoszenia, przez wycenę, po wdrożenie.',
                points: [
                    'Błąd albo poprawkę zgłaszasz jako zadanie, ze zrzutem ekranu, i widzisz, na jakim jest etapie.',
                    'Nową funkcję dodajesz w odpowiedniej kategorii: wyceniamy ją, a po Twojej akceptacji przystępujemy do pracy.',
                    'Na czacie masz stały kontakt z zespołem.',
                    'Kod na własność: każdą wersję pobierasz w zakładce Pliki i rozwijasz z nami, z własnym programistą albo sam.',
                ],
                stack: ['Laravel 13', 'React 19', 'Inertia', 'Tailwind CSS 4', 'Redis', 'MariaDB'],
            },
        },
        performance: {
            title: 'Strona Metin2, która nie obciąża bazy gry',
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
            title: 'Z czym mierzy się każdy serwer Metin2',
            lead: 'Te problemy przychodzą razem z popularnością. System ma na każdy z nich gotową odpowiedź.',
            items: [
                { threat: 'Boty zakładające konta', defence: 'hCaptcha i potwierdzenie e-mail', answer: 'Rejestracja z hCaptcha, potwierdzeniem e-mail i limitem prób z jednego adresu.' },
                { threat: 'Zgadywanie haseł', defence: 'Rate limit: 5 prób na login i IP', answer: 'Po pięciu nieudanych próbach logowanie blokuje się na minutę, a do wejścia potrzebny jest też PIN.' },
                { threat: 'Przejęcie konta gracza', defence: 'Zmiany potwierdzane mailem', answer: 'Nowe hasło, PIN i adres e-mail działają dopiero po kliknięciu linku z maila. Przeniesienie konta na nowy adres potwierdzasz na obu skrzynkach.' },
                { threat: 'Multikonta i handel między nimi', defence: 'Wspólne IP i HWID na grafie', answer: 'Graf powiązań pokazuje konta ze wspólnym IP i sprzętem oraz ich handel, sklepy i walki.' },
                { threat: 'Zbanowani, którzy wracają', defence: 'Blokada HWID', answer: 'Blokada sprzętu (HWID) zamyka dostęp do gry z danego komputera, nie tylko z jednego konta.' },
                { threat: 'Wpłaty, które utknęły', defence: 'Weryfikacja statusu u operatora', answer: 'Każdą płatność porównujemy ze statusem u operatora. Te do sprawdzenia trafiają na osobną listę.' },
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
            title: 'Jak wygląda wdrożenie CMS-a',
            lead: 'Cztery kroki. Twój serwer może w tym czasie normalnie działać.',
            steps: [
                { title: 'Rozmowa i dostęp', description: 'Opowiadasz o serwerze i plikach. Dostajemy osobnego użytkownika bazy z uprawnieniami tylko dla strony.' },
                { title: 'Podpięcie pod bazę', description: 'Łączymy system z Twoimi bazami account, player, common i log i sprawdzamy każdy ekran na prawdziwych danych.' },
                { title: 'Wygląd i treści', description: 'Projektujemy stronę pod Twój serwer: grafiki, kolory, teksty i maile.' },
                { title: 'Start i przekazanie kodu', description: 'Wdrożenie na produkcję i kod do pobrania w panelu klienta. Jeśli chcesz, zostajemy przy utrzymaniu z zero-downtime deployem.' },
            ],
        },
        guide: {
            title: 'Jak wybrać CMS dla serwera Metin2',
            intro: 'Kilka rzeczy, które warto wiedzieć, zanim postawisz stronę prywatnego serwera.',
            sections: [
                {
                    heading: 'Strona to pierwsze, co widzi gracz',
                    paragraphs: [
                        'Zanim ktoś wejdzie do gry, trafia na **stronę serwera Metin2**: zakłada konto, pobiera klienta i sprawdza ranking. Jeśli rejestracja się zacina albo strona ładuje się kilka sekund, część graczy rezygnuje jeszcze przed pierwszym logowaniem.',
                        'Dlatego strona prywatnego serwera to nie wizytówka, tylko część gry. Działa na tych samych kontach, pokazuje te same postacie i gildie, a w dniu startu przyjmuje największy ruch.',
                    ],
                },
                {
                    heading: 'Darmowy CMS czy system z opieką',
                    paragraphs: [
                        'Darmowe CMS-y do Metin2 z forów i GitHuba pozwalają postawić stronę w jeden wieczór i na serwer testowy w zupełności wystarczą. Na działającym serwerze dochodzą jednak rzeczy, których nikt za Ciebie nie zrobi: **poprawki bezpieczeństwa**, dopasowanie do Twoich plików i aktualizacje bez wyłączania strony.',
                        'Gotowy CMS z wdrożeniem kosztuje więcej na starcie, ale masz komu zlecić utrzymanie, jeśli nie chcesz zajmować się nim sam. Warto zapytać o trzy rzeczy: **czyj jest kod**, jak wygląda aktualizacja na działającym serwerze i kto reaguje, gdy coś przestanie działać.',
                    ],
                },
                {
                    heading: 'Co musi mieć strona serwera',
                    paragraphs: [
                        'Minimum to rejestracja z potwierdzeniem e-mail, pobieranie klienta, **ranking graczy i gildii**, aktualności i panel gracza, w którym da się zmienić hasło i odzyskać konto bez pisania do administratora.',
                        'Serwer zarabia na doładowaniach, więc płatności muszą księgować się same: gracz płaci, monety trafiają na konto. Itemshop w przeglądarce, Vote4Coins czy wiki przedmiotów to dodatki, które warto dołożyć, gdy podstawa działa.',
                        'Po drugiej stronie jest **panel administratora**: konta, postacie, wpłaty, logi gry i bany. Im mniej rzeczy trzeba sprawdzać bezpośrednio w bazie, tym szybciej reagujesz na zgłoszenia.',
                    ],
                },
                {
                    heading: 'Baza gry jest najważniejsza',
                    paragraphs: [
                        'W Metinie strona i gra korzystają z tej samej bazy danych. Każde ciężkie zapytanie ze strony, na przykład ranking liczony przy każdym odświeżeniu, zabiera zasoby grze. W godzinach szczytu gracze widzą to jako lagi.',
                        'Dobry CMS odpytuje bazę gry rzadko: **wyniki trzyma w cache**, a zapytania idą po indeksach.',
                    ],
                },
            ],
        },
        faq: { title: 'Częste pytania o CMS Metin2' },
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
            lead: 'A ready-made CMS for Metin2 private servers: the server website, a player panel and an admin panel. We connect the system to your game database, put a Redis cache in front of it and hand the code over to you. Maintenance with zero-downtime deploys is there if you want it.',
            quote: 'Ask about a deployment',
            quoteShort: 'Ask',
            secondary: 'See the system',
            area: 'Remote deployment, anywhere',
            facts: [
                { value: '3 in 1', label: 'the server website, the player panel and the admin panel' },
                { value: '0 s', label: 'of downtime on deploys, if we maintain the website' },
                { prefix: 'only', value: '2 / hour', label: 'ranking queries to the game database, the rest comes from cache' },
                { value: '100%', label: 'of the code is yours, to download in the client portal' },
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
            title: 'Metin2 CMS: what’s included',
            lead: 'Six parts of one system. A player signs in with the same login, password and PIN as in the game, and everything runs on your database, with no copies of the accounts.',
            tiles: {
                site: { title: 'Server website', description: 'What the server is, the ranking, the news and the client download, server-rendered for SEO.', tags: ['Ranking', 'News', 'Events', 'Downloads', 'SSR'] },
                player: { title: 'Player panel', description: 'Sign-up with email confirmation, the PIN, account changes and the list of characters.', tags: ['Sign-up', 'PIN', 'hCaptcha', 'E-mails'] },
                payments: { title: 'Top-ups', description: 'Coin packages, time-limited promotions and online payments.', tags: ['Provider of your choice', 'BLIK', 'Promotions'] },
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
                    items: ['Sign-in with the game account', 'Sign-up with hCaptcha and email confirmation', 'Password and PIN recovery', 'Top-ups through one payment provider of your choice', 'Player and guild rankings', 'Support requests', 'Password, PIN and email changes confirmed by email', 'System e-mails in the server’s look'],
                },
                {
                    title: 'For the admin',
                    items: ['Dashboard with the online chart and earnings', 'Accounts, characters and equipment', 'Game logs in 19 categories', 'Connection graph of accounts, IPs and HWIDs', 'Account and HWID bans', 'Packages, promotions and payment history', 'News, events and downloads', 'Referral links with rewards', 'Pages switched off with one toggle'],
                },
                {
                    title: 'Under the hood',
                    items: ['Cache for game database queries (Redis)', 'Rate limiting on login and forms', 'Item icon import from the client (TGA → PNG)', 'Queues and sessions on Redis', 'SSR, sitemap.xml and meta tags for SEO'],
                },
            ],
            custom: 'Made to order',
            customLead: 'What server owners ask for most often, but these are only examples. We build any idea you have: describe it, and we quote it and add it to your version of the system.',
            customItems: ['Item shop in the browser', 'Vote4Coins', 'Wheel of fortune', 'Item and monster wiki', 'More languages', 'PayPal, Stripe, paysafecard', 'Sign-in with Discord', 'Discord notifications', 'Promo codes', 'Live server statistics', 'API for the launcher and patcher', 'Your own look of the website'],
        },
        pillars: {
            title: 'Growing and maintaining the CMS after launch',
            lead: 'The system grows with your server: new modules are made to order, and maintenance with zero-downtime deploys is yours if you want it. You order everything in the client portal.',
            items: [
                { title: 'Custom modules', note: 'Made to order', description: 'Have a system of your own in the game? We add a model, a panel screen or a page for it. Smaller changes usually take only a few days to build.' },
                { title: 'Maintenance', note: 'Optional', description: 'If you want, we stay after launch: backups, updates and security patches are then on our side, and you look after the game and the community.' },
                { title: 'Zero-downtime deploys', note: 'With maintenance', description: 'When we maintain the website, we build the new release beside the running one and switch atomically: no players signed out, and a rollback if needed.' },
            ],
            ownership: {
                title: 'Code and care in the client portal',
                description: 'After the deployment you get access to the Netizo client portal. You write down fixes and ideas, and we take care of the rest: from the report, through the quote, to the deploy.',
                points: [
                    'You report a bug or a fix as a task, with a screenshot, and see what stage it is at.',
                    'You add a new feature in the right category: we quote it and, once you accept, we get to work.',
                    'The chat keeps you in touch with the team.',
                    'Code you own: you download every version under Files and develop it with us, with your own developer or on your own.',
                ],
                stack: ['Laravel 13', 'React 19', 'Inertia', 'Tailwind CSS 4', 'Redis', 'MariaDB'],
            },
        },
        performance: {
            title: 'A Metin2 website that puts no load on the game database',
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
            title: 'What every Metin2 server has to face',
            lead: 'These problems come with popularity. The system has an answer ready for each of them.',
            items: [
                { threat: 'Bots creating accounts', defence: 'hCaptcha and email confirmation', answer: 'Sign-up with hCaptcha, email confirmation and a limit on attempts from one address.' },
                { threat: 'Password guessing', defence: 'Rate limit: 5 attempts per login and IP', answer: 'After five failed attempts the login locks for a minute, and getting in takes the PIN too.' },
                { threat: 'Hijacked player accounts', defence: 'Changes confirmed by email', answer: 'A new password, PIN or email address takes effect only after a link from an email is clicked. Moving the account to a new address is confirmed in both inboxes.' },
                { threat: 'Multi-accounts trading with each other', defence: 'Shared IP and HWID on the graph', answer: 'The connection graph shows accounts with a shared IP and hardware, and their trades, shops and fights.' },
                { threat: 'Banned players coming back', defence: 'HWID ban', answer: 'A hardware (HWID) ban closes the game to a computer, not just to one account.' },
                { threat: 'Payments that got stuck', defence: 'Status check with the provider', answer: 'We compare every payment with its status at the provider. The ones to check go on a list of their own.' },
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
            title: 'How a CMS deployment goes',
            lead: 'Four steps. Your server can keep running the whole time.',
            steps: [
                { title: 'A call and access', description: 'You tell us about the server and its files. We get a separate database user with rights for the website only.' },
                { title: 'Connecting the database', description: 'We connect the system to your account, player, common and log databases and check every screen on real data.' },
                { title: 'Look and content', description: 'We design the website for your server: the art, the colors, the copy and the emails.' },
                { title: 'Launch and handover', description: 'The deploy to production and the code to download in the client portal. If you want, we stay on for maintenance with zero-downtime deploys.' },
            ],
        },
        guide: {
            title: 'How to choose a CMS for a Metin2 server',
            intro: 'A few things worth knowing before you put up a private server’s website.',
            sections: [
                {
                    heading: 'The website is the first thing a player sees',
                    paragraphs: [
                        'Before anyone enters the game, they land on the **Metin2 server website**: they create an account, download the client and check the ranking. If sign-up stalls or the page takes seconds to load, some players give up before their first login.',
                        'So a private server’s website is not a brochure, it is part of the game. It runs on the same accounts, shows the same characters and guilds, and takes the heaviest traffic on launch day.',
                    ],
                },
                {
                    heading: 'A free CMS or a system someone looks after',
                    paragraphs: [
                        'The free Metin2 CMSes from forums and GitHub let you put up a website in one evening, and for a test server they are plenty. On a live server come the things nobody will do for you: **security fixes**, fitting the CMS to your files and updates without taking the website down.',
                        'A ready-made CMS with a deployment costs more at the start, but there is someone to hand the maintenance to if you would rather not do it yourself. Three questions are worth asking: **who owns the code**, how an update goes on a running server and who reacts when something stops working.',
                    ],
                },
                {
                    heading: 'What a server website has to have',
                    paragraphs: [
                        'The minimum is sign-up with email confirmation, the client download, **player and guild rankings**, news and a player panel where a password can be changed and an account recovered without writing to an admin.',
                        'A server earns on top-ups, so payments have to credit themselves: the player pays, the coins land on the account. An item shop in the browser, Vote4Coins or an item wiki are extras worth adding once the basics work.',
                        'On the other side is the **admin panel**: accounts, characters, payments, game logs and bans. The fewer things you have to check straight in the database, the faster you answer requests.',
                    ],
                },
                {
                    heading: 'The game database comes first',
                    paragraphs: [
                        'In Metin the website and the game use the same database. Every heavy query from the website, a ranking computed on each refresh for example, takes resources from the game. At peak hours players feel it as lag.',
                        'A good CMS asks the game database rarely: **it keeps results in a cache** and its queries use indexes.',
                    ],
                },
            ],
        },
        faq: { title: 'Common questions about the Metin2 CMS' },
        contact: {
            title: 'Let’s talk about your server',
            lead: 'Tell us which files you run and when you plan to launch. We’ll reply within 24 hours.',
            messagePlaceholder: 'E.g. a server on the Marty Sama files, launching in a month, I need a website with an item shop.',
        },
    },
});
