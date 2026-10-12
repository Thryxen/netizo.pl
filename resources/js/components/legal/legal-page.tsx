import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/home/site-footer';
import { SkipLink } from '@/components/home/skip-link';
import { MotionRoot } from '@/components/motion/motion-root';
import { useInPageAnchors } from '@/hooks/use-in-page-anchors';
import { usePageUrls } from '@/lib/site';
import { LegalContactSection } from './legal-contact-section';
import { type LegalDocumentCopy, LegalDocument, type LegalNumbering } from './legal-document';
import { LegalHeader } from './legal-header';
import { LegalHero } from './legal-hero';

type LegalPageProps = {
    document: LegalDocumentCopy;
    numbering: LegalNumbering;
    /** The day the document took effect, `YYYY-MM-DD`. */
    effectiveDate: string;
    /** Buttons beside "Print" in the hero. */
    heroActions?: ReactNode;
    /** A section between the hero and the text (the privacy policy's data map). */
    summary?: ReactNode;
    /** The other legal document, linked from the closing band. */
    otherDocument: { href: string; label: string };
};

/**
 * A legal page (privacy policy, terms): its header, the hero with the party the document names, an optional summary,
 * the numbered text with its contents list and a closing band with the ways to reach us. Printing keeps the hero and
 * the text only.
 */
export function LegalPage({ document, numbering, effectiveDate, heroActions, summary, otherDocument }: LegalPageProps) {
    const pageUrls = usePageUrls();
    useInPageAnchors();

    return (
        <MotionRoot>
            <SkipLink />
            <LegalHeader pageName={document.pageName} sections={document.headerSections.map(({ id, label }) => ({ href: `#${id}`, label }))} />
            <main id="main-content" tabIndex={-1} className="outline-none">
                <LegalHero
                    title={document.title}
                    lead={document.lead}
                    note={document.note}
                    partyLabel={document.partyLabel}
                    effectiveDate={effectiveDate}
                    actions={heroActions}
                />
                {summary}
                <LegalDocument sections={document.sections} numbering={numbering} />
                <LegalContactSection otherDocument={otherDocument} />
            </main>
            <div className="print:hidden">
                <SiteFooter homeHref={pageUrls.home} />
            </div>
        </MotionRoot>
    );
}
