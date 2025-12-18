<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\StyleguideObjects;

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
final readonly class StyleguideObject implements \JsonSerializable
{
    public function __construct(
        public StyleguideObjectIdentifier $identifier,
        public StyleguideObjectName $name,
        public StyleguideObjectPath $path,
        public StyleguideStructure $structure,
        public string $description,
    ) {
    }

    public function jsonSerialize(): mixed
    {
        // this reflects the old format that the monocle ui expects
        // @todo it should be refactored to math the new names later
        return [
            'identifier' => $this->identifier,
            'path' => $this->path,
            'structure'  => $this->structure,
            'title' => $this->name,
            'description' => $this->description,
            'options' => null,
            'propSets' => null,
            'useCases'  => null,
        ];

    }
}
