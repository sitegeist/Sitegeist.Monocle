<?php

declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectCollection;


/**
 * @implements \IteratorAggregate<CpxComponentMetadata>
 */
readonly class CpxComponentMetadataCollection implements \IteratorAggregate
{
    /**
     * @var CpxComponentMetadata[]
     */
    public array $item;

    public function __construct(
        CpxComponentMetadata ... $items
    ) {
        $this->item = $items;
    }

    /**
     * @return \Generator<CpxComponentMetadata>
     */
    public function getIterator(): \Generator
    {
        yield from $this->item;
    }

    public function asStyleguideObjectCollection(): StyleguideObjectCollection
    {
        $items = [];
        foreach ($this->item as $item) {
            $items[] = $item->styleguideObject;
        }
        return new StyleguideObjectCollection(... $items);
    }
}
