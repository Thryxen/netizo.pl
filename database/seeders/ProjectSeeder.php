<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/**
 * Sample portfolio projects with generated full-page screenshots. Safe to run again: projects are
 * matched by slug and their images are copied over the previous ones on the public disk.
 */
class ProjectSeeder extends Seeder
{
    public const IMAGES_PATH = 'seeders/images/projects';

    public function run(): void
    {
        foreach ($this->projects() as $project) {
            Project::query()->updateOrCreate(
                ['slug' => $project['slug']],
                [
                    ...$project,
                    'is_active' => true,
                    'thumbnail_image' => $this->storeImage("{$project['slug']}-thumbnail.webp", "projects/thumbnails/{$project['slug']}.webp"),
                    'full_image' => $this->storeImage("{$project['slug']}.webp", "projects/full/{$project['slug']}.webp"),
                    'challenges' => collect($project['challenges'])->map(fn (string $challenge): array => ['challenge' => $challenge])->all(),
                    'solutions' => collect($project['solutions'])->map(fn (string $solution): array => ['solution' => $solution])->all(),
                    'challenges_en' => collect($project['challenges_en'])->map(fn (string $challenge): array => ['challenge' => $challenge])->all(),
                    'solutions_en' => collect($project['solutions_en'])->map(fn (string $solution): array => ['solution' => $solution])->all(),
                ],
            );
        }
    }

    private function storeImage(string $sourceName, string $targetPath): string
    {
        Storage::disk('public')->put($targetPath, File::get(database_path(self::IMAGES_PATH."/{$sourceName}")));

        return $targetPath;
    }

