import { LanguageSwitcher } from '@/components/home/language-switcher';
import { Logo } from '@/components/home/logo';
import { Container } from '@/components/home/section';
import { ThemeToggle } from '@/components/home/theme-toggle';
import { Button } from '@/components/ui/button';
import { localized, useCopy } from '@/lib/i18n';
import { usePageUrls } from '@/lib/site';
import { cn } from '@/lib/utils';

const COPY = localized({
    pl: {
        home: 'Netizo – strona główna',
        sectionsNav: 'Sekcje strony',
    },
    en: {
        home: 'Netizo – home page',
        sectionsNav: 'Page sections',
    },
});

const focusRing = 'outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

export type SubpageHeaderLink = { href: string; label: string };

type SubpageHeaderProps = {
    /** Shown beside the logo from sm. */
    pageName: string;
    /** In-page section links, from lg. */
    sections: SubpageHeaderLink[];
    /** The button on the right; `shortLabel` is shown on phones. */
    cta: SubpageHeaderLink & { shortLabel: string };
};

/**
 * Header of a page outside the home page (partner programme, about): the logo leads back to the home page, the page's
 * name sits beside it, the section links (lg+) stay on this page, and the button on the right is the page's main action.
 */
export function SubpageHeader({ pageName, sections, cta }: SubpageHeaderProps) {
    const copy = useCopy(COPY);
    const pageUrls = usePageUrls();

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/85">
            <Container className="flex h-(--header-height) items-center gap-2">
                <a href={pageUrls.home} aria-label={copy.home} className={cn('-ml-1 inline-flex min-h-11 shrink-0 items-center rounded-sm p-1 lg:min-h-0', focusRing)}>
                    <Logo className="h-9 max-[359px]:h-7" />
                </a>
                <span className="ml-2 hidden border-l border-border pl-4 text-sm font-medium text-muted-foreground sm:inline">{pageName}</span>

                <nav aria-label={copy.sectionsNav} className="ml-8 hidden lg:block xl:ml-10">
                    <ul className="flex items-center gap-1">
                        {sections.map(({ href, label }) => (
                            <li key={href}>
                                <a
                                    href={href}
                                    className={cn('inline-flex h-9 items-center rounded-md px-2.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground', focusRing)}
                                >
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <LanguageSwitcher className="max-lg:h-11" codeClassName="md:hidden lg:inline xl:hidden" nameClassName="hidden md:inline lg:hidden xl:inline" />
                    {/* Phones: no room beside the language switcher and the button (the choice made on the home page sticks). */}
                    <ThemeToggle className="hidden size-11 sm:inline-flex lg:size-9" />
                    <Button asChild className="max-lg:h-11">
                        <a href={cta.href}>
                            <span className="sm:hidden">{cta.shortLabel}</span>
                            <span className="hidden sm:inline">{cta.label}</span>
                        </a>
                    </Button>
                </div>
            </Container>
        </header>
    );
}
