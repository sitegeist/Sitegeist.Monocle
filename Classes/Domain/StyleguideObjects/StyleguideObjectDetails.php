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
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\PropsCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseCollection;

#[Flow\Proxy(false)]
final readonly class StyleguideObjectDetails implements \JsonSerializable
{
    public function __construct(
        public StyleguideObjectIdentifier $identifier,
        public StyleguideObjectName $name,
        public PropsCollection $props,
        public PropSetCollection $propSets,
        public UseCaseCollection $useCases
    ) {
    }

    /**
     * @return array<mixed>
     */
    public function jsonSerialize()
    {
        return [
            'identifier' => $this->identifier,
            'prototypeName' => $this->identifier,
            'name' => $this->name,
            'props' => $this->props,
            'propSets' => $this->propSets,
            'useCases' => $this->useCases
        ];
    }
}
