/** A project card on the about page (AboutController: a subset of the home page's project props). */
export type AboutProject = {
    id: number;
    slug: string;
    title: string;
    category: string;
    description: string;
    liveUrl: string;
    thumbnailUrl: string | null;
};

/** Props of the about page (AboutController@index). */
export type AboutPageProps = {
    projects: AboutProject[];
    /** Local development only: show the sample story, numbers and testimonials as a layout preview. */
    previewSamples: boolean;
};
