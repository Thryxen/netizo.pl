/**
 * The copy of a service page that sits next to its components (lang/{pl,en}/services.php holds the meta tags, the tiers
 * and the FAQ): one `localized<ServiceCopy>` per service in websites-copy.ts, stores-copy.ts and apps-copy.ts.
 *
 * Figures in the copy (prices, timelines) are the same as in the home page FAQ and App\Enums\Service; ranges keep
 * together with a word joiner (U+2060) after the dash and no-break spaces (U+00A0) inside amounts and before units.
 */

import type { BriefContent } from '@/components/home/process/brief-artifact';
import type { DesignContent } from '@/components/home/process/design-artifact';
import type { LaunchContent } from '@/components/home/process/launch-artifact';
import type { SprintContent } from '@/components/home/process/sprint-artifact';

export type ServiceFact = {
    /** Small text before the value ("od" / "from"). */
    prefix?: string;
    value: string;
    label: string;
};

export type ServiceCopy = {
    /** Beside the logo in the header, and the breadcrumb's last crumb. */
    name: string;
    hero: {
        /** The H1 in fixed lines for the narrow column (phones, and from lg beside the photo). */
        headingLines: string[];
        /** Between md and lg, where the heading spans the full width: how the lines merge (SplitLines). */
        wideLines?: number[][];
        lead: string;
        /** The main button (to the contact section's brief) and the header's button. */
        quote: string;
        /** The header's button on phones. */
        quoteShort: string;
        /** Four figures under the hero, from the FAQ and the tiers. */
        facts: ServiceFact[];
    };
    /** What every project of the service includes: six items, each over its vignette (in the same order). */
    scope: { title: string; lead: string; items: { title: string; description: string }[] };
    pricing: { title: string; lead: string };
    /** The four stages; only where the site states a stage's duration does it get one. */
    process: { title: string; lead: string; steps: { title: string; description: string }[] };
    /** What the four stages' live previews show (the home page's relay artifacts with this service's own words). */
    processArtifacts: { brief: BriefContent; design: DesignContent; sprint: SprintContent; launch: LaunchContent };
    projects: { title: string };
    /**
     * The guide: a few things to know before ordering the service. Paragraphs mark a key phrase with **…** (emphasis()),
     * shown in the text colour over the softer body copy.
     */
    guide: { title: string; intro: string; sections: { heading: string; paragraphs: string[] }[] };
    faq: { title: string };
};

export type EmphasisPart = { text: string; strong: boolean };

/** A paragraph split at its **…** markers: plain runs and the key phrases between the markers. */
export function emphasis(paragraph: string): EmphasisPart[] {
    return paragraph
        .split('**')
        .map((text, index) => ({ text, strong: index % 2 === 1 }))
        .filter((part) => part.text !== '');
}
