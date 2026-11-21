import { BentoStyles } from '@/components/home/bento/bento-styles';
import { bleedClassName, Rivet, Section, SectionHeading } from '@/components/home/section';
import { useCopy } from '@/lib/i18n';
import { useMetin2CmsSections } from '@/lib/sections';
import { cn } from '@/lib/utils';
import { AdminTile } from './bento/admin-tile';
import { LogsTile } from './bento/logs-tile';
import { PaymentsTile } from './bento/payments-tile';
import { PlayerTile } from './bento/player-tile';
import { SiteTile } from './bento/site-tile';
import { SupportTile } from './bento/support-tile';
import { METIN2CMS_COPY } from './metin2cms-copy';

/**
 * Co dostajesz w standardzie (#system): the six parts of the system as a live bento on the shared-border grid, rail to
 * rail, in the home page's bento (its tile shell, motion and scoped styles), laid out the same way:
 *
 *   lg (4 columns)                              md (2 columns)           below md: one column, same order
 *   [ Site 2×2    ][ Player 1×2 ][ Payments ]   [ Site 2×1            ]
 *   [ Site        ][ Player     ][ Support  ]   [ Player  ][ Payments ]
 *   [ Admin 2×1   ][ Logs 2×1               ]   [ Support ][ Admin    ]
 *                                               [ Logs 2×1            ]
 *
 * Each tile plays its part while in view (a page filling in, a sign-up, a top-up, a ticket, the dashboard, the
 * connection graph) and shows the finished frame without JS and under reduced motion. Where a row hairline meets a
 * rail, the tile below it carries the rivet; the bottom edge is the next section's hairline.
 */
export function SystemSection() {
    const copy = useCopy(METIN2CMS_COPY).system;
    const id = useMetin2CmsSections().system;
    const { tiles } = copy;

    return (
        <Section id={id} labelledBy={`${id}-heading`} containerClassName="pb-0 md:pb-0">
            <SectionHeading id={`${id}-heading`} title={copy.title} lead={copy.lead} />

            <BentoStyles />

            <div className={cn('relative border-t border-border', bleedClassName)}>
                <Rivet side="left" />
                <Rivet side="right" />
                <ul className="grid gap-px bg-border md:grid-cols-2 lg:auto-rows-[minmax(20rem,auto)] lg:grid-cols-4">
                    <SiteTile service={tiles.site} />
                    <PlayerTile service={tiles.player} rivets={[{ side: 'left', className: 'lg:hidden' }]} />
                    <PaymentsTile service={tiles.payments} rivets={[{ side: 'right', className: 'lg:hidden' }]} />
                    <SupportTile
                        service={tiles.support}
                        rivets={[
                            { side: 'left', className: 'lg:hidden' },
                            { side: 'right', className: 'md:hidden lg:block' },
                        ]}
                    />
                    <AdminTile
                        service={tiles.admin}
                        rivets={[
                            { side: 'right', className: 'lg:hidden' },
                            { side: 'left', className: 'md:hidden lg:block' },
                        ]}
                    />
                    <LogsTile service={tiles.logs} rivets={[{ side: 'left', className: 'lg:hidden' }, { side: 'right' }]} />
                </ul>
            </div>
        </Section>
    );
}
