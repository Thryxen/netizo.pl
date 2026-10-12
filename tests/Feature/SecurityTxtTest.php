<?php

use App\Services\StructuredData;
use Carbon\CarbonImmutable;

/**
 * The file's fields in order, as [name, value] pairs.
 *
 * @return list<array{0: string, 1: string}>
 */
function securityTxtFields(): array
{
    $content = test()->get('/.well-known/security.txt')->assertOk()->getContent();

    return array_map(
        fn (string $line): array => explode(': ', $line, 2),
        explode("\n", rtrim($content, "\n")),
    );
}

it('is served by the application as plain text under .well-known', function () {
    expect(public_path('.well-known/security.txt'))->not->toBeFile()
        ->and(public_path('security.txt'))->not->toBeFile();

    $this->get('/.well-known/security.txt')
        ->assertOk()
        ->assertHeader('Content-Type', 'text/plain; charset=utf-8')
        ->assertHeader('X-Robots-Tag', 'noindex')
        ->assertCookieMissing(config('session.cookie'))
        ->assertCookieMissing('XSRF-TOKEN');
});

it('names the contact address, the languages and its own address, each once', function () {
    $fields = securityTxtFields();

    expect(array_column($fields, 0))->toBe(['Contact', 'Expires', 'Preferred-Languages', 'Canonical'])
        ->and(array_column($fields, 1, 0))->toMatchArray([
            'Contact' => 'mailto:'.StructuredData::EMAIL,
            'Preferred-Languages' => 'pl, en',
            'Canonical' => url('/.well-known/security.txt'),
        ]);
});

it('ends every line with a line feed and has no blank lines', function () {
    $content = $this->get('/.well-known/security.txt')->getContent();

    expect($content)->toEndWith("\n")->not->toContain("\n\n")->not->toContain("\r");
});

it('expires in less than a year, and the date moves on with time, so the file never goes stale', function () {
    $this->travelTo(CarbonImmutable::parse('2026-10-12 15:30:00', 'UTC'));

    $expires = array_column(securityTxtFields(), 1, 0)['Expires'];

    expect($expires)->toBe('2027-04-12T00:00:00Z')
        ->and(CarbonImmutable::parse($expires)->isFuture())->toBeTrue()
        ->and(CarbonImmutable::parse($expires)->lessThan(now()->addYear()))->toBeTrue();

    $this->travelTo(CarbonImmutable::parse('2027-09-01 08:00:00', 'UTC'));

    expect(array_column(securityTxtFields(), 1, 0)['Expires'])->toBe('2028-03-01T00:00:00Z');
});
