<?php

namespace App\Services;

/**
 * Netizo's profiles on social networks and its Google Business Profile (config/socials.php, set through SOCIAL_*_URL in
 * .env). A network without a URL is left out of both the footer and the organization JSON-LD.
 */
class SocialProfiles
{
    /**
     * Configured profiles in the order of config/socials.php.
     *
     * @return list<array{network: string, url: string}>
     */
    public static function all(): array
    {
        return collect(config('socials'))
            ->filter(fn (?string $url): bool => filled($url))
            ->map(fn (string $url, string $network): array => ['network' => $network, 'url' => $url])
            ->values()
            ->all();
    }

    /**
     * URLs of the configured profiles, for the `sameAs` of the organization JSON-LD.
     *
     * @return list<string>
     */
    public static function urls(): array
    {
        return array_column(self::all(), 'url');
    }

    /**
     * The Google Business Profile (its address in Google Maps), the `hasMap` of the organization JSON-LD; null when
     * it is not configured.
     */
    public static function googleBusinessProfile(): ?string
    {
        $url = config('socials.google');

        return filled($url) ? $url : null;
    }
}
