<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails;

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
use Sitegeist\Monocle\Domain\Fusion\PrototypeName;

/**
 * @Flow\Proxy(false)
 */
final class Anatomy implements \JsonSerializable
{
    /**
     * @var PrototypeName
     */
    private $prototypeName;

    /**
     * @var array|AnatomyInterface[]
     */
    private $children;

    /**
     * @param PrototypeName $prototypeName
     * @param array $children
     */
    public function __construct(
        PrototypeName $prototypeName,
        array $children
    ) {
        $this->prototypeName = $prototypeName;
        $this->children = $children;
    }

    /**
     * @return PrototypeName
     */
    public function getPrototypeName(): PrototypeName
    {
        return $this->prototypeName;
    }

    /**
     * @return array|AnatomyInterface[]
     */
    public function getChildren(): array
    {
        return $this->children;
    }

    /**
     * @return array<mixed>
     */
    public function jsonSerialize()
    {
        return [
            'prototypeName' => $this->prototypeName,
            'children' => $this->children
        ];
    }
}
