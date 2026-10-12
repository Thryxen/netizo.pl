import { SubpageHeader, type SubpageHeaderLink } from '@/components/home/subpage-header';
import { localized, useCopy } from '@/lib/i18n';
import { contact } from '@/lib/site';

const COPY = localized({
    pl: {
        write: 'Napisz do nas',
        writeShort: 'Napisz',
    },
    en: {
        write: 'Email us',
        writeShort: 'Email',
    },
});

type LegalHeaderProps = {
    pageName: string;
    /** The document's key sections, linked from lg. */
    sections: SubpageHeaderLink[];
};

/** Header of a legal page: the button writes to us, the way to ask about the document or your data. */
export function LegalHeader({ pageName, sections }: LegalHeaderProps) {
    const copy = useCopy(COPY);

    return <SubpageHeader pageName={pageName} sections={sections} cta={{ href: `mailto:${contact.email}`, label: copy.write, shortLabel: copy.writeShort }} />;
}
