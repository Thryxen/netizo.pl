{{-- Google Analytics 4, added by CookiesServiceProvider only once analytics cookies are accepted (the Consent Mode
     defaults are in app.blade.php). The tag loads after the page, so it never competes with the first screen. --}}
<script>
    (function (w, d) {
        w.dataLayer = w.dataLayer || [];
        w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
        w.gtag('consent', 'update', { analytics_storage: 'granted' });
        w.gtag('js', new Date());
        w.gtag('config', @json($measurementId));

        function load() {
            var script = d.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(@json($measurementId));
            d.head.appendChild(script);
        }

        d.readyState === 'complete' ? load() : w.addEventListener('load', load, { once: true });
    })(window, document);
</script>
