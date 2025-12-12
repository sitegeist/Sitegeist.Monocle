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
final readonly class StyleguideAddress
{
    public function __construct(
        public StyleguideProviderIdentifier $provider,
        public StyleguideIdentifier $styleguide,
    ) {
    }

    public static function fromString(string $value): self
    {
        list ($provider, $styleguide) = explode('::', $value, 2);
        return new self(
            new StyleguideProviderIdentifier($provider),
            new StyleguideIdentifier( $styleguide)
        );
    }

    public function toString(): string
    {
        return $this->provider->value . '::' . $this->styleguide->value;
    }

}
