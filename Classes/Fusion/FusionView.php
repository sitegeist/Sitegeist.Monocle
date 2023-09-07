<?php
namespace Sitegeist\Monocle\Fusion;

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
use Neos\Fusion\Core\FusionConfiguration;
use Neos\Fusion\View\FusionView as BaseFusionView;
use Neos\Fusion\Core\Runtime as FusionRuntime;
use Neos\Flow\I18n\Locale;
use Neos\Flow\I18n\Service;

/**
 * A specialized fusion view that
 */
class FusionView extends BaseFusionView
{
    const RENDERPATH_DISCRIMINATOR = 'monoclePrototypeRenderer_';

    /**
     * @Flow\Inject
     * @var \Sitegeist\Monocle\Fusion\FusionService
     */
    protected $fusionService;

    /**
     * @Flow\Inject
     * @var Service
     */
    protected $i18nService;

    /**
     * Load Fusion from the directories specified by $this->getOption('fusionPathPatterns')
     *
     * @return void
     */
    protected function loadFusion()
    {
        $parsedFusion = $this->fusionService->getFusionConfigurationForPackageKey($this->getOption('packageKey'));
        /** @todo remove the switch after Neos 8 support is removed */
        $r = new \ReflectionClass(static::class);
        $parsedFusionType = $r->getProperty('parsedFusion')->getType();
        if ($parsedFusionType?->getName() === FusionConfiguration::class) {
            $this->parsedFusion = $parsedFusion;
        } else {
            $this->parsedFusion = $parsedFusion->toArray();
        }
    }

    /**
     * Set locales for I18n
     *
     * @param array $locales
     * @return void
     */
    public function setLocales(array $locales)
    {
        $currentLocale = new Locale($locales[0]);
        $this->i18nService->getConfiguration()->setCurrentLocale($currentLocale);
        $this->i18nService->getConfiguration()->setFallbackRule(array('strict' => false, 'order' => array_reverse($locales)));
    }
}
