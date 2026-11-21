import { Rocket, Trophy } from 'lucide-react';
import { SceneChip, sceneProps } from '@/components/home/scenes/scene-parts';
import { SCENE_CSS, useServiceScene } from '@/components/services/service-scene';
import { useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { METIN2CMS_COPY } from './metin2cms-copy';
import { HERO_INK } from './metin2cms-images';

/** Rendered width of the drawing: the stage's (7/12 of the 1200px column from lg, the full width below). */
const SIZES = '(min-width: 1248px) 700px, (min-width: 1024px) 56vw, 100vw';

/**
 * The Metin2 CMS page's hero stage: an ink drawing of the game's own models as large as the stage, a warrior holding
 * the temple steps against the tiger beast and the wolf-man. The file is black ink on white; it is multiplied onto the
 * page's background in the light theme and inverted and screened onto it in the dark one, so only the lines show in
 * both. Over it two chips of what the system does arrive in the service scenes' loop: the ranking served from the
 * cache and a deploy without downtime. Decorative: the hero's copy says the same.
 */
export function Metin2CmsScene({ className }: { className?: string }) {
    const loop = useServiceScene();
    const copy = useCopy(METIN2CMS_COPY).hero.chips;

    return (
        <div ref={loop.ref} {...sceneProps(loop.active)} data-service-scene="" data-started={loop.started ? '' : undefined} className={cn('relative isolate overflow-hidden bg-background', className)}>
            <style>{SCENE_CSS}</style>
            <img
                src={HERO_INK.src}
                srcSet={HERO_INK.srcSet}
                sizes={SIZES}
                width={HERO_INK.width}
                height={HERO_INK.height}
                alt=""
                draggable={false}
                fetchPriority="high"
                className="absolute top-[3%] left-[2%] h-[94%] w-[96%] object-contain object-bottom mix-blend-multiply dark:mix-blend-screen dark:invert"
            />
            <div data-service-chip="" className="absolute inset-x-3 top-3 sm:inset-x-auto sm:top-5 sm:right-5 sm:w-[15.5rem]">
                <SceneChip show={loop.step >= 2} from="above" icon={Rocket} title={copy.deploy} detail={copy.deployDetail} trailing={<span className="self-start text-[11px] text-muted-foreground">{copy.now}</span>} />
            </div>
            <div data-service-chip="" className="absolute right-5 bottom-5 hidden w-[15.5rem] sm:block">
                <SceneChip show={loop.step >= 1} icon={Trophy} title={copy.cache} detail={copy.cacheDetail} />
            </div>
        </div>
    );
}
