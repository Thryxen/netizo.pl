import { useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useMotionStyle, useReducedMotionPreference } from '@/components/motion';
import { photo, type PhotoName } from '@/lib/photos';
import { cn } from '@/lib/utils';

type ParallaxPhotoProps = {
    name: PhotoName;
    /** `sizes` for the srcset. */
    sizes: string;
    /** Required: '' for a decorative photo. */
    alt: string;
    /** Frame classes: its size or aspect ratio. */
    className?: string;
    /** <img> classes, e.g. the focal point (`object-[50%_30%]`). */
    imgClassName?: string;
    /** Eager-load a photo in the first screen. */
    eager?: boolean;
};

/** How far the photo drifts against the scroll, as a share of the frame; the image is scaled up to cover it. */
const DRIFT = '7%';

/**
 * A photo from the series in a clipping frame that drifts against the scroll while it crosses the screen (scroll-linked
 * parallax, transform only). Static at rest without JS and under reduced motion (flat output range).
 */
export function ParallaxPhoto({ name, sizes, alt, className, imgClassName, eager = false }: ParallaxPhotoProps) {
    const frameRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const reduced = useReducedMotionPreference();
    const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : [`-${DRIFT}`, DRIFT]);

    useMotionStyle(imageRef, { y });

    return (
        <div ref={frameRef} data-photo-frame="" className={cn('relative overflow-hidden bg-muted', className)}>
            <img
                ref={imageRef}
                {...photo(name)}
                sizes={sizes}
                alt={alt}
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                className={cn('block size-full scale-[1.18] object-cover will-change-transform', imgClassName)}
            />
        </div>
    );
}
