import { SubpageHeader, type SubpageHeaderLink } from '@/components/home/subpage-header';
import { localized, useCopy } from '@/lib/i18n';
import { useCaseStudySections, useHomeSections } from '@/lib/sections';
import { usePageUrls } from '@/lib/site';
import type { Project } from '@/types/home';

const COPY = localized({
    pl: {
        pageName: 'Realizacje',
        results: 'Wyniki',
        story: 'O projekcie',
        challenges: 'Wyzwania',
        quoteShort: 'Wycena',
        quote: 'Wyceń projekt',
    },
    en: {
        pageName: 'Projects',
        results: 'Results',
        story: 'About the project',
        challenges: 'Challenges',
        quoteShort: 'Quote',
        quote: 'Get a quote',
    },
});

type ProjectsHeaderProps = {
    /** On a case study: its sections become the header's links and the page name leads back to the list. */
    project?: Pick<Project, 'metrics' | 'challenges' | 'solutions'>;
};

/** Header of the project pages: the button leads to the contact section of the home page. */
export function ProjectsHeader({ project }: ProjectsHeaderProps) {
    const copy = useCopy(COPY);
    const sectionIds = useCaseStudySections();
    const homeSections = useHomeSections();
    const pageUrls = usePageUrls();
    const sections: SubpageHeaderLink[] = [];

    if (project) {
        if (project.metrics.length > 0) {
            sections.push({ href: `#${sectionIds.results}`, label: copy.results });
        }

        sections.push({ href: `#${sectionIds.story}`, label: copy.story });

        if (project.challenges.length > 0 || project.solutions.length > 0) {
            sections.push({ href: `#${sectionIds.challenges}`, label: copy.challenges });
        }
    }

    return (
        <SubpageHeader
            pageName={copy.pageName}
            pageHref={project ? pageUrls.projects : undefined}
            sections={sections}
            cta={{ href: `${pageUrls.home}#${homeSections.contact}`, label: copy.quote, shortLabel: copy.quoteShort }}
        />
    );
}
