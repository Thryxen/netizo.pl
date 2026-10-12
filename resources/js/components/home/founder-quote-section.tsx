import { Section } from '@/components/home/section';
import { localized, useCopy } from '@/lib/i18n';

/** Damian's avatar (netizo/zdjecia/portrety.cjs), the same files as on the about page; 192 px covers 112 px CSS on 1.5× screens. */
const PORTRAIT = '/assets/images/people/damian-idzik';

/** Damian as in PEOPLE (components/about/about-data.ts), written out here so the home chunk stays free of the about data. */
const COPY = localized({
    pl: {
        quote: '„Dla nas najważniejsze jest, żeby to, co tworzymy, realnie pomagało Twojej firmie.”',
        name: 'Damian Idzik',
        role: 'współwłaściciel Netizo',
    },
    en: {
        quote: '“What matters most to us is that what we build actually helps your business.”',
        name: 'Damian Idzik',
        role: 'co-owner of Netizo',
    },
});

/**
 * A word from a co-owner: his round avatar in a dashed ring (the page rails' line), a hairline, then the quote with its
 * opening mark hung in the margin and the attribution after a short rule; stacked and centred on phones (no hung mark,
 * no rule). The avatar is decorative: the caption names him. A hairline ring keeps the photo's white backdrop apart
 * from the light page.
 */
export function FounderQuoteSection() {
    const copy = useCopy(COPY);

    return (
        <Section containerClassName="py-16 md:py-24">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center sm:flex-row sm:gap-0 sm:text-left">
                <div className="relative shrink-0 p-2 sm:mr-10 md:mr-12">
                    <span aria-hidden="true" className="absolute inset-0 rounded-full border border-dashed border-border dark:border-foreground/18" />
                    <img
                        src={`${PORTRAIT}-192.webp`}
                        srcSet={`${PORTRAIT}-96.webp 96w, ${PORTRAIT}-192.webp 192w`}
                        sizes="(min-width: 640px) 112px, 80px"
                        width={192}
                        height={192}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="relative size-20 rounded-full bg-muted object-cover ring-1 ring-border sm:size-28 dark:brightness-[0.92]"
                    />
                </div>

                <figure className="sm:border-l sm:border-border sm:py-2 sm:pl-10 md:pl-12">
                    <blockquote>
                        <p className="text-[1.375rem] leading-[1.25] font-semibold tracking-[-0.025em] text-balance sm:text-2xl md:text-[1.875rem]">
                            <span className="sm:-ml-[0.4em]">{copy.quote.slice(0, 1)}</span>
                            {copy.quote.slice(1)}
                        </p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center justify-center gap-3 text-sm sm:justify-start">
                        <span aria-hidden="true" className="hidden h-px w-6 shrink-0 bg-foreground/40 sm:block" />
                        <span>
                            <span className="font-medium">{copy.name}</span>
                            <span className="text-muted-foreground">, {copy.role}</span>
                        </span>
                    </figcaption>
                </figure>
            </div>
        </Section>
    );
}
