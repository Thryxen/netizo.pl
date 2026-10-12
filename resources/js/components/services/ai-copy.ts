import { localized } from '@/lib/i18n';
import type { ServiceCopy } from './service-copy';

/**
 * AI & Automatyzacja (/automatyzacja-ai, /en/ai-automation). No timelines: the site states none for automations (the
 * process analysis sets them).
 */
export const AI_COPY = localized<ServiceCopy>({
    pl: {
        name: 'AI & Automatyzacja',
        hero: {
            headingLines: ['Automatyzacja', 'i wdrożenia AI', 'w firmie'],
            wideLines: [[0, 1], [2]],
            lead: 'Automatyzujemy powtarzalną pracę: chatboty, które odpowiadają klientom na podstawie Twoich dokumentów, odczytywanie faktur i zamówień, integracje z CRM i ERP. Pojedyncza automatyzacja kosztuje od 299\u00A0zł, a koszt korzystania z modeli AI szacujemy przed wdrożeniem.',
            quote: 'Wyceń automatyzację',
            quoteShort: 'Wycena',
            facts: [
                { prefix: 'od', value: '299\u00A0zł', label: 'chatbot albo pojedyncza automatyzacja' },
                { prefix: 'od', value: '1\u00A0999\u00A0zł', label: 'agent AI z integracjami' },
                { value: '24\u00A0h', label: 'na odpowiedź po briefie' },
                { value: '0\u00A0zł', label: 'za wycenę i konsultację' },
            ],
        },
        scope: {
            title: 'Co dostajesz w standardzie',
            lead: 'Każda automatyzacja, którą budujemy, ma te zabezpieczenia. Różnią się procesy, które obsługuje, i systemy, z którymi się łączy.',
            items: [
                {
                    title: 'Chatbot na Twoich danych',
                    description: 'Odpowiada na pytania klientów na podstawie Twojej oferty, cenników i regulaminów, a nie z pamięci modelu. Gdy nie zna odpowiedzi, mówi to wprost.',
                },
                {
                    title: 'Odczytywanie dokumentów',
                    description: 'Faktury, zamówienia i formularze zamieniamy w dane: AI odczytuje kwoty, daty i pozycje, a system przekazuje je dalej, np. do księgowości.',
                },
                {
                    title: 'Integracje z systemami',
                    description: 'Łączymy automatyzacje z CRM, ERP, pocztą i kalendarzami, żeby wyniki trafiały tam, gdzie zespół już pracuje.',
                },
                {
                    title: 'Człowiek w pętli',
                    description: 'Przy niepewności i ważnych decyzjach AI przekazuje sprawę człowiekowi albo czeka na akceptację. Ty decydujesz, co może zrobić samo.',
                },
                {
                    title: 'Log każdej akcji',
                    description: 'Każda odpowiedź i każde działanie jest zapisane: widzisz, co AI zrobiło, na jakiej podstawie i ile to kosztowało.',
                },
                {
                    title: 'Kontrola kosztów',
                    description: 'Dobieramy model do zadania i szacujemy koszt użycia przed wdrożeniem, a bieżące zużycie i limit widzisz w panelu.',
                },
            ],
        },
        pricing: {
            title: 'Ile kosztuje automatyzacja z AI',
            lead: 'Cena zależy od liczby kroków procesu i systemów, z którymi łączy się automatyzacja. Do tego dochodzi koszt korzystania z modeli AI, który szacujemy przed wdrożeniem.',
        },
        process: {
            title: 'Jak wdrażamy AI',
            lead: 'Cztery etapy, a zaczynamy od jednego procesu, który dziś zabiera najwięcej czasu. Termin podajemy po analizie.',
            steps: [
                {
                    title: 'Analiza procesu',
                    description: 'Rozpisujemy proces krok po kroku z osobami, które go dziś wykonują, i wskazujemy, które kroki AI zrobi dobrze, a które powinny zostać przy człowieku.',
                },
                {
                    title: 'Prototyp na Twoich danych',
                    description: 'Budujemy pierwszą wersję na prawdziwych przykładach: pytaniach klientów, fakturach albo zgłoszeniach. Sprawdzasz, jak działa, zanim podłączymy ją do systemów.',
                },
                {
                    title: 'Integracje i testy',
                    description: 'Łączymy automatyzację z CRM, pocztą albo ERP, dodajemy reguły i akceptacje, a co dwa tygodnie pokazujemy postępy na wersji testowej.',
                },
                {
                    title: 'Wdrożenie i pomiar',
                    description: 'Uruchamiamy automatyzację dla części spraw, mierzymy jakość i oszczędzony czas, a potem obejmujemy nią kolejne.',
                },
            ],
        },
        projects: { title: 'Automatyzacje, które zbudowaliśmy' },
        guide: {
            title: 'AI, które pracuje, a nie tylko rozmawia',
            intro: 'Na co zwrócić uwagę, zanim wdrożysz AI w firmie, żeby skończyło się oszczędnością czasu, a nie kolejnym eksperymentem.',
            sections: [
                {
                    heading: 'Zacznij od procesu, nie od modelu',
                    paragraphs: [
                        'AI daje najlepsze efekty w powtarzalnych zadaniach z jasnymi zasadami: odpowiadaniu na te same pytania, odczytywaniu dokumentów, przepisywaniu danych między systemami. Dlatego zaczynamy od **jednego procesu, który dziś zabiera najwięcej czasu**, i mierzymy, ile go oszczędza, zanim przejdziemy do kolejnych.',
                    ],
                },
                {
                    heading: 'Odpowiedzi z Twoich dokumentów',
                    paragraphs: [
                        'Model językowy sam z siebie potrafi zmyślać. Chatbot firmy powinien odpowiadać **na podstawie Twojej oferty, cenników i regulaminów** (to tzw. RAG) i wskazywać, skąd wziął odpowiedź. Gdy w dokumentach jej nie ma, mówi to wprost i przekazuje sprawę człowiekowi.',
                    ],
                },
                {
                    heading: 'Kontrola nad tym, co robi AI',
                    paragraphs: [
                        'Automatyzacja nie powinna działać w ciemno. Ustalamy, **co AI może zrobić samo, a co wymaga akceptacji**, i zapisujemy każdą akcję w logu. Dzięki temu wiesz, dlaczego klient dostał taką odpowiedź, a gdy trzeba, poprawiasz regułę, zamiast szukać błędu.',
                    ],
                },
                {
                    heading: 'Dane i koszty pod kontrolą',
                    paragraphs: [
                        'Do modelu trafiają tylko dane potrzebne do zadania, a klucze i dostępy trzymamy w zaszyfrowanym sejfie. Model dobieramy do zadania, więc **nie przepłacasz za moc, której nie potrzebujesz**, a bieżące zużycie widzisz w panelu.',
                    ],
                },
            ],
        },
        faq: { title: 'Częste pytania o AI i automatyzację' },
    },
    en: {
        name: 'AI & automation',
        hero: {
            headingLines: ['AI and', 'automation', 'for businesses'],
            wideLines: [[0, 1], [2]],
            lead: 'We automate repetitive work: chatbots that answer customers from your documents, reading invoices and orders, integrations with your CRM and ERP. A single automation starts at PLN\u00A0299, and we estimate the cost of using the AI models before the rollout.',
            quote: 'Get a quote',
            quoteShort: 'Quote',
            facts: [
                { prefix: 'from', value: 'PLN\u00A0299', label: 'a chatbot or a single automation' },
                { prefix: 'from', value: 'PLN\u00A01,999', label: 'an AI agent with integrations' },
                { value: '24\u00A0h', label: 'to reply to your brief' },
                { value: 'Free', label: 'quote and consultation' },
            ],
        },
        scope: {
            title: 'What you get as standard',
            lead: 'Every automation we build has these safeguards. What varies is the processes it handles and the systems it connects to.',
            items: [
                {
                    title: 'A chatbot on your data',
                    description: 'It answers customers’ questions from your offer, price lists and terms, not from the model’s memory. When it doesn’t know the answer, it says so.',
                },
                {
                    title: 'Document reading',
                    description: 'We turn invoices, orders and forms into data: the AI reads amounts, dates and line items, and the system passes them on, for example to accounting.',
                },
                {
                    title: 'System integrations',
                    description: 'We connect automations to your CRM, ERP, email and calendars, so the results land where your team already works.',
                },
                {
                    title: 'A human in the loop',
                    description: 'When it’s unsure, or the decision matters, the AI hands the case to a person or waits for approval. You decide what it may do on its own.',
                },
                {
                    title: 'A log of every action',
                    description: 'Every answer and every action is recorded: you see what the AI did, based on what, and what it cost.',
                },
                {
                    title: 'Cost control',
                    description: 'We choose the model for the task and estimate the usage cost before the rollout, and you see the current usage and limit in the panel.',
                },
            ],
        },
        pricing: {
            title: 'How much does AI automation cost',
            lead: 'The price depends on the number of process steps and the systems the automation connects to. On top of that comes the cost of using the AI models, which we estimate before the rollout.',
        },
        process: {
            title: 'How we roll out AI',
            lead: 'Four stages, and we start with the one process that takes the most time today. We give you the timeline after the analysis.',
            steps: [
                {
                    title: 'Process analysis',
                    description: 'We map the process step by step with the people who do it today, and point out which steps the AI will do well and which should stay with a person.',
                },
                {
                    title: 'A prototype on your data',
                    description: 'We build the first version on real examples: customer questions, invoices or requests. You check how it works before we connect it to your systems.',
                },
                {
                    title: 'Integrations and tests',
                    description: 'We connect the automation to your CRM, email or ERP, add rules and approvals, and show you the progress on a staging version every two weeks.',
                },
                {
                    title: 'Rollout and measurement',
                    description: 'We launch the automation for some of the cases, measure the quality and the time saved, and then extend it to the rest.',
                },
            ],
        },
        projects: { title: 'Automations we’ve built' },
        guide: {
            title: 'AI that works, not just talks',
            intro: 'What to look at before you roll out AI in your company, so it ends in time saved, not another experiment.',
            sections: [
                {
                    heading: 'Start from the process, not the model',
                    paragraphs: [
                        'AI works best on repetitive tasks with clear rules: answering the same questions, reading documents, copying data between systems. That’s why we start with **the one process that takes the most time today**, and measure how much time it saves before we move on to the next.',
                    ],
                },
                {
                    heading: 'Answers from your documents',
                    paragraphs: [
                        'A language model on its own can make things up. A company chatbot should answer **from your offer, price lists and terms** (that’s called RAG) and point to where the answer came from. When your documents don’t have the answer, it says so and hands the case to a person.',
                    ],
                },
                {
                    heading: 'Control over what the AI does',
                    paragraphs: [
                        'An automation shouldn’t run blind. We agree on **what the AI may do on its own and what needs approval**, and we log every action. That way you know why a customer got a certain answer, and when needed, you fix a rule instead of hunting for a bug.',
                    ],
                },
                {
                    heading: 'Data and costs under control',
                    paragraphs: [
                        'Only the data the task needs goes to the model, and we keep keys and access details in an encrypted vault. We choose the model for the task, so **you don’t overpay for power you don’t need**, and you see the current usage in the panel.',
                    ],
                },
            ],
        },
        faq: { title: 'Common questions about AI and automation' },
    },
});
