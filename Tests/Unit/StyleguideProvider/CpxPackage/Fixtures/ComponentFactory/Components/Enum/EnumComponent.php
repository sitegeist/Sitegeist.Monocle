<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Tests\Components\Enum;

use PackageFactory\ComponentEngine\ComponentInterface;

final class EnumComponent implements ComponentInterface
{
    public function __construct(
        public readonly Status $status,
    ) {
    }

    public static function create(Status $status): self
    {
        return new self($status);
    }

    public function render(): string
    {
        return '';
    }
}
