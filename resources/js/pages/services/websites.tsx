import { ServicePage } from '@/components/services/service-page';
import { WEBSITES_COPY } from '@/components/services/websites-copy';
import { WebsitesScene } from '@/components/services/websites-scene';
import { WEBSITES_VIGNETTES } from '@/components/services/websites-vignettes';
import type { ServicePageProps } from '@/types/services';

/**
 * Tworzenie stron internetowych (/tworzenie-stron-internetowych, /en/website-development): the service page with its own copy, hero scene
 * and vignettes; the brief starts with the service's project type checked.
 */
export default function Websites(props: ServicePageProps) {
    return (
        <ServicePage
            {...props}
            copy={WEBSITES_COPY}
            scene={<WebsitesScene className="absolute inset-0" />}
            vignettes={WEBSITES_VIGNETTES}
            guidePhoto="websites-prototype"
            briefTypes={['website']}
        />
    );
}
