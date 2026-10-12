<?php

use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use App\Services\IndexNow;
use Illuminate\Http\Client\Request;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

const INDEXNOW_TEST_KEY = 'b6f1c2d94e7a4f0c8a3d5e9f1b2c7d40';

beforeEach(function () {
    $this->withoutVite();
    config(['services.indexnow.key' => INDEXNOW_TEST_KEY]);

    // IndexNow's answer to every submission; a test that needs another one replaces it (a second fake would never match).
    $this->indexNowAnswer = fn () => Http::response('', 200);
    Http::fake(['api.indexnow.org/*' => fn () => ($this->indexNowAnswer)()]);
});

/**
 * The URL lists sent to IndexNow, one per submission.
 *
 * @return list<list<string>>
 */
function indexNowSubmissions(): array
{
    return Http::recorded()->map(fn (array $pair): array => $pair[0]->data()['urlList'])->values()->all();
}

/**
 * The pages that list projects, in both languages, in the order the panel sends them.
 *
 * @return list<string>
 */
function projectListingUrls(): array
{
    return [url('/'), url('/en'), url('/realizacje'), url('/en/projects'), url('/o-nas'), url('/en/about')];
}

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function indexNowProjectPayload(array $overrides = []): array
{
    return array_merge([
        'title' => 'Złoty Kłos',
        'slug' => 'zloty-klos',
        'url' => 'zlotyklos.pl',
        'category' => 'Strona firmowa',
        'sort_order' => 1,
        'is_active' => true,
        'description' => 'Krótki opis projektu.',
        'full_description' => 'Pełny opis projektu.',
        'tech_stack' => ['Laravel'],
        'metrics' => [['value' => '+40%', 'label' => 'Konwersja']],
        'challenges' => ['Integracja z systemem klienta'],
        'solutions' => ['Dedykowane API'],
    ], $overrides);
}

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function indexNowClientPayload(array $overrides = []): array
{
    return array_merge(['name' => 'CloudInc', 'url' => 'https://cloudinc.pl', 'sort_order' => 1, 'is_active' => true], $overrides);
}

describe('key file', function () {
    it('serves the key at /{key}.txt as plain text', function () {
        $this->get('/'.INDEXNOW_TEST_KEY.'.txt')
            ->assertOk()
            ->assertHeader('Content-Type', 'text/plain; charset=utf-8')
            ->assertHeader('X-Robots-Tag', 'noindex')
            ->assertCookieMissing(config('session.cookie'))
            ->assertCookieMissing('XSRF-TOKEN');

        expect($this->get('/'.INDEXNOW_TEST_KEY.'.txt')->getContent())->toBe(INDEXNOW_TEST_KEY)
            ->and(app(IndexNow::class)->keyLocation())->toBe(url('/'.INDEXNOW_TEST_KEY.'.txt'));
    });

    it('answers 404 for any other name', function (string $path) {
        $this->get($path)->assertNotFound();
    })->with([
        'another key' => '/a1b2c3d4e5f6a7b8.txt',
        'the key in another case' => '/'.strtoupper(INDEXNOW_TEST_KEY).'.txt',
        'security.txt outside .well-known' => '/security.txt',
    ]);

    it('answers 404 while IndexNow is off', function (?string $key) {
        config(['services.indexnow.key' => $key]);

        $this->get('/'.INDEXNOW_TEST_KEY.'.txt')->assertNotFound();
        expect(app(IndexNow::class)->isEnabled())->toBeFalse()
            ->and(app(IndexNow::class)->keyLocation())->toBeNull();
    })->with([
        'no key' => null,
        'empty key' => '',
        'too short' => 'abc123',
        'not allowed characters' => 'klucz_z_podkreslnikami',
    ]);

    it('leaves the other text files to their own routes', function () {
        $this->get('/llms.txt')->assertOk()->assertSee('# Netizo');
        $this->get('/.well-known/security.txt')->assertOk()->assertSee('Contact: mailto:');
    });
});

describe('submission', function () {
    it('posts the host, the key, the key file and the URLs once each', function () {
        $count = app(IndexNow::class)->submit([url('/'), url('/en'), url('/')]);

        expect($count)->toBe(2);

        Http::assertSentCount(1);
        Http::assertSent(fn (Request $request): bool => $request->method() === 'POST'
            && $request->url() === 'https://api.indexnow.org/indexnow'
            && $request->isJson()
            && $request->data() === [
                'host' => parse_url(url('/'), PHP_URL_HOST),
                'key' => INDEXNOW_TEST_KEY,
                'keyLocation' => url('/'.INDEXNOW_TEST_KEY.'.txt'),
                'urlList' => [url('/'), url('/en')],
            ]);
    });

    it('treats 202 (key validation pending) as accepted', function () {
        $this->indexNowAnswer = fn () => Http::response('', 202);

        expect(app(IndexNow::class)->submit([url('/')]))->toBe(1);
    });

    it('sends nothing while IndexNow is off or there is nothing to submit', function () {
        expect(app(IndexNow::class)->submit([]))->toBe(0);

        config(['services.indexnow.key' => null]);

        expect(app(IndexNow::class)->submit([url('/')]))->toBe(0);
        Http::assertNothingSent();
    });

    it('throws when IndexNow refuses the URLs', function () {
        $this->indexNowAnswer = fn () => Http::response('', 403);

        app(IndexNow::class)->submit([url('/')]);
    })->throws(RequestException::class);
});

