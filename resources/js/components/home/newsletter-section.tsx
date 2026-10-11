import { NewsletterScene } from '@/components/home/scenes/newsletter-scene';
import { bleedClassName, gutterClassName, Section, SectionHeading } from '@/components/home/section';
import { deferred, DeferredBlock } from '@/lib/deferred';
import { localized, useCopy } from '@/lib/i18n';
import { useHomeSections } from '@/lib/sections';
import { cn } from '@/lib/utils';

const COPY = localized({
    pl: {
        title: 'Newsletter raz w miesiącu',
        lead: 'Przegląd najważniejszych trendów, case studies i praktyczne porady dla firm.',
        perksLabel: 'Co znajdziesz w newsletterze',
        perks: ['Trendy technologiczne', 'Case studies projektów', 'Praktyczne porady dla firm'],
    },
    en: {
        title: 'A monthly newsletter',
        lead: 'A roundup of the key trends, case studies and practical tips for businesses.',
        perksLabel: 'What’s in the newsletter',
        perks: ['Tech trends', 'Project case studies', 'Practical tips for businesses'],
    },
});

const newsletterForm = deferred(() => import('@/components/home/newsletter-form').then((module) => module.NewsletterForm));

/**
 * A bleed split band: heading + perks on the left; on the right the photo scene (an issue arriving on a phone) over
 * the form, all sharing hairlines. Below lg: heading, a wide crop of the scene, the form. The section's own top
 * hairline and the next section's hairline are the band's edges (no container padding).
 */
export function NewsletterSection() {
    const copy = useCopy(COPY);
    const sectionId = useHomeSections().newsletter;

    return (
        <Section id={sectionId} labelledBy={`${sectionId}-heading`} containerClassName="py-0 md:py-0">
            <div className={cn('grid gap-px bg-border lg:grid-cols-12', bleedClassName)}>
                <SectionHeading
                    id={`${sectionId}-heading`}
                    title={copy.title}
                    lead={copy.lead}
                    className={cn('mb-0 bg-background pt-20 pb-12 md:mb-0 md:pt-28 md:pb-16 lg:col-span-6 lg:row-span-2 lg:pb-28 xl:col-span-7', gutterClassName)}
                >
                    <ul className="mt-8 grid list-disc gap-3 pl-5 marker:text-muted-foreground" aria-label={copy.perksLabel}>
                        {copy.perks.map((perk) => (
                            <li key={perk} className="pl-1">
                                {perk}
                            </li>
                        ))}
                    </ul>
                </SectionHeading>

                <NewsletterScene className="aspect-[16/9] sm:aspect-[21/9] lg:col-span-6 lg:aspect-auto lg:min-h-64 xl:col-span-5" />

                <div className={cn('flex flex-col justify-center bg-background py-12 md:py-14 lg:col-span-6 lg:py-12 xl:col-span-5', gutterClassName)}>
                    <DeferredBlock component={newsletterForm} />
                </div>
            </div>
        </Section>
    );
}
