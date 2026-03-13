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

namespace Sitegeist\Monocle\Domain\StyleguideObjects\PropSets;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final readonly class PropSetCollection implements \JsonSerializable
{
    /**
     * @var PropSet[]
     */
    private array $propSets;

    /**
     * @param PropSet ...$propSets
     */
    public function __construct(PropSet ...$propSets)
    {
        $this->propSets = $propSets;
    }

    /**
     * @return array|PropSet[]
     */
    public function jsonSerialize()
    {
        return $this->propSets;
    }
}
