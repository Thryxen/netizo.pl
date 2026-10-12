{{-- Google Analytics 4, added by CookiesServiceProvider only once analytics cookies are accepted (the Consent Mode
     defaults are in app.blade.php). A file, not inline code: the banner adds this tag to a page that was rendered with
     another nonce, and the page's CSP lets it run only because the banner's own (nonced) script adds it. --}}
<script src="{{ asset('assets/js/google-analytics.js') }}?v={{ substr(md5_file(public_path('assets/js/google-analytics.js')), 0, 8) }}" data-measurement-id="{{ $measurementId }}" nonce="{{ Vite::cspNonce() }}" defer></script>
