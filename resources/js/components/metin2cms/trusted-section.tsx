import { Container, gutterClassName, Rivet } from '@/components/home/section';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { METIN2CMS_COPY } from './metin2cms-copy';
import { LOGOS } from './metin2cms-images';

/**
 * Zaufali nam (#zaufali-nam, #trusted-by): a strip under the hero's figures, on the same shared-border grid: the
 * heading and a line on whose logos these are, then the servers' logos in grey, one per cell.
 */
export function TrustedSection() {
    const copy = useCopy(METIN2CMS_COPY).trusted;
    const id = useMetin2CmsSections().trusted;

    return (
        <section id={id} aria-labelledby={`${id}-heading`} className="relative border-t border-border">
            <Container className="px-0 sm:px-0 lg:px-0">
                <Rivet side="left" />
                <Rivet side="right" />
                <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-3">
                    <div className={cn('col-span-2 flex flex-col justify-center gap-1.5 bg-background py-8 lg:col-span-1', gutterClassName)}>
                        <h2 id={`${id}-heading`} tabIndex={-1} className="text-xl font-semibold tracking-tight outline-none">
                            {copy.title}
                        </h2>
                        <p className="leading-relaxed text-pretty text-muted-foreground">{copy.lead}</p>
                    </div>
                    {Object.values(LOGOS).map((logo) => (
                        <div key={logo.name} className="flex items-center justify-center bg-background px-6 py-9">
                            <img src={logo.src} width={logo.width} height={logo.height} alt={logo.name} loading="lazy" decoding="async" className="h-11 w-auto opacity-75 sm:h-14" />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
