<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" @class(['dark' => ($appearance ?? 'light') === 'dark'])>
<head>
    {{-- Trusted Types Policy for XSS Protection --}}
    <script nonce="{{ Vite::cspNonce() }}">
        if (window.trustedTypes && trustedTypes.createPolicy) {
            trustedTypes.createPolicy('default', {
                createHTML: (string) => string,
                createScriptURL: (string) => string,
                createScript: (string) => string,
            });
        }
    </script>
    {{-- Google Consent Mode v2: everything denied until the visitor accepts analytics cookies in the banner. Google
         Analytics is not loaded before that (CookiesServiceProvider adds it with the consent). --}}
    <script nonce="{{ Vite::cspNonce() }}">
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
        });
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="{{ ($appearance ?? 'light') === 'dark' ? '#0a0a0a' : '#ffffff' }}">
    <meta name="author" content="Netizo">

    {{-- Light by default; dark only when the visitor switched to it (cookie, or its localStorage copy when the cookie
         is gone). Set before first paint (no flash). --}}
    <script nonce="{{ Vite::cspNonce() }}">
        (function () {
            var dark = @json(($appearance ?? 'light') === 'dark');
            if (!@json($appearanceFromCookie ?? false)) {
                try {
                    dark = window.localStorage.getItem('appearance') === 'dark';
                } catch (e) {}
                if (dark) {
                    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
                        meta.content = '#0a0a0a';
                    });
                }
            }
            document.documentElement.classList.toggle('dark', dark);
            document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
        })();
    </script>
    {{-- Motion gate: CSS hides entrance-animated content only under html.js, so SSR/no-JS output stays visible.
         If the app has not booted in time (blocked or failed bundle), drop the gate so nothing stays hidden. --}}
    <script nonce="{{ Vite::cspNonce() }}">
        (function (root) {
            root.classList.add('js');
            window.setTimeout(function () {
                if (!root.hasAttribute('data-motion-ready')) {
                    root.classList.remove('js');
                }
            }, 5000);
        })(document.documentElement);
    </script>
    <style>
        html { background-color: oklch(1 0 0); }
        html.dark { background-color: oklch(0.145 0 0); }
    </style>

    {!! SEO::generate() !!}

    @isset($faqSchema)
        {{-- FAQ Schema --}}
        <script type="application/ld+json">
            {!! json_encode($faqSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}
        </script>
    @endisset

    {{-- Page JSON-LD with copy from the admin panel (e.g. a project's case study); JSON_HEX_TAG keeps it inside its tag. --}}
    @foreach ($schemas ?? [] as $schema)
        <script type="application/ld+json">
            {!! json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}
        </script>
    @endforeach

    {{-- Same icons as the client panel: the SVG follows the system light/dark theme; ?v busts old cached icons. --}}
    <link rel="icon" href="{{ asset('favicon.ico') }}?v=3" sizes="any" />
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}?v=3" />
    <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}?v=3" />
    <meta name="apple-mobile-web-app-title" content="Netizo.pl" />
    <link rel="manifest" href="{{ asset('manifest.webmanifest') }}?v=3" />

    {{-- Geist (latin + latin-ext for Polish) renders the first screen; fetch it with the CSS instead of after it. --}}
    @foreach (rescue(fn () => [
        Vite::asset('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2'),
        Vite::asset('node_modules/@fontsource-variable/geist/files/geist-latin-ext-wght-normal.woff2'),
    ], [], false) as $fontUrl)
        <link rel="preload" as="font" type="font/woff2" crossorigin href="{{ $fontUrl }}">
    @endforeach

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
    {{-- The cookie banner's script, written here because the package's own tag has no nonce (false leaves it out);
         the directive adds the tags of the cookies the visitor accepted. --}}
    <script src="{{ route('cookieconsent.script') }}?id={{ md5((string) filemtime(LCC_ROOT.'/dist/script.js')) }}" nonce="{{ Vite::cspNonce() }}" defer></script>
    @cookieconsentscripts(false)
</head>
<body>
    @inertia

    @cookieconsentview
</body>
</html>
