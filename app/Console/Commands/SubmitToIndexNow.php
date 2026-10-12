<?php

namespace App\Console\Commands;

use App\Services\IndexNow;
use App\Services\Sitemap;
use DateTimeImmutable;
use Illuminate\Console\Command;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Str;

class SubmitToIndexNow extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'indexnow:submit
        {urls?* : Adresy albo ścieżki stron (domyślnie wszystkie strony z sitemap.xml)}
        {--since= : Tylko strony z sitemap.xml zmienione od tego dnia (lastmod, RRRR-MM-DD)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Zgłasza strony do IndexNow (Bing, Yandex), np. po wdrożeniu zmian w treści';

    /**
     * Execute the console command.
     */
    public function handle(IndexNow $indexNow, Sitemap $sitemap): int
    {
        if (! $indexNow->isEnabled()) {
            $this->components->error('IndexNow jest wyłączony: ustaw INDEXNOW_KEY (8–128 liter, cyfr lub myślników).');

            return self::FAILURE;
        }

        $urls = $this->urls($sitemap);

        if ($urls === null) {
            return self::FAILURE;
        }

        if ($urls === []) {
            $this->components->info('Brak stron do zgłoszenia.');

            return self::SUCCESS;
        }

        try {
            $count = $indexNow->submit($urls);
        } catch (RequestException $exception) {
            $status = $exception->response->status();

            $this->components->error("IndexNow odrzucił zgłoszenie (HTTP {$status}).");

            if ($status === 403) {
                $this->components->info("Sprawdź, czy {$indexNow->keyLocation()} zwraca klucz.");
            }

            return self::FAILURE;
        } catch (ConnectionException $exception) {
            $this->components->error("Brak połączenia z IndexNow: {$exception->getMessage()}");

            return self::FAILURE;
        }

        $this->components->info("Zgłoszono stron: {$count}.");
        $this->components->bulletList(array_values(array_unique($urls)));

        return self::SUCCESS;
    }

    /**
     * The URLs given on the command line, or the pages of the sitemap (those changed since --since); null after an error.
     *
     * @return list<string>|null
     */
    private function urls(Sitemap $sitemap): ?array
    {
        $given = $this->argument('urls');
        $since = $this->option('since');

        if ($given !== [] && $since !== null) {
            $this->components->error('Podaj adresy albo --since, nie jedno i drugie.');

            return null;
        }

        if ($given !== []) {
            return array_map(fn (string $url): string => Str::startsWith($url, ['https://', 'http://']) ? $url : url($url), $given);
        }

        if ($since !== null && ! $this->isDate($since)) {
            $this->components->error("Nieprawidłowa data „{$since}”: podaj RRRR-MM-DD.");

            return null;
        }

        return collect($sitemap->entries())
            ->filter(fn (array $entry): bool => $since === null || $entry['lastmod'] >= $since)
            ->pluck('loc')
            ->values()
            ->all();
    }

    /**
     * Whether the value is a real day written as YYYY-MM-DD (the sitemap's lastmod format).
     */
    private function isDate(string $value): bool
    {
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);

        return $date !== false && $date->format('Y-m-d') === $value;
    }
}
