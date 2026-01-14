<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Tests\Components\Primary;

use PackageFactory\PHPComponentEngine\ComponentInterface;

final class PrimaryComponent implements ComponentInterface
{
    public function __construct(
        public readonly string $title,
        public readonly array $items,
        public readonly ComponentInterface $nested,
    ) {
    }

    public static function create(string $title, array $items, ComponentInterface $nested): self
    {
        return new self($title, $items, $nested);
    }

    public function render(): string
    {
        return '';
    }
}
