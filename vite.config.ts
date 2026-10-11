import inertia from '@inertiajs/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { readdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

/**
 * Every Inertia page is a build entry, not only a dynamic import of lib/pages.ts: a page chunk that also holds modules
 * shared with the parts it loads later (lib/deferred.tsx) would otherwise lose its own manifest entry, which `@vite` in
 * app.blade.php needs to preload the page.
 */
const pages = readdirSync(fileURLToPath(new URL('./resources/js/pages', import.meta.url)), { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.tsx'))
    .map((file) => `resources/js/pages/${file.replaceAll('\\', '/')}`);

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx', ...pages],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        inertia({
            ssr: {
                entry: 'resources/js/ssr.tsx',
                host: '127.0.0.1',
            },
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
    server: {
        watch: {
            ignored: ['**/.claude/**', '**/.idea/**', '**/vendor/**', '**/storage/**'],
        },
    },
});
