import { cn } from '@/lib/utils';
import type { Person } from './about-data';

type PersonAvatarProps = {
    person: Person;
    /** In the first screen (the hero): load the photo at once instead of lazily. */
    eager?: boolean;
    className?: string;
};

/**
 * Round avatar for inline use (the hero heading, the shared band): the person's photo when there is one (`portrait`),
 * else the initials on the ink colour, sized in em so it follows the surrounding type (25–56 px across the page).
 * Decorative: the name is always written next to it.
 */
export function PersonAvatar({ person, eager = false, className }: PersonAvatarProps) {
    const portrait = person.portrait ? `/assets/images/people/${person.portrait}` : null;

    return (
        <span
            aria-hidden="true"
            className={cn(
                // Sized in the surrounding font's em (only the initials inside are scaled down), centred on the letters.
                'inline-flex size-[0.78em] shrink-0 -translate-y-[0.04em] items-center justify-center overflow-hidden rounded-full bg-foreground align-middle leading-none text-background ring-[0.04em] ring-background',
                className,
            )}
        >
            {portrait ? (
                <img
                    src={`${portrait}-192.webp`}
                    srcSet={`${portrait}-96.webp 96w, ${portrait}-192.webp 192w`}
                    sizes="56px"
                    width={192}
                    height={192}
                    alt=""
                    loading={eager ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                    className="size-full object-cover dark:brightness-[0.92]"
                />
            ) : (
                <span className="text-[0.3em] font-semibold tracking-normal">{person.initials}</span>
            )}
        </span>
    );
}
