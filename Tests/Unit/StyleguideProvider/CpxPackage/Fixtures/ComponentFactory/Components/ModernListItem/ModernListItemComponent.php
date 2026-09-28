<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Tests\Components\ModernListItem;

use PackageFactory\ComponentEngine\ComponentInterface;

final class ModernListItemComponent implements ComponentInterface
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
        return sprintf('[item:%s]', $this->label);
    }
}
