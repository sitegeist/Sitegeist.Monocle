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
     * @Flow\Inject
     * @var EditorFactory
     */
    protected $editorFactory;

    /**
     * @param Prototype $fusionPrototypeAst
     * @return PropsCollectionInterface
     */
    public function fromPrototypeForPrototypeDetails(
        Prototype $prototype
    ): PropsCollectionInterface {
        $propsCollectionBuilder = new PropsCollectionBuilder();

        foreach (PropName::fromPrototype($prototype) as $propName) {
            if ($propValue = PropValue::of($prototype, $propName)) {
                if ($editor = $this->editorFactory->for($prototype, $propName)) {
                    $propsCollectionBuilder->addProp(
                        new Prop($propName, $propValue, $editor)
                    );
                }
            }
        }

        return $propsCollectionBuilder->build();
    }
}
