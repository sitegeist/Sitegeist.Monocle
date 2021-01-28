<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails\Props;

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
use Sitegeist\Monocle\Domain\Fusion\Prototype;

/**
 * @Flow\Proxy(false)
 */
final class PropName implements \JsonSerializable
{
    /**
     * @var string
     */
    private $value;

    /**
     * @param string $value
     */
    private function __construct(string $value)
    {
        $this->value = $value;
    }

    /**
     * @param Prototype $prototype
     * @return array|PropName[]
     */
    public static function fromPrototype(Prototype $prototype): array
    {
        $propNames = $prototype->getKeys('__meta.styleguide.props');
        if ($prototype->isComponent()) {
            $propNames = array_unique(
                array_merge(
                    array_filter(
                        $prototype->getKeys(),
                        function (string $key): bool {
                            return $key !== 'renderer';
                        }
                    ),
                    $propNames
                )
            );
        }

        return array_map([self::class, 'fromString'], $propNames);
    }

    /**
     * @param string $string
     * @return self
     */
    public static function fromString(string $string): self
    {
        return new self($string);
    }

    /**
     * @return string
     */
    public function jsonSerialize()
    {
        return $this->value;
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->value;
    }
}
