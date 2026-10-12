import { Mail } from 'lucide-react';
import { Appear } from '@/components/home/bento/bento-tile';
import { CHIP_SURFACE, SceneChip } from '@/components/home/scenes/scene-parts';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ServiceScene, useServiceScene } from './service-scene';
import { ScoreRing } from './vignette-parts';

const COPY = localized({
    pl: {
        url: 'twojakwiaciarnia.pl',
        resultTitle: 'Twoja Kwiaciarnia – bukiety w Lesznie',
        resultText: 'Bukiety ślubne i okolicznościowe z dostawą w Lesznie i okolicy. Zamów online albo zadzwoń.',
        performance: 'Wydajność',
        metrics: 'LCP 0,8 s, CLS 0',
        inquiry: 'Nowe zapytanie z formularza',
        inquiryDetail: 'Bukiet ślubny na sobotę',
        now: 'teraz',
    },
    en: {
        url: 'yourflorist.com',
        resultTitle: 'Your Florist – bouquets in Leszno',
        resultText: 'Wedding and occasion bouquets delivered in and around Leszno. Order online or give us a call.',
        performance: 'Performance',
        metrics: 'LCP 0.8 s, CLS 0',
        inquiry: 'New inquiry from the form',
        inquiryDetail: 'A wedding bouquet for Saturday',
        now: 'now',
    },
});

/**
 * Strony internetowe: a florist's counter with the shop's new website on the laptop; over the wall the site's story
 * arrives: found in Google, fast (the bento web tile's score ring), and the inquiry that comes in through its form.
 */
export function WebsitesScene({ className }: { className?: string }) {
    const loop = useServiceScene();
    const copy = useCopy(COPY);

    return (
        <ServiceScene
            loop={loop}
            photoName="websites-studio"
            imgClassName="object-[30%_50%] sm:object-[40%_50%] lg:object-[46%_50%]"
            className={className}
            top={<SceneChip show={loop.step >= 3} from="above" icon={Mail} title={copy.inquiry} detail={copy.inquiryDetail} trailing={<span className="self-start text-[11px] text-muted-foreground">{copy.now}</span>} />}
            middle={
                <Appear show={loop.step >= 2} from="none" className={cn('flex items-center gap-3 rounded-lg p-2.5 pr-4', CHIP_SURFACE, 'duration-600 data-[show=false]:translate-y-3')}>
                    <ScoreRing score="100" />
                    <span className="text-xs leading-snug">
                        <span className="block font-medium">{copy.performance}</span>
                        <span className="block text-muted-foreground">{copy.metrics}</span>
                    </span>
                </Appear>
            }
            bottom={
                <Appear show={loop.step >= 1} from="none" className={cn('rounded-lg p-3', CHIP_SURFACE, 'duration-600 data-[show=false]:translate-y-3')}>
                    <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex size-4 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-background">T</span>
                        <span className="truncate font-mono">{copy.url}</span>
                    </span>
                    <span className="mt-1.5 block truncate text-[13px] font-medium">{copy.resultTitle}</span>
                    <span className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">{copy.resultText}</span>
                </Appear>
            }
        />
    );
}
