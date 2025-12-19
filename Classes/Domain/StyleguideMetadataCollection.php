<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Domain;

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

use Exception;
use Neos\Flow\Annotations as Flow;
use Traversable;

#[Flow\Proxy(false)]
final readonly class StyleguideMetadataCollection implements \JsonSerializable, \IteratorAggregate
{
    /**
     * @var array<string, StyleguideMetadata>
     */
    public array $metadataItems;

    public function __construct(
        StyleguideMetadata ... $metadata
    ) {
        $items = [];
        foreach ($metadata as $metadataItem) {
            $items[$metadataItem->address->toString()] = $metadataItem;
        }
        $this->metadataItems = $items;
    }

    public function byAddress(StyleguideAddress $address): ?StyleguideMetadata
    {
        return $this->metadataItems[$address->toString()] ?? null;
    }

    public function first(): ?StyleguideMetadata
    {
        return $this->metadataItems[array_key_first($this->metadataItems)] ?? null;
    }

    public static function fromMultiple(StyleguideMetadataCollection ... $metadataCollection): self
    {
        $allItems = [];
        foreach ($metadataCollection as $metadata) {
            $allItems[] = $metadata->metadataItems;
        }
        return new self(...array_merge(...$allItems));
    }

    /**
     * @return \Generator<StyleguideMetadata>
     */
    public function getIterator(): \Generator
    {
        yield from $this->metadataItems;
    }

    public function jsonSerialize(): mixed
    {
        $result = [];
        foreach ($this->metadataItems as $metadataItem) {
            $result[$metadataItem->address->toString()] = $metadataItem->address->styleguide->value;
        }
        return $result;
    }
}