describe('admin panel', function () {
    beforeEach(function () {
        $this->actingAs(User::factory()->create());
    });

    it('announces a new public project: its case study and the pages that list projects', function () {
        $this->post(route('admin.projects.store'), indexNowProjectPayload())->assertSessionHasNoErrors();

        expect(indexNowSubmissions())->toBe([
            [url('/realizacje/zloty-klos'), url('/en/projects/zloty-klos'), ...projectListingUrls()],
        ]);
    });

    it('announces a renamed project at its old and new address', function () {
        $project = Project::factory()->create(['slug' => 'stary-adres']);

        $this->put(route('admin.projects.update', $project), indexNowProjectPayload(['slug' => 'nowy-adres']))
            ->assertSessionHasNoErrors();

        expect(indexNowSubmissions())->toBe([[
            url('/realizacje/stary-adres'), url('/en/projects/stary-adres'),
            url('/realizacje/nowy-adres'), url('/en/projects/nowy-adres'),
            ...projectListingUrls(),
        ]]);
    });

    it('announces a project being hidden or shown again', function (bool $wasActive) {
        $project = Project::factory()->create(['slug' => 'zloty-klos', 'is_active' => $wasActive]);

        $this->put(route('admin.projects.update', $project), indexNowProjectPayload(['is_active' => ! $wasActive]))
            ->assertSessionHasNoErrors();

        expect(indexNowSubmissions())->toBe([
            [url('/realizacje/zloty-klos'), url('/en/projects/zloty-klos'), ...projectListingUrls()],
        ]);
    })->with(['hidden' => true, 'shown' => false]);

    it('announces a deleted public project', function () {
        $project = Project::factory()->create(['slug' => 'zloty-klos']);

        $this->delete(route('admin.projects.destroy', $project))->assertRedirect();

        expect(indexNowSubmissions())->toBe([
            [url('/realizacje/zloty-klos'), url('/en/projects/zloty-klos'), ...projectListingUrls()],
        ]);
    });

    it('announces only the public ones of many deleted projects', function () {
        $public = Project::factory()->create(['slug' => 'publiczny']);
        $hidden = Project::factory()->inactive()->create(['slug' => 'ukryty']);

        $this->delete(route('admin.projects.destroy-many'), ['ids' => [$public->id, $hidden->id]])->assertRedirect();

        expect(indexNowSubmissions())->toBe([
            [url('/realizacje/publiczny'), url('/en/projects/publiczny'), ...projectListingUrls()],
        ]);
    });

    it('sends nothing for changes to hidden projects or to the order', function () {
        $hidden = Project::factory()->inactive()->create();
        [$first, $second] = Project::factory()->count(2)->create();

        $this->post(route('admin.projects.store'), indexNowProjectPayload(['is_active' => false]))->assertSessionHasNoErrors();
        $this->put(route('admin.projects.update', $hidden), indexNowProjectPayload(['slug' => 'inny', 'is_active' => false]))
            ->assertSessionHasNoErrors();
        $this->delete(route('admin.projects.destroy-many'), ['ids' => [$hidden->id]])->assertRedirect();
        $this->post(route('admin.projects.reorder'), ['ids' => [$second->id, $first->id]])->assertSessionHasNoErrors();

        Http::assertNothingSent();
    });

    it('announces the home page when a public client changes', function () {
        $client = Client::factory()->create();
        $hidden = Client::factory()->inactive()->create();

        $this->post(route('admin.clients.store'), indexNowClientPayload())->assertSessionHasNoErrors();
        $this->put(route('admin.clients.update', $hidden), indexNowClientPayload(['name' => 'Pokazany']))->assertSessionHasNoErrors();
        $this->put(route('admin.clients.update', $client), indexNowClientPayload(['name' => 'Ukryty', 'is_active' => false]))
            ->assertSessionHasNoErrors();
        $this->delete(route('admin.clients.destroy-many'), ['ids' => [$client->id, $hidden->id]])->assertRedirect();

        expect(indexNowSubmissions())->toBe(array_fill(0, 4, [url('/'), url('/en')]));
    });

    it('sends nothing for changes to hidden clients or to the order', function () {
        $hidden = Client::factory()->inactive()->create();
        [$first, $second] = Client::factory()->count(2)->create();

        $this->post(route('admin.clients.store'), indexNowClientPayload(['is_active' => false]))->assertSessionHasNoErrors();
        $this->put(route('admin.clients.update', $hidden), indexNowClientPayload(['is_active' => false]))->assertSessionHasNoErrors();
        $this->delete(route('admin.clients.destroy', $hidden))->assertRedirect();
        $this->post(route('admin.clients.reorder'), ['ids' => [$second->id, $first->id]])->assertSessionHasNoErrors();

        Http::assertNothingSent();
    });

    it('sends nothing while IndexNow is off', function () {
        config(['services.indexnow.key' => null]);

        $this->post(route('admin.projects.store'), indexNowProjectPayload())->assertSessionHasNoErrors();
        $this->post(route('admin.clients.store'), indexNowClientPayload())->assertSessionHasNoErrors();

        Http::assertNothingSent();
    });

    it('saves the change and only logs a failed submission', function (Closure $answer, ?int $status) {
        $this->indexNowAnswer = $answer;
        Log::spy();

        $this->post(route('admin.projects.store'), indexNowProjectPayload())
            ->assertRedirect(route('admin.projects.index'))
            ->assertSessionHas('success');

        expect(Project::query()->where('slug', 'zloty-klos')->exists())->toBeTrue();
        Log::shouldHaveReceived('warning')->once()
            ->withArgs(fn (string $message, array $context): bool => $message === 'IndexNow submission failed' && $context['status'] === $status);
    })->with([
        'refused' => [fn () => Http::response('', 429), 429],
        'unreachable' => [fn () => Http::failedConnection(), null],
    ]);
});

