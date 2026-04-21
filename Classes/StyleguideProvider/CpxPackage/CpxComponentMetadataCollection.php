<?php

/**
 * This file is part of the Sitegeist.Monocle package
 *
 * (c) 2020
 * Martin Ficzel <ficzel@sitegeist.de>
 * Wilhelm Behncke <behncke@sitegeist.de>
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;

/**
 * @implements \IteratorAggregate<CpxComponentMetadata>
 */
readonly class CpxComponentMetadataCollection implements \IteratorAggregate
{
    /**
     * @var array<string, CpxComponentMetadata>
     */
    public array $items;

    public function __construct(
        CpxComponentMetadata ...$items
    ) {
        $itemsIndexedById = [];
        foreach ($items as $item) {
            $itemsIndexedById[$item->styleguideObject->identifier->value] = $item;
        }
        $this->items = $itemsIndexedById;
    }

    public function find(StyleguideObjectIdentifier $identifier): ?CpxComponentMetadata
    {
        if (array_key_exists($identifier->value, $this->items)) {
            return $this->items[$identifier->value];
        }
        return null;
    }

    /**
     * @return \Generator<CpxComponentMetadata>
     */
    public function getIterator(): \Generator
    {
        yield from $this->items;
    }

    public function asStyleguideObjectCollection(): StyleguideObjectCollection
    {
        $items = [];
        foreach ($this->items as $item) {
            $items[] = $item->styleguideObject;
        }
        return new StyleguideObjectCollection(... $items);
    }
}
