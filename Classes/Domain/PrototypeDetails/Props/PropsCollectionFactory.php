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
 * @Flow\Scope("singleton")
 */
final class PropsCollectionFactory implements PropsCollectionFactoryInterface
{
    /**
     * @param Prototype $fusionPrototypeAst
     * @return PropsCollectionInterface
     */
    public function fromPrototypeForPrototypeDetails(
        Prototype $prototype
    ): PropsCollectionInterface {
        if ($prototype->extends(PrototypeName::fromString('Neos.Fusion:Component'))) {
            return $this->fromComponentForPrototypeDetails(
                $prototype
            );
        }

        return new PropsCollection();
    }

    /**
     * @param Prototype $fusionPrototypeAst
     * @return PropsCollectionInterface
     */
    public function fromComponentForPrototypeDetails(
        Prototype $component
    ): PropsCollectionInterface {
        assert($component->extends(PrototypeName::fromString('Neos.Fusion:Component')));

        $propsCollectionBuilder = new PropsCollectionBuilder();
        $styleguideProps = $component
            ->evaluate('/__meta/styleguide/props<Neos.Fusion:DataStructure>') ?: [];
        $componentPropNames = $component->getKeys();

        $propNames = array_merge(
            array_filter($componentPropNames, function (string $key): bool {
                return $key !== 'renderer';
            }),
            array_keys($styleguideProps)
        );

        foreach ($propNames as $propNameAsString) {
            $value = $styleguideProps[$propNameAsString] ??
                $component->evaluate('/' . $propNameAsString);

            if (PropValue::isValid($value)) {
                $propName = PropName::fromString($propNameAsString);
                $propValue = PropValue::fromAny($value);

                if ($editor = Editor::forPropValue($propValue)) {
                    $propsCollectionBuilder->addProp(
                        new Prop($propName, $propValue, $editor)
                    );
                }
            }
        }

        return $propsCollectionBuilder->build();
    }
}
