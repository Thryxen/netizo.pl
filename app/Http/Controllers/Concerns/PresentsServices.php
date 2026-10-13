<?php

namespace App\Http\Controllers\Concerns;

use App\Enums\Service;
use App\Services\LocalizedRoutes;

/**
 * The services as page props for the public pages that sell them (the service pages, the Leszno page): a service's
 * tiers with their prices, the links to the other services and the offers of its JSON-LD. The copy comes from
 * lang/{pl,en}/services.php, the prices from App\Enums\Service.
 */
trait PresentsServices
{
    /**
     * The service's tiers in the current language with their prices: the copy of each tier and the price bracket at the
     * same position in App\Enums\Service::priceBrackets(). A tier without a timeline in the copy has none (the site
     * states no timeline for it).
     *
     * @return list<array{name: string, description: string, timeline: string|null, includes: list<string>, priceFrom: int, priceTo: int|null}>
     */
    protected function offers(Service $service): array
    {
        $brackets = $service->priceBrackets();

        return array_map(fn (array $offer, int $index): array => [
            'name' => $offer['name'],
            'description' => $offer['description'],
            'timeline' => $offer['timeline'] ?? null,
            'includes' => array_values($offer['includes']),
            'priceFrom' => $brackets[$index]['from'],
            'priceTo' => $brackets[$index]['to'],
        ], __("services.{$service->value}.offers"), array_keys($brackets));
    }

    /**
     * The services other than `$except`, each with its name, one sentence, the price it starts at and its page in the
     * current language.
     *
     * @return list<array{key: string, name: string, description: string, priceFrom: int, url: string}>
     */
    protected function otherServices(Service $except): array
    {
        return collect(Service::cases())
            ->reject(fn (Service $other): bool => $other === $except)
            ->map(fn (Service $other): array => [
                'key' => $other->value,
                'name' => __("services.{$other->value}.card.name"),
                'description' => __("services.{$other->value}.card.description"),
                'priceFrom' => $other->priceBrackets()[0]['from'],
                'url' => LocalizedRoutes::url($other->routeName()),
            ])
            ->values()
            ->all();
    }

    /**
     * The tiers as the offers of a Service node: the price each one starts at (no maximum: the copy's ceilings are what a
     * price usually stays under, not a cap).
     *
     * @param  list<array{name: string, description: string, priceFrom: int, priceTo: int|null}>  $offers
     * @return list<array<string, mixed>>
     */
    protected function offerSchema(array $offers): array
    {
        return array_map(fn (array $offer): array => [
            '@type' => 'Offer',
            'name' => $offer['name'],
            'description' => $offer['description'],
            'priceSpecification' => [
                '@type' => 'PriceSpecification',
                'minPrice' => $offer['priceFrom'],
                'priceCurrency' => 'PLN',
            ],
        ], $offers);
    }
}
