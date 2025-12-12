<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Domain;

final readonly class StyleguideProviderIdentifier
{
    public function __construct(
        public string $value
    ) {
    }
}
