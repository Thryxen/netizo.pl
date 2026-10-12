// Google Analytics 4, added only once analytics cookies are accepted (resources/views/analytics/google.blade.php;
// the Consent Mode defaults are in app.blade.php). The measurement ID comes from the tag's data-measurement-id.
// The tag loads after the page, so it never competes with the first screen.
(function (w, d, script) {
    var measurementId = script && script.getAttribute('data-measurement-id');

    if (!measurementId) {
        return;
    }

    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
    w.gtag('consent', 'update', { analytics_storage: 'granted' });
    w.gtag('js', new Date());
    w.gtag('config', measurementId);

    function load() {
        var tag = d.createElement('script');
        tag.async = true;
        tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
        d.head.appendChild(tag);
    }

    d.readyState === 'complete' ? load() : w.addEventListener('load', load, { once: true });
})(window, document, document.currentScript);
