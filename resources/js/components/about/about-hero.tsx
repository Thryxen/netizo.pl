import { Clock, Laptop, MapPin, Phone } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Container } from '@/components/home/section';
import { SplitLines } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { photo } from '@/lib/photos';
import { useAboutSections, useHomeSections } from '@/lib/sections';
import { contact, usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';
import { CHIP_SURFACE } from '@/components/home/scenes/scene-parts';
import { fullName, PEOPLE } from './about-data';
import { CardRivets } from './card';
import { PersonAvatar } from './person-portrait';

const COPY = localized({
    pl: {
        pill: 'Damian i Kamil, współwłaściciele',
        headingLines: ['Za Netizo stoją', 'Damian i Kamil.'],
        lead: 'Netizo to software house, który tworzy strony internetowe, sklepy i aplikacje webowe dla firm. Pracujemy zdalnie z firmami z całej Polski, a w Lesznie i okolicach przyjeżdżamy do klienta.',
        quote: 'Wyceń projekt',
        call: 'Zadzwoń',
        factsLabel: 'W skrócie',
        facts: ['Zdalnie w całej Polsce', 'Na miejscu w Lesznie i okolicach', 'Odpowiedź w ciągu 24 godzin'],
        reply: 'Odpowiadamy w ciągu 24 godzin',
    },
    en: {
        pill: 'Damian and Kamil, co-owners',
        headingLines: ['Netizo is', 'Damian and Kamil.'],
        lead: 'We are a software house that builds websites, online stores and web apps for companies. We work remotely with companies across Poland, and around Leszno we come to you.',
        quote: 'Get a quote',
        call: 'Call',
        factsLabel: 'At a glance',
        facts: ['Remote across Poland', 'In person around Leszno', 'A reply within 24 hours'],
        reply: 'We reply within 24 hours',
    },
});

const FACT_ICONS = [Laptop, MapPin, Clock];

/** The first screen's choreography (app.css `[data-split-line]`, `[data-hero-rise]`): copy first, then the photo, then the cards on it. */
const RISE_AT = 0.45;
const RISE_STAGGER = 0.09;

const riseDelay = (index: number): CSSProperties => ({ '--hero-rise-delay': `${RISE_AT + index * RISE_STAGGER}s` }) as CSSProperties;

/** A floating card on the photo's wall: the home page's scene chip (its surface, its radius). */
const FLOATING_CARD = cn('rounded-lg', CHIP_SURFACE);

/**
 * First screen of the about page: the copy on the left (an avatar pill, the heading, the lead, the two ways to get in
 * touch, the facts), on the right the studio photo in a sharp-edged frame with rivets on its corners, running off the
 * right edge from lg, with the co-owners' cards and the reply time floating on its wall like the home page's scene chips.
 */
export function AboutHero() {
    const copy = useCopy(COPY);
    const people = useCopy(PEOPLE);
    const homeSections = useHomeSections();
    const sectionIds = useAboutSections();
    const pageUrls = usePageUrls();

    return (
        <section aria-labelledby="hero-heading" className="relative overflow-hidden">
            {/* A faint wash behind the photo, like the soft backdrops of shadcn hero blocks. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_80%_20%,color-mix(in_oklab,var(--foreground)_6%,transparent),transparent_70%)]"
            />
            <Container className="pt-10 pb-16 sm:pt-14 md:pb-20 lg:pt-20 lg:pb-28">
                <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-6">
                        <a
                            href={`#${sectionIds.team}`}
                            data-hero-rise=""
                            style={riseDelay(-3)}
                            className="inline-flex items-center gap-3 border border-border bg-background py-1 pr-4 pl-1 text-sm transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            <span className="flex text-[2rem]">
                                {people.map((person, index) => (
                                    <PersonAvatar key={person.lastName} person={person} className={cn(index > 0 && '-ml-[0.2em]')} />
                                ))}
                            </span>
                            <span className="font-medium">{copy.pill}</span>
                        </a>

                        <SplitLines
                            id="hero-heading"
                            lines={copy.headingLines}
                            delay={0.1}
                            className="mt-8 text-[clamp(2.5rem,8vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.045em] lg:text-[clamp(2.75rem,4.6vw,4.25rem)]"
                        />
                        <p data-hero-rise="" style={riseDelay(0)} className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl md:leading-relaxed">
                            {copy.lead}
                        </p>

                        <div data-hero-rise="" style={riseDelay(1)} className="mt-9 flex flex-wrap items-center gap-3">
                            <Button size="lg" className="max-md:h-11" asChild>
                                <a href={`${pageUrls.home}#${homeSections.contact}`}>{copy.quote}</a>
                            </Button>
                            <Button size="lg" variant="outline" className="max-md:h-11" asChild>
                                <a href={contact.phone.href}>
                                    <Phone aria-hidden="true" />
                                    <span className="sr-only">{copy.call}: </span>
                                    <span className="tabular-nums">{contact.phone.display}</span>
                                </a>
                            </Button>
                        </div>

                        <ul data-hero-rise="" style={riseDelay(2)} aria-label={copy.factsLabel} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                            {copy.facts.map((fact, index) => {
                                const Icon = FACT_ICONS[index];

                                return (
                                    <li key={fact} className="flex items-center gap-2">
                                        <Icon aria-hidden="true" className="size-4 text-foreground" />
                                        {fact}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* The photo runs off the right edge from lg. */}
                    <div className="relative lg:col-span-6 lg:-mr-28 xl:-mr-44">
                        <div data-hero-rise="" style={riseDelay(2)} className="relative border border-border bg-muted/70 p-2">
                            <CardRivets />
                            {/* The first screen's largest element: loaded eagerly, at high priority (Photo is lazy). */}
                            <div data-photo-frame="" className="relative aspect-[3/2] overflow-hidden bg-muted">
                                <img
                                    {...photo('about-studio')}
                                    sizes="(min-width: 1280px) 820px, (min-width: 1024px) 640px, 100vw"
                                    alt=""
                                    loading="eager"
                                    fetchPriority="high"
                                    decoding="async"
                                    className="block size-full object-cover"
                                />
                            </div>

                            <div aria-hidden="true" className="pointer-events-none absolute inset-2 overflow-hidden">
                                {people.map((person, index) => (
                                    <div
                                        key={person.lastName}
                                        data-hero-rise=""
                                        style={riseDelay(4 + index)}
                                        className={cn(
                                            'absolute flex items-center gap-3 py-2.5 pr-4 pl-2.5',
                                            FLOATING_CARD,
                                            // Phones: opposite corners of the small photo; from sm: stacked on the calm wall on the right.
                                            index === 0 ? 'top-3 left-3 sm:top-[9%] sm:right-[10%] sm:left-auto' : 'right-3 bottom-3 sm:top-[33%] sm:right-[24%] sm:bottom-auto',
                                        )}
                                    >
                                        <PersonAvatar person={person} className="text-[2.75rem] ring-0" />
                                        <span className="leading-tight">
                                            <span className="block text-sm font-semibold">{fullName(person)}</span>
                                            <span className="block text-xs text-muted-foreground">{person.role}</span>
                                        </span>
                                    </div>
                                ))}

                                <div
                                    data-hero-rise=""
                                    style={riseDelay(6)}
                                    className={cn('absolute bottom-[8%] left-[6%] hidden items-center gap-2 px-3 py-2 text-xs font-medium sm:flex', FLOATING_CARD)}
                                >
                                    <span aria-hidden="true" className="relative flex size-2">
                                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-foreground/40 motion-reduce:animate-none" />
                                        <span className="relative inline-flex size-2 rounded-full bg-foreground" />
                                    </span>
                                    {copy.reply}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
