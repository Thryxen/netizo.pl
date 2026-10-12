<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | URL configuration
    |--------------------------------------------------------------------------
    |
    | These values determine the package's API route URLs. Both values are
    | nullable and represent the same concepts as Laravel's routing parameters.
    |
    */

    'url' => [
        'domain' => null,
        'middleware' => [],
        'prefix' => 'cookie-consent',
    ],

    /*
    |--------------------------------------------------------------------------
    | Consent cookie configuration
    |--------------------------------------------------------------------------
    |
    | In order to keep track of the user's preferences, this package stores
    | an anonymized cookie. You do not need to register this cookie in the
    | package's cookie manager as it is done automatically (under "essentials").
    |
    | The duration parameter represents the cookie's lifetime in minutes.
    |
    | The domain parameter, when defined, determines the cookie's activity domain.
    | For multiple sub-domains, prefix your domain with "." (eg: ".mydomain.com").
    |
    */

    'cookie' => [
        'name' => Str::slug(env('APP_NAME', 'laravel'), '_').'_cookie_consent',
        'duration' => (60 * 24 * 365),
        'domain' => null,
    ],

    /*
    |--------------------------------------------------------------------------
    | Legal page configuration
    |--------------------------------------------------------------------------
    |
    | Most cookie notices display a link to a dedicated page explaining
    | the extended cookies usage policy. If your application has such a page
    | you can add its route name here.
    |
    | Set for every request to the privacy policy in the page's language
    | (`privacy` or `en.privacy`, App\Http\Middleware\SetLocale).
    |
    */

    'policy' => null,

    /*
    |--------------------------------------------------------------------------
    | Google Analytics 4 (loaded only with consent)
    |--------------------------------------------------------------------------
    |
    | The measurement ID. App\Providers\CookiesServiceProvider registers the
    | GA cookies under the "analytics" category and adds the tag once the
    | visitor accepts it. An empty ID leaves Google Analytics out entirely.
    |
    */
    'google_analytics' => [
        'id' => env('GOOGLE_ANALYTICS_ID', 'G-YP98QHKF97'),
    ],

];
