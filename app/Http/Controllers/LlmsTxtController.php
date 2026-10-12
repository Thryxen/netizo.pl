<?php

namespace App\Http\Controllers;

use App\Services\LlmsTxt;
use Illuminate\Http\Response;

/**
 * llms.txt, built on every request from the copy and the active projects (App\Services\LlmsTxt), so it never falls behind
 * the pages. Registered outside the web group (bootstrap/app.php): no session cookie. Google Search ignores the file;
 * `noindex` keeps the raw text out of search results, where it would only stand in for the pages it describes.
 */
class LlmsTxtController extends Controller
{
    public function __invoke(LlmsTxt $llmsTxt): Response
    {
        return response($llmsTxt->render())
            ->header('Content-Type', 'text/plain; charset=utf-8')
            ->header('Cache-Control', 'public, max-age=3600')
            ->header('X-Robots-Tag', 'noindex');
    }
}
