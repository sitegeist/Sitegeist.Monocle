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
use Sitegeist\Monocle\Domain\Fusion\Prototype;
use Sitegeist\Monocle\Domain\PrototypeDetails\Props\PropsCollectionFactoryInterface;
use Sitegeist\Monocle\Domain\PrototypeDetails\PropSets\PropSetCollection;
use Sitegeist\Monocle\Domain\PrototypeDetails\UseCases\UseCase;
use Sitegeist\Monocle\Domain\PrototypeDetails\UseCases\UseCaseCollection;
use Symfony\Component\Yaml\Yaml;

/**
 * @Flow\Scope("singleton")
 */
final class PrototypeDetailsFactory implements PrototypeDetailsFactoryInterface
{
    /**
     * @Flow\Inject
     * @var PropsCollectionFactoryInterface
     */
    protected $propsCollectionFactory;

    /**
     * @param string $prototypeNameString
     * @param string $sitePackageKey
     * @return PrototypeDetailsInterface
     */
    public function forPrototype(Prototype $prototype): PrototypeDetailsInterface
    {
        return new PrototypeDetails(
            $prototype->getName(),
            $this->propsCollectionFactory
                ->fromPrototypeForPrototypeDetails($prototype),
            PropSetCollection::fromPrototype($prototype),
            UseCaseCollection::fromPrototype($prototype)
        );
    }
}
