<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Tests\Components\SlotHost;

use PackageFactory\ComponentEngine\ComponentInterface;

final class SlotHostComponent implements ComponentInterface
{
    public function __construct(
        public readonly ComponentInterface|string|null $content,
    ) {
    }

    public static function create(ComponentInterface|string|null $content = null): self
    {
        return new self($content);
    }

    public function render(): string
    {
        if (is_string($this->content)) {
            return $this->content;
        }

        return $this->content?->render() ?? '';
    }
}
