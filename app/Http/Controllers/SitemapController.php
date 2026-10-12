<?php

namespace App\Http\Controllers;

use App\Services\Sitemap;
use Illuminate\Http\Response;

/**
 * sitemap.xml, built on every request from the routes and the active projects (App\Services\Sitemap), so a project
 * added in the admin panel is listed at once. Registered outside the web group (bootstrap/app.php): no session cookie.
 */
class SitemapController extends Controller
{
    public function __invoke(Sitemap $sitemap): Response
    {
        return response()
            ->view('sitemap', ['entries' => $sitemap->entries()])
            ->header('Content-Type', 'application/xml; charset=utf-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
