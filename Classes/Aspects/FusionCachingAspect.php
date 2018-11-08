<?php
namespace Sitegeist\Monocle\Aspects;

/**
 * This file is part of the Sitegeist.Monocle package
 *
 * (c) 2016
 * Martin Ficzel <ficzel@sitegeist.de>
 * Wilhelm Behncke <behncke@sitegeist.de>
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Aop\JoinPointInterface;
use Neos\Cache\Frontend\VariableFrontend;

/**
 * @Flow\Scope("singleton")
 * @Flow\Aspect
 */
class FusionCachingAspect
{
    /**
     * @Flow\Inject
     * @var VariableFrontend
     */
    protected $fusionCache;

    /**
     * @Flow\Around("setting(Sitegeist.Monocle.fusion.enableObjectTreeCache) && method(Sitegeist\Monocle\Fusion\FusionService->getMergedFusionObjectTreeForSitePackage())")
     * @param JoinPointInterface $joinPoint The current join point
     * @return mixed
     */
    public function cacheGetMergedFusionObjectTree(JoinPointInterface $joinPoint)
    {
        $siteResourcesPackageKey = $joinPoint->getMethodArgument('siteResourcesPackageKey');
        $cacheIdentifier = str_replace('.', '_', $siteResourcesPackageKey);

        if ($this->fusionCache->has($cacheIdentifier)) {
            $fusionObjectTree = $this->fusionCache->get($cacheIdentifier);
        } else {
            $fusionObjectTree = $joinPoint->getAdviceChain()->proceed($joinPoint);
            $this->fusionCache->set($cacheIdentifier, $fusionObjectTree);
        }

        return $fusionObjectTree;
    }
}
