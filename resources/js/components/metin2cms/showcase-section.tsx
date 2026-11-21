import { Tabs } from 'radix-ui';
import { BrowserBar } from '@/components/home/project-frame';
import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { METIN2CMS_COPY, SHOWCASE_SCREENS } from './metin2cms-copy';
import { DEPLOYMENT_HOST, screen } from './metin2cms-images';
import { SherkanClip } from './sherkan-clip';

/** Shared borders of the three facts: a column on phones, a row from md. */
const FACT_BORDERS = ['border-b md:border-r md:border-b-0', 'border-b md:border-r md:border-b-0', ''];

/**
 * Realizacja (#realizacja, #case-study): the first deployment, the last thing before the questions. One block rail to
 * rail: what was built as three facts, then the deployment itself in a browser window as wide as the page. The tabs
 * above it pick the screen (the site and the player panel, then the admin panel); the first one is the clip of the home
 * page. Only the chosen screen is rendered, so the others load when picked; the server renders the first.
 */
export function ShowcaseSection() {
    const copy = useCopy(METIN2CMS_COPY).caseStudy;
    const id = useMetin2CmsSections().caseStudy;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />

                <dl className="grid md:grid-cols-3">
                    {copy.facts.map((fact, index) => (
                        <div key={fact.label} className={cn('border-border py-6 sm:py-7', gutterClassName, FACT_BORDERS[index])}>
                            <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                            <dd className="mt-1 leading-snug font-medium text-pretty sm:text-lg">{fact.value}</dd>
                        </div>
                    ))}
                </dl>

                <Tabs.Root defaultValue={SHOWCASE_SCREENS[0][0].key}>
                    <Tabs.List aria-label={copy.pick} className="border-t border-border">
                        {copy.groups.map((group, groupIndex) => (
                            <div key={group.title} className={cn('flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:gap-6', gutterClassName, groupIndex > 0 && 'border-t border-border')}>
                                <span className="shrink-0 text-sm text-muted-foreground lg:w-44">{group.title}</span>
                                <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1 lg:flex-wrap lg:overflow-visible">
                                    {group.screens.map((item, index) => (
                                        <Tabs.Trigger
                                            key={SHOWCASE_SCREENS[groupIndex][index].key}
                                            value={SHOWCASE_SCREENS[groupIndex][index].key}
                                            className="shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=active]:border-foreground data-[state=active]:bg-foreground data-[state=active]:text-background"
                                        >
                                            {item.label}
                                        </Tabs.Trigger>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Tabs.List>

                    {copy.groups.map((group, groupIndex) =>
                        group.screens.map((item, index) => {
                            const { key, path, file } = SHOWCASE_SCREENS[groupIndex][index];
                            const image = file ? screen(file) : null;

                            return (
                                <Tabs.Content key={key} value={key} className="border-t border-border outline-none">
                                    <p className={cn('py-4 leading-relaxed text-pretty text-muted-foreground', gutterClassName)}>{item.description}</p>
                                    <BrowserBar url={path ? `${DEPLOYMENT_HOST}/${path}` : DEPLOYMENT_HOST} className="border-t" />
                                    {image ? (
                                        <img
                                            src={image.src}
                                            srcSet={image.srcSet}
                                            sizes="(min-width: 1248px) 1200px, 100vw"
                                            width={image.width}
                                            height={image.height}
                                            alt={`${item.label} – Sherkan`}
                                            loading="lazy"
                                            decoding="async"
                                            className="block h-auto w-full bg-muted"
                                        />
                                    ) : (
                                        <SherkanClip label={item.description} />
                                    )}
                                </Tabs.Content>
                            );
                        }),
                    )}
                </Tabs.Root>

                <p className={cn('border-t border-border py-5 text-sm text-muted-foreground', gutterClassName)}>{copy.note}</p>
            </div>
        </Section>
    );
}
