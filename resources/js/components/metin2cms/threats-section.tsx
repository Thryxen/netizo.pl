import { Bot, Coins, KeyRound, type LucideIcon, MailCheck, Network, ShieldCheck, UserX } from 'lucide-react';
import { bleedClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { METIN2CMS_COPY } from './metin2cms-copy';

/** The icon of each threat, in the order of `threats.items`. */
const ICONS: LucideIcon[] = [Bot, KeyRound, MailCheck, Network, UserX, Coins];

/**
 * Bezpieczeństwo (#bezpieczenstwo, #security): what every popular server runs into and how the system answers it. Six
 * cells on the shared-border grid rail to rail (one column on phones, two from sm, three from lg), each with an icon,
 * the problem, the answer in a sentence and in a few words beside a shield; the grid leaves its bottom hairline to the
 * next section. Icons only: the page's renders stand elsewhere.
 */
export function ThreatsSection() {
    const copy = useCopy(METIN2CMS_COPY).threats;
    const id = useMetin2CmsSections().threats;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {copy.items.map((item, index) => {
                        const Icon = ICONS[index];

                        return (
                            <li key={item.threat} className="flex min-w-0 flex-col bg-background px-4 py-8 sm:px-6 lg:px-7 lg:py-10">
                                <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-md border bg-muted/60">
                                    <Icon className="size-5" />
                                </span>
                                <h3 className="mt-6 text-lg font-semibold tracking-tight text-balance sm:text-xl">{item.threat}</h3>
                                <p className="mt-2 max-w-[44ch] leading-relaxed text-pretty text-muted-foreground">{item.answer}</p>
                                <p className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium">
                                    <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
                                    {item.defence}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </Section>
    );
}
