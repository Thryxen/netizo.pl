{{-- Styles first: the browser may paint the banner, or start its transitions from unstyled values, before a later <style> applies. --}}
<style data-cookie-consent>
/* Uses the site tokens from resources/css/app.css (:root / .dark), so it follows the light/dark theme. */

/* While the banner shows (this style block goes with it), reserve its height so it never hides content or focus. */
html {
    scroll-padding-bottom: var(--cookie-banner-height, 0px);
}

body {
    padding-bottom: var(--cookie-banner-height, 0px);
}

.cookies {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    /* Above the header (40) and callback FAB (30), below Radix dialog/sheet overlays (50) so an open modal is never covered. */
    z-index: 45;
    font-family: inherit;
    color: var(--foreground);
    -webkit-font-smoothing: antialiased;
}

/* Set by the package script once a choice is made (it removes the banner 210 ms later): the banner slides out below the edge.
   The transition sits on this class only, so the banner never slides in when the package removes the class on load. */
.cookies--closing {
    transform: translateY(100%);
    transition: transform 0.2s ease-in;
}

.cookies[hidden] {
    display: none;
}

.cookies__alert {
    max-height: 100vh;
    max-height: 100dvh;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    background: var(--background);
    border-top: 1px solid var(--border);
    box-shadow: 0 -12px 32px -16px rgb(0 0 0 / 0.18);
}

/* The package script animates the notice's height when the settings open; the notice stays, so its height is kept. */
.cookies__container {
    max-width: 1200px;
    height: auto !important;
    margin: 0 auto;
    padding: 16px 40px;
}

.cookies__wrapper {
    display: flex;
    align-items: center;
    gap: 12px 20px;
    flex-wrap: wrap;
}

.cookies__icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cookies__icon svg {
    width: 20px;
    height: 20px;
    color: var(--foreground);
}

.cookies__text {
    flex: 1;
    min-width: 280px;
}

.cookies__title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: -0.01em;
    color: var(--foreground);
    margin: 0 0 2px 0;
}

.cookies__intro {
    margin: 0;
    font-size: 14px;
    color: var(--muted-foreground);
    line-height: 1.5;
}

.cookies__intro a,
.cookies__details {
    color: var(--foreground);
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-color: var(--border);
    border-radius: 2px;
    transition: text-decoration-color 0.15s ease;
}

.cookies__intro a:hover,
.cookies__details:hover {
    text-decoration-color: currentColor;
}

.cookies__actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
}

.cookiesBtn {
    display: flex;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
}

.cookiesBtn__link,
.cookies__btn--customize {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 44px;
    padding: 0 18px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    border-radius: calc(var(--radius) - 2px);
    border: 1px solid transparent;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    text-decoration: none;
    white-space: nowrap;
}

.cookies__btn--customize {
    padding: 0 12px 0 14px;
    color: var(--muted-foreground);
}

.cookies__btn--customize:hover {
    color: var(--foreground);
    background: var(--muted);
}

.cookies__btn--customize svg {
    flex-shrink: 0;
    transition: transform 0.2s ease;
}

/* Settings open: the package script sets cookies--show; without JS the panel opens as the :target. */
.cookies--show .cookies__btn--customize,
.cookies:has(#cookies-policy-customize:target) .cookies__btn--customize {
    color: var(--foreground);
}

.cookies--show .cookies__btn--customize svg,
.cookies:has(#cookies-policy-customize:target) .cookies__btn--customize svg {
    transform: rotate(180deg);
}

.cookiesBtn--essentials .cookiesBtn__link {
    background: var(--background);
    color: var(--foreground);
    border-color: var(--border);
}

.cookiesBtn--essentials .cookiesBtn__link:hover {
    background: var(--muted);
}

.cookiesBtn--accept .cookiesBtn__link,
.cookies__save .cookiesBtn__link {
    background: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
}

.cookiesBtn--accept .cookiesBtn__link:hover,
.cookies__save .cookiesBtn__link:hover {
    background: color-mix(in oklab, var(--primary) 90%, transparent);
}

.cookies a:focus-visible,
.cookies button:focus-visible {
    outline: 3px solid color-mix(in oklab, var(--ring) 50%, transparent);
    outline-offset: 2px;
}

