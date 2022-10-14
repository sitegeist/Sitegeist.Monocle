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
use Sitegeist\Monocle\Domain\Fusion\PrototypeName;

/**
 * @Flow\Proxy(false)
 */
final class FusionObjectAst
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
        if (!isset($value['__objectType'])) {
            throw new \UnexpectedValueException('__objectType key must be set.');
        }

        $this->value = $value;
    }

    public function getPrototypeName(): PrototypeName
    {
        return PrototypeName::fromString($this->value['__objectType']);
    }

    /**
     * @return \Iterator<mixed,FusionObjectAst>
     */
    public function getAllReferencedFusionObjects(): \Iterator
    {
        $findReferencedFusionPrototypeAstsRecursively = function (
            array $astExcerpt
        ) use (&$findReferencedFusionPrototypeAstsRecursively): \Iterator {
            if (isset($astExcerpt['__objectType'])) {
                yield self::fromArray($astExcerpt);
            } else {
                foreach ($astExcerpt as $key => $value) {
                    if (is_string($key) && substr($key, 0, 2) === '__') {
                        continue;
                    }

                    if (is_array($value)) {
                        yield from $findReferencedFusionPrototypeAstsRecursively($value);
                    }
                }
            }
        };

        $value = $this->value;
        unset($value['__objectType']);

        yield from $findReferencedFusionPrototypeAstsRecursively($value);
    }

    /**
     * @param array $array
     * @return self
     */
    public static function fromArray(array $array): self
    {
        return new self($array);
    }
}
