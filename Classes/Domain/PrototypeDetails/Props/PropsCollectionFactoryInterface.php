<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails\Props;

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

use Sitegeist\Monocle\Domain\Fusion\Prototype;

interface PropsCollectionFactoryInterface
{
    /**
     * @param Prototype $prototype
     * @return PropsCollectionInterface
     */
    public function fromPrototypeForPrototypeDetails(
        Prototype $prototype
    ): PropsCollectionInterface;
}
