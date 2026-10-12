<?php

namespace App\Enums;

/**
 * The services with a page of their own. The value names the page's Polish route (`services.{value}`; the English twin
 * is `en.` + that name), its copy in lang/{pl,en}/services.php and the tag a project carries in the admin panel to be
 * shown on that page.
 */
enum Service: string
{
    case Websites = 'websites';
    case Stores = 'stores';
    case Apps = 'apps';
    case Mobile = 'mobile';
    case Ai = 'ai';
    case Devops = 'devops';

    /**
     * Polish route name of the service's page.
     */
    public function routeName(): string
    {
        return "services.{$this->value}";
    }

    /**
     * The service in the admin panel (Polish only).
     */
    public function adminLabel(): string
    {
        return match ($this) {
            self::Websites => 'Strony internetowe',
            self::Stores => 'Sklepy internetowe',
            self::Apps => 'Aplikacje webowe',
            self::Mobile => 'Aplikacje mobilne',
            self::Ai => 'AI & Automatyzacja',
            self::Devops => 'DevOps & Cloud',
        };
    }

    /**
     * The price brackets of the service's tiers in złoty, in the order of the tiers in lang/{pl,en}/services.php: where
     * the price starts and where it usually ends (null: no usual ceiling). The first tier starts at the service's price
     * "od" (the home page FAQ quotes the same six prices); the second tier starts about 500 zł above the first
     * tier's ceiling, like the website tiers.
     *
     * @return list<array{from: int, to: int|null}>
     */
    public function priceBrackets(): array
    {
        return match ($this) {
            self::Websites => [['from' => 799, 'to' => 1499], ['from' => 1799, 'to' => 2999]],
            self::Stores => [['from' => 1299, 'to' => 4999], ['from' => 5499, 'to' => 12999]],
            self::Apps => [['from' => 1699, 'to' => 3999], ['from' => 4499, 'to' => null]],
            self::Mobile => [['from' => 999, 'to' => 3999], ['from' => 4499, 'to' => null]],
            self::Ai => [['from' => 299, 'to' => 1499], ['from' => 1999, 'to' => 4999]],
            self::Devops => [['from' => 499, 'to' => 1499], ['from' => 1999, 'to' => 4999]],
        };
    }
}
