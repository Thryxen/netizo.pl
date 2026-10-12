import { localized } from '@/lib/i18n';
import { company, contact, pageUrls } from '@/lib/site';
import { CookieSettingsButton, CookieTable } from './cookie-table';
import type { LegalDocumentCopy } from './legal-document';

const address = `${company.street}, ${company.postalCode} ${company.city}`;
const mail = <a href={`mailto:${contact.email}`}>{contact.email}</a>;
const phone = (
    <a href={contact.phone.href} className="whitespace-nowrap">
        {contact.phone.display}
    </a>
);

/**
 * Polityka prywatności (/polityka-prywatnosci) and its English translation (/en/privacy-policy). It describes what the
 * code does: the five forms (Form Requests), Google Analytics behind the cookie banner (CookiesServiceProvider) and the
 * cookies the banner lists. Change it together with them, the data map (data-routes-section.tsx) and
 * LegalPageController::PRIVACY_EFFECTIVE_DATE. It leaves out the Discord notifications (DiscordWebhookService), which are
 * off in production (no DISCORD_WEBHOOK_*): turning them on needs a section on Discord Inc. as a recipient here.
 */
export const PRIVACY_POLICY = localized<LegalDocumentCopy>({
    pl: {
        pageName: 'Polityka prywatności',
        title: 'Polityka prywatności',
        lead: 'Jakie dane zbieramy przez formularze i analitykę, gdzie je przechowujemy, komu je przekazujemy i jakie masz prawa.',
        partyLabel: 'Administrator danych',
        note: null,
        headerSections: [
            { id: 'formularze', label: 'Formularze' },
            { id: 'cookies', label: 'Cookies' },
            { id: 'prawa', label: 'Twoje prawa' },
        ],
        sections: [
            {
                id: 'administrator',
                title: 'Kto odpowiada za Twoje dane',
                body: (
                    <>
                        <p>
                            Administratorem Twoich danych osobowych jest <strong>{company.owner}</strong>, prowadzący działalność gospodarczą pod nazwą{' '}
                            <strong>{company.name}</strong>, {address}, NIP {company.nip}, REGON {company.regon} (dalej: „Netizo”, „my”).
                        </p>
                        <p>
                            W sprawach danych osobowych napisz na {mail}, zadzwoń pod {phone} albo wyślij list na adres powyżej. Nie wyznaczyliśmy
                            inspektora ochrony danych, bo nie mamy takiego obowiązku.
                        </p>
                        <p>
                            Polityka dotyczy strony netizo.pl w wersji polskiej i angielskiej. Dane klientów, z którymi podpisaliśmy umowę, przetwarzamy
                            także na zasadach opisanych w tej umowie.
                        </p>
                    </>
                ),
            },
            {
                id: 'formularze',
                title: 'Formularze na stronie',
                body: (
                    <>
                        <p>
                            Dane w formularzach podajesz dobrowolnie, ale bez pól oznaczonych jako wymagane nie będziemy mogli odpowiedzieć. Do każdego
                            zgłoszenia dopisujemy język strony, z której je wysłano, żeby odpisać w tym samym języku.
                        </p>
                        <ul>
                            <li>
                                <strong>Szybka wiadomość</strong>: imię i nazwisko, e-mail, temat i treść. Odpowiadamy na Twoją wiadomość. Podstawa: nasz
                                prawnie uzasadniony interes, czyli prowadzenie korespondencji (art. 6 ust. 1 lit. f RODO), a gdy pytasz o współpracę,
                                także podjęcie działań przed zawarciem umowy na Twoje żądanie (art. 6 ust. 1 lit. b RODO).
                            </li>
                            <li>
                                <strong>Brief projektu</strong>: odpowiedzi o projekcie (rodzaj, funkcje, branża, projekt graficzny, termin, technologie,
                                budżet, uwagi) oraz imię i nazwisko i e-mail, a jeśli je podasz, także telefon, firma, stanowisko, adres strony, skąd o nas
                                wiesz i preferowany sposób kontaktu. Przygotowujemy wycenę i kontaktujemy się w jej sprawie. Podstawa: działania przed
                                zawarciem umowy (art. 6 ust. 1 lit. b RODO).
                            </li>
                            <li>
                                <strong>Oddzwonimy do Ciebie</strong>: numer telefonu. Oddzwaniamy, żeby porozmawiać o Twojej sprawie. Podstawa: art. 6
                                ust. 1 lit. b RODO, a gdy rozmowa nie dotyczy współpracy, art. 6 ust. 1 lit. f RODO.
                            </li>
                            <li>
                                <strong>Newsletter</strong>: adres e-mail. Wysyłamy newsletter, najwyżej raz w miesiącu. Podstawa: Twoja zgoda, którą
                                wyrażasz, zapisując się (art. 6 ust. 1 lit. a RODO). Wypiszesz się w każdej chwili, pisząc na {mail}.
                            </li>
                            <li>
                                <strong>Zgłoszenie do programu partnerskiego</strong>: imię i nazwisko, e-mail, kim jesteś (np. agencja, freelancer),
                                kogo chcesz polecać, a jeśli go podasz, telefon; zapisujemy też, którą wersję{' '}
                                <a href={pageUrls.pl.partnerTerms}>regulaminu programu</a> zaakceptowano w zgłoszeniu. Rozpatrujemy zgłoszenie, a po
                                jego przyjęciu prowadzimy Twój udział w programie i wypłacamy prowizje. Przed pierwszą wypłatą prosimy e-mailem o numer
                                rachunku, a jeśli nie prowadzisz firmy, także o adres, numer PESEL i urząd skarbowy. Podstawa: zawarcie i wykonanie
                                umowy, którą tworzy regulamin programu (art. 6 ust. 1 lit. b RODO), a dla danych do rozliczenia podatku obowiązek
                                prawny (art. 6 ust. 1 lit. c RODO).
                            </li>
                        </ul>
                        <p>
                            Przy zgłoszeniu nie zapisujemy Twojego adresu IP ani danych przeglądarki. Adres IP służy tylko do ochrony formularzy przed
                            spamem: przez minutę liczymy, ile zgłoszeń wysłano z danego adresu.
                        </p>
                    </>
                ),
            },
            {
                id: 'analityka',
                title: 'Google Analytics',
                body: (
                    <>
                        <p>
                            Korzystamy z Google Analytics 4, żeby wiedzieć, które podstrony są czytane i skąd przychodzą odwiedzający. Działa on
                            wyłącznie po Twojej zgodzie na analityczne pliki cookie w banerze (art. 6 ust. 1 lit. a RODO). Dopóki jej nie wyrazisz,
                            skrypt Google w ogóle się nie ładuje, a tryb zgody Google (Consent Mode) pozostaje ustawiony na odmowę.
                        </p>
                        <p>
                            Po zgodzie Google Analytics zbiera m.in. odwiedzone podstrony i czas wizyty, źródło wejścia (np. wyszukiwarka, link),
                            rodzaj urządzenia, system i przeglądarkę, przybliżoną lokalizację (kraj lub miasto) oraz identyfikator zapisany w pliku
                            cookie. Google Analytics 4 nie przechowuje adresów IP. Oglądamy wyłącznie zbiorcze statystyki i nie łączymy ich z danymi z
                            formularzy.
                        </p>
                        <p>
                            Dostawcą jest Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Irlandia); dane mogą trafiać także do Google
                            LLC w USA. Dane w Google Analytics przechowujemy nie dłużej niż 14 miesięcy. Zgodę cofniesz w każdej chwili przyciskiem
                            „Zmień ustawienia cookies” w pkt 4.
                        </p>
                        <p>
                            Nie używamy narzędzi nagrywających sesje ani map cieplnych (np. Microsoft Clarity), pikseli reklamowych (Meta, Google Ads,
                            TikTok) ani remarketingu.
                        </p>
                    </>
                ),
            },
            {
                id: 'cookies',
                title: 'Pliki cookie i pamięć przeglądarki',
                body: (
                    <>
                        <p>
                            Pliki cookie to małe pliki, które strona zapisuje w Twojej przeglądarce. Niezbędne działają bez zgody, bo bez nich strona
                            nie działałaby poprawnie albo nie zapamiętałaby Twoich wyborów. Analityczne zapisujemy dopiero po Twojej zgodzie (art. 399
                            Prawa komunikacji elektronicznej). Oto pełna lista:
                        </p>
                        <CookieTable />
                        <p>
                            Wybrany motyw strony zapisujemy też w pamięci przeglądarki (localStorage, klucz <code>appearance</code>). Cloudflare, który
                            chroni stronę, może zapisać techniczne pliki cookie do odróżniania ludzi od botów (np. <code>__cf_bm</code>,{' '}
                            <code>cf_clearance</code>); nie służą one do śledzenia.
                        </p>
                        <p>
                            Zgodę zmienisz albo cofniesz w każdej chwili: przycisk poniżej usuwa zapisany wybór i ponownie pokazuje baner. Po cofnięciu
                            zgody Google Analytics przestaje się ładować, a zapisane wcześniej pliki <code>_ga</code> możesz usunąć w przeglądarce.
                            Pliki cookie zablokujesz też w ustawieniach przeglądarki; bez niezbędnych część strony może nie działać.
                        </p>
                        <CookieSettingsButton className="print:hidden" />
                    </>
                ),
            },
            {
                id: 'serwer',
                title: 'Serwer, Cloudflare i logi',
                body: (
                    <>
                        <p>
                            Strona i baza danych działają na serwerze firmy hostingowej, która przechowuje dane w naszym imieniu, na podstawie umowy
                            powierzenia przetwarzania danych. Ruch do strony przechodzi przez Cloudflare (Cloudflare, Inc., USA), który przyspiesza jej
                            ładowanie i chroni ją przed atakami; w tym celu przetwarza Twój adres IP i dane techniczne zapytań.
                        </p>
                        <p>
                            Serwer zapisuje w logach techniczne dane wizyt: adres IP, datę i godzinę, adres podstrony, kod odpowiedzi i nazwę
                            przeglądarki. Używamy ich tylko do diagnozowania błędów i dbania o bezpieczeństwo (art. 6 ust. 1 lit. f RODO) i trzymamy
                            krótko, zwykle do 30 dni, chyba że są potrzebne do wyjaśnienia incydentu. Na czas sesji (do 2 godzin bez aktywności)
                            zapisujemy też adres IP i nazwę przeglądarki razem z identyfikatorem sesji.
                        </p>
                        <p>
                            Czcionki i zdjęcia ładujemy z naszego serwera, więc Twoja przeglądarka nie łączy się z Google Fonts. Linki do naszych
                            profili w mediach społecznościowych to zwykłe odnośniki, które nie ładują skryptów tych serwisów. Po przejściu na nie
                            obowiązują zasady prywatności danego serwisu.
                        </p>
                    </>
                ),
            },
            {
                id: 'odbiorcy',
                title: 'Komu przekazujemy dane',
                body: (
                    <>
                        <p>Nie sprzedajemy danych i nie udostępniamy ich innym firmom do celów marketingowych. Dane mogą otrzymać tylko:</p>
                        <ul>
                            <li>firma hostingowa, na której serwerze działają strona i baza danych;</li>
                            <li>Cloudflare, Inc.: przyspieszanie i ochrona strony;</li>
                            <li>Google Ireland Limited i Google LLC: statystyki Google Analytics, tylko po Twojej zgodzie (pkt 3);</li>
                            <li>dostawcy poczty e-mail i usług telefonicznych, przez których odpisujemy i dzwonimy;</li>
                            <li>biuro rachunkowe i kancelaria prawna, jeśli podpiszemy umowę albo trzeba będzie dochodzić roszczeń;</li>
                            <li>organy publiczne, gdy wymaga tego prawo.</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'poza-eog',
                title: 'Przekazywanie danych poza EOG',
                body: (
                    <p>
                        Google LLC i Cloudflare, Inc. mają siedziby w USA, więc dane mogą trafić poza Europejski Obszar Gospodarczy.
                        Przekazanie odbywa się na podstawie decyzji Komisji Europejskiej z 10 lipca 2023 r. o odpowiednim stopniu ochrony w ramach
                        EU-US Data Privacy Framework (dla firm w nim certyfikowanych) albo standardowych klauzul umownych zatwierdzonych przez Komisję
                        (art. 45 i 46 RODO). Kopię tych zabezpieczeń otrzymasz, pisząc na {mail}.
                    </p>
                ),
            },
            {
                id: 'okres',
                title: 'Jak długo przechowujemy dane',
                body: (
                    <>
                        <ul>
                            <li>
                                <strong>Szybka wiadomość, brief i prośba o telefon</strong>: do 12 miesięcy od ostatniego kontaktu w sprawie. Jeśli
                                podpiszemy umowę, dane przechodzą do jej dokumentacji: trzymamy je przez czas umowy, a potem do przedawnienia roszczeń i
                                przez okres wymagany przepisami podatkowymi.
                            </li>
                            <li>
                                <strong>Zgłoszenie do programu partnerskiego</strong>: do 12 miesięcy od zgłoszenia, jeśli go nie przyjmiemy. Dane
                                partnera trzymamy przez czas udziału w programie i rozliczeń prowizji, a potem do przedawnienia roszczeń; dokumenty
                                rozliczeń przez okres wymagany przepisami podatkowymi.
                            </li>
                            <li>
                                <strong>Newsletter</strong>: do wypisania się albo cofnięcia zgody.
                            </li>
                            <li>
                                <strong>Google Analytics</strong>: nie dłużej niż 14 miesięcy.
                            </li>
                            <li>
                                <strong>Logi serwera</strong>: zwykle do 30 dni.
                            </li>
                            <li>
                                <strong>Pliki cookie</strong>: zgodnie z tabelą w pkt 4.
                            </li>
                        </ul>
                        <p>Dłużej przechowujemy dane tylko wtedy, gdy są potrzebne do ustalenia, dochodzenia lub obrony roszczeń, i tylko w tym zakresie.</p>
                    </>
                ),
            },
            {
                id: 'prawa',
                title: 'Twoje prawa',
                body: (
                    <>
                        <p>W każdej chwili możesz:</p>
                        <ul>
                            <li>uzyskać dostęp do swoich danych i ich kopię (art. 15 RODO);</li>
                            <li>poprawić je lub uzupełnić (art. 16);</li>
                            <li>zażądać ich usunięcia (art. 17);</li>
                            <li>zażądać ograniczenia przetwarzania (art. 18);</li>
                            <li>przenieść dane, które przetwarzamy na podstawie zgody lub umowy (art. 20);</li>
                            <li>wnieść sprzeciw wobec przetwarzania na podstawie naszego prawnie uzasadnionego interesu (art. 21);</li>
                            <li>cofnąć zgodę na newsletter lub analitykę; cofnięcie nie wpływa na zgodność z prawem tego, co działo się wcześniej.</li>
                        </ul>
                        <p>
                            Napisz na {mail}. Odpowiemy bez zbędnej zwłoki, najpóźniej w ciągu miesiąca, i bez opłat. Możemy poprosić o informacje,
                            które potwierdzą, że wniosek składasz Ty.
                        </p>
                        <p>
                            Masz też prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa,{' '}
                            <a href="https://uodo.gov.pl">uodo.gov.pl</a>).
                        </p>
                    </>
                ),
            },
            {
                id: 'automatyczne-decyzje',
                title: 'Bez automatycznych decyzji',
                body: (
                    <p>
                        Nie podejmujemy wobec Ciebie decyzji opartych wyłącznie na automatycznym przetwarzaniu, w tym profilowaniu, które wywoływałyby
                        skutki prawne lub w podobny sposób istotnie na Ciebie wpływały (art. 22 RODO). Statystyki Google Analytics oglądamy wyłącznie
                        zbiorczo.
                    </p>
                ),
            },
            {
                id: 'zmiany',
                title: 'Zmiany polityki',
                body: (
                    <p>
                        Aktualizujemy politykę, gdy zmienia się sposób przetwarzania danych, na przykład gdy dodajemy formularz albo narzędzie. Aktualna
                        wersja jest zawsze na tej stronie, z datą, od której obowiązuje. O istotnych zmianach dotyczących newslettera poinformujemy
                        subskrybentów e-mailem. Zasady korzystania ze strony opisuje <a href={pageUrls.pl.terms}>regulamin</a>.
                    </p>
                ),
            },
        ],
    },
    en: {
        pageName: 'Privacy policy',
        title: 'Privacy policy',
        lead: 'What data we collect through our forms and analytics, where we store it, who receives it and what your rights are.',
        partyLabel: 'Data controller',
        note: (
            <>
                This is an English translation for your convenience; the{' '}
                <a href={pageUrls.pl.privacy} hrefLang="pl">
                    Polish version
                </a>{' '}
                is legally binding.
            </>
        ),
        headerSections: [
            { id: 'forms', label: 'Forms' },
            { id: 'cookies', label: 'Cookies' },
            { id: 'your-rights', label: 'Your rights' },
        ],
        sections: [
            {
                id: 'controller',
                title: 'Who is responsible for your data',
                body: (
                    <>
                        <p>
                            The controller of your personal data is <strong>{company.owner}</strong>, running a sole proprietorship trading as{' '}
                            <strong>{company.name}</strong>, {address}, Poland, tax ID (NIP) {company.nip}, REGON {company.regon} (“Netizo”, “we”).
                        </p>
                        <p>
                            For anything about your personal data, email {mail}, call {phone} or write to the address above. We have not appointed a data
                            protection officer, as we are not required to.
                        </p>
                        <p>
                            This policy covers netizo.pl in Polish and English. For clients who have signed a contract with us, the terms of that contract
                            apply to their data as well.
                        </p>
                    </>
                ),
            },
            {
                id: 'forms',
                title: 'Forms on the site',
                body: (
                    <>
                        <p>
                            Filling in a form is voluntary, but we can’t reply without the fields marked as required. Every submission also records the
                            language of the site it came from, so we can answer in the same language.
                        </p>
                        <ul>
                            <li>
                                <strong>Quick message</strong>: name, email, subject and message. We reply to your message. Legal basis: our legitimate
                                interest in handling correspondence (Art. 6(1)(f) GDPR) and, when you ask about working with us, steps taken at your
                                request before entering into a contract (Art. 6(1)(b) GDPR).
                            </li>
                            <li>
                                <strong>Project brief</strong>: your answers about the project (type, features, industry, design, timeline,
                                technologies, budget, notes), your name and email and, if you provide them, phone, company, job title, website, how you
                                heard about us and how you prefer to be contacted. We prepare a quote and contact you about it. Legal basis: steps
                                before entering into a contract (Art. 6(1)(b) GDPR).
                            </li>
                            <li>
                                <strong>We’ll call you back</strong>: your phone number. We call you back to talk about your request. Legal basis:
                                Art. 6(1)(b) GDPR or, when the call isn’t about working with us, Art. 6(1)(f) GDPR.
                            </li>
                            <li>
                                <strong>Newsletter</strong>: your email address. We send the newsletter at most once a month. Legal basis: the consent
                                you give by signing up (Art. 6(1)(a) GDPR). You can unsubscribe at any time by emailing {mail}.
                            </li>
                            <li>
                                <strong>Partner program application</strong>: your name, email, who you are (e.g. an agency or a freelancer), who you
                                want to refer and, if you provide it, your phone number; we also record which version of the{' '}
                                <a href={pageUrls.en.partnerTerms}>program terms</a> was accepted with it. We review the application and, once it is
                                accepted, run your participation in the program and pay your commissions. Before the first payout, we ask by email for
                                your bank account number and, if you don’t run a business, your address, PESEL number and tax office. Legal basis:
                                entering into and performing the contract formed by the program terms (Art. 6(1)(b) GDPR) and, for the tax details, a
                                legal obligation (Art. 6(1)(c) GDPR).
                            </li>
                        </ul>
                        <p>
                            We don’t store your IP address or browser details with a submission. Your IP address only protects the forms from spam: we
                            count how many submissions came from it within a minute.
                        </p>
                    </>
                ),
            },
            {
                id: 'analytics',
                title: 'Google Analytics',
                body: (
                    <>
                        <p>
                            We use Google Analytics 4 to see which pages people read and where visitors come from. It runs only after you accept
                            analytics cookies in the banner (Art. 6(1)(a) GDPR). Until then, the Google script isn’t loaded at all and Google Consent
                            Mode stays set to denied.
                        </p>
                        <p>
                            With your consent, Google Analytics collects, among other things, the pages you visit and how long you stay, how you got
                            here (e.g. a search engine or a link), your device type, operating system and browser, your approximate location (country
                            or city) and an identifier stored in a cookie. Google Analytics 4 doesn’t store IP addresses. We only look at aggregate
                            statistics and never combine them with form data.
                        </p>
                        <p>
                            The provider is Google Ireland Limited (Gordon House, Barrow Street, Dublin 4, Ireland); data may also reach Google LLC in
                            the USA. We keep Google Analytics data for no longer than 14 months. You can withdraw consent at any time with the “Change
                            cookie settings” button in section 4.
                        </p>
                        <p>
                            We don’t use session recording or heatmap tools (such as Microsoft Clarity), advertising pixels (Meta, Google Ads, TikTok)
                            or remarketing.
                        </p>
                    </>
                ),
            },
            {
                id: 'cookies',
                title: 'Cookies and browser storage',
                body: (
                    <>
                        <p>
                            Cookies are small files a website stores in your browser. Essential cookies are set without consent, because without them
                            the site wouldn’t work properly or remember your choices. Analytics cookies are set only after you consent (Art. 399 of the
                            Polish Electronic Communications Law). Here is the full list:
                        </p>
                        <CookieTable />
                        <p>
                            We also keep the theme you picked in your browser’s storage (localStorage, key <code>appearance</code>). Cloudflare, which
                            protects the site, may set technical cookies to tell people from bots (e.g. <code>__cf_bm</code>, <code>cf_clearance</code>);
                            they aren’t used for tracking.
                        </p>
                        <p>
                            You can change or withdraw your consent at any time: the button below clears your saved choice and shows the banner again.
                            Once you withdraw consent, Google Analytics stops loading, and you can delete any <code>_ga</code> cookies already set in
                            your browser. You can also block cookies in your browser settings; without the essential ones, parts of the site may not
                            work.
                        </p>
                        <CookieSettingsButton className="print:hidden" />
                    </>
                ),
            },
            {
                id: 'hosting',
                title: 'Hosting, Cloudflare and logs',
                body: (
                    <>
                        <p>
                            The site and its database run on a hosting company’s server, which stores data on our behalf under a data processing
                            agreement. Traffic to the site goes through Cloudflare (Cloudflare, Inc., USA), which speeds it up and protects it from
                            attacks; to do so, it processes your IP address and the technical details of each request.
                        </p>
                        <p>
                            The server logs technical details of visits: IP address, date and time, page address, response code and browser name. We use
                            them only to diagnose errors and keep the site secure (Art. 6(1)(f) GDPR) and keep them briefly, usually up to 30 days,
                            unless they are needed to investigate an incident. For the length of a session (up to 2 hours of inactivity) we also store
                            your IP address and browser name with the session identifier.
                        </p>
                        <p>
                            Fonts and images load from our own server, so your browser doesn’t connect to Google Fonts. The links to our social media
                            profiles are plain links that don’t load any scripts from those services. Once you follow one, that service’s privacy
                            policy applies.
                        </p>
                    </>
                ),
            },
            {
                id: 'recipients',
                title: 'Who receives your data',
                body: (
                    <>
                        <p>We don’t sell data or share it with other companies for their marketing. Only these may receive it:</p>
                        <ul>
                            <li>the hosting company whose server runs the site and the database;</li>
                            <li>Cloudflare, Inc.: speeding up and protecting the site;</li>
                            <li>Google Ireland Limited and Google LLC: Google Analytics statistics, only with your consent (section 3);</li>
                            <li>the email and phone providers we reply and call through;</li>
                            <li>our accountants and lawyers, if we sign a contract or need to pursue claims;</li>
                            <li>public authorities, when the law requires it.</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'transfers',
                title: 'Transfers outside the EEA',
                body: (
                    <p>
                        Google LLC and Cloudflare, Inc. are based in the USA, so data may leave the European Economic Area. Such transfers
                        rely on the European Commission’s adequacy decision of 10 July 2023 for the EU-US Data Privacy Framework (for companies certified
                        under it) or on standard contractual clauses approved by the Commission (Art. 45 and 46 GDPR). Email {mail} for a copy of these
                        safeguards.
                    </p>
                ),
            },
            {
                id: 'retention',
                title: 'How long we keep your data',
                body: (
                    <>
                        <ul>
                            <li>
                                <strong>Quick message, brief and callback request</strong>: up to 12 months after our last contact about it. If we sign
                                a contract, the data becomes part of its records: we keep it for the duration of the contract, then until claims expire
                                and for as long as tax law requires.
                            </li>
                            <li>
                                <strong>Partner program application</strong>: up to 12 months after you apply if we don’t accept it. We keep a
                                partner’s data for as long as they take part in the program and commissions are settled, then until claims expire;
                                settlement records for as long as tax law requires.
                            </li>
                            <li>
                                <strong>Newsletter</strong>: until you unsubscribe or withdraw consent.
                            </li>
                            <li>
                                <strong>Google Analytics</strong>: no longer than 14 months.
                            </li>
                            <li>
                                <strong>Server logs</strong>: usually up to 30 days.
                            </li>
                            <li>
                                <strong>Cookies</strong>: as listed in the table in section 4.
                            </li>
                        </ul>
                        <p>We keep data longer only when it is needed to establish, pursue or defend legal claims, and only to that extent.</p>
                    </>
                ),
            },
            {
                id: 'your-rights',
                title: 'Your rights',
                body: (
                    <>
                        <p>At any time, you can:</p>
                        <ul>
                            <li>access your data and get a copy of it (Art. 15 GDPR);</li>
                            <li>correct or complete it (Art. 16);</li>
                            <li>have it erased (Art. 17);</li>
                            <li>restrict its processing (Art. 18);</li>
                            <li>take the data we process based on consent or a contract to another provider (Art. 20);</li>
                            <li>object to processing based on our legitimate interest (Art. 21);</li>
                            <li>withdraw your consent to the newsletter or analytics; this doesn’t affect the lawfulness of processing before you did.</li>
                        </ul>
                        <p>
                            Email {mail}. We will reply without undue delay, within a month at the latest, free of charge. We may ask for information
                            that confirms the request comes from you.
                        </p>
                        <p>
                            You also have the right to lodge a complaint with the Polish data protection authority, the President of the Personal Data
                            Protection Office (ul. Stawki 2, 00-193 Warsaw, <a href="https://uodo.gov.pl">uodo.gov.pl</a>), or with the authority in
                            your own EU country.
                        </p>
                    </>
                ),
            },
            {
                id: 'automated-decisions',
                title: 'No automated decisions',
                body: (
                    <p>
                        We don’t make decisions about you based solely on automated processing, including profiling, that would have legal effects on
                        you or similarly significantly affect you (Art. 22 GDPR). We only look at Google Analytics statistics in aggregate.
                    </p>
                ),
            },
            {
                id: 'changes',
                title: 'Changes to this policy',
                body: (
                    <p>
                        We update this policy when the way we process data changes, for example when we add a form or a tool. The current version is
                        always on this page, with the date it took effect. We will email newsletter subscribers about significant changes that affect
                        them. How you can use the site is set out in our <a href={pageUrls.en.terms}>terms of service</a>.
                    </p>
                ),
            },
        ],
    },
});
