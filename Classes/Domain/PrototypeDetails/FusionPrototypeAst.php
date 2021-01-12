<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails;

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
final class FusionPrototypeAst implements \JsonSerializable
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
        if (!isset($value['__prototypeObjectName'])) {
            throw new \UnexpectedValueException('__prototypeObjectName key must be set.');
        }

        $this->value = $value;
    }

    /**
     * @return \Iterator<mixed,FusionObjectAst>
     */
    public function getAllReferencedFusionObjects(): \Iterator
    {
        $findReferencedFusionPrototypeAstsRecursively = function(
            array $astExcerpt
        ) use (&$findReferencedFusionPrototypeAstsRecursively): \Iterator {
            if (isset($astExcerpt['__objectType'])) {
                yield FusionObjectAst::fromArray($astExcerpt);
            } else {
                foreach ($astExcerpt as $key => $value) {
                    if (substr($key, 0, 2) === '__') {
                        continue;
                    }

                    if (is_array($value)) {
                        yield from $findReferencedFusionPrototypeAstsRecursively($value);
                    }
                }
            }
        };

        yield from $findReferencedFusionPrototypeAstsRecursively($this->value);
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
     * @return array
     */
    public function jsonSerialize()
    {
        return $this->value;
    }
}
