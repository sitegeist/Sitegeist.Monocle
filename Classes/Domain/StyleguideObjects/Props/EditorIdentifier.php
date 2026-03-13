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

namespace Sitegeist\Monocle\Domain\StyleguideObjects\Props;

use Neos\Flow\Annotations as Flow;

#[Flow\Proxy(false)]
final readonly class EditorIdentifier implements \JsonSerializable
{
    private function __construct(
        public string $value
    ) {
    }

    public static function fromString(string $string): self
    {
        return new self($string);
    }

    public function jsonSerialize(): string
    {
        return $this->value;
    }
}
