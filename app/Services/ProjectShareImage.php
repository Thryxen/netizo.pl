<?php

namespace App\Services;

use App\Models\Project;
use GdImage;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Image;
use Intervention\Image\ImageManager;

/**
 * The link preview (og:image, twitter:image) of a project's case study: a 1200 × 630 JPEG in the frame of the site's
 * other share images (netizo/og-image: hairlines, rails with rivets, the logo top left, the address in mono at the
 * bottom), with the project's name and type on the left and the top of its site in a browser window on the right.
 *
 * Drawn the first time the case study is shown and kept on the public disk under a name hashed from what it shows, so
 * an edit in the panel gives the preview a new address (link previews are cached by URL) and the old file is removed.
 * Fonts and the logo live in resources/og/ (Geist, OFL; the logo rendered from netizo/wizytowki/logo.svg at 72 px).
 */
class ProjectShareImage
{
    public const WIDTH = 1200;

    public const HEIGHT = 630;

    /** Bump to redraw every preview after a change of the layout below. */
    private const LAYOUT_VERSION = 3;

    private const DIRECTORY = 'projects/share';

    /** The frame of netizo/og-image/szablon-o-nas.html: rails, the column line, the content inset and the two hairlines. */
    private const RAIL_X = 64;

    private const COLUMN_X = 680;

    private const CONTENT_X = 104;

    private const LINE_TOP = 140;

    private const LINE_BOTTOM = 500;

    private const BAR_HEIGHT = 44;

    /** Width of the left column's text: from the content inset to 40 px before the column line. */
    private const TEXT_WIDTH = 536;

    private const INK = '#0a0a0a';

    private const MUTED = '#6e6e6e';

    private const LINE = '#d6d6d6';

    private const RIVET = '#b3b3b3';

    private const BAR = '#f5f5f5';

    private const DOT = '#c4c4c4';

    /**
     * URL of the preview of the case study in the current language, drawn first when needed. Null for a project without
     * a screenshot on the disk (the page then shares the list's image).
     *
     * @param  string  $category  The project's type in the current language.
     * @param  string  $pageUrl  The case study's URL; shown without the scheme.
     */
    public function url(Project $project, string $category, string $pageUrl): ?string
    {
        $screenshot = $project->full_image ?: $project->thumbnail_image;
        $disk = Storage::disk('public');

        if (! $screenshot || ! $disk->exists($screenshot)) {
            return null;
        }

        $address = preg_replace('#^https?://#', '', $pageUrl);
        $label = __('projects.share.label');
        $hash = substr(sha1(json_encode([self::LAYOUT_VERSION, $project->title, $project->url, $category, $screenshot, $address, $label])), 0, 12);
        $prefix = self::DIRECTORY."/{$project->id}-".app()->getLocale().'-';
        $path = "{$prefix}{$hash}.jpg";

        if (! $disk->exists($path)) {
            // A server without GD's FreeType (or a broken screenshot) must not take the case study down: share the list's image.
            $jpeg = rescue(fn (): string => $this->draw($project->title, (string) $project->url, $category, $disk->path($screenshot), $address, $label));

            if ($jpeg === null) {
                return null;
            }

            $disk->put($path, $jpeg);

            foreach ($disk->files(self::DIRECTORY) as $file) {
                if (str_starts_with($file, $prefix) && $file !== $path) {
                    $disk->delete($file);
                }
            }
        }

        return asset('storage/'.$path);
    }

    /**
     * @return string The JPEG.
     */
    private function draw(string $title, string $siteUrl, string $category, string $screenshotPath, string $address, string $label): string
    {
        $manager = new ImageManager(['driver' => 'gd']);
        $canvas = $manager->canvas(self::WIDTH, self::HEIGHT, '#ffffff');

        $this->drawWindow($manager, $canvas, $screenshotPath, $siteUrl);

        $image = $canvas->getCore();

        // The frame: the hairlines stop at the window, the rails run the full height, rivets where they cross.
        $this->fill($image, 0, self::LINE_TOP - 1, self::WIDTH, 2, self::LINE);
        $this->fill($image, 0, self::LINE_BOTTOM - 1, self::COLUMN_X, 2, self::LINE);
        $this->fill($image, self::RAIL_X - 1, 0, 2, self::HEIGHT, self::LINE);
        $this->fill($image, self::COLUMN_X - 1, 0, 2, self::HEIGHT, self::LINE);

        foreach ([self::RAIL_X, self::COLUMN_X] as $x) {
            foreach ([self::LINE_TOP, self::LINE_BOTTOM] as $y) {
                $this->fill($image, $x - 5, $y - 5, 10, 10, self::RIVET);
            }
        }

        $canvas->insert(resource_path('og/logo.png'), 'top-left', self::CONTENT_X, 34);

        $this->drawLine($image, $label, $this->font('mono'), 21, self::COLUMN_X + 48, $this->middleBaseline(0, self::LINE_TOP, 21), self::MUTED);

        $this->drawTitle($image, $title, $category);

        // The address shrinks to fit the column; a slug too long even at 20 px ends in an ellipsis.
        $addressSize = $this->fitSize($address, $this->font('mono'), self::TEXT_WIDTH, 34, 20);
        $address = $this->truncate($address, $this->font('mono'), $addressSize, self::TEXT_WIDTH);
        $this->drawLine($image, $address, $this->font('mono'), $addressSize, self::CONTENT_X, $this->middleBaseline(self::LINE_BOTTOM, self::HEIGHT, $addressSize), self::MUTED);

        return $canvas->encode('jpg', 86)->getEncoded();
    }

