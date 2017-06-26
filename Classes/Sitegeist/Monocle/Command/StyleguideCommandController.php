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
use Neos\Flow\Package\PackageManagerInterface;
use Symfony\Component\Yaml\Yaml;
use Sitegeist\Monocle\Service\DummyControllerContextTrait;

/**
 * Class StyleguideCommandController
 * @package Sitegeist\Monocle\Command
 */
class StyleguideCommandController extends CommandController
{
    use DummyControllerContextTrait;

    /**
     * @Flow\Inject
     * @var PackageManagerInterface
     */
    protected $packageManager;

    /**
     * @var array
     * @Flow\InjectConfiguration("viewportPresets")
     */
    protected $viewportPresets;

    /**
     * @Flow\Inject
     * @var FusionService
     */
    protected $fusionService;

    /**
     * Get a list of all configured default styleguide viewports
     *
     * @param string $format Result encoding ``yaml`` and ``json`` are supported
     */
    public function viewportsCommand($format = 'json')
    {
        $this->outputData($this->viewportPresets, $format);
    }

    /**
     * Get all styleguide items currently available
     *
     * @param string $format Result encoding ``yaml`` and ``json`` are supported
     */
    public function itemsCommand($format = 'json')
    {
        $sitePackages = $this->packageManager->getFilteredPackages('available', null, 'neos-site');
        $sitePackage = reset($sitePackages);
        $sitePackageKey = $sitePackage->getPackageKey();

        $fusionAst = $this->fusionService->getMergedTypoScriptObjectTreeForSitePackage($sitePackageKey);
        $styleguideObjects = $this->fusionService->getStyleguideObjectsFromFusionAst($fusionAst);

        $this->outputData($styleguideObjects, $format);
    }

    /**
     * Render a given fusion component to HTML
     *
     * @param string $prototypeName The prototype name of the component
     * @return void
     */
    public function renderCommand($prototypeName)
    {
        $prototypePreviewRenderPath = FusionService::RENDERPATH_DISCRIMINATOR . str_replace(['.', ':'], ['_', '__'], $prototypeName);
        $controllerContext = $this->createDummyControllerContext();

        //
        // Extract package key from prototype name
        //
        list($packageKey) = explode(':', $prototypeName);

        $typoScriptView = new FusionView();
        $typoScriptView->setControllerContext($controllerContext);
        $typoScriptView->setFusionPath($prototypePreviewRenderPath);
        $typoScriptView->setPackageKey($packageKey);

        $this->output($typoScriptView->render());
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
