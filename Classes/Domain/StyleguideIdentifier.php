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

namespace Sitegeist\Monocle\Domain;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final readonly class StyleguideIdentifier
{
    public function __construct(
        public string $value
    ) {
    }

    public static function fromString(string $value): self
    {
        return new self($value);
    }

    public function equals(StyleguideIdentifier $other): bool
    {
        return $this->value === $other->value;
    }
}
