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
use Sitegeist\Monocle\Domain\Fusion\PrototypeName;

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
                'of type \\stdClass. Got "%s" instead.',
                is_object($value) ? get_class($value) : gettype($value)
            );
        }

        $this->value = $value;
    }

    /**
     * @param Prototype $prototype
     * @param PropName $propName
     * @return null|self
     */
    public static function of(Prototype $prototype, PropName $propName): ?self
    {
        $value = $prototype
            ->evaluate('/__meta/styleguide/props/' . $propName);

        if ($prototype->extends(PrototypeName::fromString('Neos.Fusion:Component'))) {
            $value = $value ?? $prototype->evaluate('/' . $propName);
        }

        if (PropValue::isValid($value)) {
            return PropValue::fromAny($value);
        }

        return null;
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
            || $value instanceof \stdClass
        );
    }

    /**
     * @return integer
     */
    public function getLength(): int
    {
        switch (true) {
            case $this->isString():
                return strlen($this->value);
            default:
                throw new \DomainException(
                    sprintf(
                        'PropValue of type "%s" has no length.',
                        gettype($this->value)
                    )
                );
        }
    }

    /**
     * @return boolean
     */
    public function isBoolean(): bool
    {
        return is_bool($this->value);
    }

    /**
     * @return boolean
     */
    public function isNumber(): bool
    {
        return $this->isInteger() || $this->isFloat();
    }

    /**
     * @return boolean
     */
    public function isInteger(): bool
    {
        return is_int($this->value);
    }

    /**
     * @return boolean
     */
    public function isFloat(): bool
    {
        return is_float($this->value);
    }

    /**
     * @return boolean
     */
    public function isString(): bool
    {
        return is_string($this->value);
    }

    /**
     * @return boolean
     */
    public function isList(): bool
    {
        if (is_array($this->value)) {
            foreach ($this->value as $key => $value) {
                if ($key === 0) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @return boolean
     */
    public function isDictionary(): bool
    {
        if ($this->value instanceof \stdClass) {
            return true;
        }

        if (is_array($this->value)) {
            foreach ($this->value as $key => $value) {
                if ($key !== 0) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @return mixed
     */
    public function jsonSerialize()
    {
        return $this->value;
    }
}
