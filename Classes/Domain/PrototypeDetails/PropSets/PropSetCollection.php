<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails\PropSets;

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
use Sitegeist\Monocle\Domain\PrototypeDetails\Props\PropValue;

/**
 * @Flow\Proxy(false)
 */
final class PropSetCollection implements \JsonSerializable
{
    /**
     * @var array|PropSet[]
     */
    private $propSets;

    /**
     * @param PropSet ...$propSets
     */
    private function __construct(PropSet ...$propSets)
    {
        $this->propSets = $propSets;
    }

    /**
     * @param Prototype $prototype
     * @return self
     */
    public static function fromPrototype(Prototype $prototype): self
    {
        $ast = $prototype->getAst();
        $propSets = [];

        if (isset($ast['__meta']['styleguide']['propSets'])) {
            $propSetNames = array_keys(
                $ast['__meta']['styleguide']['propSets']
            );

            foreach ($propSetNames as $propSetNameAsString) {
                $propSetName = PropSetName::fromString($propSetNameAsString);
                $values = $prototype->evaluate(sprintf(
                    '/__meta/styleguide/propSets/%s<Neos.Fusion:DataStructure>',
                    $propSetName
                ));
                $overrides = [];

                if (is_array($values)) {
                    foreach ($values as $name => $value) {
                        if (PropValue::isValid($value)) {
                            $overrides[(string) $name] =
                                PropValue::fromAny($value);
                        }
                    }
                }

                $propSets[] = new PropSet($propSetName, $overrides);
            }
        }

        return new self(...$propSets);
    }

    /**
     * @return array|PropSet[]
     */
    public function jsonSerialize()
    {
        return $this->propSets;
    }
}
