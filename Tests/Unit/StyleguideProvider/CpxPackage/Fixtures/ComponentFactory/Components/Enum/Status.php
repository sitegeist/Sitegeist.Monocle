<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Tests\Components\Enum;

enum Status: string
{
    case Active = 'active';
    case Inactive = 'inactive';
}