    /**
     * The right column below the top hairline: a browser bar (three dots, the site's address without the scheme) over
     * the top of the site, at the column's width (a short screenshot is cropped to cover the window).
     */
    private function drawWindow(ImageManager $manager, Image $canvas, string $screenshotPath, string $siteUrl): void
    {
        $image = $canvas->getCore();
        $windowTop = self::LINE_TOP + self::BAR_HEIGHT;
        $width = self::WIDTH - self::COLUMN_X;
        $height = self::HEIGHT - $windowTop;

        $this->fill($image, self::COLUMN_X, self::LINE_TOP, $width, self::BAR_HEIGHT, self::BAR);
        $this->fill($image, self::COLUMN_X, $windowTop - 1, $width, 1, self::LINE);

        foreach ([0, 1, 2] as $dot) {
            imagefilledellipse($image, self::COLUMN_X + 26 + $dot * 14, self::LINE_TOP + 22, 8, 8, $this->color($image, self::DOT));
        }

        $fieldX = self::COLUMN_X + 76;
        $this->fill($image, $fieldX, self::LINE_TOP + 9, $width - 76 - 16, 26, self::LINE);
        $this->fill($image, $fieldX + 1, self::LINE_TOP + 10, $width - 76 - 18, 24, '#ffffff');
        $siteAddress = rtrim((string) preg_replace('#^https?://(www\.)?#i', '', $siteUrl), '/');
        $this->drawLine($image, $this->truncate($siteAddress, $this->font('mono'), 15, $width - 76 - 40), $this->font('mono'), 15, $fieldX + 12, self::LINE_TOP + 27, self::MUTED);

        $screenshot = $manager->make($screenshotPath)->widen($width);

        if ($screenshot->height() < $height) {
            $screenshot->fit($width, $height, null, 'top');
        } else {
            $screenshot->crop($width, $height, 0, 0);
        }

        $canvas->insert($screenshot, 'top-left', self::COLUMN_X, $windowTop);
    }

    /**
     * The project's name, as large as fits the column in at most three lines with every line inside it (76 px down to
     * 36 px: a long one-word name such as a domain shrinks instead of running into the window), with its type under it,
     * centred together between the hairlines. A word wider than the column even at 36 px is broken inside.
     */
    private function drawTitle(GdImage $image, string $title, string $category): void
    {
        $titleFont = $this->font('600');
        $categoryFont = $this->font('400');
        $categorySize = 27;

        foreach (range(76, 36, -4) as $size) {
            $lines = $this->wrap($title, $titleFont, $size, self::TEXT_WIDTH);

            if (count($lines) <= 3 && $this->widestLine($lines, $titleFont, $size) <= self::TEXT_WIDTH) {
                break;
            }
        }

        if ($this->widestLine($lines, $titleFont, $size) > self::TEXT_WIDTH) {
            $lines = $this->wrap($title, $titleFont, $size, self::TEXT_WIDTH, breakWords: true);
        }

        $lines = array_slice($lines, 0, 3);
        $lineHeight = (int) round($size * 1.06);
        $categoryLines = $category === '' ? [] : array_slice($this->wrap($category, $categoryFont, $categorySize, self::TEXT_WIDTH), 0, 2);
        $categoryGap = 22;
        $categoryLineHeight = (int) round($categorySize * 1.3);
        $blockHeight = count($lines) * $lineHeight + ($categoryLines === [] ? 0 : $categoryGap + count($categoryLines) * $categoryLineHeight);
        $top = (int) round(self::LINE_TOP + (self::LINE_BOTTOM - self::LINE_TOP - $blockHeight) / 2);

        foreach ($lines as $index => $line) {
            $this->drawLine($image, $line, $titleFont, $size, self::CONTENT_X - 3, $top + (int) round($size * 0.86) + $index * $lineHeight, self::INK);
        }

        $categoryTop = $top + count($lines) * $lineHeight + $categoryGap;

        foreach ($categoryLines as $index => $line) {
            $this->drawLine($image, $line, $categoryFont, $categorySize, self::CONTENT_X, $categoryTop + (int) round($categorySize * 0.95) + $index * $categoryLineHeight, self::MUTED);
        }
    }

