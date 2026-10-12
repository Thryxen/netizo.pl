<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use function Illuminate\Support\defer;

/**
 * IndexNow: tells Bing, Yandex and the other engines behind api.indexnow.org which pages were added, changed or removed,
 * so they recrawl them without waiting for the sitemap. The engines check the key (INDEXNOW_KEY) against the key file,
 * /{key}.txt (IndexNowKeyController), which proves the URLs are ours. Off until the key is set.
 */
class IndexNow
{
    private const ENDPOINT = 'https://api.indexnow.org/indexnow';

    /** A key the protocol accepts, also the constraint of the key file's route. */
    public const KEY_PATTERN = '[A-Za-z0-9-]{8,128}';

    public function isEnabled(): bool
    {
        return preg_match('/^'.self::KEY_PATTERN.'$/', (string) config('services.indexnow.key')) === 1;
    }

    /**
     * The key, or null when IndexNow is off (no key, or one the protocol would refuse).
     */
    public function key(): ?string
    {
        return $this->isEnabled() ? config('services.indexnow.key') : null;
    }

    /**
     * The URL of the key file, or null when IndexNow is off.
     */
    public function keyLocation(): ?string
    {
        $key = $this->key();

        return $key === null ? null : route('indexnow.key', ['key' => $key]);
    }

    /**
     * Submit the URLs now and return how many were sent: none while IndexNow is off or there is nothing to submit.
     *
     * @param  list<string>  $urls
     *
     * @throws ConnectionException when api.indexnow.org cannot be reached
     * @throws RequestException when it refuses the URLs (403: the key file is unreachable, 422: a URL is not on this host,
     *                          429: too many submissions)
     */
    public function submit(array $urls): int
    {
        $keyLocation = $this->keyLocation();
        $urls = array_values(array_unique($urls));

        if ($keyLocation === null || $urls === []) {
            return 0;
        }

        Http::timeout(10)->post(self::ENDPOINT, [
            'host' => parse_url($keyLocation, PHP_URL_HOST),
            'key' => $this->key(),
            'keyLocation' => $keyLocation,
            'urlList' => $urls,
        ])->throw();

        return count($urls);
    }

    /**
     * Submit the URLs once the response has been sent, so the admin panel does not wait for the search engines. A failure
     * is only logged: the sitemap's lastmod still tells crawlers about the change.
     *
     * @param  list<string>  $urls
     */
    public function submitAfterResponse(array $urls): void
    {
        if (! $this->isEnabled() || $urls === []) {
            return;
        }

        defer(function () use ($urls): void {
            try {
                $this->submit($urls);
            } catch (ConnectionException|RequestException $exception) {
                Log::warning('IndexNow submission failed', [
                    'status' => $exception instanceof RequestException ? $exception->response->status() : null,
                    'message' => $exception->getMessage(),
                ]);
            }
        });
    }
}
