<?php
declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\StyleguideObjects;

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
final readonly class StyleguideObjectCollection implements \JsonSerializable
{
    /**
     * @var StyleguideObject[]
     */
    private array $styleguideObjects;

    public function __construct(
        StyleguideObject ... $styleguideObject
    ) {
        $this->styleguideObjects = $styleguideObject;
    }

    public function jsonSerialize(): array
    {
        $result = [];
        foreach ($this->styleguideObjects as $styleguideObject) {
            $result[$styleguideObject->identifier->value] = $styleguideObject;
        }
        return $result;
    }

}
