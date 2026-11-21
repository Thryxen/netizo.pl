/**
 * Images of the Metin2 CMS page (public/assets/images/metin2cms/).
 *
 * The hero's ink drawing (hero-ink.webp and its 640w copy): the game's own models drawn as monochrome ink line art, a
 * warrior holding the temple steps against the tiger beast and the wolf-man under the gate. Generated with codex-image
 * from the Sherkan hero painting (the architecture) and the real renders of those models as references, then flattened
 * to black on white without alpha: the page blends it into its own background (Metin2CmsScene).
 *
 * The first deployment's screens: captured at a full desktop width from a local copy of Sherkan filled with invented
 * data (16:9, 2400w and 1200w), and the clip of its home page with its poster.
 */

const BASE = '/assets/images/metin2cms';

export const HERO_INK = {
    src: `${BASE}/hero-ink.webp`,
    srcSet: `${BASE}/hero-ink-640.webp 640w, ${BASE}/hero-ink.webp 1020w`,
    width: 1020,
    height: 1024,
} as const;

/** A 16:9 screen of the deployment, e.g. `admin-logs` or `site-ranking`. */
export function screen(name: string): { src: string; srcSet: string; width: number; height: number } {
    return {
        src: `${BASE}/screen-${name}.webp`,
        srcSet: `${BASE}/screen-${name}-1200.webp 1200w, ${BASE}/screen-${name}.webp 2400w`,
        width: 2400,
        height: 1350,
    };
}

/** The clip of the deployment's home page (12 s, silent, loops) and its first frame. */
export const CLIP = { src: `${BASE}/sherkan-home.mp4`, poster: `${BASE}/sherkan-home.webp`, width: 1920, height: 1080 } as const;

/** What the browser window shows as the deployment's address. */
export const DEPLOYMENT_HOST = 'sherkan';
