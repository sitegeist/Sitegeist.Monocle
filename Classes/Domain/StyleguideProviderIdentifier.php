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
final readonly class StyleguideProviderIdentifier
{
    public function __construct(
        public string $value
    ) {
        if (str_contains(':', $value)) {
            throw new \InvalidArgumentException('StyleguideProviderIdentifier must not contain ":".');
        }
    }

    public function equals(StyleguideProviderIdentifier $other): bool
    {
        return $this->value === $other->value;
    }

    public static function fromString(string $string): self
    {
        return new self($string);
    }
}
