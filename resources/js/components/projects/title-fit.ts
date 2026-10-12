import type { CSSProperties } from 'react';

/**
 * Width of a character of a big project name (Geist semibold, tracking -0.05em) as a share of the font size, with
 * headroom for wide letters such as "m" and "w".
 */
const CHARACTER_WIDTH = 0.52;

/**
 * `--title-fit` for a project's name set large: the font size at which its longest word fills the column, so a long
 * one-word name (a domain such as "nakazdaokazje.pl") shrinks instead of breaking inside the word. Use it inside a size
 * container (`[container-type:inline-size]`) as `min(<the usual size>, var(--title-fit))`.
 */
export function titleFitStyle(title: string): CSSProperties {
    const longestWord = Math.max(1, ...title.split(/\s+/).map((word) => [...word].length));

    return { '--title-fit': `calc(100cqw / ${(longestWord * CHARACTER_WIDTH).toFixed(2)})` } as CSSProperties;
}
