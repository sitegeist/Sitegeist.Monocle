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

/**
 * @Flow\Proxy(false)
 */
final class PropValue implements \JsonSerializable
{
    /**
     * @var mixed
     */
    private $value;

    /**
     * @param mixed $value
     */
    private function __construct($value)
    {
        if (!self::isValid($value)) {
            throw new \UnexpectedValueException(
                'PropValue must be a primitive, an array or an object ' .
                'implementing \\JsonSerializable. Got "%s" instead.',
                is_object($value) ? get_class($value) : gettype($value)
            );
        }

        $this->value = $value;
    }

    /**
     * @param mixed $value
     * @return self
     */
    public static function fromAny($any): self
    {
        return new self($any);
    }

    /**
     * @param mixed $value
     * @return boolean
     */
    public static function isValid($value): bool
    {
        if (is_array($value)) {
            foreach ($value as $childValue) {
                if (!self::isValid($childValue)) {
                    return false;
                }
            }

            return true;
        }

        return (
            is_bool($value)
            || is_int($value)
            || is_float($value)
            || is_string($value)
            || $value instanceof \JsonSerializable
        );
    }

    /**
     * @return mixed
     */
    public function jsonSerialize()
    {
        return $this->value;
    }
}
