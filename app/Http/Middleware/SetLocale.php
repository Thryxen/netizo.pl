<?php

namespace App\Http\Middleware;

use App\Services\LocalizedRoutes;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Pick the language from the path: the English site lives under /en, everything else (the Polish site and the
     * admin panel) is Polish. Global and path-based rather than a route middleware, so responses produced before or
     * without a matched route (404, 405, the CSRF 419, the `forms` rate limiter) speak the visitor's language too.
     * The cookie banner links to the privacy policy in that language (the package renders `route()` of this name).
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        App::setLocale(LocalizedRoutes::localeFromPath($request));
        config(['cookieconsent.policy' => LocalizedRoutes::name('privacy')]);

        return $next($request);
    }
}
