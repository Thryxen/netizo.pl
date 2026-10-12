<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

/**
 * The public site in two languages: Polish without a prefix (`/`, `/partnerzy`), English under /en (`/en`,
 * `/en/partners`). Every English route is named like its Polish twin with an `en.` prefix (`home` ↔ `en.home`).
 */
class LocalizedRoutes
{
    /** @var list<string> */
    public const LOCALES = ['pl', 'en'];

    /** The language served without a prefix, and the hreflang x-default. */
    public const DEFAULT_LOCALE = 'pl';

    /** @var array<string, string> Open Graph locale of each language. */
    public const OG_LOCALES = ['pl' => 'pl_PL', 'en' => 'en_US'];

    public static function localeFromPath(Request $request): string
    {
        return $request->is('en', 'en/*') ? 'en' : self::DEFAULT_LOCALE;
    }

    /**
     * Name of the route `$name` (a Polish route name such as `partners`) in the current language.
     */
    public static function name(string $name): string
    {
        return app()->getLocale() === self::DEFAULT_LOCALE ? $name : app()->getLocale().'.'.$name;
    }

    /**
     * URL of the page `$name` (a Polish route name such as `home`) in the current language. A page with parameters (a
     * case study's project) takes the same ones in every language.
     *
     * @param  array<string, mixed>  $parameters
     */
    public static function url(string $name, array $parameters = []): string
    {
        return route(self::name($name), $parameters);
    }

    /**
     * The current page in every language, keyed by locale, from the name of the matched route and its parameters (the
     * same in every language, e.g. a project's slug). Empty for a route without a name or without a twin in each language.
     *
     * @param  array<string, mixed>  $parameters
     * @return array<string, string>
     */
    public static function alternates(?string $routeName, array $parameters = []): array
    {
        if ($routeName === null) {
            return [];
        }

        $name = Str::startsWith($routeName, 'en.') ? Str::after($routeName, 'en.') : $routeName;
        $urls = [];

        foreach (self::LOCALES as $locale) {
            $localizedName = $locale === self::DEFAULT_LOCALE ? $name : "{$locale}.{$name}";

            if (! Route::has($localizedName)) {
                return [];
            }

            $urls[$locale] = route($localizedName, $parameters);
        }

        return $urls;
    }
}
