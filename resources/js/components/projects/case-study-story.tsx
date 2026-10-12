import { ExternalLinkIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ExternalLink } from '@/components/home/external-link';
import { displayUrl } from '@/components/home/project-frame';
import { Container, Rivet, SectionHeading } from '@/components/home/section';
import { TechTag } from '@/components/home/tech-tag';
import { localized, useCopy } from '@/lib/i18n';
import { useCaseStudySections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/home';
import { ScrollingScreenshot } from './scrolling-screenshot';

const COPY = localized({
    pl: {
        story: 'O projekcie',
        facts: 'Projekt w skrócie',
        type: 'Rodzaj projektu',
        tech: 'Technologie',
        site: 'Strona',
        challenges: 'Wyzwania i rozwiązania',
        challengesLead: 'Z czym przyszedł klient i co zbudowaliśmy, żeby to rozwiązać.',
        challenge: 'Wyzwanie',
        solution: 'Rozwiązanie',
        challengeList: 'Wyzwania',
        solutionList: 'Rozwiązania',
    },
    en: {
        story: 'About the project',
        facts: 'The project at a glance',
        type: 'Project type',
        tech: 'Technologies',
        site: 'Website',
        challenges: 'Challenges and solutions',
        challengesLead: 'What the client came to us with, and what we built to solve it.',
        challenge: 'Challenge',
        solution: 'Solution',
        challengeList: 'Challenges',
        solutionList: 'Solutions',
    },
});

/**
 * The case study itself, rail to rail under one hairline: "O projekcie" (the full description and the project at a
 * glance) and "Wyzwania i rozwiązania" in the left half; from lg the right half holds the window that scrolls through
 * the whole site while they are read (ScrollingScreenshot). Below lg the window sits between the two.
 */
export function CaseStudyStory({ project }: { project: Project }) {
    const copy = useCopy(COPY);
    const sectionIds = useCaseStudySections();
    const paragraphs = (project.fullDescription || project.description).split(/\n\s*\n|\n/).filter((paragraph) => paragraph.trim() !== '');
    const hasChallenges = project.challenges.length > 0 || project.solutions.length > 0;

    return (
        <div className="relative border-t border-border">
            <Container className="py-20 md:py-28">
                <Rivet side="left" />
                <Rivet side="right" />
                <div className="grid gap-14 md:gap-16 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-24">
                    <section id={sectionIds.story} aria-labelledby={`${sectionIds.story}-heading`} className="min-w-0 lg:col-span-6 lg:col-start-1 lg:row-start-1">
                        <SectionHeading id={`${sectionIds.story}-heading`} title={copy.story} className="mb-8 md:mb-10" />
                        <div className="grid max-w-[62ch] gap-5 text-lg leading-[1.7] text-pretty text-foreground/85">
                            {paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>

                        <dl aria-label={copy.facts} className="mt-12 divide-y divide-border border-y border-border">
                            {project.category && (
                                <Fact term={copy.type}>
                                    <span>{project.category}</span>
                                </Fact>
                            )}
                            {project.techStack.length > 0 && (
                                <Fact term={copy.tech}>
                                    <ul className="flex flex-wrap gap-1.5">
                                        {project.techStack.map((tech) => (
                                            <li key={tech}>
                                                <TechTag size="md">{tech}</TechTag>
                                            </li>
                                        ))}
                                    </ul>
                                </Fact>
                            )}
                            {project.liveUrl && (
                                <Fact term={copy.site}>
                                    <ExternalLink
                                        href={project.liveUrl}
                                        className="inline-flex min-h-11 items-center gap-1.5 rounded-sm font-medium underline decoration-foreground/30 underline-offset-4 transition-colors outline-none hover:decoration-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 md:min-h-0"
                                    >
                                        {displayUrl(project.url)}
                                        <ExternalLinkIcon aria-hidden="true" className="size-3.5" />
                                    </ExternalLink>
                                </Fact>
                            )}
                        </dl>
                    </section>

                    <ScrollingScreenshot project={project} className={cn('min-w-0 lg:col-span-6 lg:col-start-7 lg:row-start-1', hasChallenges && 'lg:row-span-2')} />

                    {hasChallenges && (
                        <section id={sectionIds.challenges} aria-labelledby={`${sectionIds.challenges}-heading`} className="min-w-0 lg:col-span-6 lg:col-start-1 lg:row-start-2">
                            <SectionHeading id={`${sectionIds.challenges}-heading`} title={copy.challenges} lead={copy.challengesLead} className="mb-8 md:mb-10" />
                            <ChallengesAndSolutions challenges={project.challenges} solutions={project.solutions} />
                        </section>
                    )}
                </div>
            </Container>
        </div>
    );
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
    return (
        <div className="grid gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline sm:gap-6">
            <dt className="text-sm text-muted-foreground">{term}</dt>
            <dd className="min-w-0">{children}</dd>
        </div>
    );
}

/**
 * The panel keeps challenges and solutions as two lists. When they are as long as each other, item n of one answers
 * item n of the other, so they are shown as pairs (the challenge on a muted cell, its solution beside or under it);
 * otherwise as two lists in the same frame.
 */
function ChallengesAndSolutions({ challenges, solutions }: { challenges: string[]; solutions: string[] }) {
    const copy = useCopy(COPY);
    const cell = 'min-w-0 p-5 md:p-6';
    const label = 'text-sm font-medium text-muted-foreground';

    if (challenges.length === solutions.length) {
        return (
            <ul className="divide-y divide-border border border-border">
                {challenges.map((challenge, index) => (
                    <li key={`${index}-${challenge}`} className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y xl:grid-cols-2 xl:divide-x xl:divide-y-0">
                        <div className={cn(cell, 'bg-muted/50')}>
                            <p className={label}>{copy.challenge}</p>
                            <p className="mt-2 leading-relaxed text-pretty text-foreground/80">{challenge}</p>
                        </div>
                        <div className={cell}>
                            <p className={label}>{copy.solution}</p>
                            <p className="mt-2 leading-relaxed text-pretty">{solutions[index]}</p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    const columns = [
        { title: copy.challengeList, items: challenges, muted: true },
        { title: copy.solutionList, items: solutions, muted: false },
    ].filter((column) => column.items.length > 0);

    return (
        <div className="divide-y divide-border border border-border">
            {columns.map((column) => (
                <div key={column.title} className={cn(cell, column.muted && 'bg-muted/50')}>
                    <h3 className={label}>{column.title}</h3>
                    <ul className="mt-3 grid list-disc gap-2.5 pl-5 marker:text-muted-foreground">
                        {column.items.map((item) => (
                            <li key={item} className="pl-1 leading-relaxed text-pretty">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
