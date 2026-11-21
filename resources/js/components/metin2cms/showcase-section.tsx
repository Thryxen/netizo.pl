import { Tabs } from 'radix-ui';
import { useState } from 'react';
import { BrowserBar } from '@/components/home/project-frame';
import { bleedClassName, gutterClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { DEPLOYMENTS, METIN2CMS_COPY } from './metin2cms-copy';
import { LOGOS, screen } from './metin2cms-images';
import { SherkanClip } from './sherkan-clip';

const chip =
    'shrink-0 rounded-md border px-2.5 py-1 text-[0.8125rem] font-medium whitespace-nowrap text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=active]:border-foreground data-[state=active]:bg-foreground data-[state=active]:text-background';

/**
 * Wdrożenia (#wdrozenia, #deployments): the servers the system runs on, the last thing before the questions, one compact
 * card rail to rail however many there are. On the left the deployment (its logo, a sentence, its facts) and its
 * screens as chips in groups (the site and the player panel, the admin panel, the e-mails it sends); on the right the
 * chosen screen in a window. From the second deployment on, a row of logos above the card switches between them.
 * Tabs: only the chosen screen is rendered, so the others load when picked; the server renders the first.
 */
export function ShowcaseSection() {
    const copy = useCopy(METIN2CMS_COPY).caseStudy;
    const id = useMetin2CmsSections().caseStudy;
    const [current, setCurrent] = useState(0);
    const deployment = DEPLOYMENTS[current];
    const deploymentCopy = copy.deployments[current];
    const logo = LOGOS[deployment.logo];

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />

                {DEPLOYMENTS.length > 1 && (
                    <div role="group" aria-label={copy.choose} className={cn('flex gap-2 overflow-x-auto border-b border-border py-4', gutterClassName)}>
                        {DEPLOYMENTS.map((item, index) => (
                            <button
                                key={item.key}
                                type="button"
                                aria-pressed={index === current}
                                onClick={() => setCurrent(index)}
                                className="shrink-0 rounded-md border px-4 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-pressed:border-foreground"
                            >
                                <img src={LOGOS[item.logo].src} width={LOGOS[item.logo].width} height={LOGOS[item.logo].height} alt={LOGOS[item.logo].name} className="h-7 w-auto opacity-75" />
                            </button>
                        ))}
                    </div>
                )}

                <Tabs.Root key={deployment.key} defaultValue={deployment.groups[0][0].key} className="grid lg:grid-cols-12">
                    <div className={cn('flex flex-col py-8 lg:col-span-4 lg:py-10', gutterClassName)}>
                        <h3>
                            <img src={logo.src} width={logo.width} height={logo.height} alt={logo.name} loading="lazy" decoding="async" className="h-10 w-auto opacity-75" />
                        </h3>
                        <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{deploymentCopy.description}</p>
                        <dl className="mt-5 flex flex-col gap-2.5 text-sm">
                            {deploymentCopy.facts.map((fact) => (
                                <div key={fact.label} className="grid grid-cols-[6.5rem_1fr] gap-3">
                                    <dt className="text-muted-foreground">{fact.label}</dt>
                                    <dd className="font-medium text-pretty">{fact.value}</dd>
                                </div>
                            ))}
                        </dl>

                        <Tabs.List aria-label={copy.pick} className="mt-7 flex flex-col gap-4 border-t border-border pt-6">
                            {deploymentCopy.groups.map((group, groupIndex) => (
                                <div key={group.title}>
                                    <span className="text-sm text-muted-foreground">{group.title}</span>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {group.screens.map((item, index) => (
                                            <Tabs.Trigger key={deployment.groups[groupIndex][index].key} value={deployment.groups[groupIndex][index].key} className={chip}>
                                                {item.label}
                                            </Tabs.Trigger>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Tabs.List>
                    </div>

                    <div className="flex min-w-0 flex-col justify-center border-t border-border bg-muted p-4 sm:p-6 lg:col-span-8 lg:border-t-0 lg:border-l lg:p-8">
                        {deploymentCopy.groups.map((group, groupIndex) =>
                            group.screens.map((item, index) => {
                                const { key, bar, file } = deployment.groups[groupIndex][index];
                                const image = file ? screen(file) : null;

                                return (
                                    <Tabs.Content key={key} value={key} className="outline-none">
                                        <div className="overflow-hidden rounded-lg border bg-background shadow-[0_24px_48px_-24px_rgb(0_0_0/0.35)] dark:shadow-none">
                                            <BrowserBar url={bar} />
                                            {image ? (
                                                <img
                                                    src={image.src}
                                                    srcSet={image.srcSet}
                                                    sizes="(min-width: 1248px) 740px, (min-width: 1024px) 62vw, 100vw"
                                                    width={image.width}
                                                    height={image.height}
                                                    alt={`${item.label} – ${logo.name}`}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="block h-auto w-full bg-muted"
                                                />
                                            ) : (
                                                <SherkanClip label={item.description} />
                                            )}
                                        </div>
                                        <p className="mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">{item.description}</p>
                                    </Tabs.Content>
                                );
                            }),
                        )}
                    </div>
                </Tabs.Root>

                <p className={cn('border-t border-border py-5 text-sm text-muted-foreground', gutterClassName)}>{copy.note}</p>
            </div>
        </Section>
    );
}
