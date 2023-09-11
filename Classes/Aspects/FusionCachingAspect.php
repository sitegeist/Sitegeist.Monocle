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
use Neos\Fusion\Core\FusionConfiguration;

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
     * @Flow\Around("setting(Sitegeist.Monocle.fusion.enableObjectTreeCache) && method(Sitegeist\Monocle\Fusion\FusionService->getFusionConfigurationForPackageKey())")
     * @param JoinPointInterface $joinPoint The current join point
     * @return mixed
     */
    public function cacheFusionConfigurationForPackageKey(JoinPointInterface $joinPoint)
    {
        $packageKey = $joinPoint->getMethodArgument('packageKey');
        $cacheIdentifier = str_replace('.', '_', $packageKey);

        if ($this->fusionCache->has($cacheIdentifier)) {
            $fusionConfigurationArray = $this->fusionCache->get($cacheIdentifier);
            $fusionConfiguration = FusionConfiguration::fromArray($fusionConfigurationArray);
        } else {
            /**
             * @var FusionConfiguration $fusionConfiguration
             */
            $fusionConfiguration = $joinPoint->getAdviceChain()->proceed($joinPoint);
            $this->fusionCache->set($cacheIdentifier, $fusionConfiguration->toArray());
        }

        return $fusionConfiguration;
    }
}
