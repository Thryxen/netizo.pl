import { localized } from '@/lib/i18n';
import { company, contact, pageUrls } from '@/lib/site';
import { EffectiveDate } from './effective-date';
import type { LegalDocumentCopy } from './legal-document';

const address = `${company.street}, ${company.postalCode} ${company.city}`;
const mail = <a href={`mailto:${contact.email}`}>{contact.email}</a>;
const phone = (
    <a href={contact.phone.href} className="whitespace-nowrap">
        {contact.phone.display}
    </a>
);

/**
 * Regulamin programu partnerskiego (/partnerzy/regulamin) and its English translation (/en/partners/terms): the binding
 * terms of the partner programme, accepted in the application form instead of a signed agreement. Its figures must
 * match the programme page (components/partners/partner-data.ts, lang/{pl,en}/partners.php): 15% net, 12 months, payout
 * within 14 days. Change it with LegalPageController::PARTNER_TERMS_EFFECTIVE_DATE.
 */
export const PARTNER_TERMS = localized<LegalDocumentCopy>({
    pl: {
        pageName: 'Regulamin programu',
        title: 'Regulamin programu partnerskiego',
        lead: 'Warunki programu partnerskiego Netizo: kto może polecać, kiedy należy się prowizja, jak ją wypłacamy i jak zakończyć udział.',
        partyLabel: 'Organizator',
        note: null,
        headerSections: [
            { id: 'prowizja', label: 'Prowizja' },
            { id: 'wyplata', label: 'Wypłata' },
            { id: 'zakonczenie', label: 'Zakończenie' },
        ],
        sections: [
            {
                id: 'postanowienia-ogolne',
                title: 'Postanowienia ogólne',
                body: (
                    <ol>
                        <li>
                            Regulamin określa zasady programu partnerskiego Netizo (dalej: „Program”), w którym za polecanie nam klientów otrzymujesz
                            prowizję.
                        </li>
                        <li>
                            Organizatorem Programu jest {company.owner}, prowadzący działalność gospodarczą pod nazwą {company.name}, {address}, NIP{' '}
                            {company.nip}, REGON {company.regon}, e-mail {mail}, telefon {phone} (dalej: „Organizator”, „my”).
                        </li>
                        <li>
                            Regulamin jest wzorcem umowy w rozumieniu art. 384 Kodeksu cywilnego. Akceptujesz go w formularzu zgłoszenia; odrębna umowa
                            nie jest potrzebna.
                        </li>
                        <li>Udział w Programie jest bezpłatny i dobrowolny. Nie musisz polecić określonej liczby klientów.</li>
                        <li>
                            Regulamin jest dostępny bezpłatnie na tej stronie. Możesz go wydrukować albo zapisać jako PDF przyciskiem „Drukuj”, a na
                            Twoją prośbę prześlemy go e-mailem.
                        </li>
                        <li>
                            Opis Programu na <a href={pageUrls.pl.partners}>stronie programu partnerskiego</a> jest streszczeniem regulaminu. W razie
                            rozbieżności rozstrzyga regulamin.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'definicje',
                title: 'Definicje',
                body: (
                    <dl>
                        <div>
                            <dt>Partner (Ty)</dt>
                            <dd>Osoba albo firma, której zgłoszenie do Programu przyjęliśmy zgodnie z § 4.</dd>
                        </div>
                        <div>
                            <dt>Kod partnera</dt>
                            <dd>Indywidualny kod, który przydzielamy Partnerowi po przyjęciu zgłoszenia.</dd>
                        </div>
                        <div>
                            <dt>Polecenie</dt>
                            <dd>Wskazanie nam Klienta przez Partnera w sposób opisany w § 5.</dd>
                        </div>
                        <div>
                            <dt>Klient</dt>
                            <dd>Firma albo osoba polecona przez Partnera, która spełnia warunki z § 5 ust. 4.</dd>
                        </div>
                        <div>
                            <dt>Zamówienie</dt>
                            <dd>
                                Umowa zawarta przez Klienta z Organizatorem na zaprojektowanie, wykonanie, rozbudowę lub utrzymanie strony, sklepu albo
                                aplikacji, w tym na opiekę techniczną.
                            </dd>
                        </div>
                        <div>
                            <dt>Okres prowizyjny</dt>
                            <dd>12 miesięcy od dnia, w którym Klient zawarł pierwsze Zamówienie.</dd>
                        </div>
                        <div>
                            <dt>Prowizja</dt>
                            <dd>Wynagrodzenie Partnera za Polecenie, obliczane zgodnie z § 7.</dd>
                        </div>
                    </dl>
                ),
            },
            {
                id: 'kto-moze-byc-partnerem',
                title: 'Kto może zostać Partnerem',
                body: (
                    <ol>
                        <li>
                            Partnerem może zostać pełnoletnia osoba fizyczna z pełną zdolnością do czynności prawnych, a także firma: osoba prawna albo
                            jednostka organizacyjna, której ustawa przyznaje zdolność prawną. Nie musisz prowadzić działalności gospodarczej.
                        </li>
                        <li>Partnerem nie może zostać osoba, która realizuje projekty dla Organizatora, np. na podstawie umowy o pracę, zlecenia albo umowy o współpracy.</li>
                        <li>Nie możesz polecić samego siebie ani firmy, którą prowadzisz, współprowadzisz albo którą kierujesz.</li>
                    </ol>
                ),
            },
            {
                id: 'przystapienie',
                title: 'Przystąpienie do Programu',
                body: (
                    <ol>
                        <li>
                            Żeby przystąpić do Programu, wypełnij formularz zgłoszenia na{' '}
                            <a href={`${pageUrls.pl.partners}#dolacz`}>stronie programu partnerskiego</a> i zaakceptuj regulamin.
                        </li>
                        <li>Odpowiadamy na zgłoszenie zwykle w ciągu 24 godzin, najpóźniej w ciągu 7 dni.</li>
                        <li>
                            Umowa o udział w Programie zostaje zawarta, gdy wyślemy Ci e-mail z potwierdzeniem przyjęcia zgłoszenia i Twoim kodem
                            partnera. Od tej chwili jesteś Partnerem.
                        </li>
                        <li>
                            Możemy nie przyjąć zgłoszenia, np. gdy dane są niepełne lub nieprawdziwe albo gdy zgłaszający nie spełnia warunków z § 3.
                            Poinformujemy Cię o tym e-mailem.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'polecanie',
                title: 'Polecanie klientów',
                body: (
                    <ol>
                        <li>
                            Polecenie zgłaszasz na jeden z dwóch sposobów:
                            <ul>
                                <li>Klient podaje Twój kod partnera w briefie, w wiadomości albo podczas pierwszej rozmowy z nami;</li>
                                <li>przekazujesz nam dane kontaktowe Klienta e-mailem na {mail}, za jego zgodą.</li>
                            </ul>
                        </li>
                        <li>
                            Każde Polecenie potwierdzamy Ci e-mailem. Jeśli polecona firma nie spełnia warunków z ust. 4, piszemy Ci o tym w tym samym
                            e-mailu.
                        </li>
                        <li>
                            Polecenie jest ważne przez 6 miesięcy od jego potwierdzenia. Jeśli w tym czasie Klient nie zawrze pierwszego Zamówienia,
                            Polecenie wygasa.
                        </li>
                        <li>
                            Prowizja należy się za Klienta, który w chwili Polecenia jest dla nas nowy: w ciągu 12 miesięcy przed Poleceniem nie
                            rozmawialiśmy z nim o współpracy ani nie realizowaliśmy dla niego zamówień.
                        </li>
                        <li>Jeśli tego samego Klienta poleci kilku Partnerów, Prowizja należy się temu, którego Polecenie potwierdziliśmy jako pierwsze.</li>
                        <li>
                            O zawarciu Zamówienia, jego zakresie i cenie decydujemy razem z Klientem. Cena dla Klienta jest taka sama jak bez Polecenia;
                            Prowizję płacimy z naszej marży. Nie odpowiadamy wobec Partnera za to, że Klient nie zawrze Zamówienia.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'zasady-polecania',
                title: 'Zasady polecania',
                body: (
                    <ol>
                        <li>
                            Polecasz nas we własnym imieniu. Nie jesteś naszym pełnomocnikiem ani przedstawicielem: nie możesz składać ofert, ustalać cen
                            ani zawierać umów w naszym imieniu.
                        </li>
                        <li>Przekazuj prawdziwe informacje o nas i naszych usługach. Nie obiecuj rabatów, terminów ani warunków, których nie oferujemy.</li>
                        <li>
                            Nie wysyłaj niezamówionych informacji handlowych, w tym e-maili, SMS-ów i wiadomości w mediach społecznościowych do osób,
                            które nie zgodziły się ich otrzymywać.
                        </li>
                        <li>
                            Nie podszywaj się pod Netizo. Bez naszej zgody nie używaj nazwy ani logo Netizo w płatnych reklamach (np. jako słowa
                            kluczowego w wyszukiwarce) ani w nazwach domen, profili i firm.
                        </li>
                        <li>Dane kontaktowe Klienta przekazuj nam tylko wtedy, gdy Klient się na to zgodził.</li>
                        <li>
                            Jeśli naruszysz ust. 1–5, możemy nie uznać Poleceń, których dotyczy naruszenie, a przy rażącym naruszeniu wypowiedzieć
                            udział w Programie ze skutkiem natychmiastowym (§ 11 ust. 3).
                        </li>
                    </ol>
                ),
            },
            {
                id: 'prowizja',
                title: 'Prowizja',
                body: (
                    <ol>
                        <li>
                            Za każdego Klienta należy Ci się Prowizja w wysokości 15% wartości netto każdej faktury za Zamówienia (projekt, rozbudowę,
                            opiekę techniczną), którą Klient opłaci w Okresie prowizyjnym.
                        </li>
                        <li>
                            Prowizję liczymy od kwoty netto (bez VAT) faktycznie zapłaconej przez Klienta. Jeśli Klient płaci fakturę w częściach,
                            Prowizja należy się od każdej zapłaconej części.
                        </li>
                        <li>
                            Prowizja nie należy się od faktur niezapłaconych ani anulowanych, ani od kwot zwróconych Klientowi. Jeśli po wypłacie
                            Prowizji faktura zostanie skorygowana albo kwota zwrócona Klientowi, potrącimy różnicę z kolejnej Prowizji, a gdy kolejnej
                            nie będzie, zwrócisz ją w ciągu 14 dni od wezwania.
                        </li>
                        <li>Prowizja jest kwotą netto. Jeśli jesteś czynnym podatnikiem VAT, doliczasz do niej VAT na swojej fakturze.</li>
                        <li>Nie ma limitu Poleceń ani łącznej wysokości Prowizji.</li>
                        <li>
                            Przykład: Klient zamawia stronę za {'10\u00A0000\u00A0zł'} netto i opłaca fakturę. Twoja Prowizja wynosi{' '}
                            {'1\u00A0500\u00A0zł'}.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'wyplata',
                title: 'Wypłata Prowizji',
                body: (
                    <ol>
                        <li>
                            Gdy Klient opłaci fakturę, wysyłamy Ci e-mailem zestawienie: za jakie Zamówienie, od jakiej kwoty i w jakiej wysokości
                            należy się Prowizja.
                        </li>
                        <li>
                            Jeśli prowadzisz działalność gospodarczą, wystawiasz nam fakturę albo rachunek na kwotę z zestawienia. Jeśli jej nie
                            prowadzisz, nie wystawiasz żadnych dokumentów; przed pierwszą wypłatą poprosimy Cię o dane potrzebne do rozliczenia: imię i
                            nazwisko, adres zamieszkania, numer PESEL i urząd skarbowy.
                        </li>
                        <li>
                            Prowizję wypłacamy przelewem na rachunek bankowy, który wskażesz, najpóźniej 14 dni od dnia, w którym Klient opłacił
                            fakturę. Jeśli Twoja faktura albo dane z ust. 2 dotrą do nas później niż 7 dni przed tym terminem, wypłacimy Prowizję w
                            ciągu 7 dni od ich otrzymania.
                        </li>
                        <li>Prowizja od faktury opłaconej w Okresie prowizyjnym należy się także wtedy, gdy jej wypłata przypada po tym okresie.</li>
                    </ol>
                ),
            },
            {
                id: 'podatki',
                title: 'Podatki',
                body: (
                    <ol>
                        <li>Prowizja jest Twoim przychodem i rozliczasz ją samodzielnie, zgodnie z przepisami podatkowymi.</li>
                        <li>
                            Jeśli nie prowadzisz działalności gospodarczej, wykonujemy obowiązki, które przepisy podatkowe nakładają na nas w związku z
                            wypłatą, np. sporządzamy informację PIT-11.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'dane-osobowe',
                title: 'Dane osobowe',
                body: (
                    <ol>
                        <li>
                            Twoje dane przetwarzamy, żeby rozpatrzyć zgłoszenie, prowadzić Twój udział w Programie i wypłacać Prowizję. Szczegóły
                            opisuje <a href={pageUrls.pl.privacy}>polityka prywatności</a>.
                        </li>
                        <li>
                            Przekazując nam dane kontaktowe Klienta, potwierdzasz, że Klient zgodził się na ich przekazanie. Od chwili, w której je
                            otrzymamy, ich administratorem jesteśmy my; przy pierwszym kontakcie informujemy Klienta o przetwarzaniu jego danych.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'zakonczenie',
                title: 'Czas trwania i zakończenie udziału',
                body: (
                    <ol>
                        <li>Umowa o udział w Programie jest zawarta na czas nieokreślony.</li>
                        <li>Możesz zakończyć udział w każdej chwili, bez podawania przyczyny i bez kosztów, pisząc na {mail}.</li>
                        <li>
                            Możemy wypowiedzieć Ci udział e-mailem, z zachowaniem 14-dniowego okresu wypowiedzenia. Przy rażącym naruszeniu
                            regulaminu, w szczególności § 6, możemy wypowiedzieć go ze skutkiem natychmiastowym.
                        </li>
                        <li>Możemy zakończyć cały Program, informując Partnerów e-mailem co najmniej 30 dni wcześniej.</li>
                        <li>
                            Po zakończeniu udziału albo Programu nie przyjmujemy nowych Poleceń. Prowizja za Klientów, których Polecenia potwierdziliśmy
                            wcześniej, należy się na dotychczasowych zasadach przez cały Okres prowizyjny. Jeśli wypowiedzieliśmy Ci udział ze skutkiem
                            natychmiastowym, należy Ci się tylko Prowizja od faktur opłaconych do dnia wypowiedzenia, z wyjątkiem Poleceń, których
                            dotyczyło naruszenie.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'reklamacje',
                title: 'Reklamacje',
                body: (
                    <ol>
                        <li>
                            Reklamację dotyczącą Programu, w tym wysokości albo terminu wypłaty Prowizji, złożysz e-mailem na {mail} albo listownie na
                            adres Organizatora.
                        </li>
                        <li>Opisz problem i podaj dane do kontaktu, żebyśmy mogli odpowiedzieć.</li>
                        <li>Rozpatrzymy reklamację w ciągu 14 dni od jej otrzymania i odpowiemy e-mailem, chyba że wskażesz inny sposób.</li>
                    </ol>
                ),
            },
            {
                id: 'zmiany',
                title: 'Zmiany regulaminu',
                body: (
                    <ol>
                        <li>Możemy zmienić regulamin z ważnych przyczyn, takich jak zmiana przepisów, zmiana sposobu rozliczeń albo zmiana zakresu Programu.</li>
                        <li>
                            O zmianach informujemy Partnerów e-mailem co najmniej 14 dni przed ich wejściem w życie, a nową wersję publikujemy na tej
                            stronie z datą, od której obowiązuje. Jeśli się z nimi nie zgadzasz, możesz wcześniej zakończyć udział (§ 11 ust. 2).
                        </li>
                        <li>Zmiany nie dotyczą Prowizji od faktur opłaconych przed ich wejściem w życie.</li>
                    </ol>
                ),
            },
            {
                id: 'postanowienia-koncowe',
                title: 'Postanowienia końcowe',
                body: (
                    <ol>
                        <li>
                            Regulamin podlega prawu polskiemu. Wybór prawa nie pozbawia konsumenta ochrony, którą zapewniają mu bezwzględnie obowiązujące
                            przepisy państwa jego zwykłego pobytu.
                        </li>
                        <li>
                            Regulamin nie ogranicza praw, które konsumentom i przedsiębiorcom na prawach konsumenta przyznają bezwzględnie obowiązujące
                            przepisy.
                        </li>
                        <li>
                            Spory z konsumentami rozstrzyga sąd właściwy według przepisów ogólnych, a spory z przedsiębiorcami sąd właściwy dla miejsca
                            wykonywania działalności Organizatora.
                        </li>
                        <li>W sprawach nieuregulowanych w regulaminie stosuje się przepisy Kodeksu cywilnego.</li>
                        <li>Angielska wersja regulaminu jest tłumaczeniem; w razie rozbieżności rozstrzyga wersja polska.</li>
                        <li>
                            Regulamin obowiązuje od <EffectiveDate />.
                        </li>
                    </ol>
                ),
            },
        ],
    },
    en: {
        pageName: 'Partner program terms',
        title: 'Partner program terms',
        lead: 'The terms of the Netizo partner program: who can refer clients, when the commission is due, how we pay it and how to leave.',
        partyLabel: 'Organizer',
        note: (
            <>
                This is an English translation for your convenience; the{' '}
                <a href={pageUrls.pl.partnerTerms} hrefLang="pl">
                    Polish version
                </a>{' '}
                is legally binding.
            </>
        ),
        headerSections: [
            { id: 'commission', label: 'Commission' },
            { id: 'payout', label: 'Payout' },
            { id: 'termination', label: 'Leaving' },
        ],
        sections: [
            {
                id: 'general-provisions',
                title: 'General provisions',
                body: (
                    <ol>
                        <li>These terms set out the rules of the Netizo partner program (the “Program”), in which you earn a commission for referring clients to us.</li>
                        <li>
                            The Program is run by {company.owner}, running a sole proprietorship trading as {company.name}, {address}, Poland, tax ID
                            (NIP) {company.nip}, REGON {company.regon}, email {mail}, phone {phone} (the “Organizer”, “we”).
                        </li>
                        <li>
                            These terms are standard contract terms within the meaning of Art. 384 of the Polish Civil Code. You accept them in the
                            application form; no separate agreement is needed.
                        </li>
                        <li>Taking part in the Program is free and voluntary. You don’t have to refer any set number of clients.</li>
                        <li>
                            These terms are available free of charge on this page. You can print them or save them as a PDF with the “Print” button, and
                            we will email them to you on request.
                        </li>
                        <li>
                            The description on the <a href={pageUrls.en.partners}>partner program page</a> summarizes these terms. If they differ, these
                            terms prevail.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'definitions',
                title: 'Definitions',
                body: (
                    <dl>
                        <div>
                            <dt>Partner (you)</dt>
                            <dd>A person or company whose application to the Program we have accepted under § 4.</dd>
                        </div>
                        <div>
                            <dt>Partner code</dt>
                            <dd>The personal code we give a Partner once their application is accepted.</dd>
                        </div>
                        <div>
                            <dt>Referral</dt>
                            <dd>A Partner pointing a Client to us in one of the ways described in § 5.</dd>
                        </div>
                        <div>
                            <dt>Client</dt>
                            <dd>A company or person referred by a Partner who meets the conditions of § 5(4).</dd>
                        </div>
                        <div>
                            <dt>Order</dt>
                            <dd>
                                A contract between a Client and the Organizer to design, build, extend or maintain a website, online store or app,
                                including technical care.
                            </dd>
                        </div>
                        <div>
                            <dt>Commission period</dt>
                            <dd>12 months from the day the Client makes their first Order.</dd>
                        </div>
                        <div>
                            <dt>Commission</dt>
                            <dd>What a Partner earns for a Referral, calculated under § 7.</dd>
                        </div>
                    </dl>
                ),
            },
            {
                id: 'who-can-join',
                title: 'Who can become a Partner',
                body: (
                    <ol>
                        <li>
                            Any adult with full legal capacity can become a Partner, and so can a company: a legal person or an organizational unit
                            granted legal capacity by law. You don’t need to run a business.
                        </li>
                        <li>People who work on projects for the Organizer, for example under an employment, service or cooperation contract, can’t become Partners.</li>
                        <li>You can’t refer yourself or a company you run, co-run or manage.</li>
                    </ol>
                ),
            },
            {
                id: 'joining',
                title: 'Joining the Program',
                body: (
                    <ol>
                        <li>
                            To join the Program, fill in the application form on the <a href={`${pageUrls.en.partners}#join`}>partner program page</a>{' '}
                            and accept these terms.
                        </li>
                        <li>We usually reply to an application within 24 hours, and within 7 days at the latest.</li>
                        <li>
                            The agreement to take part in the Program is made when we email you to confirm that your application is accepted, with your
                            partner code. From then on, you are a Partner.
                        </li>
                        <li>
                            We may decline an application, for example when the details are incomplete or untrue, or when the applicant doesn’t meet the
                            conditions of § 3. We will let you know by email.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'referring-clients',
                title: 'Referring clients',
                body: (
                    <ol>
                        <li>
                            You make a Referral in one of two ways:
                            <ul>
                                <li>the Client gives your partner code in the brief, in a message or during their first conversation with us;</li>
                                <li>you email us the Client’s contact details at {mail}, with the Client’s consent.</li>
                            </ul>
                        </li>
                        <li>We confirm every Referral by email. If the referred company doesn’t meet the conditions of section 4, we say so in the same email.</li>
                        <li>A Referral is valid for 6 months from its confirmation. If the Client doesn’t make a first Order in that time, the Referral expires.</li>
                        <li>
                            A Commission is due for a Client who is new to us at the time of the Referral: in the 12 months before it, we haven’t talked
                            with them about working together or worked on any order for them.
                        </li>
                        <li>If several Partners refer the same Client, the Commission goes to the Partner whose Referral we confirmed first.</li>
                        <li>
                            We decide with the Client whether to make an Order, what it covers and what it costs. The Client pays the same price as
                            without a Referral; we pay the Commission out of our margin. We are not liable to the Partner if the Client doesn’t make an
                            Order.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'referral-rules',
                title: 'Referral rules',
                body: (
                    <ol>
                        <li>
                            You refer us in your own name. You are not our agent or representative: you can’t make offers, set prices or enter into
                            contracts on our behalf.
                        </li>
                        <li>Give true information about us and our services. Don’t promise discounts, deadlines or terms we don’t offer.</li>
                        <li>
                            Don’t send unsolicited commercial communications, including emails, text messages and social media messages, to people who
                            haven’t agreed to receive them.
                        </li>
                        <li>
                            Don’t pose as Netizo. Without our permission, don’t use the Netizo name or logo in paid ads (for example as a search keyword)
                            or in domain, profile or company names.
                        </li>
                        <li>Pass on a Client’s contact details only with the Client’s consent.</li>
                        <li>
                            If you break sections 1–5, we may refuse the Referrals affected, and in the case of a serious breach end your participation
                            with immediate effect (§ 11(3)).
                        </li>
                    </ol>
                ),
            },
            {
                id: 'commission',
                title: 'Commission',
                body: (
                    <ol>
                        <li>
                            For every Client you get a Commission of 15% of the net value of every invoice for Orders (the project, extensions, technical
                            care) that the Client pays during the Commission period.
                        </li>
                        <li>
                            We calculate the Commission on the net amount (excluding VAT) the Client actually paid. If the Client pays an invoice in
                            installments, the Commission is due on each installment paid.
                        </li>
                        <li>
                            No Commission is due on unpaid or canceled invoices or on amounts refunded to the Client. If an invoice is corrected or an
                            amount is refunded after we have paid the Commission, we deduct the difference from your next Commission, or, if there is
                            none, you pay it back within 14 days of our request.
                        </li>
                        <li>The Commission is a net amount. If you are registered for VAT, you add VAT to it on your invoice.</li>
                        <li>There is no limit on Referrals or on the total Commission.</li>
                        <li>
                            Example: a Client orders a website for {'PLN\u00A010,000'} net and pays the invoice. Your Commission is {'PLN\u00A01,500'}.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'payout',
                title: 'Commission payout',
                body: (
                    <ol>
                        <li>Once the Client pays an invoice, we email you a statement: which Order, which amount and how much Commission is due.</li>
                        <li>
                            If you run a business, you send us an invoice or bill for the amount in the statement. If you don’t, you don’t issue any
                            documents; before the first payout we will ask for the details we need for the settlement: your full name, home address,
                            PESEL number and tax office.
                        </li>
                        <li>
                            We pay the Commission by bank transfer to the account you give us, no later than 14 days after the day the Client paid the
                            invoice. If your invoice or the details from section 2 reach us later than 7 days before that deadline, we pay the
                            Commission within 7 days of receiving them.
                        </li>
                        <li>A Commission on an invoice paid during the Commission period is due even if its payout falls after that period.</li>
                    </ol>
                ),
            },
            {
                id: 'taxes',
                title: 'Taxes',
                body: (
                    <ol>
                        <li>The Commission is your income, and you settle the tax on it yourself under the tax rules that apply to you.</li>
                        <li>
                            If you don’t run a business, we fulfill the obligations Polish tax law places on us in connection with the payout, for
                            example by preparing a PIT-11 form.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'personal-data',
                title: 'Personal data',
                body: (
                    <ol>
                        <li>
                            We process your data to review your application, run your participation in the Program and pay your Commission. The details
                            are in the <a href={pageUrls.en.privacy}>privacy policy</a>.
                        </li>
                        <li>
                            By passing a Client’s contact details on to us, you confirm that the Client agreed to it. From the moment we receive them, we
                            are their controller; we tell the Client how we process their data when we first contact them.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'termination',
                title: 'Duration and leaving the Program',
                body: (
                    <ol>
                        <li>The agreement to take part in the Program is made for an indefinite period.</li>
                        <li>You can leave at any time, without giving a reason and at no cost, by emailing {mail}.</li>
                        <li>
                            We may end your participation by email with 14 days’ notice. In the case of a serious breach of these terms, especially of
                            § 6, we may end it with immediate effect.
                        </li>
                        <li>We may end the whole Program by emailing Partners at least 30 days in advance.</li>
                        <li>
                            Once your participation or the Program ends, we don’t accept new Referrals. The Commission for Clients whose Referrals we
                            confirmed before then stays due on the same terms for the whole Commission period. If we ended your participation with
                            immediate effect, only the Commission on invoices paid up to that day is due, except for the Referrals the breach concerned.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'complaints',
                title: 'Complaints',
                body: (
                    <ol>
                        <li>
                            You can file a complaint about the Program, including the amount or timing of a Commission payout, by emailing {mail} or by
                            mail to the Organizer’s address.
                        </li>
                        <li>Describe the problem and give your contact details so we can reply.</li>
                        <li>We will review the complaint within 14 days of receiving it and reply by email, unless you ask otherwise.</li>
                    </ol>
                ),
            },
            {
                id: 'changes',
                title: 'Changes to these terms',
                body: (
                    <ol>
                        <li>We may change these terms for valid reasons, such as changes in the law, in how we settle commissions or in the scope of the Program.</li>
                        <li>
                            We email Partners about changes at least 14 days before they take effect and publish the new version on this page with the
                            date it takes effect. If you don’t agree with them, you can leave before then (§ 11(2)).
                        </li>
                        <li>Changes don’t affect the Commission on invoices paid before they take effect.</li>
                    </ol>
                ),
            },
            {
                id: 'final-provisions',
                title: 'Final provisions',
                body: (
                    <ol>
                        <li>
                            These terms are governed by Polish law. This choice of law doesn’t deprive a consumer of the protection given by the
                            mandatory provisions of the country where they usually live.
                        </li>
                        <li>These terms don’t limit the rights that mandatory law gives consumers and sole traders with consumer rights.</li>
                        <li>
                            Disputes with consumers are settled by the court with jurisdiction under general rules; disputes with businesses by the court
                            with jurisdiction over the Organizer’s place of business.
                        </li>
                        <li>Matters these terms don’t cover are governed by the Polish Civil Code.</li>
                        <li>This English version is a translation; if the versions differ, the Polish version prevails.</li>
                        <li>
                            These terms are effective from <EffectiveDate />.
                        </li>
                    </ol>
                ),
            },
        ],
    },
});
