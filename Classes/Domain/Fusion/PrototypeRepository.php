<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\Fusion;

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
use Neos\Fusion\Core\Runtime as FusionRuntime;
use Neos\Fusion\Core\RuntimeFactory as FusionRuntimeFactory;
use Sitegeist\Monocle\Fusion\FusionService;

/**
 * @Flow\Scope("singleton")
 */
final class PrototypeRepository
{
    /**
     * @Flow\Inject
     * @var FusionRuntimeFactory
     */
    protected $fusionRuntimeFactory;

    /**
     * @Flow\Inject
     * @var FusionService
     */
    protected $fusionService;

    public function findOneByPrototypeNameInSitePackage(
        string $prototypeName,
        string $sitePackageKey
    ): ?Prototype {
        $fusionObjectTree = $this->fusionService->getMergedFusionObjectTreeForSitePackage($sitePackageKey);

        if (isset($fusionObjectTree['__prototypes'][$prototypeName])) {
            $fusionAst =  $fusionObjectTree['__prototypes'][$prototypeName];
            $fusionRuntime = $this->fusionRuntimeFactory->create($fusionObjectTree);
            $fusionRuntime->setEnableContentCache(false);

            return new Prototype(
                PrototypeName::fromString($prototypeName),
                $fusionAst,
                $fusionRuntime
            );
        }

        return null;
    }
}
