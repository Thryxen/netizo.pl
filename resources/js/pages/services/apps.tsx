import { ServicePage } from '@/components/services/service-page';
import { APPS_COPY } from '@/components/services/apps-copy';
import { AppsScene } from '@/components/services/apps-scene';
import { APPS_VIGNETTES } from '@/components/services/apps-vignettes';
import type { ServicePageProps } from '@/types/services';

/**
 * Aplikacje webowe (/aplikacje-webowe, /en/web-applications): the service page with its own copy, hero scene
 * and vignettes; the brief starts with the service's project type checked.
 */
export default function Apps(props: ServicePageProps) {
    return (
        <ServicePage
            {...props}
            copy={APPS_COPY}
            scene={<AppsScene className="absolute inset-0" />}
            vignettes={APPS_VIGNETTES}
            guidePhoto="apps-warehouse"
            briefTypes={['webapp']}
        />
    );
}
