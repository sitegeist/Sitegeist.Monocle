<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Tests\Components\ListItem;

use PackageFactory\ComponentEngine\ComponentInterface;

final class ListItemComponent implements ComponentInterface
{
    public function __construct(
        public readonly string $label,
    ) {
    }

    public static function create(string $label): self
    {
        return new self($label);
    }

    public function render(): string
    {
        return '';
    }
}
