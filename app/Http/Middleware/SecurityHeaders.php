<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // A new nonce per response, before the views render: @vite adds it to its tags, Blade to the inline scripts.
        $nonce = Vite::useCspNonce();

        $response = $next($request);

        // Build CSP with Trusted Types
        $csp = $this->buildContentSecurityPolicy($nonce, $request->is('admin', 'admin/*'));

        $response->headers->set('Content-Security-Policy', $csp);

        // Additional security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return $response;
    }

    /**
     * Build Content Security Policy header value.
     */
    private function buildContentSecurityPolicy(string $nonce, bool $isAdmin): string
    {
        $devServer = $this->viteDevServerSources();

        // Third parties: Google Analytics on the public site (after consent), Cloudflare Turnstile on the admin login
        $scriptHosts = $isAdmin ? ' https://challenges.cloudflare.com' : ' https://www.googletagmanager.com';
        $connectHosts = $isAdmin ? '' : ' https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com';
        $frameHosts = $isAdmin ? ' https://challenges.cloudflare.com' : ' https://www.googletagmanager.com';

        $directives = [
            // Default fallback
            "default-src 'self'",

            // Scripts - only those with this response's nonce and the scripts they add ('strict-dynamic'); browsers
            // that support 'strict-dynamic' ignore 'self' and the hosts, which are the fallback for older ones
            "script-src 'nonce-{$nonce}' 'strict-dynamic' 'self'".$scriptHosts.$devServer['http'],

            // Styles - allow inline for React style attributes and the <style> blocks of the views
            "style-src 'self' 'unsafe-inline'".$devServer['http'],

            // Images
            "img-src 'self' data: https: blob:".$devServer['http'],

            // Fonts (self-hosted)
            "font-src 'self'".$devServer['http'],

            // Connect (XHR, fetch, WebSocket)
            "connect-src 'self'".$connectHosts.$devServer['http'].$devServer['ws'],

            // Frames
            "frame-src 'self'".$frameHosts,

            // Child/worker
            "child-src 'self' blob:",

            // Object (plugins)
            "object-src 'none'",

            // Base URI
            "base-uri 'self'",

            // Form actions
            "form-action 'self'",

            // Frame ancestors (prevents clickjacking)
            "frame-ancestors 'self'",

            // Trusted Types for DOM XSS protection
            "require-trusted-types-for 'script'",

            // Trusted Types policy - allow default policy for GTM
            'trusted-types default dompurify gtm',
        ];

        return implode('; ', $directives);
    }

    /**
     * Extra CSP sources for the Vite dev server (HMR), only while it is running hot.
     *
     * @return array{http: string, ws: string}
     */
    private function viteDevServerSources(): array
    {
        if (! Vite::isRunningHot()) {
            return ['http' => '', 'ws' => ''];
        }

        $hotUrl = trim((string) @file_get_contents(Vite::hotFile()));
        $parts = parse_url($hotUrl);

        if (! is_array($parts) || ! isset($parts['host'])) {
            return ['http' => '', 'ws' => ''];
        }

        $host = $parts['host'];
        $port = isset($parts['port']) ? ':'.$parts['port'] : '';
        $hosts = in_array($host, ['[::1]', '::1', '127.0.0.1', 'localhost'], true)
            ? ['localhost', '127.0.0.1', '[::1]']
            : [$host];

        $http = [];
        $ws = [];

        foreach ($hosts as $candidate) {
            $http[] = "http://{$candidate}{$port}";
            $http[] = "https://{$candidate}{$port}";
            $ws[] = "ws://{$candidate}{$port}";
            $ws[] = "wss://{$candidate}{$port}";
        }

        return [
            'http' => ' '.implode(' ', $http),
            'ws' => ' '.implode(' ', $ws),
        ];
    }
}
