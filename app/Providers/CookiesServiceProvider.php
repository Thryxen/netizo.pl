<?php

namespace App\Providers;

use Whitecube\LaravelCookieConsent\Consent;
use Whitecube\LaravelCookieConsent\Cookie;
use Whitecube\LaravelCookieConsent\CookiesGroup;
use Whitecube\LaravelCookieConsent\CookiesServiceProvider as ServiceProvider;
use Whitecube\LaravelCookieConsent\Facades\Cookies;

class CookiesServiceProvider extends ServiceProvider
{
    /**
     * Define the cookies users should be aware of.
     */
    protected function registerCookies(): void
    {
        // Register Laravel's base cookies under the "required" cookies section:
        Cookies::essentials()
            ->session()
            ->csrf();

        $googleAnalyticsId = (string) config('cookieconsent.google_analytics.id');

        if ($googleAnalyticsId !== '') {
            Cookies::analytics()
                ->group(fn (CookiesGroup $group) => $this->googleAnalytics($group, $googleAnalyticsId));
        }
    }

    /**
     * Google Analytics 4: its cookies, and the tag only once they are accepted (Consent Mode defaults in app.blade.php).
     */
    protected function googleAnalytics(CookiesGroup $group, string $measurementId): void
    {
        $twoYears = 2 * 365 * 24 * 60;

        $group->name('ga')
            ->cookie(fn (Cookie $cookie) => $cookie->name('_ga')
                ->duration($twoYears)
                ->description(__('cookieConsent::cookies.defaults._ga')))
            ->cookie(fn (Cookie $cookie) => $cookie->name('_ga_'.strtoupper(preg_replace('/^G-/', '', $measurementId)))
                ->duration($twoYears)
                ->description(__('cookieConsent::cookies.defaults._ga_ID')))
            ->accepted(fn (Consent $consent) => $consent
                ->script(view('analytics.google', ['measurementId' => $measurementId])->render()));
    }
}
