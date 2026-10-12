<?php

/*
|--------------------------------------------------------------------------
| Social Profiles
|--------------------------------------------------------------------------
|
| Netizo's profiles, linked from the footer of the public site and listed
| as `sameAs` in the organization JSON-LD (App\Services\SocialProfiles).
| The footer follows this order; an empty URL hides the network. A new
| network also needs its icon and name in
| resources/js/components/home/social-icon.tsx and lib/site.ts.
|
| `google` is the Google Business Profile (its address in Google Maps),
| also the organization's `hasMap`.
|
*/

return [
    'facebook' => env('SOCIAL_FACEBOOK_URL'),
    'instagram' => env('SOCIAL_INSTAGRAM_URL'),
    'tiktok' => env('SOCIAL_TIKTOK_URL'),
    'youtube' => env('SOCIAL_YOUTUBE_URL'),
    'linkedin' => env('SOCIAL_LINKEDIN_URL'),
    'discord' => env('SOCIAL_DISCORD_URL'),
    'google' => env('SOCIAL_GOOGLE_URL'),
];