    /**
     * Polish copy, then its English twin for /en (the `_en` columns).
     *
     * @return list<array{slug: string, sort_order: int, title: string, url: string, category: string, description: string, full_description: string, tech_stack: list<string>, metrics: list<array{value: string, label: string}>, challenges: list<string>, solutions: list<string>, category_en: string, description_en: string, full_description_en: string, metrics_en: list<array{value: string, label: string}>, challenges_en: list<string>, solutions_en: list<string>}>
     */
    private function projects(): array
    {
        return [
            [
                'slug' => 'zloty-klos',
                'sort_order' => 10,
                'title' => 'Piekarnia Złoty Kłos',
                'url' => 'zlotyklos-leszno.pl',
                'category' => 'Strona firmowa / Zamówienia online',
                'description' => 'Strona rzemieślniczej piekarni z Leszna z zamówieniami na następny dzień i odbiorem w jednym z trzech punktów.',
                'full_description' => 'Złoty Kłos przyjmował zamówienia telefonicznie i w wiadomościach na Facebooku, a listę na kolejny dzień ktoś składał ręcznie późnym wieczorem. Zaprojektowaliśmy stronę, która pokazuje ofertę jak witryna piekarni, i dodaliśmy prosty system zamówień z wyborem punktu odbioru. Piekarze dostają rano gotowe zestawienie wypieków, a klienci płacą online albo przy odbiorze.',
                'tech_stack' => ['Laravel', 'React', 'Inertia.js', 'Tailwind CSS', 'Przelewy24'],
                'metrics' => [
                    ['value' => '38%', 'label' => 'zamówień przez stronę'],
                    ['value' => '2 h', 'label' => 'mniej pracy dziennie'],
                    ['value' => '0,9 s', 'label' => 'LCP na telefonie'],
                ],
                'challenges' => [
                    'Zamówienia z telefonu, Messengera i kartek trzeba było co wieczór przepisywać do jednej listy.',
                    'Oferta zmienia się codziennie, a część wypieków jest dostępna tylko w weekendy.',
                    'Większość klientów wchodzi na stronę z telefonu, często w drodze do pracy.',
                ],
                'solutions' => [
                    'Zamówienia trafiają do panelu, który o 21:00 tworzy zestawienie dla piekarni z podziałem na punkty odbioru.',
                    'Kalendarz dostępności produktów, który obsługa ustawia w kilka sekund.',
                    'Lekki frontend z obrazami WebP i koszykiem, który działa płynnie nawet przy słabym zasięgu.',
                ],
                'category_en' => 'Company website / Online orders',
                'description_en' => 'Website of an artisan bakery in Leszno with next-day orders and pickup at one of three locations.',
                'full_description_en' => 'Złoty Kłos took orders by phone and in Facebook messages, and late every evening someone put together the list for the next day by hand. We designed a website that presents the range like a bakery shop window and added a simple ordering system with a choice of pickup point. The bakers get a ready summary of the bakes every morning, and customers pay online or on pickup.',
                'metrics_en' => [
                    ['value' => '38%', 'label' => 'of orders via the website'],
                    ['value' => '2 h', 'label' => 'less work every day'],
                    ['value' => '0.9 s', 'label' => 'LCP on mobile'],
                ],
                'challenges_en' => [
                    'Orders from the phone, Messenger and paper notes had to be copied into one list every evening.',
                    'The range changes every day, and some bakes are only available on weekends.',
                    'Most customers visit the website on their phones, often on the way to work.',
                ],
                'solutions_en' => [
                    'Orders go to a dashboard that builds the bakery’s summary at 9 p.m., split by pickup point.',
                    'A product availability calendar the staff can set in a few seconds.',
                    'A lightweight front end with WebP images and a cart that runs smoothly even on a weak signal.',
                ],
            ],
            [
                'slug' => 'mebloteka',
                'sort_order' => 20,
                'title' => 'Mebloteka',
                'url' => 'mebloteka-sklep.pl',
                'category' => 'E-commerce / Headless',
                'description' => 'Sklep z meblami w stylu skandynawskim: szybki frontend, warianty tkanin i drewna oraz synchronizacja stanów z hurtownią.',
                'full_description' => 'Mebloteka sprzedawała wyłącznie przez marketplace i potrzebowała własnego kanału sprzedaży, który nie będzie wolniejszy od konkurencji. Zbudowaliśmy sklep w architekturze headless: katalog i zamówienia obsługuje backend w Laravelu, a frontend w Next.js renderuje karty produktów z wariantami tkanin i drewna. Stany magazynowe synchronizują się z hurtownią co 15 minut.',
                'tech_stack' => ['Next.js', 'TypeScript', 'Laravel', 'PostgreSQL', 'Stripe'],
                'metrics' => [
                    ['value' => '+41%', 'label' => 'współczynnika konwersji'],
                    ['value' => '1,2 s', 'label' => 'średni czas ładowania'],
                    ['value' => '3,4 tys.', 'label' => 'produktów w katalogu'],
                ],
                'challenges' => [
                    'Ponad 3 tysiące produktów z wariantami koloru, tkaniny i wymiarów.',
                    'Stany magazynowe zmieniały się w hurtowni kilka razy dziennie.',
                    'Duże zdjęcia aranżacji spowalniały karty produktów.',
                ],
                'solutions' => [
                    'Model wariantów, w którym klient zmienia tkaninę i od razu widzi zdjęcie, cenę i czas dostawy.',
                    'Synchronizacja z API hurtowni co 15 minut przez kolejkę, z powiadomieniem przy błędach.',
                    'Responsywne obrazy AVIF i WebP oraz wyszukiwarka z podpowiedziami bez przeładowania strony.',
                ],
                'category_en' => 'E-commerce / Headless',
                'description_en' => 'An online store with Scandinavian-style furniture: a fast front end, fabric and wood variants, and stock synced with the wholesaler.',
                'full_description_en' => 'Mebloteka sold only through a marketplace and needed its own sales channel that would be no slower than the competition. We built a headless store: a Laravel back end handles the catalog and orders, and a Next.js front end renders product pages with fabric and wood variants. Stock levels sync with the wholesaler every 15 minutes.',
                'metrics_en' => [
                    ['value' => '+41%', 'label' => 'conversion rate'],
                    ['value' => '1.2 s', 'label' => 'average load time'],
                    ['value' => '3.4k', 'label' => 'products in the catalog'],
                ],
                'challenges_en' => [
                    'More than 3,000 products with color, fabric and size variants.',
                    'Stock levels at the wholesaler changed several times a day.',
                    'Large room-setting photos slowed down the product pages.',
                ],
                'solutions_en' => [
                    'A variant model where customers switch the fabric and instantly see the photo, price and delivery time.',
                    'Sync with the wholesaler’s API every 15 minutes through a queue, with an alert on errors.',
                    'Responsive AVIF and WebP images and a search with suggestions that never reloads the page.',
                ],
            ],
            [
                'slug' => 'flotapro',
                'sort_order' => 30,
                'title' => 'FlotaPro',
                'url' => 'flotapro.app',
                'category' => 'Aplikacja webowa / SaaS',
                'description' => 'Panel do zarządzania flotą firmową: pozycje pojazdów na żywo, koszty paliwa, przeglądy i raporty dla księgowości.',
                'full_description' => 'FlotaPro to produkt dla firm transportowych i serwisowych z flotą od 10 do 300 pojazdów. Zaprojektowaliśmy i zbudowaliśmy go od zera: od strony z cennikiem, przez onboarding, po panel z mapą, alertami i raportami. Dane z lokalizatorów GPS trafiają do systemu w czasie rzeczywistym, a kierownik floty widzi koszty każdego auta w jednym miejscu.',
                'tech_stack' => ['Laravel', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'WebSocket'],
                'metrics' => [
                    ['value' => '120+', 'label' => 'firm w abonamencie'],
                    ['value' => '< 5 s', 'label' => 'odświeżanie pozycji'],
                    ['value' => '−18%', 'label' => 'kosztów paliwa u klientów'],
                ],
                'challenges' => [
                    'Tysiące odczytów GPS na minutę z urządzeń różnych producentów.',
                    'Kierownicy flot pracowali w arkuszach i nie chcieli uczyć się skomplikowanego systemu.',
                    'Abonamenty, faktury i okresy próbne musiały działać bez ręcznej obsługi.',
                ],
                'solutions' => [
                    'Kolejka odczytów na Redisie i WebSockety, które odświeżają mapę bez przeładowania strony.',
                    'Onboarding z importem pojazdów z pliku CSV i pierwszym raportem gotowym w kilka minut.',
                    'Płatności cykliczne z automatycznymi fakturami i przypomnieniami o końcu okresu próbnego.',
                ],
                'category_en' => 'Web application / SaaS',
                'description_en' => 'A dashboard for managing company fleets: live vehicle positions, fuel costs, inspections and reports for accounting.',
                'full_description_en' => 'FlotaPro is a product for transport and service companies with fleets of 10 to 300 vehicles. We designed and built it from scratch: from the pricing page, through onboarding, to the dashboard with a map, alerts and reports. Data from GPS trackers reaches the system in real time, and the fleet manager sees the costs of every vehicle in one place.',
                'metrics_en' => [
                    ['value' => '120+', 'label' => 'companies subscribed'],
                    ['value' => '< 5 s', 'label' => 'position refresh'],
                    ['value' => '−18%', 'label' => 'fuel costs for clients'],
                ],
                'challenges_en' => [
                    'Thousands of GPS readings a minute from devices made by different manufacturers.',
                    'Fleet managers worked in spreadsheets and didn’t want to learn a complicated system.',
                    'Subscriptions, invoices and free trials had to run without manual work.',
                ],
                'solutions_en' => [
                    'A Redis queue for the readings and WebSockets that refresh the map without reloading the page.',
                    'Onboarding with vehicle import from a CSV file and the first report ready in a few minutes.',
                    'Recurring payments with automatic invoices and reminders before a trial ends.',
                ],
            ],
            [
                'slug' => 'fizjo-studio',
                'sort_order' => 40,
                'title' => 'Fizjo Studio',
                'url' => 'fizjostudio-poznan.pl',
                'category' => 'Strona usługowa / Rezerwacje online',
                'description' => 'Strona gabinetu fizjoterapii z Poznania z rezerwacją wizyt online, przypomnieniami SMS i profilami specjalistów.',
                'full_description' => 'Fizjo Studio traciło pacjentów, bo do recepcji trudno było się dodzwonić, a wolne terminy znała tylko jedna osoba. Przygotowaliśmy nową stronę z opisami zabiegów i cennikiem oraz system rezerwacji połączony z grafikami fizjoterapeutów. Pacjent wybiera zabieg, specjalistę i godzinę, a dzień przed wizytą dostaje SMS z przypomnieniem.',
                'tech_stack' => ['Laravel', 'React', 'Tailwind CSS', 'Google Calendar API', 'SMSAPI'],
                'metrics' => [
                    ['value' => '70%', 'label' => 'wizyt umawianych online'],
                    ['value' => '−45%', 'label' => 'nieodwołanych wizyt'],
                    ['value' => '4,9/5', 'label' => 'ocena w Google'],
                ],
                'challenges' => [
                    'Recepcja odbierała kilkadziesiąt telefonów dziennie, głównie w sprawie wolnych terminów.',
                    'Każdy fizjoterapeuta prowadził grafik w innym kalendarzu.',
                    'Pacjenci zapominali o wizytach, a puste okienka trudno było zapełnić.',
                ],
                'solutions' => [
                    'Rezerwacja online w trzech krokach, z wolnymi terminami liczonymi według długości zabiegu.',
                    'Dwukierunkowa synchronizacja z kalendarzami Google wszystkich specjalistów.',
                    'Przypomnienia SMS z linkiem do odwołania wizyty, który od razu zwalnia termin dla innych.',
                ],
                'category_en' => 'Service website / Online booking',
                'description_en' => 'Website of a physiotherapy clinic in Poznań with online booking, SMS reminders and specialist profiles.',
                'full_description_en' => 'Fizjo Studio was losing patients because the front desk was hard to reach by phone and only one person knew the free slots. We built a new website with treatment descriptions and a price list, plus a booking system connected to the physiotherapists’ schedules. Patients choose the treatment, the specialist and the time, and get an SMS reminder the day before the visit.',
                'metrics_en' => [
                    ['value' => '70%', 'label' => 'of visits booked online'],
                    ['value' => '−45%', 'label' => 'no-shows'],
                    ['value' => '4.9/5', 'label' => 'Google rating'],
                ],
                'challenges_en' => [
                    'The front desk took dozens of calls a day, mostly about free slots.',
                    'Each physiotherapist kept their schedule in a different calendar.',
                    'Patients forgot about their visits, and empty slots were hard to fill.',
                ],
                'solutions_en' => [
                    'Online booking in three steps, with free slots calculated from the length of the treatment.',
                    'Two-way sync with the Google Calendars of all the specialists.',
                    'SMS reminders with a link to cancel the visit, which frees the slot for others right away.',
                ],
            ],
            [
                'slug' => 'zielone-tarasy',
                'sort_order' => 50,
                'title' => 'Osiedle Zielone Tarasy',
                'url' => 'zielonetarasy-leszno.pl',
                'category' => 'Strona inwestycji / Wyszukiwarka mieszkań',
                'description' => 'Strona osiedla w Lesznie z wyszukiwarką mieszkań na rzucie budynku i cenami aktualnymi po każdej rezerwacji.',
                'full_description' => 'Deweloper sprzedawał mieszkania z cennika w PDF-ie, który po każdej rezerwacji trzeba było poprawiać i rozsyłać od nowa. Zaprojektowaliśmy stronę inwestycji z wyszukiwarką: klient wybiera budynek i piętro na rzucie, filtruje lokale po metrażu, liczbie pokoi i ekspozycji, a karta mieszkania pokazuje plan, cenę i historię jej zmian. Biuro sprzedaży zmienia status i cenę lokalu w panelu jednym kliknięciem.',
                'tech_stack' => ['Laravel', 'React', 'Inertia.js', 'TypeScript', 'Tailwind CSS'],
                'metrics' => [
                    ['value' => '+63%', 'label' => 'zapytań o mieszkania'],
                    ['value' => '48', 'label' => 'lokali z kartą online'],
                    ['value' => '1 klik', 'label' => 'zmiana statusu lokalu'],
                ],
                'challenges' => [
                    'Cennik w PDF-ie trzeba było poprawiać i rozsyłać po każdej rezerwacji.',
                    'Klienci nie wiedzieli, które mieszkania są jeszcze wolne, i dzwonili z pytaniem o każdy lokal.',
                    'Z wiadomości wysłanych formularzem nie wynikało, o które mieszkanie chodzi.',
                ],
                'solutions' => [
                    'Panel sprzedaży, w którym status i cena lokalu zmieniają się jednym kliknięciem, a strona aktualizuje się od razu.',
                    'Interaktywny rzut budynku z podświetlonymi wolnymi lokalami i filtrami, które zostawiają tylko pasujące mieszkania.',
                    'Karta każdego mieszkania z planem do pobrania, historią ceny i formularzem, który przekazuje numer lokalu do biura sprzedaży.',
                ],
                'category_en' => 'Development website / Apartment finder',
                'description_en' => 'Website of a housing development in Leszno with an apartment finder on the building plan and prices updated after every reservation.',
                'full_description_en' => 'The developer sold apartments from a PDF price list that had to be corrected and sent out again after every reservation. We designed a development website with an apartment finder: buyers pick the building and floor on the plan, filter apartments by size, number of rooms and orientation, and each apartment page shows the floor plan, the price and its history. The sales office changes an apartment’s status and price in the dashboard with one click.',
                'metrics_en' => [
                    ['value' => '+63%', 'label' => 'apartment inquiries'],
                    ['value' => '48', 'label' => 'apartments with their own page'],
                    ['value' => '1 click', 'label' => 'to change an apartment’s status'],
                ],
                'challenges_en' => [
                    'The PDF price list had to be corrected and sent out after every reservation.',
                    'Buyers didn’t know which apartments were still available and called to ask about each one.',
                    'Messages sent through the form didn’t say which apartment they were about.',
                ],
                'solutions_en' => [
                    'A sales dashboard where an apartment’s status and price change with one click and the website updates right away.',
                    'An interactive building plan with available apartments highlighted and filters that leave only the matching ones.',
                    'A page for every apartment with a downloadable floor plan, its price history and a form that passes the apartment number to the sales office.',
                ],
            ],
            [
                'slug' => 'promien-fotowoltaika',
                'sort_order' => 60,
                'title' => 'Promień Fotowoltaika',
                'url' => 'promien-fotowoltaika.pl',
                'category' => 'Landing page / Kalkulator oszczędności',
                'description' => 'Landing page instalatora fotowoltaiki i pomp ciepła z Wielkopolski z kalkulatorem oszczędności, który kwalifikuje zapytania.',
                'full_description' => 'Promień płacił za kampanie, które kierowały na ogólną stronę firmy, a handlowcy oddzwaniali do osób, którym instalacja się nie opłacała. Przygotowaliśmy landing page z kalkulatorem na pierwszym ekranie: klient podaje rachunek za prąd, rodzaj i kierunek dachu, a strona szacuje moc instalacji, koszt i okres zwrotu. Zapytanie trafia do CRM-u razem z wynikiem kalkulacji, więc handlowiec wie, z kim rozmawia, zanim zadzwoni.',
                'tech_stack' => ['Astro', 'React', 'TypeScript', 'Tailwind CSS', 'HubSpot'],
                'metrics' => [
                    ['value' => '3,2×', 'label' => 'więcej zapytań z kampanii'],
                    ['value' => '−52%', 'label' => 'kosztu pozyskania zapytania'],
                    ['value' => '98/100', 'label' => 'Lighthouse na telefonie'],
                ],
                'challenges' => [
                    'Kampanie kierowały na ogólną stronę firmy, z której mało kto wysyłał zapytanie.',
                    'Handlowcy tracili czas na rozmowy z osobami, którym instalacja się nie opłacała.',
                    'Większość ruchu z reklam trafia na stronę z telefonu, więc każda sekunda ładowania kosztowała zapytania.',
                ],
                'solutions' => [
                    'Landing page z jednym celem: kalkulator na pierwszym ekranie, realizacje z regionu i opinie klientów.',
                    'Kalkulator, który z rachunku za prąd i parametrów dachu wylicza moc, koszt i okres zwrotu, a wynik wysyła do HubSpota razem z zapytaniem.',
                    'Statyczna strona w Astro, w której kalkulator ładuje się dopiero przy pierwszym ekranie, a zdjęcia mają format AVIF.',
                ],
                'category_en' => 'Landing page / Savings calculator',
                'description_en' => 'Landing page of a solar panel and heat pump installer from Wielkopolska with a savings calculator that qualifies inquiries.',
                'full_description_en' => 'Promień paid for campaigns that sent people to the general company website, and sales reps called back people for whom an installation didn’t pay off. We built a landing page with a calculator on the first screen: customers enter their electricity bill and the type and direction of their roof, and the page estimates the system size, the cost and the payback period. The inquiry reaches the CRM together with the calculation, so the sales rep knows who they are talking to before they call.',
                'metrics_en' => [
                    ['value' => '3.2×', 'label' => 'more inquiries from campaigns'],
                    ['value' => '−52%', 'label' => 'cost per inquiry'],
                    ['value' => '98/100', 'label' => 'Lighthouse on mobile'],
                ],
                'challenges_en' => [
                    'Campaigns sent people to the general company website, where few of them sent an inquiry.',
                    'Sales reps lost time talking to people for whom an installation didn’t pay off.',
                    'Most ad traffic arrives on phones, so every second of loading cost inquiries.',
                ],
                'solutions_en' => [
                    'A landing page with one goal: the calculator on the first screen, local projects and customer reviews.',
                    'A calculator that works out the system size, cost and payback period from the electricity bill and the roof, and sends the result to HubSpot with the inquiry.',
                    'A static Astro site where the calculator loads with the first screen only and the photos are AVIF.',
                ],
            ],
            [
                'slug' => 'lingwista',
                'sort_order' => 70,
                'title' => 'Lingwista',
                'url' => 'lingwista-kursy.pl',
                'category' => 'Platforma e-learningowa / Subskrypcje',
                'description' => 'Platforma kursów językowych online z lekcjami wideo, ćwiczeniami sprawdzanymi automatycznie i abonamentem z okresem próbnym.',
                'full_description' => 'Lingwista prowadził zajęcia w Lesznie i Kościanie, a kursy online sprzedawał jako paczki nagrań wysyłanych mailem. Zbudowaliśmy platformę, na której kursant ogląda lekcje, rozwiązuje ćwiczenia sprawdzane automatycznie i widzi swoje postępy, a lektor w jednym miejscu dodaje materiały i odpowiada na pytania. Dostęp działa w abonamencie miesięcznym albo rocznym, z siedmiodniowym okresem próbnym.',
                'tech_stack' => ['Laravel', 'Vue.js', 'Inertia.js', 'Mux', 'Stripe'],
                'metrics' => [
                    ['value' => '1,8 tys.', 'label' => 'aktywnych kursantów'],
                    ['value' => '74%', 'label' => 'kursantów kończy moduł'],
                    ['value' => '−27%', 'label' => 'rezygnacji z abonamentu'],
                ],
                'challenges' => [
                    'Nagrania wysyłane mailem łatwo było przekazać dalej, a kursanci gubili linki.',
                    'Lektorzy co tydzień ręcznie sprawdzali setki ćwiczeń.',
                    'Kursanci rezygnowali po kilku tygodniach, bo nie widzieli swoich postępów.',
                ],
                'solutions' => [
                    'Wideo odtwarzane przez Mux z podpisanymi linkami, dostępne tylko z konta kursanta.',
                    'Ćwiczenia z automatycznym sprawdzaniem (luki, wybór, dopasowanie), a lektor ocenia tylko wypowiedzi pisemne.',
                    'Panel postępów z serią dni nauki i przypomnieniem, gdy kursant zrobi kilka dni przerwy.',
                ],
                'category_en' => 'E-learning platform / Subscriptions',
                'description_en' => 'An online language course platform with video lessons, automatically checked exercises and a subscription with a free trial.',
                'full_description_en' => 'Lingwista taught classes in Leszno and Kościan and sold its online courses as bundles of recordings sent by email. We built a platform where students watch lessons, do exercises that are checked automatically and see their progress, while teachers add materials and answer questions in one place. Access runs on a monthly or yearly subscription with a seven-day free trial.',
                'metrics_en' => [
                    ['value' => '1.8k', 'label' => 'active students'],
                    ['value' => '74%', 'label' => 'of students finish a module'],
                    ['value' => '−27%', 'label' => 'subscription cancellations'],
                ],
                'challenges_en' => [
                    'Recordings sent by email were easy to pass on, and students lost the links.',
                    'Teachers checked hundreds of exercises by hand every week.',
                    'Students canceled after a few weeks because they couldn’t see their progress.',
                ],
                'solutions_en' => [
                    'Video played through Mux with signed links, available only from the student’s account.',
                    'Exercises checked automatically (gap fills, multiple choice, matching), so teachers grade only written answers.',
                    'A progress dashboard with a study streak and a reminder when a student takes a few days off.',
                ],
            ],
            [
                'slug' => 'agrosklad',
                'sort_order' => 80,
                'title' => 'AgroSkład',
                'url' => 'agrosklad-b2b.pl',
                'category' => 'Platforma B2B / Integracja z ERP',
                'description' => 'Platforma zamówień B2B hurtowni rolniczej z indywidualnymi cennikami, limitami kupieckimi i synchronizacją z Comarch ERP Optima.',
                'full_description' => 'AgroSkład zaopatruje sklepy rolnicze i gospodarstwa w nasiona, nawozy i części do maszyn, a zamówienia przyjmowali handlowcy przez telefon i e-mail. Zbudowaliśmy platformę B2B, w której każdy klient widzi swój cennik i limit kupiecki, zamawia z historii albo z pliku i sprawdza status dostawy. Produkty, ceny, stany i faktury synchronizują się z Comarch ERP Optima, więc nikt nie przepisuje zamówień ręcznie.',
                'tech_stack' => ['Laravel', 'React', 'MySQL', 'Meilisearch', 'Comarch ERP Optima'],
                'metrics' => [
                    ['value' => '62%', 'label' => 'zamówień przez platformę'],
                    ['value' => '12 tys.', 'label' => 'indeksów w katalogu'],
                    ['value' => '15 min', 'label' => 'synchronizacja z ERP'],
                ],
                'challenges' => [
                    'Każdy klient ma inne rabaty i terminy płatności, ustalane indywidualnie przez handlowca.',
                    'Zamówienia z telefonu i maili handlowcy przepisywali ręcznie do systemu ERP.',
                    'W katalogu jest kilkanaście tysięcy indeksów, a klienci szukają po numerach katalogowych i nazwach zwyczajowych.',
                ],
                'solutions' => [
                    'Indywidualne cenniki, terminy płatności i limity kupieckie pobierane z ERP i widoczne po zalogowaniu.',
                    'Zamówienia trafiają do Comarch ERP Optima automatycznie, a statusy i faktury wracają na platformę co 15 minut.',
                    'Wyszukiwarka na Meilisearch z synonimami i numerami katalogowymi oraz szybkie zamówienie z pliku CSV.',
                ],
                'category_en' => 'B2B platform / ERP integration',
                'description_en' => 'A B2B ordering platform for an agricultural wholesaler with individual price lists, credit limits and sync with Comarch ERP Optima.',
                'full_description_en' => 'AgroSkład supplies farm shops and farms with seeds, fertilizers and machine parts, and its sales reps took orders by phone and email. We built a B2B platform where every customer sees their own price list and credit limit, orders from their history or from a file and tracks the delivery. Products, prices, stock and invoices sync with Comarch ERP Optima, so nobody copies orders by hand.',
                'metrics_en' => [
                    ['value' => '62%', 'label' => 'of orders via the platform'],
                    ['value' => '12k', 'label' => 'items in the catalog'],
                    ['value' => '15 min', 'label' => 'ERP sync'],
                ],
                'challenges_en' => [
                    'Every customer has different discounts and payment terms, set individually by a sales rep.',
                    'Sales reps copied orders from phone calls and emails into the ERP by hand.',
                    'The catalog has more than ten thousand items, and customers search by catalog numbers and common names.',
                ],
                'solutions_en' => [
                    'Individual price lists, payment terms and credit limits taken from the ERP and shown after logging in.',
                    'Orders reach Comarch ERP Optima automatically, and statuses and invoices come back to the platform every 15 minutes.',
                    'A Meilisearch search with synonyms and catalog numbers, plus quick ordering from a CSV file.',
                ],
            ],
            [
                'slug' => 'autopunkt',
                'sort_order' => 90,
                'title' => 'AutoPunkt',
                'url' => 'autopunkt-leszno.pl',
                'category' => 'Strona salonu / Katalog samochodów',
                'description' => 'Strona salonu samochodów używanych z Leszna z katalogiem aut synchronizowanym z Otomoto, kalkulatorem raty i rezerwacją jazdy próbnej.',
                'full_description' => 'AutoPunkt publikował ogłoszenia na Otomoto, a własna strona pokazywała listę aut aktualizowaną ręcznie, na której wisiały samochody dawno sprzedane. Zbudowaliśmy katalog, który co godzinę pobiera ofertę z Otomoto, z filtrami marki, rocznika, przebiegu i ceny, galerią zdjęć i kalkulatorem raty. Klient umawia jazdę próbną z karty auta, a zapytanie trafia do handlowca razem z numerem ogłoszenia.',
                'tech_stack' => ['Next.js', 'TypeScript', 'Laravel', 'PostgreSQL', 'Otomoto API'],
                'metrics' => [
                    ['value' => '+85%', 'label' => 'ruchu z Google'],
                    ['value' => '4×', 'label' => 'więcej jazd próbnych'],
                    ['value' => '1 h', 'label' => 'aktualizacja oferty'],
                ],
                'challenges' => [
                    'Listę aut na stronie aktualizowano ręcznie, więc pokazywała samochody już sprzedane.',
                    'Klienci porównywali auta na portalach i rzadko trafiali na stronę salonu.',
                    'Jazdę próbną dało się umówić tylko telefonicznie, w godzinach pracy salonu.',
                ],
                'solutions' => [
                    'Synchronizacja z Otomoto co godzinę: nowe ogłoszenia pojawiają się same, a sprzedane auta znikają.',
                    'Karta każdego auta z historią serwisową, raportem VIN i kalkulatorem raty, jako osobna strona w Google.',
                    'Rezerwacja jazdy próbnej z karty auta, z wolnymi terminami handlowców i potwierdzeniem SMS.',
                ],
                'category_en' => 'Dealership website / Car catalog',
                'description_en' => 'Website of a used car dealership in Leszno with a car catalog synced with Otomoto, an installment calculator and test drive booking.',
                'full_description_en' => 'AutoPunkt published its listings on Otomoto, while its own website showed a hand-updated list that still included cars sold long ago. We built a catalog that pulls the listings from Otomoto every hour, with filters for make, year, mileage and price, a photo gallery and an installment calculator. Customers book a test drive from the car’s page, and the request reaches a salesperson with the listing number.',
                'metrics_en' => [
                    ['value' => '+85%', 'label' => 'traffic from Google'],
                    ['value' => '4×', 'label' => 'more test drives'],
                    ['value' => '1 h', 'label' => 'listing refresh'],
                ],
                'challenges_en' => [
                    'The list of cars on the website was updated by hand, so it showed cars that were already sold.',
                    'Customers compared cars on listing portals and rarely reached the dealership’s website.',
                    'Test drives could only be booked by phone during opening hours.',
                ],
                'solutions_en' => [
                    'Hourly sync with Otomoto: new listings appear on their own and sold cars disappear.',
                    'A page for every car with its service history, a VIN report and an installment calculator, indexed in Google on its own.',
                    'Test drive booking from the car’s page, with the salespeople’s free slots and an SMS confirmation.',
                ],
            ],
        ];
    }
}
