<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Tests\Components\CollectionHost;

use PackageFactory\ComponentEngine\ComponentCollectionInterface;
use PackageFactory\ComponentEngine\ComponentInterface;

final class CollectionHostComponent implements ComponentInterface
{
    public function __construct(
        public readonly ?ComponentCollectionInterface $content,
    ) {
    }

    public static function create(?ComponentCollectionInterface $content = null): self
    {
        return new self($content);
    }

    public function render(): string
    {
        return $this->content?->render() ?? '';
    }
}