describe('indexnow:submit', function () {
    it('submits every page of the sitemap', function () {
        Project::factory()->create(['slug' => 'zloty-klos']);

        $this->artisan('indexnow:submit')
            ->expectsOutputToContain('Zgłoszono stron: 16.')
            ->assertSuccessful();

        $locs = [];

        foreach (simplexml_load_string($this->get('/sitemap.xml')->getContent())->url as $entry) {
            $locs[] = (string) $entry->loc;
        }

        expect(indexNowSubmissions())->toBe([$locs])
            ->and($locs)->toHaveCount(16)->toContain(url('/realizacje/zloty-klos'), url('/en/projects/zloty-klos'));
    });

    it('submits only the pages of the sitemap changed since a day', function () {
        $this->travelTo('2030-03-01 12:00:00');
        Project::factory()->create(['slug' => 'zloty-klos']);

        $this->artisan('indexnow:submit', ['--since' => '2030-03-01'])->assertSuccessful();

        expect(indexNowSubmissions())->toBe([
            [...projectListingUrls(), url('/realizacje/zloty-klos'), url('/en/projects/zloty-klos')],
        ]);
    });

    it('submits nothing when no page changed since that day', function () {
        $this->artisan('indexnow:submit', ['--since' => '2099-01-01'])
            ->expectsOutputToContain('Brak stron do zgłoszenia.')
            ->assertSuccessful();

        Http::assertNothingSent();
    });

    it('submits the pages given as paths or URLs', function () {
        $this->artisan('indexnow:submit', ['urls' => ['/partnerzy', url('/en/partners')]])->assertSuccessful();

        expect(indexNowSubmissions())->toBe([[url('/partnerzy'), url('/en/partners')]]);
    });

    it('refuses wrong options and sends nothing', function (array $parameters, string $message) {
        $this->artisan('indexnow:submit', $parameters)
            ->expectsOutputToContain($message)
            ->assertFailed();

        Http::assertNothingSent();
    })->with([
        'not a day' => [['--since' => '2030-02-30'], 'Nieprawidłowa data'],
        'not a date' => [['--since' => 'wczoraj'], 'Nieprawidłowa data'],
        'urls and --since' => [['urls' => ['/'], '--since' => '2030-01-01'], 'nie jedno i drugie'],
    ]);

    it('fails without a key', function () {
        config(['services.indexnow.key' => null]);

        $this->artisan('indexnow:submit')
            ->expectsOutputToContain('ustaw INDEXNOW_KEY')
            ->assertFailed();

        Http::assertNothingSent();
    });

    it('fails when IndexNow refuses the URLs and points to the key file on 403', function () {
        $this->indexNowAnswer = fn () => Http::response('', 403);

        $this->artisan('indexnow:submit', ['urls' => ['/']])
            ->expectsOutputToContain('HTTP 403')
            ->expectsOutputToContain(url('/'.INDEXNOW_TEST_KEY.'.txt'))
            ->assertFailed();
    });

    it('fails when IndexNow cannot be reached', function () {
        $this->indexNowAnswer = fn () => Http::failedConnection();

        $this->artisan('indexnow:submit', ['urls' => ['/']])
            ->expectsOutputToContain('Brak połączenia z IndexNow')
            ->assertFailed();
    });
});
