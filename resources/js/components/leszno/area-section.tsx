import { ParallaxPhoto } from '@/components/about/parallax-photo';
import { ServiceAreaMap, TOWN_DISTANCES } from '@/components/about/service-area-map';
import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { localized, useCopy } from '@/lib/i18n';
import { useAboutSections, useLesznoSections } from '@/lib/sections';
import { usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';
import { NEARBY_PLACES } from './leszno-data';

const COPY = localized({
    pl: {
        title: 'Gdzie do Ciebie przyjeżdżamy',
        lead: 'Nie mamy biura dla klientów, więc spotykamy się u Ciebie: w biurze, sklepie, warsztacie albo gabinecie. W tych miastach i między nimi.',
        townsTitle: 'Miasta, do których przyjeżdżamy',
        townsLead: 'Odległość od Leszna w linii prostej.',
        leszno: 'Leszno',
        here: 'na miejscu',
        km: 'km',
        nearbyTitle: 'I miejscowości pomiędzy nimi',
        nearbyMore: 'i inne.',
        remote: 'Dalej od Leszna pracujemy zdalnie, w całej Polsce: na wideorozmowach, przez telefon i w panelu klienta.',
        howWeWork: 'Zobacz, jak pracujemy',
    },
    en: {
        title: 'Where we come to you',
        lead: 'We have no office for clients to visit, so we meet at your place: your office, shop, workshop or practice. In these towns and in between.',
        townsTitle: 'Towns we come to',
        townsLead: 'Straight-line distance from Leszno.',
        leszno: 'Leszno',
        here: 'right here',
        km: 'km',
        nearbyTitle: 'And the places in between',
        nearbyMore: 'and more.',
        remote: 'Further from Leszno we work remotely, across Poland: over video calls, by phone and in the client portal.',
        howWeWork: 'See how we work',
    },
});

const linkFocus = 'rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

/**
 * Dojazd (#dojazd, #where-we-meet): the area we travel to, rail to rail. On the left the road photo, the six towns with
 * their distance from Leszno (the about page's map maths) and the smaller places between them as text; on the right the
 * about page's map of the area, with no base marked. Under it a line on working remotely further away.
 */
export function AreaSection() {
    const copy = useCopy(COPY);
    const id = useLesznoSections().area;
    const pageUrls = usePageUrls();
    const howWeWorkId = useAboutSections().howWeWork;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <div className="grid gap-px bg-border lg:grid-cols-12">
                    <div className="flex min-w-0 flex-col bg-background lg:col-span-5">
                        <ParallaxPhoto name="leszno-road" sizes="(min-width: 1248px) 500px, (min-width: 1024px) 40vw, 100vw" alt="" className="aspect-[16/9] lg:aspect-[16/10]" />
                        <div className={cn('flex flex-1 flex-col border-t border-border pt-8 pb-10 lg:pt-10 lg:pb-12', gutterClassName)}>
                            <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{copy.townsTitle}</h3>
                            <p className="mt-2 text-sm text-muted-foreground">{copy.townsLead}</p>
                            <ul className="mt-6 divide-y divide-border border-y border-border">
                                <li className="flex items-baseline justify-between gap-4 py-3">
                                    <span className="font-medium">{copy.leszno}</span>
                                    <span className="text-sm text-muted-foreground">{copy.here}</span>
                                </li>
                                {TOWN_DISTANCES.map((town) => (
                                    <li key={town.name} className="flex items-baseline justify-between gap-4 py-3">
                                        <span className="font-medium">{town.name}</span>
                                        <span className="text-sm text-muted-foreground tabular-nums">
                                            {town.km}&nbsp;{copy.km}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <h3 className="mt-8 text-sm font-medium">{copy.nearbyTitle}</h3>
                            <p className="mt-2 leading-relaxed text-pretty text-muted-foreground">
                                {NEARBY_PLACES.join(', ')} {copy.nearbyMore}
                            </p>
                        </div>
                    </div>

                    <figure className="relative m-0 flex items-center bg-card lg:col-span-7">
                        <ServiceAreaMap />
                    </figure>
                </div>
            </div>

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <p className={cn('flex max-w-4xl flex-wrap items-baseline gap-x-3 gap-y-2 py-7 text-sm leading-relaxed text-pretty text-muted-foreground md:py-8', gutterClassName)}>
                    <span>{copy.remote}</span>
                    <a
                        href={`${pageUrls.about}#${howWeWorkId}`}
                        className={cn('font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground', linkFocus)}
                    >
                        {copy.howWeWork}
                    </a>
                </p>
            </div>
        </Section>
    );
}
