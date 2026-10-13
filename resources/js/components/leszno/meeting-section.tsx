import { Check } from 'lucide-react';
import { ParallaxPhoto } from '@/components/about/parallax-photo';
import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { localized, useCopy } from '@/lib/i18n';
import { useLesznoSections } from '@/lib/sections';
import { cn } from '@/lib/utils';

const COPY = localized({
    pl: {
        title: 'Jak wygląda spotkanie u Ciebie',
        lead: 'Rozmowa przy jednym stole zamiast długiej wymiany maili. Po spotkaniu dostajesz zakres prac i wycenę.',
        steps: [
            {
                title: 'Piszesz albo dzwonisz',
                description: 'Podajesz miejscowość i to, czego potrzebujesz. Odpowiadamy w ciągu 24 godzin i umawiamy termin, który Ci pasuje.',
            },
            {
                title: 'Przyjeżdżamy do Twojej firmy',
                description: 'Siadamy przy laptopie w Twoim biurze, sklepie albo warsztacie. Pokazujemy przykłady stron i pytamy o klientów, ofertę i konkurencję.',
            },
            {
                title: 'Zakres i wycena',
                description: 'Po spotkaniu spisujemy zakres prac: podstrony, funkcje i treści. Dostajesz go do akceptacji razem z bezpłatną wyceną i terminem.',
            },
            {
                title: 'Projekt i dalsza praca',
                description: 'Prototyp w Figmie i wersję testową oglądasz na swoim telefonie i komputerze, a postępy widzisz w panelu klienta. Gdy wolisz coś omówić przy stole, umawiamy kolejne spotkanie.',
            },
        ],
        prepareTitle: 'Co warto mieć pod ręką',
        prepare: ['Logo i zdjęcia firmy albo realizacji', 'Przykłady stron, które Ci się podobają', 'Listę usług albo produktów', 'Dostęp do obecnej domeny, jeśli ją masz'],
    },
    en: {
        title: 'What a meeting at your place looks like',
        lead: 'A conversation at one table instead of a long email thread. After the meeting you get the scope of work and a quote.',
        steps: [
            {
                title: 'You write or call',
                description: 'Tell us your town and what you need. We reply within 24 hours and book a time that suits you.',
            },
            {
                title: 'We come to your company',
                description: 'We sit down at the laptop in your office, shop or workshop. We show you examples of websites and ask about your customers, offer and competitors.',
            },
            {
                title: 'Scope and quote',
                description: 'After the meeting we write down the scope of work: the pages, features and content. You get it to approve together with a free quote and a timeline.',
            },
            {
                title: 'Design and the work after',
                description: 'You view the Figma prototype and the staging version on your own phone and computer, and follow the progress in the client portal. When you’d rather talk something over at the table, we book another meeting.',
            },
        ],
        prepareTitle: 'Good to have at hand',
        prepare: ['Your logo and photos of your business or work', 'Examples of websites you like', 'A list of your services or products', 'Access to your current domain, if you have one'],
    },
});

/**
 * Spotkanie (#spotkanie, #meeting): how a meeting at the client's company runs, rail to rail: the photo of a client's
 * desk on the left (it drifts with the scroll), the four steps on the shared-border grid on the right, then what is
 * good to have at hand.
 */
export function MeetingSection() {
    const copy = useCopy(COPY);
    const id = useLesznoSections().meeting;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <div className="grid gap-px bg-border lg:grid-cols-12">
                    <ParallaxPhoto
                        name="leszno-meeting"
                        sizes="(min-width: 1248px) 500px, (min-width: 1024px) 40vw, 100vw"
                        alt=""
                        className="aspect-[3/2] lg:col-span-5 lg:aspect-auto lg:min-h-full"
                    />
                    <ol className="grid gap-px bg-border sm:grid-cols-2 lg:col-span-7">
                        {copy.steps.map((step, index) => (
                            <li key={step.title} className={cn('flex flex-col bg-background pt-8 pb-10 lg:pt-10 lg:pb-12', gutterClassName)}>
                                <span aria-hidden="true" className="text-sm text-muted-foreground tabular-nums">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <h3 className="mt-6 text-xl font-semibold tracking-tight">{step.title}</h3>
                                <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{step.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <div className={cn('flex flex-col gap-5 py-8 lg:flex-row lg:items-baseline lg:gap-10 lg:py-9', gutterClassName)}>
                    <h3 className="shrink-0 text-sm font-medium">{copy.prepareTitle}</h3>
                    <ul className="grid gap-x-8 gap-y-3 text-[0.9375rem] leading-snug sm:grid-cols-2 xl:grid-cols-4">
                        {copy.prepare.map((item) => (
                            <li key={item} className="flex gap-2.5">
                                <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" strokeWidth={2.25} />
                                <span className="text-pretty">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Section>
    );
}
