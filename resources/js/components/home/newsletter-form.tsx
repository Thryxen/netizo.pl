import { useForm } from '@inertiajs/react';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import { FieldError, fieldError, FormErrorAlert, formLevelError, invalidProps, SubmitButton } from '@/components/home/brief/fields';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEndpoints } from '@/lib/endpoints';
import { localized, useCopy } from '@/lib/i18n';

const COPY = localized({
    pl: {
        success: 'Zapisano. Pierwszy numer trafi do Ciebie w przyszłym miesiącu.',
        formLabel: 'Zapis do newslettera',
        email: 'Adres e-mail',
        placeholder: 'ty@firma.pl',
        pending: 'Zapisywanie…',
        submit: 'Zapisz się',
        note: 'Zero spamu. Możesz wypisać się w dowolnym momencie.',
    },
    en: {
        success: 'You’re subscribed. Your first issue arrives next month.',
        formLabel: 'Newsletter sign-up',
        email: 'Email address',
        placeholder: 'you@company.com',
        pending: 'Subscribing…',
        submit: 'Subscribe',
        note: 'No spam. You can unsubscribe at any time.',
    },
});

/** The newsletter sign-up of NewsletterSection, in its own module so its code loads only near the section. */
export function NewsletterForm() {
    const copy = useCopy(COPY);
    const endpoints = useEndpoints();
    const form = useForm<{ email: string }>(() => ({ email: '' }));
    const [subscribed, setSubscribed] = useState(false);
    const successRef = useRef<HTMLParagraphElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const pendingFocus = useRef<'success' | 'invalid' | null>(null);

    useEffect(() => {
        const target = pendingFocus.current;

        if (target === null) {
            return;
        }

        pendingFocus.current = null;

        if (target === 'success') {
            successRef.current?.focus();
        } else {
            emailInputRef.current?.focus();
        }
    }, [subscribed, form.errors]);

    const emailError = fieldError(form.errors, 'email');
    const formError = formLevelError(form.errors);
    const noteId = 'newsletter-note';

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (form.processing) {
            return;
        }

        form.post(endpoints.newsletter, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                pendingFocus.current = 'success';
                setSubscribed(true);
            },
            onError: (serverErrors) => {
                if ('email' in serverErrors) {
                    pendingFocus.current = 'invalid';
                }
            },
        });
    };

    if (subscribed) {
        return (
            <p ref={successRef} tabIndex={-1} role="status" className="text-lg leading-relaxed font-medium outline-none">
                {copy.success}
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate aria-label={copy.formLabel} className="grid gap-3">
            <Label htmlFor="newsletter-email" className="sr-only">
                {copy.email}
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                    ref={emailInputRef}
                    id="newsletter-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={copy.placeholder}
                    maxLength={255}
                    value={form.data.email}
                    onChange={(event) => {
                        form.setData('email', event.target.value);

                        if (emailError) {
                            form.clearErrors('email');
                        }
                    }}
                    aria-required="true"
                    className="h-11 sm:flex-1 md:h-10"
                    {...invalidProps('newsletter-email', emailError, noteId)}
                />
                <SubmitButton processing={form.processing} pendingLabel={copy.pending} size="lg" className="max-md:h-11 sm:min-w-32">
                    {copy.submit}
                </SubmitButton>
            </div>
            <FieldError fieldId="newsletter-email" message={emailError} />
            <FormErrorAlert message={formError} />
            <p id={noteId} className="text-sm text-muted-foreground">
                {copy.note}
            </p>
        </form>
    );
}
