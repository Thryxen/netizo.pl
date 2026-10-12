import { DEVOPS_COPY } from '@/components/services/devops-copy';
import { DevopsScene } from '@/components/services/devops-scene';
import { DEVOPS_VIGNETTES } from '@/components/services/devops-vignettes';
import { ServicePage } from '@/components/services/service-page';
import type { ServicePageProps } from '@/types/services';

/**
 * DevOps & Cloud (/devops-i-chmura, /en/devops-cloud): the service page with its own copy, hero scene and vignettes;
 * the brief starts with "Inne" (APIs, integrations, automation) checked.
 */
export default function Devops(props: ServicePageProps) {
    return (
        <ServicePage
            {...props}
            copy={DEVOPS_COPY}
            scene={<DevopsScene className="absolute inset-0" />}
            vignettes={DEVOPS_VIGNETTES}
            guidePhoto="devops-architecture"
            briefTypes={['other']}
        />
    );
}
