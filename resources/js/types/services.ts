import type { FaqItem } from '@/types/home';
import type { ProjectSummary } from '@/types/projects';

/** The services with a page of their own (App\Enums\Service). */
export type ServiceKey = 'websites' | 'stores' | 'apps' | 'mobile' | 'ai' | 'devops';

/** A tier of a service: its copy (lang/{pl,en}/services.php) and its price bracket in złoty (App\Enums\Service). */
export type ServiceOffer = {
    name: string;
    description: string;
    /** How long it usually takes; null where the site states no timeline. */
    timeline: string | null;
    includes: string[];
    priceFrom: number;
    /** What the price usually stays under; null when there is no usual ceiling. */
    priceTo: number | null;
};

/** Another service, linked from the bottom of a service page. */
export type OtherService = {
    key: ServiceKey;
    name: string;
    description: string;
    priceFrom: number;
    url: string;
};

/** Props of a service page (ServicePageController). */
export type ServicePageProps = {
    offers: ServiceOffer[];
    faq: FaqItem[];
    /** Up to four active projects tagged with the service in the panel, in the panel's order. */
    projects: ProjectSummary[];
    otherServices: OtherService[];
};
