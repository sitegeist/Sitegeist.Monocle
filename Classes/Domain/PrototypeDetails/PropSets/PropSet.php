<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails\PropSets;

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

/**
 * @Flow\Proxy(false)
 */
final class PropSet implements \JsonSerializable
{
    /**
     * @var PropSetName
     */
    private $name;

    /**
     * @var array<string,PropValue>
     */
    private $overrides;

    /**
     * @param PropSetName $name
     * @param array $overrides
     */
    public function __construct(
        PropSetName $name,
        array $overrides
    ) {
        $this->name = $name;
        $this->overrides = $overrides;
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
