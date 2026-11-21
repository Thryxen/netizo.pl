import { useEffect } from 'react';
import { useInViewLoop } from '@/components/motion';
import { cn } from '@/lib/utils';
import { CLIP } from './metin2cms-images';

type SherkanClipProps = {
    /** What the clip shows. */
    label: string;
    className?: string;
};

/**
 * The clip of the deployment's home page, silent and looping. It plays only while in view with motion allowed, and its
 * file is fetched the first time it plays; SSR, no JS and reduced motion show the poster (the clip's first frame).
 */
export function SherkanClip({ label, className }: SherkanClipProps) {
    const { ref, active } = useInViewLoop<HTMLVideoElement>({ amount: 0.3 });

    useEffect(() => {
        const video = ref.current;

        if (!video) {
            return;
        }

        if (active) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [active, ref]);

    return (
        <video
            ref={ref}
            src={CLIP.src}
            poster={CLIP.poster}
            width={CLIP.width}
            height={CLIP.height}
            muted
            loop
            playsInline
            preload="none"
            aria-label={label}
            className={cn('block aspect-video h-auto w-full bg-muted object-cover', className)}
        />
    );
}
