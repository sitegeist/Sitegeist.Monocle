<?php

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
