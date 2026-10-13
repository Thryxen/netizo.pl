import { CalendarCheck, Mail } from 'lucide-react';
import { Appear } from '@/components/home/bento/bento-tile';
import { CHIP_SURFACE, SceneChip } from '@/components/home/scenes/scene-parts';
import { TOWN_DISTANCES } from '@/components/about/service-area-map';
import { ServiceScene, useServiceScene } from '@/components/services/service-scene';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const COPY = localized({
    pl: {
        from: 'Leszno',
        to: 'Rydzyna',
        km: 'km',
        onTheWay: 'W drodze do Ciebie',
        meeting: 'Spotkanie w Twojej firmie',
        meetingDetail: 'Omawiamy projekt na żywo',
        inquiry: 'Nowe zapytanie ze strony',
        inquiryDetail: 'Stół dębowy na wymiar, Kościan',
        now: 'teraz',
    },
    en: {
        from: 'Leszno',
        to: 'Rydzyna',
        km: 'km',
        onTheWay: 'On our way to you',
        meeting: 'A meeting at your company',
        meetingDetail: 'Going over the project live',
        inquiry: 'New inquiry from the website',
        inquiryDetail: 'A made-to-measure oak table, Kościan',
        now: 'now',
    },
});

/** The straight-line distance the route chip shows, from the about page's map (the same towns and maths). */
const ROUTE_KM = TOWN_DISTANCES.find((town) => town.name === 'Rydzyna')?.km ?? 0;

/**
 * The Leszno page's hero stage: a joinery workshop where we sit with the owner over the new website; over its sage
 * wall the visit arrives in order: on the way from Leszno, the meeting at the client's company, and the inquiry the
 * finished website brings in from a town nearby.
 */
export function LesznoScene({ className }: { className?: string }) {
    const loop = useServiceScene();
    const copy = useCopy(COPY);

    return (
        <ServiceScene
            loop={loop}
            photoName="leszno-visit"
            imgClassName="object-[30%_50%] sm:object-[38%_50%] lg:object-[44%_50%]"
            className={className}
            top={<SceneChip show={loop.step >= 3} from="above" icon={Mail} title={copy.inquiry} detail={copy.inquiryDetail} trailing={<span className="self-start text-[11px] text-muted-foreground">{copy.now}</span>} />}
            middle={<SceneChip show={loop.step >= 2} icon={CalendarCheck} title={copy.meeting} detail={copy.meetingDetail} />}
            bottom={
                <Appear show={loop.step >= 1} from="none" className={cn('rounded-lg p-3', CHIP_SURFACE, 'duration-600 data-[show=false]:translate-y-3')}>
                    <span className="block text-[11px] text-muted-foreground">{copy.onTheWay}</span>
                    <span className="mt-2 flex items-center gap-2.5 text-[13px] font-medium">
                        <span className="size-2.5 shrink-0 rounded-full bg-foreground" />
                        {copy.from}
                        <span className="h-px min-w-6 flex-1 border-t border-dashed border-foreground/45" />
                        <span className="text-[11px] font-normal text-muted-foreground tabular-nums">
                            {ROUTE_KM}&nbsp;{copy.km}
                        </span>
                        <span className="h-px min-w-6 flex-1 border-t border-dashed border-foreground/45" />
                        <span className="size-2.5 shrink-0 rounded-full border-2 border-foreground" />
                        {copy.to}
                    </span>
                </Appear>
            }
        />
    );
}
