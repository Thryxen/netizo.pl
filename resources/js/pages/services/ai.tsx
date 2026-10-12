import { AI_COPY } from '@/components/services/ai-copy';
import { AiScene } from '@/components/services/ai-scene';
import { AI_VIGNETTES } from '@/components/services/ai-vignettes';
import { ServicePage } from '@/components/services/service-page';
import type { ServicePageProps } from '@/types/services';

/**
 * AI & Automatyzacja (/automatyzacja-ai, /en/ai-automation): the service page with its own copy, hero scene and
 * vignettes; the brief starts with "Inne" (APIs, integrations, automation) checked.
 */
export default function Ai(props: ServicePageProps) {
    return (
        <ServicePage
            {...props}
            copy={AI_COPY}
            scene={<AiScene className="absolute inset-0" />}
            vignettes={AI_VIGNETTES}
            guidePhoto="ai-process"
            briefTypes={['other']}
        />
    );
}
