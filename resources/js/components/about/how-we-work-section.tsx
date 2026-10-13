import { Section, SectionHeading } from '@/components/home/section';
import { localized, useCopy } from '@/lib/i18n';
import { useAboutSections } from '@/lib/sections';
import { usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';
import { WORK_MODES, WORK_NOTES } from './about-data';
import { CARD, CardRivets } from './card';
import { ParallaxPhoto } from './parallax-photo';
import { ServiceAreaMap, TOWN_DISTANCES } from './service-area-map';

const COPY = localized({
    pl: {
        title: 'Jak pracujemy',
        lead: 'Większość spraw załatwiamy zdalnie. Tam, gdzie to ma sens, przyjeżdżamy.',
        mapTitle: 'Tu przyjeżdżamy do klienta',
        mapLead: 'Odległość od Leszna w linii prostej. W pozostałej części Polski pracujemy zdalnie.',
        km: 'km',
        local: 'Strony internetowe w Lesznie i okolicach',
    },
    en: {
        title: 'How we work',
        lead: 'Most things happen remotely. Where it makes sense, we come to you.',
        mapTitle: 'Where we come to you',
        mapLead: 'Straight-line distance from Leszno. Everywhere else in Poland we work remotely.',
        km: 'km',
        local: 'Websites in and around Leszno',
    },
});

/**
 * Jak pracujemy (#jak-pracujemy, #how-we-work): the two ways we work as photo cards (the photos drift with the scroll),
 * then a wide card with the map of the towns where we meet in person beside the road photo and their distances, then
 * the smaller print as two small cards.
 */
export function HowWeWorkSection() {
    const copy = useCopy(COPY);
    const modes = useCopy(WORK_MODES);
    const notes = useCopy(WORK_NOTES);
    const sectionId = useAboutSections().howWeWork;
    const pageUrls = usePageUrls();

    return (
        <Section id={sectionId} labelledBy={`${sectionId}-heading`}>
            <SectionHeading id={`${sectionId}-heading`} title={copy.title} lead={copy.lead} />

            <ul className="grid gap-6 md:grid-cols-2">
                {modes.map((mode) => (
                    <li key={mode.term} className={cn(CARD, 'flex flex-col overflow-hidden')}>
                        <ParallaxPhoto name={mode.photo} sizes="(min-width: 768px) 600px, 100vw" alt="" className="aspect-[3/2]" />
                        <div className="p-8 md:p-10">
                            <p className="text-sm text-muted-foreground">{mode.term}</p>
                            <h3 className="mt-2 text-3xl leading-tight font-semibold tracking-[-0.035em] md:text-4xl">{mode.title}</h3>
                            <p className="mt-4 max-w-[46ch] leading-relaxed text-pretty text-muted-foreground">{mode.detail}</p>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="relative mt-6">
                <CardRivets />
                <div className={cn(CARD, 'grid overflow-hidden lg:grid-cols-12')}>
                    <figure className="relative m-0 lg:col-span-7">
                        <ServiceAreaMap />
                    </figure>
                    <div className="flex flex-col border-t border-border lg:col-span-5 lg:border-t-0 lg:border-l">
                        <ParallaxPhoto name="about-drive" sizes="(min-width: 1024px) 480px, 100vw" alt="" className="aspect-[16/9] lg:aspect-[3/2]" />
                        <div className="flex flex-1 flex-col p-8 md:p-10">
                            <h3 className="text-2xl leading-tight font-semibold tracking-[-0.03em] md:text-3xl">{copy.mapTitle}</h3>
                            <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-pretty text-muted-foreground">{copy.mapLead}</p>
                            <ul className="mt-6 divide-y divide-border border-y border-border">
                                {TOWN_DISTANCES.map((town) => (
                                    <li key={town.name} className="flex items-baseline justify-between gap-4 py-3">
                                        <span className="font-medium">{town.name}</span>
                                        <span className="text-sm text-muted-foreground tabular-nums">
                                            {town.km} {copy.km}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <a
                                href={pageUrls.leszno}
                                className="mt-6 self-start rounded-sm text-sm font-medium underline decoration-foreground/30 underline-offset-4 outline-none hover:decoration-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            >
                                {copy.local}
                            </a>
                        </div>
                    </div>
            </div>
            </div>

            <dl className="mt-6 grid gap-6 md:grid-cols-2">
                {notes.map((note) => (
                    <div key={note.term} className={cn(CARD, 'p-6 md:p-8')}>
                        <dt className="font-medium">{note.term}</dt>
                        <dd className="mt-2 max-w-[52ch] leading-relaxed text-pretty text-muted-foreground">{note.detail}</dd>
                    </div>
                ))}
            </dl>
        </Section>
    );
}
