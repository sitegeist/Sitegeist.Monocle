<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\StyleguideObjects\Props;

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
final readonly class Prop implements \JsonSerializable
{
    public function __construct(
        public PropName $name,
        public PropValue $value,
        public Editor $editor
    ) {
    }

    public function jsonSerialize()
    {
        return [
            'name' => $this->name,
            'value' => $this->value,
            'editor' => $this->editor
        ];
    }
}
