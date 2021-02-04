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
use UnexpectedValueException;

/**
 * @Flow\Proxy(false)
 */
final class EditorOptions implements \JsonSerializable
{
    /**
     * @var array
     */
    private $value;

    /**
     * @param array $value
     */
    private function __construct(array $value)
    {
        $this->value = $value;
    }

    /**
     * @return self
     */
    public static function empty(): self
    {
        return new self([]);
    }

    /**
     * @param array $array
     * @return self
     */
    public static function fromArray(array $array): self
    {
        return new self($array);
    }

    /**
     * @param \JsonSerializable $jsonSerializable
     * @return self
     */
    public static function fromJsonSerializable(
        \JsonSerializable $jsonSerializable
    ): self {
        $jsonSerializeResult = $jsonSerializable->jsonSerialize();

        if (!is_array($jsonSerializeResult)) {
            throw new UnexpectedValueException(
                sprintf(
                    '$jsonSerializable->jsonSerialize() must return an ' .
                    'array. Got "%" instead.',
                    gettype($jsonSerializeResult)
                )
            );
        }

        return new self($jsonSerializeResult);
    }

    /**
     * @return array<mixed>
     */
    public function jsonSerialize()
    {
        return $this->value ?: new \stdClass;
    }
}
