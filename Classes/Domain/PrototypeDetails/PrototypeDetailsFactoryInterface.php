<?php

namespace Sitegeist\Monocle\Domain\PrototypeDetails;

use Sitegeist\Monocle\Domain\Fusion\Prototype;

interface PrototypeDetailsFactoryInterface
{
    public function forPrototype(Prototype $prototype): PrototypeDetailsInterface;
}
