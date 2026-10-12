import { ServicePage } from '@/components/services/service-page';
import { STORES_COPY } from '@/components/services/stores-copy';
import { StoresScene } from '@/components/services/stores-scene';
import { STORES_VIGNETTES } from '@/components/services/stores-vignettes';
import type { ServicePageProps } from '@/types/services';

/**
 * Sklepy internetowe (/sklepy-internetowe, /en/online-stores): the service page with its own copy, hero scene
 * and vignettes; the brief starts with the service's project type checked.
 */
export default function Stores(props: ServicePageProps) {
    return (
        <ServicePage
            {...props}
            copy={STORES_COPY}
            scene={<StoresScene className="absolute inset-0" />}
            vignettes={STORES_VIGNETTES}
            guidePhoto="stores-product-shoot"
            briefTypes={['ecommerce']}
        />
    );
}
