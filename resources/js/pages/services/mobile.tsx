import { MOBILE_COPY } from '@/components/services/mobile-copy';
import { MobileScene } from '@/components/services/mobile-scene';
import { MOBILE_VIGNETTES } from '@/components/services/mobile-vignettes';
import { ServicePage } from '@/components/services/service-page';
import type { ServicePageProps } from '@/types/services';

/**
 * Aplikacje mobilne (/aplikacje-mobilne, /en/mobile-apps): the service page with its own copy, hero scene and
 * vignettes; the brief starts with the service's project type checked.
 */
export default function Mobile(props: ServicePageProps) {
    return (
        <ServicePage
            {...props}
            copy={MOBILE_COPY}
            scene={<MobileScene className="absolute inset-0" />}
            vignettes={MOBILE_VIGNETTES}
            guidePhoto="mobile-testing"
            briefTypes={['mobile']}
        />
    );
}
