<?php
namespace Sitegeist\Monocle;

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

use Neos\Flow\Cache\CacheManager;
use Neos\Flow\Core\Booting\Sequence;
use Neos\Flow\Core\Bootstrap;
use Neos\Flow\Monitor\FileMonitor;
use Neos\Flow\Package\Package as BasePackage;
use Neos\Flow\Package\PackageManager;

/**
 * The Fluid Package
 *
 */
class Package extends BasePackage
{

    /**
     * Invokes custom PHP code directly after the package manager has been initialized.
     *
     * @param Bootstrap $bootstrap The current bootstrap
     * @return void
     */
    public function boot(Bootstrap $bootstrap)
    {
        $dispatcher = $bootstrap->getSignalSlotDispatcher();

        $context = $bootstrap->getContext();
        if (!$context->isProduction()) {
            $dispatcher->connect(Sequence::class, 'afterInvokeStep', function ($step) use ($bootstrap, $dispatcher) {
                if ($step->getIdentifier() === 'neos.flow:systemfilemonitor') {
                    $templateFileMonitor = FileMonitor::createFileMonitorAtBoot('Sitegeist_Monocle_Fusion_Files', $bootstrap);
                    /**
                     * @var PackageManager $packageManager
                     */
                    $packageManager = $bootstrap->getEarlyInstance(PackageManager::class);

                    foreach ($packageManager->getAvailablePackages() as $packageKey => $package) {
                        //
                        // this is here to distinguish between flow and other packages
                        // in flow 5 we can check wether the packe is a FlowPackage instead
                        // @todo fix this after the support for neos 3.3 is dropped
                        //
                        if (method_exists($package, 'getResourcesPath')) {
                            $templatesPath = $package->getResourcesPath() . 'Private/Fusion';
                            if (is_dir($templatesPath)) {
                                $templateFileMonitor->monitorDirectory($templatesPath);
                            }
                        }
                    }

                    $templateFileMonitor->detectChanges();
                    $templateFileMonitor->shutdownObject();
                }
            });
        }

        $flushTemplates = function ($identifier, $changedFiles) use ($bootstrap) {
            if ($identifier !== 'Sitegeist_Monocle_Fusion_Files') {
                return;
            }

            if ($changedFiles === []) {
                return;
            }

            $templateCache = $bootstrap->getObjectManager()->get(CacheManager::class)->getCache('Sitegeist_Monocle_Fusion');
            $templateCache->flush();
        };
        $dispatcher->connect(FileMonitor::class, 'filesHaveChanged', $flushTemplates);
    }
}
