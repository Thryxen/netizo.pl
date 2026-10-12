import type { Project } from '@/types/home';

/** A project in the list of projects and in the case study's "next project" link (PortfolioController: no long copy). */
export type ProjectSummary = Pick<
    Project,
    'id' | 'slug' | 'title' | 'url' | 'category' | 'description' | 'thumbnailUrl' | 'fullImageUrl' | 'techStack' | 'metrics'
>;

/** Props of the list of projects (PortfolioController@index: /realizacje, /en/projects). */
export type ProjectsPageProps = {
    projects: ProjectSummary[];
};

/** Props of a project's case study (PortfolioController@show: /realizacje/{slug}, /en/projects/{slug}). */
export type CaseStudyPageProps = {
    project: Project;
    /** The project after this one in the panel's order (wrapping around); null when it is the only active one. */
    nextProject: ProjectSummary | null;
};