/* Collapsed panels are also hidden (not just clipped) so their links and checkboxes leave the tab order. */
.cookies__expandable {
    max-height: 0;
    overflow: hidden;
    visibility: hidden;
    transition: max-height 0.3s ease, visibility 0s linear 0.3s;
}

.cookies__expandable:target,
.cookies__expandable--open {
    max-height: 600px;
    visibility: visible;
    transition-delay: 0s;
}

.cookies__customize {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 40px 24px;
    border-top: 1px solid var(--border);
}

.cookies__sections {
    display: grid;
    gap: 0;
    margin-bottom: 20px;
    border: 1px solid var(--border);
}

.cookies__section {
    background: var(--background);
    padding: 16px;
}

.cookies__section + .cookies__section {
    border-top: 1px solid var(--border);
}

.cookies__category {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    cursor: pointer;
    flex-wrap: wrap;
    position: relative;
}

.cookies__category input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.cookies__category input[type="checkbox"] + .cookies__box::before {
    content: '';
    width: 16px;
    height: 16px;
    border: 1px solid var(--input);
    border-radius: 4px;
    background: var(--background);
    box-sizing: border-box;
    transition: background-color 0.15s ease, border-color 0.15s ease;
    position: absolute;
    left: 0;
    top: 2px;
}

.cookies__category input[type="checkbox"]:checked + .cookies__box::before {
    background: var(--primary);
    border-color: var(--primary);
}

.cookies__category input[type="checkbox"]:checked + .cookies__box::after {
    content: '';
    position: absolute;
    left: 5.5px;
    top: 4.5px;
    width: 5px;
    height: 8px;
    border: solid var(--primary-foreground);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.cookies__category input[type="checkbox"]:disabled + .cookies__box::before {
    opacity: 0.5;
    cursor: not-allowed;
}

.cookies__category input[type="checkbox"]:not(:disabled):hover + .cookies__box::before {
    border-color: var(--muted-foreground);
}

.cookies__category input[type="checkbox"]:focus-visible + .cookies__box::before {
    outline: 3px solid color-mix(in oklab, var(--ring) 50%, transparent);
    outline-offset: 2px;
}

.cookies__box {
    position: relative;
    padding-left: 28px;
    flex: 1;
    min-width: 200px;
}

.cookies__label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--foreground);
    margin-bottom: 2px;
}

.cookies__info {
    font-size: 13px;
    color: var(--muted-foreground);
    line-height: 1.55;
    margin: 0;
    flex-basis: 100%;
    padding-left: 28px;
}

/* A 44 px target around the link text. */
.cookies__details {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    margin-left: 28px;
    margin-bottom: -10px;
    font-size: 13px;
    font-weight: 500;
}

.cookies__definitions {
    list-style: none;
    padding: 12px 0 0 28px;
    margin: 0;
    display: grid;
    gap: 0;
}

.cookies__cookie {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px 16px;
    padding: 10px 12px;
    border: 1px solid var(--border);
}

.cookies__cookie + .cookies__cookie {
    border-top: 0;
}

.cookies__name {
    font-size: 13px;
    font-weight: 500;
    color: var(--foreground);
    margin: 0;
    overflow-wrap: anywhere;
}

.cookies__duration {
    font-size: 12px;
    color: var(--muted-foreground);
    margin: 0;
    text-align: right;
}

.cookies__description {
    grid-column: 1 / -1;
    font-size: 12px;
    color: var(--muted-foreground);
    margin: 0;
    line-height: 1.5;
}

.cookies__save {
    display: flex;
    justify-content: flex-end;
}

@media (prefers-reduced-motion: reduce) {
    .cookies,
    .cookies *,
    .cookies *::before,
    .cookies *::after {
        transition: none !important;
    }
}

