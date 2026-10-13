/**
 * The generated photo series (spec v2 §3, v3 §3) in public/assets/images/photos: each photo ships at its native width
 * (`{name}.webp`) and as 768w, 384w and 256w variants (`{name}-768.webp` …), made by `netizo/zdjecia/warianty.cjs`.
 * Sizes are the generated sizes.
 *
 * `shop-*`: the knitwear shop the hero's LiveBuild stage builds (shop-hero 3:2, the products 1:1).
 * `backdrop-*`: the sets the live mock-ups float on (spec v7, 3:2, colour at the edges, a calm defocused centre):
 * the knitwear workshop behind the hero's LiveBuild, the office corner behind the client panel.
 * `world-wool` (3:2): the knitwear shop's wool, under the FAQ chat.
 * `newsletter-reading`: the Newsletter photo (4:5).
 * `partner-referral` (3:2): a business card handed across a café table, under the partner programme's hero scene;
 * the right half is a calm sage wall for the floating chips.
 * `partner-question` (3:2): a partner at home reading his phone, under the partner FAQ's chat; the lower part is a calm
 * desk for the bubbles.
 * `about-*`: the about page — `about-studio` (3:2, the hero: a desk set for two, no people; the right third is a calm
 * sage wall for the floating cards), `about-code` and `about-planning` (2:3) for the co-owners' rows (hands only: the
 * technology and the organization, not the people themselves), `about-remote`, `about-visit` (a meeting at a client's
 * shop) and `about-drive` (on the way to a client: a parked car in a small town) (3:2) for "Jak pracujemy", and
 * `about-meeting` (3:2, a café table set for a meeting, a calm sage wall in the middle) behind the closing call to action.
 * The service pages (3:2 each, generated with codex-image in the same style, no faces): the heroes' sets, whose right
 * third is a calm sage wall for the floating chips — `websites-studio` (a florist's counter with a laptop),
 * `stores-packing` (a ceramics studio packing orders), `apps-office` (a wholesaler's office with a dashboard),
 * `mobile-cafe` (a café counter with an ordering app on a phone), `ai-office` (a support desk with a chat on the laptop
 * and invoices), `devops-desk` (a workspace with monitoring on screen and a small server) — and the guides' photos: `websites-prototype` (hands over printed wireframes and a prototype on a
 * tablet), `stores-product-shoot` (a mug on a paper sweep, a softbox, a phone on a tripod), `apps-warehouse` (a tablet in
 * a warehouse aisle), `mobile-testing` (an app tested on two phones), `ai-process` (a process mapped on paper), `devops-architecture`
 * (an architecture drawn on paper).
 * `leszno-*`: the Leszno hub (/tworzenie-stron-internetowych/leszno; 3:2, codex-image, same style, no faces) —
 * `leszno-visit` (the hero: a meeting at a client's joinery workshop, a laptop and printed wireframes on the workbench;
 * the right third is a calm sage wall for the floating chips), `leszno-road` (on the way to a client: a country road
 * through the fields towards a small town) and `leszno-meeting` (a tree care company's office, the website's layouts
 * marked up on the desk).
 */
const PHOTOS = {
    'bento-mobile': { width: 1024, height: 1536 },
    'bento-ecommerce': { width: 1536, height: 1024 },
    'mission-workshop': { width: 1536, height: 1024 },
    'contact-desk': { width: 1024, height: 1024 },
    'shop-hero': { width: 1536, height: 1024 },
    'shop-sweater': { width: 1024, height: 1024 },
    'shop-scarf': { width: 1024, height: 1024 },
    'shop-hat': { width: 1024, height: 1024 },
    'backdrop-workshop': { width: 1536, height: 1024 },
    'backdrop-office': { width: 1536, height: 1024 },
    'world-wool': { width: 1536, height: 1024 },
    'newsletter-reading': { width: 1024, height: 1280 },
    'partner-referral': { width: 1536, height: 1024 },
    'partner-question': { width: 1536, height: 1024 },
    'about-studio': { width: 1536, height: 1024 },
    'about-code': { width: 1024, height: 1536 },
    'about-planning': { width: 1024, height: 1536 },
    'about-remote': { width: 1536, height: 1024 },
    'about-visit': { width: 1536, height: 1024 },
    'about-drive': { width: 1536, height: 1024 },
    'about-meeting': { width: 1536, height: 1024 },
    'websites-studio': { width: 1536, height: 1024 },
    'websites-prototype': { width: 1536, height: 1024 },
    'stores-packing': { width: 1536, height: 1024 },
    'stores-product-shoot': { width: 1536, height: 1024 },
    'apps-office': { width: 1536, height: 1024 },
    'apps-warehouse': { width: 1536, height: 1024 },
    'mobile-cafe': { width: 1536, height: 1024 },
    'mobile-testing': { width: 1536, height: 1024 },
    'ai-office': { width: 1536, height: 1024 },
    'ai-process': { width: 1536, height: 1024 },
    'devops-desk': { width: 1536, height: 1024 },
    'devops-architecture': { width: 1536, height: 1024 },
    'leszno-visit': { width: 1536, height: 1024 },
    'leszno-road': { width: 1536, height: 1024 },
    'leszno-meeting': { width: 1536, height: 1024 },
} as const satisfies Record<string, { width: number; height: number }>;

export type PhotoName = keyof typeof PHOTOS;

/** Variant widths next to the native file; small ones fit the mock-up slots (64–300 px) on phones. */
const PHOTO_WIDTHS = [256, 384, 768] as const;

export type PhotoSources = {
    src: string;
    srcSet: string;
    width: number;
    height: number;
    /** Marks a photo (not a project screenshot) for the dark-theme photo balance in app.css. */
    'data-photo': '';
};

/**
 * `src`, `srcSet` (256w, 384w, 768w + native) and intrinsic size for a photo; add `sizes` per use.
 *
 * @example <Photo {...photo('mission-workshop')} sizes="(min-width: 1024px) 680px, 100vw" alt="" className="aspect-[3/2]" />
 */
export function photo(name: PhotoName): PhotoSources {
    const entry = PHOTOS[name];
    const base = `/assets/images/photos/${name}`;

    return {
        src: `${base}.webp`,
        srcSet: [...PHOTO_WIDTHS.map((width) => `${base}-${width}.webp ${width}w`), `${base}.webp ${entry.width}w`].join(', '),
        width: entry.width,
        height: entry.height,
        'data-photo': '',
    };
}
