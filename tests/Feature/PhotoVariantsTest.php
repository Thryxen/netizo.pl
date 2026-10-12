<?php

/**
 * The photo series and its variant widths as declared in resources/js/lib/photos.ts (PHOTOS, PHOTO_WIDTHS). Plain
 * paths, not resource_path(): the dataset is read before the application boots.
 *
 * @return array{photos: array<string, array{string, int, int}>, widths: list<int>}
 */
function photoSeriesFromSource(): array
{
    $source = file_get_contents(dirname(__DIR__, 2).'/resources/js/lib/photos.ts');

    preg_match_all("/'([a-z0-9-]+)': \{ width: (\d+), height: (\d+) \}/", $source, $photos, PREG_SET_ORDER);
    preg_match('/const PHOTO_WIDTHS = \[([\d, ]+)\]/', $source, $widths);

    return [
        'photos' => collect($photos)->mapWithKeys(fn (array $match): array => [$match[1] => [$match[1], (int) $match[2], (int) $match[3]]])->all(),
        'widths' => array_map('intval', explode(',', $widths[1])),
    ];
}

it('declares the small variants the phone mock-up slots need', function () {
    expect(photoSeriesFromSource()['widths'])->toBe([256, 384, 768])
        ->and(photoSeriesFromSource()['photos'])->not->toBeEmpty();
});

it('ships every photo of the series at its native size and in every srcset width', function (string $name, int $width, int $height) {
    $directory = public_path('assets/images/photos');

    expect(array_slice(getimagesize("{$directory}/{$name}.webp"), 0, 2))->toBe([$width, $height]);

    foreach (photoSeriesFromSource()['widths'] as $variantWidth) {
        $variant = "{$directory}/{$name}-{$variantWidth}.webp";

        expect($variant)->toBeFile()
            ->and(array_slice(getimagesize($variant), 0, 2))->toBe([$variantWidth, (int) round($height * $variantWidth / $width)])
            ->and(filesize($variant))->toBeLessThan($variantWidth <= 384 ? 40 * 1024 : 200 * 1024);
    }
})->with(photoSeriesFromSource()['photos']);

it('ships no photo outside the series', function () {
    $series = photoSeriesFromSource();

    $expected = collect($series['photos'])->keys()
        ->flatMap(fn (string $name): array => ["{$name}.webp", ...array_map(fn (int $width): string => "{$name}-{$width}.webp", $series['widths'])])
        ->sort()->values()->all();

    $shipped = collect(glob(public_path('assets/images/photos/*')))->map(fn (string $path): string => basename($path))
        ->sort()->values()->all();

    expect($shipped)->toBe($expected);
});