/* Phones and small tablets: the sentence in the gutter, then the three actions as one strip, rail to rail, split by hairlines. */
@media (max-width: 768px) {
    .cookies__container {
        padding: 0;
    }

    .cookies__wrapper {
        display: block;
    }

    .cookies__icon {
        display: none;
    }

    /* Size set on the block too, so its line boxes are not as tall as the body text's. */
    .cookies__text {
        min-width: 0;
        padding: 14px 16px 12px;
        font-size: 14px;
        line-height: 1.5;
    }

    /* Run-in: the heading sentence in bold, the policy link right after it. */
    .cookies__title,
    .cookies__intro {
        display: inline;
        font-size: inherit;
        line-height: inherit;
    }

    .cookies__title {
        margin: 0;
        letter-spacing: 0;
    }

    /* The two choices share the width equally; the customize toggle takes what its label needs. */
    .cookies__actions {
        display: grid;
        grid-template-columns: auto 1fr 1fr;
        gap: 0;
        border-top: 1px solid var(--border);
    }

    .cookies__actions > * + * {
        border-left: 1px solid var(--border);
    }

    .cookies__actions > .cookiesBtn--accept {
        border-left-color: var(--primary);
    }

    .cookies__actions .cookiesBtn__link,
    .cookies__actions .cookies__btn--customize {
        min-height: 48px;
        padding: 0 10px;
        border: 0;
        border-radius: 0;
    }

    .cookies__actions .cookiesBtn__link {
        width: 100%;
    }

    .cookies__actions .cookies__btn--customize {
        gap: 4px;
        padding: 0 14px;
    }

    .cookies__actions .cookies__btn--customize svg {
        width: 14px;
        height: 14px;
    }

    /* Inset rings: the strip touches the screen edge, where an outer ring would be cut off. */
    .cookies__actions a:focus-visible,
    .cookies__actions button:focus-visible {
        outline: 2px solid var(--foreground);
        outline-offset: -4px;
    }

    .cookies__actions .cookiesBtn--accept button:focus-visible {
        outline-color: var(--primary-foreground);
    }

    .cookies__customize {
        padding: 16px;
    }

    .cookies__save .cookiesBtn__link {
        width: 100%;
    }

    .cookies__info {
        padding-left: 0;
    }

    .cookies__details {
        margin-left: 0;
    }

    .cookies__definitions {
        padding-left: 0;
    }
}

@media (max-width: 413px) {
    .cookies__actions .cookiesBtn__link,
    .cookies__actions .cookies__btn--customize {
        font-size: 13px;
    }

    .cookies__actions .cookies__btn--customize {
        padding: 0 12px;
    }
}

/* The narrowest phones: the labels wrap onto two lines inside the strip instead of overflowing it. */
@media (max-width: 339px) {
    .cookies__text {
        font-size: 13px;
    }

    .cookies__actions .cookiesBtn__link,
    .cookies__actions .cookies__btn--customize {
        white-space: normal;
        text-align: center;
    }

    .cookies__actions .cookies__btn--customize svg {
        display: none;
    }
}
</style>

