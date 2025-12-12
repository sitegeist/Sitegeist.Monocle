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
final readonly class EditorOptions implements \JsonSerializable
{
    /**
     * @param array $value
     */
    private function __construct(
        public array $value
    ) {
    }

    public static function empty(): self
    {
        return new self([]);
    }

    public static function fromArray(array $array): self
    {
        return new self($array);
    }

    /**
     * @return array<mixed>
     */
    public function jsonSerialize()
    {
        return $this->value ?: new \stdClass;
    }
}
