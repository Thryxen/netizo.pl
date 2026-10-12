import { DatabaseBackup, GitCommitHorizontal } from 'lucide-react';
import { Appear } from '@/components/home/bento/bento-tile';
import { CHIP_SURFACE, SceneChip } from '@/components/home/scenes/scene-parts';
import { localized, useCopy } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { ServiceScene, useServiceScene } from './service-scene';
import { DoneTick } from './vignette-parts';

const COPY = localized({
    pl: {
        commit: 'Nowa wersja w repozytorium',
        commitDetail: 'main, 3 zmiany',
        stages: ['Build', 'Testy', 'Deploy'],
        deployed: 'Wdrożono w 2 min 21 s, bez przestojów',
        backup: 'Kopia zapasowa gotowa',
        backupDetail: 'Baza i pliki, test odtworzenia zaliczony',
        now: 'teraz',
    },
    en: {
        commit: 'New version in the repository',
        commitDetail: 'main, 3 changes',
        stages: ['Build', 'Tests', 'Deploy'],
        deployed: 'Deployed in 2 min 21 s, no downtime',
        backup: 'Backup ready',
        backupDetail: 'Database and files, restore test passed',
        now: 'now',
    },
});

/**
 * DevOps & Cloud: a workspace with monitoring on the screen and a small server on the shelf; over the wall a release goes
 * through: a new version is pushed, the pipeline runs green (the bento's DevOps tile) and the nightly backup is verified.
 */
export function DevopsScene({ className }: { className?: string }) {
    const loop = useServiceScene();
    const copy = useCopy(COPY);

    return (
        <ServiceScene
            loop={loop}
            photoName="devops-desk"
            imgClassName="object-[28%_50%] sm:object-[36%_50%] lg:object-[40%_50%]"
            className={className}
            top={<SceneChip show={loop.step >= 3} from="above" icon={DatabaseBackup} title={copy.backup} detail={copy.backupDetail} trailing={<span className="self-start text-[11px] text-muted-foreground">{copy.now}</span>} />}
            middle={
                <Appear show={loop.step >= 2} from="none" className={cn('rounded-lg p-3', CHIP_SURFACE, 'duration-600 data-[show=false]:translate-y-3')}>
                    <span className="flex items-center justify-between gap-2">
                        {copy.stages.map((stage) => (
                            <span key={stage} className="flex items-center gap-1.5 text-xs font-medium">
                                <DoneTick />
                                {stage}
                            </span>
                        ))}
                    </span>
                    <span className="mt-2 block border-t pt-2 text-[11px] text-muted-foreground">{copy.deployed}</span>
                </Appear>
            }
            bottom={<SceneChip show={loop.step >= 1} icon={GitCommitHorizontal} title={copy.commit} detail={copy.commitDetail} />}
        />
    );
}