<aside id="cookies-policy" class="cookies cookies--no-js" aria-labelledby="cookies-policy-title" data-text="{{ json_encode(__('cookieConsent::cookies.details')) }}">
    <div class="cookies__alert">
        <div class="cookies__container">
            <div class="cookies__wrapper">
                <div class="cookies__icon" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
                        <path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/>
                        <path d="M11 17v.01"/><path d="M7 14v.01"/>
                    </svg>
                </div>
                <div class="cookies__text">
                    <h2 class="cookies__title" id="cookies-policy-title">@lang('cookieConsent::cookies.title')</h2>
                    @if($policy)
                        <p class="cookies__intro">@lang('cookieConsent::cookies.link', ['url' => $policy])</p>
                    @endif
                </div>
                {{-- The customize toggle sits in the row with the two choices; the package script finds it by its class, wherever it is. --}}
                <div class="cookies__actions">
                    <a href="#cookies-policy-customize" class="cookies__btn cookies__btn--customize" aria-controls="cookies-policy-customize">
                        <span>@lang('cookieConsent::cookies.customize')</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </a>
                    @cookieconsentbutton(action: 'accept.essentials', label: __('cookieConsent::cookies.essentials'), attributes: ['class' => 'cookiesBtn cookiesBtn--essentials'])
                    @cookieconsentbutton(action: 'accept.all', label: __('cookieConsent::cookies.all'), attributes: ['class' => 'cookiesBtn cookiesBtn--accept'])
                </div>
            </div>
        </div>
        <div class="cookies__expandable cookies__expandable--custom" id="cookies-policy-customize">
            <form action="{{ route('cookieconsent.accept.configuration') }}" method="post" class="cookies__customize">
                @csrf
                <div class="cookies__sections">
                    @foreach($cookies->getCategories() as $category)
                    <div class="cookies__section">
                        <label for="cookies-policy-check-{{ $category->key() }}" class="cookies__category">
                            @if ($category->key() === 'essentials')
                                <input type="hidden" name="categories[]" value="{{ $category->key() }}" />
                                <input type="checkbox" name="categories[]" value="{{ $category->key() }}" id="cookies-policy-check-{{ $category->key() }}" checked="checked" disabled="disabled" />
                            @else
                                <input type="checkbox" name="categories[]" value="{{ $category->key() }}" id="cookies-policy-check-{{ $category->key() }}" />
                            @endif
                            <span class="cookies__box">
                                <strong class="cookies__label">{{ $category->title }}</strong>
                            </span>
                            @if($category->description)
                                <p class="cookies__info">{{ $category->description }}</p>
                            @endif
                        </label>

                        <div class="cookies__expandable" id="cookies-policy-{{ $category->key() }}">
                            <ul class="cookies__definitions">
                                @foreach($category->getCookies() as $cookie)
                                <li class="cookies__cookie">
                                    <p class="cookies__name">{{ $cookie->name }}</p>
                                    <p class="cookies__duration">{{ Carbon\Carbon::now()->diffForHumans(Carbon\Carbon::now()->addMinutes($cookie->duration), true) }}</p>
                                    @if($cookie->description)
                                        <p class="cookies__description">{{ $cookie->description }}</p>
                                    @endif
                                </li>
                                @endforeach
                            </ul>
                        </div>
                        <a href="#cookies-policy-{{ $category->key() }}" class="cookies__details">@lang('cookieConsent::cookies.details.more')</a>
                    </div>
                    @endforeach
                </div>
                <div class="cookies__save">
                    <button type="submit" class="cookiesBtn__link">@lang('cookieConsent::cookies.save')</button>
                </div>
            </form>
        </div>
    </div>
</aside>

<script data-cookie-consent nonce="{{ Vite::cspNonce() }}">
    {!! file_get_contents(LCC_ROOT . '/dist/script.js') !!}
</script>

<script data-cookie-consent nonce="{{ Vite::cspNonce() }}">
    {{-- Publish the banner's height as --cookie-banner-height while it shows, so page content, focused controls and the callback button stay above it. --}}
    {{-- Also: no entrance fade (the package fades the banner in on load; only closing slides it out), aria-expanded on the customize toggle, and focus kept on a toggle opened with Enter (the package blurs it). --}}
    (function () {
        var banner = document.getElementById('cookies-policy');
        var alert = banner && banner.querySelector('.cookies__alert');
        var customize = banner && banner.querySelector('.cookies__btn--customize');
        var root = document.documentElement;

        if (!alert) {
            return;
        }

        banner.classList.remove('cookies--closing');

        var resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(sync) : null;
        var mutationObserver = typeof MutationObserver === 'function' ? new MutationObserver(sync) : null;

        function sync() {
            if (!banner.isConnected || banner.hidden) {
                root.style.removeProperty('--cookie-banner-height');
                resizeObserver && resizeObserver.disconnect();
                mutationObserver && mutationObserver.disconnect();

                return;
            }

            root.style.setProperty('--cookie-banner-height', alert.offsetHeight + 'px');
            customize && customize.setAttribute('aria-expanded', banner.classList.contains('cookies--show') ? 'true' : 'false');
        }

        banner.querySelectorAll('.cookies__btn--customize, .cookies__details').forEach(function (toggle) {
            toggle.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    setTimeout(function () {
                        toggle.focus();
                    });
                }
            });
        });

        resizeObserver && resizeObserver.observe(alert);

        if (mutationObserver && banner.parentNode) {
            mutationObserver.observe(banner.parentNode, { childList: true });
            mutationObserver.observe(banner, { attributes: true, attributeFilter: ['hidden', 'class'] });
        }

        sync();
    })();
</script>
