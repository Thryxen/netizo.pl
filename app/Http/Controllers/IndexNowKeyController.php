<?php

namespace App\Http\Controllers;

use App\Services\IndexNow;
use Illuminate\Http\Response;

/**
 * The IndexNow key file, /{key}.txt: the engines fetch it to check that the URLs we submit are ours (App\Services\IndexNow).
 * Any other name, and every name while IndexNow is off, is a 404. Registered outside the web group (bootstrap/app.php):
 * no session cookie.
 */
class IndexNowKeyController extends Controller
{
    public function __invoke(IndexNow $indexNow, string $key): Response
    {
        $configuredKey = $indexNow->key();

        abort_unless($configuredKey !== null && hash_equals($configuredKey, $key), 404);

        return response($configuredKey)
            ->header('Content-Type', 'text/plain; charset=utf-8')
            ->header('Cache-Control', 'public, max-age=3600')
            ->header('X-Robots-Tag', 'noindex');
    }
}
