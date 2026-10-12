<?php

namespace App\Http\Controllers;

use App\Services\LocalizedRoutes;
use App\Services\StructuredData;
use Carbon\CarbonImmutable;
use Illuminate\Http\Response;

/**
 * /.well-known/security.txt (RFC 9116): where to report a vulnerability. Built on every request: the contact is the
 * address on the pages (StructuredData::EMAIL) and Expires keeps moving ahead, so the file never goes stale while the
 * site runs. Not signed (no OpenPGP key). Registered outside the web group (bootstrap/app.php): no session cookie.
 */
class SecurityTxtController extends Controller
{
    /** How long the file stays valid; RFC 9116 recommends less than a year. */
    private const VALID_FOR_MONTHS = 6;

    public function __invoke(): Response
    {
        $fields = [
            'Contact' => 'mailto:'.StructuredData::EMAIL,
            'Expires' => CarbonImmutable::today('UTC')->addMonths(self::VALID_FOR_MONTHS)->toIso8601ZuluString(),
            'Preferred-Languages' => implode(', ', LocalizedRoutes::LOCALES),
            'Canonical' => route('security-txt'),
        ];

        $content = collect($fields)->map(fn (string $value, string $field): string => "{$field}: {$value}\n")->implode('');

        return response($content)
            ->header('Content-Type', 'text/plain; charset=utf-8')
            ->header('Cache-Control', 'public, max-age=3600')
            ->header('X-Robots-Tag', 'noindex');
    }
}
