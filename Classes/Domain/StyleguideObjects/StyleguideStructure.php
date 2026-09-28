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

namespace Sitegeist\Monocle\Domain\StyleguideObjects;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final readonly class StyleguideStructure
{
    public function __construct(
        public string $label,
        public string $icon,
        public string $color,
    ) {
    }
}
