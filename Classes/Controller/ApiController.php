<?php
namespace Sitegeist\Monocle\Controller;

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
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\ResourceManagement\ResourceManager;
use Sitegeist\Monocle\Fusion\FusionService;
use Sitegeist\Monocle\Service\PackageKeyTrait;
use Sitegeist\Monocle\Service\ConfigurationService;
use Sitegeist\Monocle\Domain\PrototypeDetails\PrototypeDetailsFactory;

/**
 * Class ApiController
 * @package Sitegeist\Monocle\Controller
 */
class ApiController extends ActionController
{
    use PackageKeyTrait;

    /**
     * @var array
     */
    protected $defaultViewObjectName = 'Neos\Flow\Mvc\View\JsonView';

    /**
     * @Flow\Inject
     * @var FusionService
     */
    protected $fusionService;

    /**
     * @Flow\Inject
     * @var ResourceManager
     */
    protected $resourceManager;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.additionalResources")
     */
    protected $additionalResources;

    /**
     * @Flow\Inject
     * @var ConfigurationService
     */
    protected $configurationService;

    /**
     * @Flow\Inject
     * @var PrototypeDetailsFactory
     */
    protected $prototypeDetailsFactory;

    /**
     * Get all configurations for this site package
     *
     * @param string $sitePackageKey
     */
    public function configurationAction($sitePackageKey = null)
    {
        $sitePackageKey = $sitePackageKey ?: $this->getDefaultSitePackageKey();

        $value = [];
        $value['sitePackage'] = $sitePackageKey;
        $value['ui'] = [
            'sitePackages' =>  $this->getSitePackages(),
            'viewportPresets' => $this->configurationService->getSiteConfiguration($sitePackageKey, 'ui.viewportPresets'),
            'localePresets' => $this->configurationService->getSiteConfiguration($sitePackageKey, 'ui.localePresets'),
            'hotkeys' => $this->configurationService->getSiteConfiguration($sitePackageKey, 'ui.hotkeys'),
            'preview' => $this->configurationService->getSiteConfiguration($sitePackageKey, 'preview')
        ];
        $value['styleguideObjects'] = $this->getStyleguideObjects($sitePackageKey);

        $this->view->assign('value', $value);
    }

    /**
     * Render informations about the given prototype
     *
     * @Flow\SkipCsrfProtection
     * @param string $sitePackageKey
     * @param string $prototypeName
     * @return void
     */
    public function prototypeDetailsAction($sitePackageKey, $prototypeName)
    {
        $prototypeDetails = $this->prototypeDetailsFactory
            ->forPrototypeInSitePackage(
                $prototypeName,
                $sitePackageKey ?: $this->getDefaultSitePackageKey(),
                $this->getControllerContext()
            );

        $this->view->assign('value', $prototypeDetails);
    }

    /**
     * Render the given prototype
     *
     * @Flow\SkipCsrfProtection
     * @param string $prototypeName
     * @param string $sitePackageKey
     * @return void
     * @deprecated
     */
    public function renderPrototypeAction($prototypeName, $sitePackageKey = null)
    {
        return $this->prototypeDetailsAction($sitePackageKey, $prototypeName);
    }

    /**
     * @return array
     */
    protected function getSitePackages(): array
    {
        $sitePackageKeys = $this->getActiveSitePackageKeys();
        $result = [];

        foreach ($sitePackageKeys as $sitePackageKey) {
            $result[$sitePackageKey] = $sitePackageKey;
        }
        return $result;
    }

    /**
     * @param $sitePackageKey
     * @param $styleguideObject
     * @return array
     * @throws \Neos\Neos\Domain\Exception
     */
    protected function getStyleguideObjects($sitePackageKey): array
    {
        $fusionAst = $this->fusionService->getMergedFusionObjectTreeForSitePackage($sitePackageKey);
        $styleguideObjects = $this->fusionService->getStyleguideObjectsFromFusionAst($fusionAst);
        $prototypeStructures = $this->configurationService->getSiteConfiguration($sitePackageKey, 'ui.structure');

        foreach ($styleguideObjects as $prototypeName => &$styleguideObject) {
            $styleguideObject['structure'] = $this->getStructureForPrototypeName($prototypeStructures, $prototypeName);
        }

        $hiddenPrototypeNamePatterns = $this->configurationService->getSiteConfiguration($sitePackageKey, 'hiddenPrototypeNamePatterns');
        if (is_array($hiddenPrototypeNamePatterns)) {
            $alwaysShowPrototypes = $this->configurationService->getSiteConfiguration($sitePackageKey, 'alwaysShowPrototypes');
            foreach ($hiddenPrototypeNamePatterns as $pattern) {
                $styleguideObjects = array_filter(
                    $styleguideObjects,
                    function ($prototypeName) use ($pattern, $alwaysShowPrototypes) {
                        if (in_array($prototypeName, $alwaysShowPrototypes, true)) {
                            return true;
                        }
                        return fnmatch($pattern, $prototypeName) === false;
                    },
                    ARRAY_FILTER_USE_KEY
                );
            }
        }
        return $styleguideObjects;
    }

    /**
     * Find the matching structure for a prototype
     *
     * @param $prototypeStructures
     * @param $prototypeName
     * @return array
     */
    protected function getStructureForPrototypeName($prototypeStructures, $prototypeName)
    {
        foreach ($prototypeStructures as $structure) {
            if (preg_match(sprintf('!%s!', $structure['match']), $prototypeName)) {
                return $structure;
            }
        }

        return [
            'label' => 'Other',
            'icon' => 'icon-question',
            'color' => 'white'
        ];
    }
}
