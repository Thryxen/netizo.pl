import { Phone } from 'lucide-react';
import { Section } from '@/components/home/section';
import { Reveal } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { useHomeSections } from '@/lib/sections';
import { contact, usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';
import { PEOPLE } from './about-data';
import { CardRivets } from './card';
import { ParallaxPhoto } from './parallax-photo';
import { PersonAvatar } from './person-portrait';

const COPY = localized({
    pl: {
        title: 'Porozmawiajmy o Twoim projekcie',
        lead: 'Napisz, czego potrzebujesz, albo zadzwoń. Odpowiadamy w ciągu 24 godzin.',
        quote: 'Wyceń projekt',
        call: 'Zadzwoń',
    },
    en: {
        title: 'Let’s talk about your project',
        lead: 'Tell us what you need, or give us a call. We reply within 24 hours.',
        quote: 'Get a quote',
        call: 'Call',
    },
});

const HEADING_ID = 'about-cta-heading';

/**
 * Closing call to action: a centred panel over the café-table photo (drifting with the scroll, under a dark scrim) with
 * the co-founders' avatars, the heading and the two ways to get in touch (the contact form on the home page, the phone).
 * The heading block enters like the other section headings.
 */
export function AboutCtaSection() {
    const copy = useCopy(COPY);
    const people = useCopy(PEOPLE);
    const homeSections = useHomeSections();
    const pageUrls = usePageUrls();

    return (
        <Section labelledBy={HEADING_ID}>
            <div className="relative">
                <CardRivets />
                <div className="relative isolate overflow-hidden border border-border px-6 py-20 text-center text-white sm:px-12 md:py-28">
                    <ParallaxPhoto name="about-meeting" sizes="(min-width: 1200px) 1120px, 100vw" alt="" className="absolute inset-0 -z-10" />
                    {/* A dark scrim over the photo keeps the white copy readable in both themes; lightest at the wall behind the heading. */}
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_50%_40%,rgb(0_0_0/0.38),rgb(0_0_0/0.62))]" />
                    <Reveal stagger className="mx-auto flex max-w-2xl flex-col items-center">
                        <span className="flex text-[3.5rem]">
                            {people.map((person, index) => (
                                <PersonAvatar key={person.lastName} person={person} className={cn('bg-white text-neutral-950 ring-neutral-950/40', index > 0 && '-ml-[0.12em]')} />
                            ))}
                        </span>
                        <h2 id={HEADING_ID} className="mt-8 text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance">
                            {copy.title}
                        </h2>
                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-white/80">{copy.lead}</p>
                        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                            <Button size="lg" className="bg-white text-neutral-950 hover:bg-white/90 max-md:h-11" asChild>
                                <a href={`${pageUrls.home}#${homeSections.contact}`}>{copy.quote}</a>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white max-md:h-11 dark:border-white/40 dark:bg-white/10 dark:hover:bg-white/20"
                                asChild
                            >
                                <a href={contact.phone.href}>
                                    <Phone aria-hidden="true" />
                                    <span className="sr-only">{copy.call}: </span>
                                    <span className="tabular-nums">{contact.phone.display}</span>
                                </a>
                            </Button>
                        </div>
                    </Reveal>
                </div>
            </div>
        </Section>
    );
}
