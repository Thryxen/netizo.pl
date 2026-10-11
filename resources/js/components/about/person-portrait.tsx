import { cn } from '@/lib/utils';
import type { Person } from './about-data';

type PersonAvatarProps = {
    person: Person;
    className?: string;
};

/**
 * Round avatar for inline use (the hero heading, the shared band): the initials on the ink colour, sized in em so it
 * follows the surrounding type. Decorative: the name is always written next to it.
 */
export function PersonAvatar({ person, className }: PersonAvatarProps) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                // Sized in the surrounding font's em (only the initials inside are scaled down), centred on the letters.
                'inline-flex size-[0.78em] shrink-0 -translate-y-[0.04em] items-center justify-center rounded-full bg-foreground align-middle leading-none text-background ring-[0.04em] ring-background',
                className,
            )}
        >
            <span className="text-[0.3em] font-semibold tracking-normal">{person.initials}</span>
        </span>
    );
}
