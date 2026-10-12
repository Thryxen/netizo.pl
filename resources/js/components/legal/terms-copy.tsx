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
 * Regulamin serwisu (/regulamin) and its English translation (/en/terms): the terms of the services provided on the site
 * by electronic means (the forms, the newsletter), as the Polish Act on Providing Services by Electronic Means requires.
 * Project work is agreed in a separate contract. Change it with LegalPageController::TERMS_EFFECTIVE_DATE.
 */
export const TERMS = localized<LegalDocumentCopy>({
    pl: {
        pageName: 'Regulamin',
        title: 'Regulamin serwisu',
        lead: 'Zasady korzystania z netizo.pl: co możesz zrobić na stronie, czego potrzebujesz, jak złożyć reklamację i jakie prawa masz jako konsument.',
        partyLabel: 'Usługodawca',
        note: null,
        headerSections: [
            { id: 'uslugi', label: 'Usługi' },
            { id: 'reklamacje', label: 'Reklamacje' },
            { id: 'konsumenci', label: 'Konsumenci' },
        ],
        sections: [
            {
                id: 'postanowienia-ogolne',
                title: 'Postanowienia ogólne',
                body: (
                    <ol>
                        <li>
                            Regulamin określa zasady korzystania z serwisu netizo.pl i z usług, które świadczymy w nim drogą elektroniczną. Jest
                            regulaminem, o którym mowa w art. 8 ustawy z 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną.
                        </li>
                        <li>
                            Usługodawcą jest {company.owner}, prowadzący działalność gospodarczą pod nazwą {company.name}, {address}, NIP {company.nip},
                            REGON {company.regon}, e-mail {mail}, telefon {phone} (dalej:
                            „Usługodawca”, „my”).
                        </li>
                        <li>Regulamin jest dostępny bezpłatnie na tej stronie. Możesz go wydrukować albo zapisać jako PDF przyciskiem „Drukuj”.</li>
                        <li>Korzystanie z serwisu jest bezpłatne. Płatne są tylko projekty i usługi zamawiane na podstawie odrębnej umowy.</li>
                    </ol>
                ),
            },
            {
                id: 'definicje',
                title: 'Definicje',
                body: (
                    <dl>
                        <div>
                            <dt>Serwis</dt>
                            <dd>Strona internetowa netizo.pl z podstronami, w wersji polskiej i angielskiej.</dd>
                        </div>
                        <div>
                            <dt>Użytkownik (Ty)</dt>
                            <dd>Każda osoba, która korzysta z serwisu.</dd>
                        </div>
                        <div>
                            <dt>Usługi</dt>
                            <dd>Usługi świadczone w serwisie drogą elektroniczną, wymienione w § 3.</dd>
                        </div>
                        <div>
                            <dt>Konsument</dt>
                            <dd>
                                Osoba fizyczna, która korzysta z serwisu w celu niezwiązanym bezpośrednio z jej działalnością gospodarczą lub zawodową
                                (art. 22¹ Kodeksu cywilnego).
                            </dd>
                        </div>
                        <div>
                            <dt>Przedsiębiorca na prawach konsumenta</dt>
                            <dd>
                                Osoba fizyczna prowadząca działalność gospodarczą, która zawiera umowę bezpośrednio związaną z tą działalnością, ale
                                niemającą dla niej charakteru zawodowego.
                            </dd>
                        </div>
                        <div>
                            <dt>Umowa projektowa</dt>
                            <dd>Odrębna umowa na zaprojektowanie, wykonanie, rozwój lub utrzymanie strony, sklepu albo aplikacji.</dd>
                        </div>
                    </dl>
                ),
            },
            {
                id: 'uslugi',
                title: 'Usługi w serwisie',
                body: (
                    <ol>
                        <li>
                            W serwisie bezpłatnie świadczymy następujące usługi:
                            <ul>
                                <li>przeglądanie treści serwisu;</li>
                                <li>„Szybka wiadomość”: wysłanie do nas wiadomości;</li>
                                <li>„Brief projektu”: przekazanie informacji o planowanym projekcie, żebyśmy mogli przygotować wycenę;</li>
                                <li>„Oddzwonimy do Ciebie”: prośba o telefon pod wskazany numer;</li>
                                <li>newsletter: wiadomości e-mail o naszej pracy, z poradami i case studies, wysyłane najwyżej raz w miesiącu;</li>
                                <li>zgłoszenie do programu partnerskiego.</li>
                            </ul>
                        </li>
                        <li>
                            Wysłanie formularza nie oznacza zawarcia umowy projektowej. Na podstawie zgłoszenia możemy przygotować wycenę lub ofertę;
                            umowa projektowa zostaje zawarta dopiero wtedy, gdy obie strony uzgodnią i zaakceptują jej warunki.
                        </li>
                        <li>
                            Ceny, przykłady i inne informacje w serwisie, w tym orientacyjne koszty w odpowiedziach na częste pytania, mają charakter
                            informacyjny i nie są ofertą w rozumieniu Kodeksu cywilnego.
                        </li>
                        <li>
                            Zasady programu partnerskiego, w tym prowizję i jej wypłatę, określa odrębny{' '}
                            <a href={pageUrls.pl.partnerTerms}>regulamin programu partnerskiego</a>, który akceptujesz w zgłoszeniu.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'wymagania-techniczne',
                title: 'Wymagania techniczne',
                body: (
                    <ol>
                        <li>Do korzystania z serwisu potrzebujesz urządzenia z dostępem do internetu i aktualnej przeglądarki, np. Chrome, Firefox, Safari lub Edge.</li>
                        <li>Do wysłania formularza potrzebna jest włączona obsługa JavaScriptu, a do newslettera i większości formularzy także aktywny adres e-mail.</li>
                        <li>
                            Serwis używa plików cookie. Zasady ich używania opisuje <a href={pageUrls.pl.privacy}>polityka prywatności</a>.
                        </li>
                        <li>
                            Korzystanie z usług elektronicznych wiąże się z ryzykiem, np. złośliwego oprogramowania, wyłudzania danych (phishingu) czy
                            przechwycenia danych w niezabezpieczonej sieci. Połączenie z serwisem jest szyfrowane (HTTPS); dbaj o aktualne
                            oprogramowanie urządzenia i nie podawaj danych na stronach podszywających się pod nas.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'umowa',
                title: 'Zawarcie i rozwiązanie umowy o świadczenie usług',
                body: (
                    <ol>
                        <li>Umowa o przeglądanie serwisu zostaje zawarta, gdy otwierasz serwis, i kończy się, gdy go opuszczasz.</li>
                        <li>
                            Umowa o wysłanie formularza (wiadomość, brief, prośba o telefon, zgłoszenie do programu partnerskiego) zostaje zawarta z
                            chwilą wysłania formularza i wygasa po jego przekazaniu.
                        </li>
                        <li>
                            Umowa o newsletter zostaje zawarta na czas nieokreślony z chwilą zapisu. Możesz ją rozwiązać w każdej chwili, bez podawania
                            przyczyny i bez kosztów, pisząc na {mail}.
                        </li>
                        <li>
                            Możemy rozwiązać umowę o newsletter z ważnej przyczyny, np. gdy kończymy jego wysyłkę, z 14-dniowym okresem wypowiedzenia.
                            Poinformujemy Cię o tym e-mailem.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'zasady-korzystania',
                title: 'Zasady korzystania',
                body: (
                    <ol>
                        <li>Korzystaj z serwisu zgodnie z prawem, dobrymi obyczajami i regulaminem.</li>
                        <li>
                            Nie wolno przesyłać treści bezprawnych, obraźliwych ani naruszających prawa innych osób, w tym cudzych danych osobowych bez
                            podstawy prawnej.
                        </li>
                        <li>
                            Nie wolno zakłócać działania serwisu, w tym wysyłać formularzy automatycznie ani próbować obejść zabezpieczeń. Liczba
                            zgłoszeń z jednego adresu IP jest ograniczona.
                        </li>
                        <li>Podawaj prawdziwe dane kontaktowe, żebyśmy mogli odpowiedzieć.</li>
                    </ol>
                ),
            },
            {
                id: 'prawa-autorskie',
                title: 'Prawa autorskie',
                body: (
                    <ol>
                        <li>
                            Treści serwisu, w tym teksty, grafiki, zdjęcia, logo Netizo i kod, są chronione prawem autorskim i należą do nas albo do
                            osób, które pozwoliły nam z nich korzystać.
                        </li>
                        <li>
                            Zrzuty ekranu i opisy realizacji przedstawiają projekty wykonane dla naszych klientów; prawa do nich i do znaków klientów
                            należą do ich właścicieli.
                        </li>
                        <li>
                            Bez naszej zgody nie wolno kopiować ani rozpowszechniać treści serwisu w celach komercyjnych. Nie ogranicza to korzystania z
                            nich w granicach dozwolonego użytku, np. cytowania.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'odpowiedzialnosc',
                title: 'Odpowiedzialność',
                body: (
                    <ol>
                        <li>
                            Dbamy o to, żeby serwis działał bez przerw i zawierał aktualne informacje. Mogą się zdarzyć przerwy techniczne związane z
                            konserwacją lub awarią; staramy się, żeby były jak najkrótsze.
                        </li>
                        <li>Nie odpowiadamy za skutki korzystania z serwisu niezgodnie z regulaminem ani za treść stron, do których prowadzą linki zewnętrzne.</li>
                        <li>
                            Postanowienia ograniczające odpowiedzialność nie dotyczą konsumentów i przedsiębiorców na prawach konsumenta w zakresie, w
                            jakim wyłączają to przepisy prawa.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'reklamacje',
                title: 'Reklamacje',
                body: (
                    <ol>
                        <li>Reklamację dotyczącą działania serwisu lub usług złożysz e-mailem na {mail} albo listownie na adres Usługodawcy.</li>
                        <li>Opisz problem i podaj dane do kontaktu, żebyśmy mogli odpowiedzieć.</li>
                        <li>
                            Rozpatrzymy reklamację w ciągu 14 dni od jej otrzymania i odpowiemy w ten sam sposób, w jaki ją złożono, chyba że wskażesz
                            inny.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'dane-osobowe',
                title: 'Dane osobowe',
                body: (
                    <p>
                        Zasady przetwarzania danych osobowych, w tym danych z formularzy, oraz używania plików cookie opisuje{' '}
                        <a href={pageUrls.pl.privacy}>polityka prywatności</a>.
                    </p>
                ),
            },
            {
                id: 'konsumenci',
                title: 'Konsumenci',
                body: (
                    <ol>
                        <li>
                            Konsument może odstąpić od umowy zawartej na odległość w ciągu 14 dni bez podania przyczyny. Usługi w serwisie są bezpłatne
                            i możesz z nich zrezygnować w każdej chwili: wystarczy przestać z nich korzystać albo wypisać się z newslettera.
                        </li>
                        <li>
                            Konsument może skorzystać z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń, m.in. z pomocy
                            powiatowego (miejskiego) rzecznika konsumentów, organizacji konsumenckich oraz stałych polubownych sądów konsumenckich przy
                            wojewódzkich inspektoratach Inspekcji Handlowej. Informacje o nich znajdziesz na stronie{' '}
                            <a href="https://uokik.gov.pl">uokik.gov.pl</a>.
                        </li>
                        <li>Przepisy chroniące konsumentów stosuje się także do przedsiębiorców na prawach konsumenta, w zakresie przewidzianym w ustawie o prawach konsumenta.</li>
                    </ol>
                ),
            },
            {
                id: 'zmiany',
                title: 'Zmiany regulaminu',
                body: (
                    <ol>
                        <li>Możemy zmienić regulamin z ważnych przyczyn, takich jak zmiana przepisów, nowe usługi w serwisie albo zmiana sposobu ich świadczenia.</li>
                        <li>
                            Nową wersję publikujemy na tej stronie z datą, od której obowiązuje. Subskrybentów newslettera informujemy e-mailem co
                            najmniej 14 dni przed wejściem zmian w życie; jeśli się z nimi nie zgadzasz, możesz wcześniej się wypisać.
                        </li>
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
                            Spory z konsumentami rozstrzyga sąd właściwy według przepisów ogólnych, a spory z przedsiębiorcami sąd właściwy dla miejsca
                            wykonywania działalności Usługodawcy.
                        </li>
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
        pageName: 'Terms of service',
        title: 'Terms of service',
        lead: 'How you can use netizo.pl: what you can do on the site, what you need for it, how to file a complaint and what rights you have as a consumer.',
        partyLabel: 'Service provider',
        note: (
            <>
                This is an English translation for your convenience; the{' '}
                <a href={pageUrls.pl.terms} hrefLang="pl">
                    Polish version
                </a>{' '}
                is legally binding.
            </>
        ),
        headerSections: [
            { id: 'services', label: 'Services' },
            { id: 'complaints', label: 'Complaints' },
            { id: 'consumers', label: 'Consumers' },
        ],
        sections: [
            {
                id: 'general-provisions',
                title: 'General provisions',
                body: (
                    <ol>
                        <li>
                            These terms set out how you can use netizo.pl and the services we provide on it by electronic means. They are the terms
                            required by Art. 8 of the Polish Act of 18 July 2002 on Providing Services by Electronic Means.
                        </li>
                        <li>
                            The service provider is {company.owner}, running a sole proprietorship trading as {company.name}, {address}, Poland, tax ID
                            (NIP) {company.nip}, REGON {company.regon}, email {mail}, phone {phone}{' '}
                            (the “Service Provider”, “we”).
                        </li>
                        <li>These terms are available free of charge on this page. You can print them or save them as a PDF with the “Print” button.</li>
                        <li>Using the site is free. Only projects and services ordered under a separate contract are paid.</li>
                    </ol>
                ),
            },
            {
                id: 'definitions',
                title: 'Definitions',
                body: (
                    <dl>
                        <div>
                            <dt>Site</dt>
                            <dd>The netizo.pl website and its pages, in Polish and English.</dd>
                        </div>
                        <div>
                            <dt>User (you)</dt>
                            <dd>Anyone who uses the site.</dd>
                        </div>
                        <div>
                            <dt>Services</dt>
                            <dd>The services provided on the site by electronic means, listed in § 3.</dd>
                        </div>
                        <div>
                            <dt>Consumer</dt>
                            <dd>
                                A natural person using the site for purposes not directly related to their business or profession (Art. 22¹ of the
                                Polish Civil Code).
                            </dd>
                        </div>
                        <div>
                            <dt>Sole trader with consumer rights</dt>
                            <dd>
                                A natural person running a business who enters into a contract directly related to that business but not of a
                                professional nature for them.
                            </dd>
                        </div>
                        <div>
                            <dt>Project contract</dt>
                            <dd>A separate contract to design, build, develop or maintain a website, online store or app.</dd>
                        </div>
                    </dl>
                ),
            },
            {
                id: 'services',
                title: 'Services on the site',
                body: (
                    <ol>
                        <li>
                            We provide the following services on the site free of charge:
                            <ul>
                                <li>browsing the content of the site;</li>
                                <li>“Quick message”: sending us a message;</li>
                                <li>“Project brief”: telling us about a planned project so we can prepare a quote;</li>
                                <li>“We’ll call you back”: asking us to call the number you give;</li>
                                <li>the newsletter: emails about our work, with tips and case studies, sent at most once a month;</li>
                                <li>applying to the partner program.</li>
                            </ul>
                        </li>
                        <li>
                            Sending a form doesn’t create a project contract. We may prepare a quote or an offer based on it; a project contract is made
                            only when both sides agree on and accept its terms.
                        </li>
                        <li>
                            Prices, examples and other information on the site, including the indicative costs in the answers to frequently asked
                            questions, are for information only and are not an offer within the meaning of the Polish Civil Code.
                        </li>
                        <li>
                            The partner program, including the commission and its payout, is governed by the separate{' '}
                            <a href={pageUrls.en.partnerTerms}>partner program terms</a>, which you accept when you apply.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'technical-requirements',
                title: 'Technical requirements',
                body: (
                    <ol>
                        <li>To use the site, you need a device with internet access and an up-to-date browser, such as Chrome, Firefox, Safari or Edge.</li>
                        <li>Sending a form requires JavaScript to be turned on; the newsletter and most forms also need a working email address.</li>
                        <li>
                            The site uses cookies, as described in the <a href={pageUrls.en.privacy}>privacy policy</a>.
                        </li>
                        <li>
                            Using electronic services carries risks such as malware, phishing or data being intercepted on an unsecured network. The
                            connection to the site is encrypted (HTTPS); keep your device’s software up to date and don’t enter your details on pages
                            that impersonate us.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'agreement',
                title: 'Starting and ending the service agreement',
                body: (
                    <ol>
                        <li>The agreement to browse the site starts when you open it and ends when you leave.</li>
                        <li>
                            The agreement to send a form (message, brief, callback request, partner application) is made when you send the form and
                            ends once it is delivered.
                        </li>
                        <li>
                            The newsletter agreement is made for an indefinite period when you sign up. You can end it at any time, without giving a
                            reason and at no cost, by emailing {mail}.
                        </li>
                        <li>We may end the newsletter agreement for a valid reason, such as when we stop sending it, with 14 days’ notice by email.</li>
                    </ol>
                ),
            },
            {
                id: 'acceptable-use',
                title: 'Acceptable use',
                body: (
                    <ol>
                        <li>Use the site lawfully, in good faith and in line with these terms.</li>
                        <li>
                            Don’t send unlawful or offensive content or content that infringes other people’s rights, including other people’s personal
                            data without a legal basis.
                        </li>
                        <li>
                            Don’t disrupt the site, send forms automatically or try to get around its security. The number of submissions from one IP
                            address is limited.
                        </li>
                        <li>Give real contact details so we can reply.</li>
                    </ol>
                ),
            },
            {
                id: 'copyright',
                title: 'Copyright',
                body: (
                    <ol>
                        <li>
                            The content of the site, including text, graphics, photos, the Netizo logo and code, is protected by copyright and belongs to
                            us or to those who allowed us to use it.
                        </li>
                        <li>
                            Screenshots and descriptions of our work show projects made for our clients; the rights to them and to the clients’ marks
                            belong to their owners.
                        </li>
                        <li>
                            Don’t copy or distribute the content of the site for commercial purposes without our permission. This doesn’t limit uses
                            allowed by law, such as quoting.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'liability',
                title: 'Liability',
                body: (
                    <ol>
                        <li>
                            We work to keep the site available and up to date. There may be technical breaks for maintenance or failures; we keep them
                            as short as we can.
                        </li>
                        <li>We are not liable for the effects of using the site against these terms or for the content of external sites we link to.</li>
                        <li>
                            Limitations of liability don’t apply to consumers and sole traders with consumer rights to the extent the law doesn’t allow
                            them.
                        </li>
                    </ol>
                ),
            },
            {
                id: 'complaints',
                title: 'Complaints',
                body: (
                    <ol>
                        <li>You can file a complaint about the site or its services by emailing {mail} or by mail to the Service Provider’s address.</li>
                        <li>Describe the problem and give your contact details so we can reply.</li>
                        <li>We will review the complaint within 14 days of receiving it and reply the way you sent it, unless you ask otherwise.</li>
                    </ol>
                ),
            },
            {
                id: 'personal-data',
                title: 'Personal data',
                body: (
                    <p>
                        How we process personal data, including the data you enter in forms, and how we use cookies is described in the{' '}
                        <a href={pageUrls.en.privacy}>privacy policy</a>.
                    </p>
                ),
            },
            {
                id: 'consumers',
                title: 'Consumers',
                body: (
                    <ol>
                        <li>
                            A consumer may withdraw from a distance contract within 14 days without giving a reason. The services on the site are free
                            and you can stop using them at any time: just stop using them or unsubscribe from the newsletter.
                        </li>
                        <li>
                            Consumers can use out-of-court ways of handling complaints and claims, such as help from a district (municipal) consumer
                            ombudsman, consumer organizations and the permanent consumer arbitration courts at the regional Trade Inspection offices.
                            Information about them is available at <a href="https://uokik.gov.pl">uokik.gov.pl</a>.
                        </li>
                        <li>The consumer protection rules also apply to sole traders with consumer rights, to the extent set out in the Polish Consumer Rights Act.</li>
                    </ol>
                ),
            },
            {
                id: 'changes',
                title: 'Changes to these terms',
                body: (
                    <ol>
                        <li>We may change these terms for valid reasons, such as changes in the law, new services on the site or changes to how we provide them.</li>
                        <li>
                            We publish the new version on this page with the date it takes effect. We email newsletter subscribers at least 14 days
                            before the changes take effect; if you don’t agree with them, you can unsubscribe before then.
                        </li>
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
                        <li>
                            Disputes with consumers are settled by the court with jurisdiction under general rules; disputes with businesses by the court
                            with jurisdiction over the Service Provider’s place of business.
                        </li>
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