    /**
     * Greedy word wrap at `$width` pixels. A word wider than `$width` is kept whole, unless `$breakWords`: then it is
     * split into pieces that fit.
     *
     * @return list<string>
     */
    private function wrap(string $text, string $font, int $size, int $width, bool $breakWords = false): array
    {
        $lines = [];
        $line = '';
        $words = preg_split('/\s+/u', trim($text)) ?: [];

        if ($breakWords) {
            $words = array_merge(...array_map(fn (string $word): array => $this->splitWord($word, $font, $size, $width), $words));
        }

        foreach ($words as $word) {
            $candidate = $line === '' ? $word : "{$line} {$word}";

            if ($line !== '' && $this->textWidth($candidate, $font, $size) > $width) {
                $lines[] = $line;
                $line = $word;
            } else {
                $line = $candidate;
            }
        }

        return $line === '' ? $lines : [...$lines, $line];
    }

    /**
     * A word cut into pieces no wider than `$width`, character by character.
     *
     * @return list<string>
     */
    private function splitWord(string $word, string $font, int $size, int $width): array
    {
        $pieces = [];
        $piece = '';

        foreach (mb_str_split($word) as $character) {
            if ($piece !== '' && $this->textWidth($piece.$character, $font, $size) > $width) {
                $pieces[] = $piece;
                $piece = '';
            }

            $piece .= $character;
        }

        return $piece === '' ? $pieces : [...$pieces, $piece];
    }

    /**
     * @param  list<string>  $lines
     */
    private function widestLine(array $lines, string $font, int $size): int
    {
        return max(0, ...array_map(fn (string $line): int => $this->textWidth($line, $font, $size), $lines));
    }

    /** The largest size from `$max` down to `$min` at which `$text` fits `$width` on one line. */
    private function fitSize(string $text, string $font, int $width, int $max, int $min): int
    {
        for ($size = $max; $size > $min; $size--) {
            if ($this->textWidth($text, $font, $size) <= $width) {
                return $size;
            }
        }

        return $min;
    }

    private function truncate(string $text, string $font, int $size, int $width): string
    {
        while (mb_strlen($text) > 1 && $this->textWidth($text, $font, $size) > $width) {
            $text = rtrim(mb_substr($text, 0, -2)).'…';
        }

        return $text;
    }

    /** Baseline that centres a line of `$size` px (cap height ≈ 0.7 em) between `$top` and `$bottom`. */
    private function middleBaseline(int $top, int $bottom, int $size): int
    {
        return (int) round(($top + $bottom) / 2 + $size * 0.36);
    }

    /** Draw one line with its baseline at `$baseline` (sizes in px, as in the HTML templates). */
    private function drawLine(GdImage $image, string $text, string $font, int $size, int $x, int $baseline, string $color): void
    {
        imagettftext($image, $size * 0.75, 0, $x, $baseline, $this->color($image, $color), $font, $text);
    }

    private function textWidth(string $text, string $font, int $size): int
    {
        $box = imagettfbbox($size * 0.75, 0, $font, $text);

        return $box === false ? 0 : $box[2] - $box[0];
    }

    private function fill(GdImage $image, int $x, int $y, int $width, int $height, string $color): void
    {
        imagefilledrectangle($image, $x, $y, $x + $width - 1, $y + $height - 1, $this->color($image, $color));
    }

    private function color(GdImage $image, string $hex): int
    {
        [$red, $green, $blue] = sscanf($hex, '#%02x%02x%02x');

        return imagecolorallocate($image, $red, $green, $blue);
    }

    /**
     * @param  '400'|'600'|'mono'  $weight
     */
    private function font(string $weight): string
    {
        return resource_path($weight === 'mono' ? 'og/geist-mono-400.ttf' : "og/geist-{$weight}.ttf");
    }
}
