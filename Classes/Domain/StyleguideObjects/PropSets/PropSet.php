<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\StyleguideObjects\PropSets;

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
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\PropValue;

#[Flow\Proxy(false)]
final readonly class PropSet implements \JsonSerializable
{
    /**
     * @param array<string,PropValue> $overrides
     */
    public function __construct(
        public PropSetName $name,
        public array $overrides
    ) {
    }

    /**
     * @return array<mixed>
     */
    public function jsonSerialize()
    {
        return [
            'name' => $this->name,
            'overrides' => $this->overrides
        ];
    }
}
