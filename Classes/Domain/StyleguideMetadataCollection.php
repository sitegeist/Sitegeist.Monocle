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

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final readonly class StyleguideMetadataCollection implements \JsonSerializable
{
    /**
     * @var StyleguideMetadata[]
     */
    public array $metadataItems;

    public function __construct(
        StyleguideMetadata ... $metadata
    ) {
        $this->metadataItems = $metadata;
    }

    public static function fromMultiple(StyleguideMetadataCollection ... $metadataCollection): self
    {
        $allItems = [];
        foreach ($metadataCollection as $metadata) {
            $allItems[] = $metadata->metadataItems;
        }
        return new self(...array_merge(...$allItems));
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
