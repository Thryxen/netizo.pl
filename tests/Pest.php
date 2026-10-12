<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

/**
 * The value of one directive of a Content Security Policy, with its name ('' when the policy leaves it out).
 */
function cspDirective(string $policy, string $name): string
{
    foreach (explode(';', $policy) as $directive) {
        $directive = trim($directive);

        if ($directive === $name || str_starts_with($directive, $name.' ')) {
            return $directive;
        }
    }

    return '';
}

/**
 * The nonce a response's Content Security Policy lets scripts run with ('' when it has none).
 */
function scriptNonce(TestResponse $response): string
{
    $scriptSources = cspDirective((string) $response->headers->get('Content-Security-Policy'), 'script-src');

    return preg_match("/'nonce-([^']+)'/", $scriptSources, $matches) ? $matches[1] : '';
}
