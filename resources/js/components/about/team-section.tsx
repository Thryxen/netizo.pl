import { Section, SectionHeading } from '@/components/home/section';
import { localized, useCopy } from '@/lib/i18n';
import { useAboutSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { fullName, PEOPLE, type Person, SHARED_DUTY } from './about-data';
import { CARD, CardRivets } from './card';
import { ParallaxPhoto } from './parallax-photo';
import { PersonAvatar } from './person-portrait';

const COPY = localized({
    pl: {
        title: 'Kto czym się zajmuje',
        lead: 'Obaj jesteśmy współwłaścicielami Netizo. Pracą dzielimy się tak:',
    },
    en: {
        title: 'Who does what',
        lead: 'We are both co-owners of Netizo. This is how we split the work:',
    },
});

/**
 * Zespół (#zespol, #team): a card per co-owner — on one side (alternating) the photo of their part of the work, drifting
 * with the scroll, with their initials as a badge; on the other the name set large in two lines with the role, a short
 * bio and what you settle with them — then a muted card with what they share. Stacked on phones.
 */
export function TeamSection() {
    const copy = useCopy(COPY);
    const people = useCopy(PEOPLE);
    const shared = useCopy(SHARED_DUTY);
    const sectionId = useAboutSections().team;

    return (
        <Section id={sectionId} labelledBy={`${sectionId}-heading`}>
            <SectionHeading id={`${sectionId}-heading`} title={copy.title} lead={copy.lead} />

            <div className="flex flex-col gap-6">
                {people.map((person, index) => (
                    <PersonCard key={person.lastName} person={person} topicsLabel={shared.topicsLabel} photoOnRight={index % 2 === 1} />
                ))}

                <div className="flex flex-col gap-6 bg-muted/70 p-8 sm:flex-row sm:items-center sm:gap-10 md:p-10 dark:bg-muted/40">
                    <span className="flex shrink-0 text-[3.25rem] md:text-[4rem]">
                        {people.map((person, index) => (
                            <PersonAvatar key={person.lastName} person={person} className={cn(index > 0 && '-ml-[0.12em]')} />
                        ))}
                    </span>
                    <div>
                        <p className="text-2xl leading-tight font-semibold tracking-[-0.03em] md:text-3xl">{shared.focus}</p>
                        <p className="mt-2 max-w-2xl leading-relaxed text-pretty text-muted-foreground">{shared.detail}</p>
                    </div>
                </div>
            </div>
        </Section>
    );
}

type PersonCardProps = {
    person: Person;
    topicsLabel: string;
    /** Alternate the sides from lg: the second person's photo sits on the right. */
    photoOnRight: boolean;
};

function PersonCard({ person, topicsLabel, photoOnRight }: PersonCardProps) {
    return (
        <div className="relative">
            <CardRivets />
            <article aria-label={fullName(person)} className={cn(CARD, 'grid overflow-hidden lg:grid-cols-12')}>
                <div className={cn('relative lg:col-span-5', photoOnRight && 'lg:order-2')}>
                    <ParallaxPhoto
                        name={person.photo}
                        sizes="(min-width: 1024px) 480px, 100vw"
                        alt=""
                        className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:size-full lg:min-h-[34rem]"
                    />
                    {/* Whose part of the work the photo shows: their initials, in the corner by the copy. */}
                    <PersonAvatar
                        person={person}
                        className={cn('absolute bottom-5 text-[4rem] md:bottom-6 md:text-[4.5rem]', photoOnRight ? 'left-5 md:left-6 lg:right-6 lg:left-auto' : 'left-5 md:left-6')}
                    />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12 lg:col-span-7 lg:p-14 xl:p-16">
                    <h3 className="text-[clamp(2.75rem,10vw,5.5rem)] leading-[0.92] font-semibold tracking-[-0.05em]">
                        <span className="block">{person.firstName}</span>
                        <span className="block">{person.lastName}</span>
                    </h3>
                    <p className="mt-5 text-muted-foreground">{person.role}</p>
                    <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-pretty">{person.bio}</p>
                    <div className="mt-10 max-w-xl">
                        <p className="text-sm text-muted-foreground">{topicsLabel}</p>
                        <ul className="mt-3 divide-y divide-border border-y border-border">
                            {person.topics.map((topic) => (
                                <li key={topic} className="py-3 leading-snug">
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </article>
        </div>
    );
}
