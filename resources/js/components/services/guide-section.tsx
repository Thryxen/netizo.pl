import { Photo } from '@/components/home/photo';
import { Section, SectionHeading } from '@/components/home/section';
import { photo, type PhotoName } from '@/lib/photos';
import { useServiceSections } from '@/lib/sections';
import { emphasis, type ServiceCopy } from './service-copy';

type GuideSectionProps = {
    guide: ServiceCopy['guide'];
    /** The photo under the heading (a photo of the series, decorative). */
    photoName: PhotoName;
};

/**
 * Poradnik (#poradnik, #guide): the longer read of the page, a few things to know before ordering the service. From lg
 * the heading, its intro and the photo stick on the left while the text scrolls on the right; below lg they come first.
 * The text is set like the legal documents (`legal-prose`: soft body copy, the key phrases in the text colour).
 */
export function GuideSection({ guide, photoName }: GuideSectionProps) {
    const id = useServiceSections().guide;

    return (
        <Section id={id} labelledBy={`${id}-heading`}>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)]">
                        <SectionHeading id={`${id}-heading`} title={guide.title} lead={guide.intro} className="mb-0 md:mb-0" />
                        <Photo
                            {...photo(photoName)}
                            alt=""
                            sizes="(min-width: 1248px) 440px, (min-width: 1024px) 36vw, calc(100vw - 2rem)"
                            className="mt-10 aspect-[16/10] rounded-lg lg:aspect-[3/2]"
                        />
                    </div>
                </div>

                <div className="legal-prose max-w-[68ch] lg:col-span-7">
                    {guide.sections.map((section) => (
                        <div key={section.heading} className="[&+&]:mt-12">
                            <h3 className="text-xl leading-snug font-semibold tracking-tight text-foreground md:text-2xl">{section.heading}</h3>
                            {section.paragraphs.map((paragraph) => (
                                <p key={paragraph} className="mt-4">
                                    {emphasis(paragraph).map((part, index) => (part.strong ? <strong key={index}>{part.text}</strong> : <span key={index}>{part.text}</span>))}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
