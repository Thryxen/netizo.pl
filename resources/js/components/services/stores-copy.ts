import { localized } from '@/lib/i18n';
import type { ServiceCopy } from './service-copy';

/** Sklepy internetowe (/sklepy-internetowe, /en/online-stores). No timelines: the site states none for stores. */
export const STORES_COPY = localized<ServiceCopy>({
    pl: {
        name: 'Sklepy internetowe',
        hero: {
            headingLines: ['Tworzenie', 'sklepów', 'internetowych'],
            wideLines: [[0, 1], [2]],
            lead: 'Budujemy sklepy, w których klient szybko znajduje produkt i płaci w kilka kliknięć, a Ty obsługujesz zamówienia z jednego panelu. Mały sklep kosztuje od 1\u00A0299\u00A0zł, a sklep z integracjami z magazynem lub ERP od 5\u00A0499\u00A0zł.',
            quote: 'Wyceń sklep',
            quoteShort: 'Wycena',
            facts: [
                { prefix: 'od', value: '1\u00A0299\u00A0zł', label: 'mały sklep z płatnościami i wysyłką' },
                { prefix: 'od', value: '5\u00A0499\u00A0zł', label: 'duży e-commerce z integracjami' },
                { value: '24\u00A0h', label: 'na odpowiedź po briefie' },
                { value: '0\u00A0zł', label: 'za wycenę i konsultację' },
            ],
        },
        scope: {
            title: 'Co dostajesz w standardzie',
            lead: 'Każdy sklep, który budujemy, ma te elementy. Różnią się katalog, integracje i to, czy sprzedajesz też firmom.',
            items: [
                {
                    title: 'Płatności online',
                    description: 'BLIK, karty i szybkie przelewy przez bramkę płatności, np. Przelewy24 albo Stripe. Status płatności widzisz przy każdym zamówieniu.',
                },
                {
                    title: 'Wysyłka bez przepisywania',
                    description: 'Kurier i paczkomaty z kosztem liczonym w koszyku. Etykietę nadania drukujesz z panelu, a klient dostaje numer przesyłki.',
                },
                {
                    title: 'Produkty i warianty',
                    description: 'Rozmiary, kolory i pojemności z osobnymi cenami i stanami. Zdjęcia zapisujemy w lekkich formatach, żeby karta produktu ładowała się szybko.',
                },
                {
                    title: 'Stany i integracje',
                    description: 'Stany magazynowe aktualizują się po każdym zamówieniu. W większych sklepach synchronizujemy je z hurtownią albo systemem ERP.',
                },
                {
                    title: 'Produkty widoczne w Google',
                    description: 'Szybkie karty produktów z danymi strukturalnymi, dzięki którym cena i dostępność mogą pojawić się w wynikach wyszukiwania.',
                },
                {
                    title: 'Panel sprzedaży',
                    description: 'Zamówienia, klienci, kody rabatowe i raport sprzedaży w jednym miejscu. Na start pokazujemy, jak z niego korzystać.',
                },
            ],
        },
        pricing: {
            title: 'Ile kosztuje sklep internetowy',
            lead: 'Cena zależy od liczby produktów i wariantów, integracji i tego, czy sprzedajesz też firmom. Poniżej dwa progi, od których zaczynamy.',
        },
        process: {
            title: 'Jak powstaje sklep',
            lead: 'Cztery etapy, te same co przy każdym naszym projekcie. Termin podajemy po briefie, bo zależy głównie od katalogu i integracji.',
            steps: [
                {
                    title: 'Brief i katalog',
                    description: 'Poznajemy Twoje produkty, klientów i sposób wysyłki, a potem spisujemy zakres: kategorie, warianty, płatności, wysyłkę i integracje.',
                },
                {
                    title: 'Projekt sklepu',
                    description: 'W Figmie projektujemy stronę główną, listę i kartę produktu, koszyk i zamówienie. Najwięcej uwagi poświęcamy drodze od produktu do płatności.',
                },
                {
                    title: 'Budowa i integracje',
                    description: 'Budujemy sklep na wersji testowej, podłączamy płatności, wysyłkę i magazyn, a co dwa tygodnie pokazujemy postępy. Produkty przenosimy albo importujemy z pliku.',
                },
                {
                    title: 'Start sprzedaży',
                    description: 'Składamy zamówienia testowe od koszyka po etykietę, przekierowujemy stare adresy i publikujemy sklep. Potem rozwijamy go razem z Tobą.',
                },
            ],
        },
        projects: { title: 'Sklepy, które zbudowaliśmy' },
        guide: {
            title: 'Sklep, który sprzedaje',
            intro: 'Na co zwrócić uwagę, zanim zaczniesz sprzedawać online albo przeniesiesz sklep na nową platformę.',
            sections: [
                {
                    heading: 'Gotowa platforma czy własny sklep?',
                    paragraphs: [
                        'Przy małym katalogu i prostej wysyłce gotowa platforma, np. Shopify albo WooCommerce, bywa najszybszym startem. **Własny sklep** opłaca się, gdy potrzebujesz indywidualnych cen dla firm, nietypowej logiki zamówień, integracji z ERP albo bardzo szybkiego frontendu. Wtedy to sklep dopasowuje się do firmy, a nie firma do sklepu.',
                    ],
                },
                {
                    heading: 'Droga od produktu do płatności',
                    paragraphs: [
                        'Najwięcej klientów sklep traci między koszykiem a płatnością. Dlatego projektujemy **krótką ścieżkę zamówienia**: zakup bez zakładania konta, BLIK i szybkie przelewy, koszt dostawy znany przed płatnością i formularz, który nie każe wpisywać tego samego dwa razy. Każdy krok sprawdzamy na telefonie, bo na nim robi zakupy coraz więcej osób.',
                    ],
                },
                {
                    heading: 'Magazyn, który się nie myli',
                    paragraphs: [
                        'Jeśli sprzedajesz też stacjonarnie albo w innych kanałach, stany muszą się zgadzać wszędzie. **Synchronizujemy stany i ceny** z hurtownią, magazynem albo systemem ERP, np. Comarch ERP Optima, a zamówienia trafiają tam bez przepisywania. Klient widzi prawdziwą dostępność, a Ty nie sprzedajesz towaru, którego nie masz.',
                    ],
                },
                {
                    heading: 'Przeprowadzka bez utraty ruchu',
                    paragraphs: [
                        'Przy zmianie platformy przenosimy produkty, zdjęcia, kategorie i konta klientów, a **stare adresy produktów przekierowujemy** na nowe. Dzięki temu nie tracisz pozycji w Google ani linków z porównywarek i blogów. Nowy sklep sprawdzamy na zamówieniach testowych, zanim przełączymy domenę.',
                    ],
                },
            ],
        },
        faq: { title: 'Częste pytania o sklepy internetowe' },
    },
    en: {
        name: 'Online stores',
        hero: {
            headingLines: ['Online store', 'development'],
            lead: 'We build stores where customers find products fast and pay in a few clicks, while you handle orders from one panel. A small store starts at PLN\u00A01,299, and a store with warehouse or ERP integrations at PLN\u00A05,499.',
            quote: 'Get a quote',
            quoteShort: 'Quote',
            facts: [
                { prefix: 'from', value: 'PLN\u00A01,299', label: 'a small store with payments and shipping' },
                { prefix: 'from', value: 'PLN\u00A05,499', label: 'large e-commerce with integrations' },
                { value: '24\u00A0h', label: 'to reply to your brief' },
                { value: 'Free', label: 'quote and consultation' },
            ],
        },
        scope: {
            title: 'What you get as standard',
            lead: 'Every store we build has these. What varies is the catalog, the integrations and whether you also sell to businesses.',
            items: [
                {
                    title: 'Online payments',
                    description: 'BLIK, cards and instant bank transfers through a payment gateway such as Przelewy24 or Stripe. You see the payment status next to every order.',
                },
                {
                    title: 'Shipping without retyping',
                    description: 'Couriers and parcel lockers, with the cost calculated in the cart. You print the shipping label from the panel, and the customer gets a tracking number.',
                },
                {
                    title: 'Products and variants',
                    description: 'Sizes, colors and capacities with their own prices and stock. We save photos in lightweight formats, so product pages load fast.',
                },
                {
                    title: 'Stock and integrations',
                    description: 'Stock levels update after every order. In larger stores, we sync them with your wholesaler or ERP system.',
                },
                {
                    title: 'Products visible in Google',
                    description: 'Fast product pages with structured data, which can bring the price and availability into search results.',
                },
                {
                    title: 'A sales panel',
                    description: 'Orders, customers, discount codes and a sales report in one place. We show you how to use it at the start.',
                },
            ],
        },
        pricing: {
            title: 'How much does an online store cost',
            lead: 'The price depends on the number of products and variants, the integrations and whether you also sell to businesses. Below are the two tiers we start from.',
        },
        process: {
            title: 'How a store comes together',
            lead: 'Four stages, the same as in every project of ours. We give you the timeline after the brief, because it depends mainly on the catalog and the integrations.',
            steps: [
                {
                    title: 'Brief and catalog',
                    description: 'We get to know your products, customers and shipping, then write down the scope: categories, variants, payments, shipping and integrations.',
                },
                {
                    title: 'Store design',
                    description: 'In Figma, we design the home page, the product list and page, the cart and the checkout. We pay the most attention to the path from product to payment.',
                },
                {
                    title: 'Build and integrations',
                    description: 'We build the store on a staging version, connect payments, shipping and the warehouse, and show you the progress every two weeks. We move your products over or import them from a file.',
                },
                {
                    title: 'Go live',
                    description: 'We place test orders from cart to label, redirect old addresses and launch the store. After that, we grow it together with you.',
                },
            ],
        },
        projects: { title: 'Stores we’ve built' },
        guide: {
            title: 'A store that sells',
            intro: 'What to look at before you start selling online or move your store to a new platform.',
            sections: [
                {
                    heading: 'A ready-made platform or a custom store?',
                    paragraphs: [
                        'With a small catalog and simple shipping, a ready-made platform such as Shopify or WooCommerce is often the fastest start. **A custom store** pays off when you need individual prices for businesses, unusual order logic, an ERP integration or a very fast frontend. Then the store adapts to your company, not the other way round.',
                    ],
                },
                {
                    heading: 'The path from product to payment',
                    paragraphs: [
                        'Stores lose the most customers between the cart and the payment. That’s why we design **a short checkout**: buying without creating an account, BLIK and instant transfers, delivery costs known before payment and a form that never asks for the same thing twice. We test every step on a phone, because more and more people shop on one.',
                    ],
                },
                {
                    heading: 'Stock you can trust',
                    paragraphs: [
                        'If you also sell in a shop or other channels, your stock has to match everywhere. **We sync stock levels and prices** with your wholesaler, warehouse or ERP system, such as Comarch ERP Optima, and orders go there without retyping. Customers see real availability, and you don’t sell goods you don’t have.',
                    ],
                },
                {
                    heading: 'Moving without losing traffic',
                    paragraphs: [
                        'When you change platforms, we move products, photos, categories and customer accounts, and **redirect old product addresses** to the new ones. That way you don’t lose rankings in Google or links from comparison sites and blogs. We check the new store with test orders before we switch the domain.',
                    ],
                },
            ],
        },
        faq: { title: 'Common questions about online stores' },
    },
});
