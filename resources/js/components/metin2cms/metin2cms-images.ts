/**
 * Images of the Metin2 CMS page (public/assets/images/metin2cms/).
 *
 * The hero's ink drawing (hero-ink.webp and its 640w copy): the game's own models drawn as monochrome ink line art, a
 * warrior holding the temple steps against the tiger beast and the wolf-man under the gate. Generated with codex-image
 * from the Sherkan hero painting (the architecture) and the real renders of those models as references, then flattened
 * to black on white without alpha: the page blends it into its own background (Metin2CmsScene).
 *
 * The first deployment's screens: captured at a full desktop width from a local copy of Sherkan filled with invented
 * data (16:9, 2400w and 1200w), the clip of its home page with its poster, and its four e-mails (screen-mail-*: the
 * templates rendered for an invented account, the top of each on its own dark background).
 */

const BASE = '/assets/images/metin2cms';

export const HERO_INK = {
    src: `${BASE}/hero-ink.webp`,
    srcSet: `${BASE}/hero-ink-640.webp 640w, ${BASE}/hero-ink.webp 1020w`,
    width: 1020,
    height: 1024,
} as const;

/**
 * The bento's two ink drawings (bento-ink-{name}.webp and their 640w copies), made like the hero's and flattened to
 * black on white: the four classes as a party (the player panel's tile) and a dragon over the warrior and his lion (the
 * banner of the site tile's mock-up).
 */
const ink = (name: string) => ({ src: `${BASE}/bento-ink-${name}.webp`, srcSet: `${BASE}/bento-ink-${name}-640.webp 640w, ${BASE}/bento-ink-${name}.webp 1024w`, width: 1024, height: 1024 });

export const BENTO_INK = { party: ink('party'), dragon: ink('dragon') } as const;

/** The logos of the servers the system runs for, in grey (logo-{name}.webp on alpha, 160 px high): Sherkan's own and the one from runeris.com. */
export const LOGOS = {
    sherkan: { name: 'Sherkan', src: `${BASE}/logo-sherkan.webp`, width: 474, height: 160 },
    runeris: { name: 'Runeris', src: `${BASE}/logo-runeris.webp`, width: 532, height: 160 },
} as const;

export type LogoName = keyof typeof LOGOS;

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
