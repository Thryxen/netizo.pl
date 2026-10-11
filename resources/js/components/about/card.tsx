import { cn } from '@/lib/utils';

/**
 * The about page's surface (the page is unframed, app.css `[data-unframed]`): a sharp-edged card with a hairline border,
 * like the home page's frames, in the shadcn card colour so it lifts off the page in dark mode too. No shadow.
 */
export const CARD = 'border border-border bg-card text-card-foreground';

/**
 * Square rivets on a card's four corners, the home page's mark where hairlines meet. Place inside a `relative` wrapper
 * that does not clip (the rivets sit half outside the corners); the card itself may clip its content.
 */
export function CardRivets({ className }: { className?: string }) {
    return (
        <>
            {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((position) => (
                <span key={position} aria-hidden="true" className={cn('pointer-events-none absolute z-10 size-[7px] bg-rivet', position, className)} />
            ))}
        </>
    );
}
