<?php
namespace Sitegeist\Monocle\Command;

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

use Sitegeist\Monocle\Fusion\FusionService;
use Sitegeist\Monocle\Fusion\FusionView;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Cli\CommandController;
use Symfony\Component\Yaml\Yaml;
use Sitegeist\Monocle\Service\DummyControllerContextTrait;
use Sitegeist\Monocle\Service\PackageKeyTrait;
use Sitegeist\Monocle\Service\ConfigurationService;

/**
 * Class StyleguideCommandController
 * @package Sitegeist\Monocle\Command
 */
class StyleguideCommandController extends CommandController
{
    use DummyControllerContextTrait, PackageKeyTrait;

    /**
     * @Flow\Inject
     * @var FusionService
     */
    protected $fusionService;

    /**
     * @Flow\Inject
     * @var ConfigurationService
     */
    protected $configurationService;

    /**
     * Get a list of all configured default styleguide viewports
     *
     * @param string $format Result encoding ``yaml`` and ``json`` are supported
     * @param string $packageKey site-package (defaults to first found)
     */
    public function viewportsCommand($format = 'json', $packageKey = null)
    {
        $sitePackageKey = $packageKey ?: $this->getDefaultSitePackageKey();
        $viewportPresets = $this->configurationService->getSiteConfiguration($sitePackageKey, 'ui.viewportPresets');
        $this->outputData($viewportPresets, $format);
    }

    /**
     * Get all styleguide items currently available
     *
     * @param string $format Result encoding ``yaml`` and ``json`` are supported
     * @param string $packageKey site-package (defaults to first found)
     */
    public function itemsCommand($format = 'json', $packageKey = null)
    {
        $sitePackageKey = $packageKey ?: $this->getDefaultSitePackageKey();

        $fusionAst = $this->fusionService->getMergedFusionObjectTreeForSitePackage($sitePackageKey);
        $styleguideObjects = $this->fusionService->getStyleguideObjectsFromFusionAst($fusionAst);

        $this->outputData($styleguideObjects, $format);
    }

    /**
     * Render a given fusion component to HTML
     *
     * @param string $prototypeName The prototype name of the component
     * @param string $packageKey site-package (defaults to first found)
     * @param string $propSet The propSet used for the preview
     * @param string $props Custom props for the preview
     * @param string $locales Custom locales for the preview
     * @return void
     */
    public function renderCommand($prototypeName, $packageKey = null, $propSet = '__default', $props = '', $locales = '')
    {
        $sitePackageKey = $packageKey ?: $this->getDefaultSitePackageKey();

        $controllerContext = $this->createDummyControllerContext();

        $fusionView = new FusionView();
        $fusionView->setControllerContext($controllerContext);
        $fusionView->setPackageKey($sitePackageKey);

        $convertedProps = json_decode($props, true) ?? [];
        $convertedLocales = json_decode($locales, true) ?? [];

        print($fusionView->renderStyleguidePrototype($prototypeName, $propSet, $convertedProps, $convertedLocales));
    }

    protected function outputData($data, $format)
    {
        switch ($format) {
            case 'json':
                $json = json_encode($data);
                $this->outputLine($json . chr(10));
                break;
            case 'yaml':
                $yaml = Yaml::dump($data, 99);
                $this->outputLine($yaml . chr(10));
                break;
            default:
                throw new \Exception(sprintf('Unsupported format %s', $format));
                break;
        }
    }
}
