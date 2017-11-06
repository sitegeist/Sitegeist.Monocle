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
use Neos\Flow\Mvc\View\ViewInterface;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\ResourceManagement\ResourceManager;
use Neos\Flow\Package\PackageManagerInterface;
use Sitegeist\Monocle\Fusion\FusionService;
use Sitegeist\Monocle\Fusion\FusionView;
use Sitegeist\Monocle\Service\PackageKeyTrait;

/**
 * Class PreviewController
 * @package Sitegeist\Monocle\Controller
 */
class PreviewController extends ActionController
{
    use PackageKeyTrait;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.additionalResources")
     */
    protected $additionalResources;

    /**
     * @var array
     * @Flow\InjectConfiguration("defaultPrototypeName")
     */
    protected $defaultPrototypeName;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.metaViewport")
     */
    protected $metaViewport;

    /**
     * @var array
     * @Flow\InjectConfiguration("ui")
     */
    protected $uiSettings;

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
     * Initialize the view
     *
     * @param  ViewInterface $view
     * @return void
     */
    public function initializeView(ViewInterface $view)
    {
        $view->assign('defaultSitePackageKey', $this->getDefaultSitePackageKey());
        $view->assign('defaultPrototypeName', json_encode($this->defaultPrototypeName));
        $view->assign('metaViewport', $this->metaViewport);
        $this->view->assign('uiSettings', json_encode($this->uiSettings));

        //
        // Resolve resource uris in beforehand
        //
        $view->assign('additionalResources', array_map(function ($resourceList) {
            return array_map(function ($path) {
                if (strpos($path, 'resource://') === 0) {
                    list($package, $path) = $this->resourceManager->getPackageAndPathByPublicPath($path);
                    return $this->resourceManager->getPublicPackageResourceUri($package, $path);
                }

                return $path;
            }, $resourceList);
        }, $this->additionalResources));
    }

    /**
     * @return void
     */
    public function moduleAction()
    {
    }

    /**
     * @param  string $prototypeName
     * @param  string $sitePackageKey
     * @param  string $propSet
     * @param  string $props props as json encoded string
     * @return void
     */
    public function componentAction($prototypeName, $sitePackageKey, $propSet = '__default', $props = '')
    {
        $renderProps = [];

        if ($props) {
            $data = json_decode($props, true);
            if (is_array($data)) {
                $renderProps = $data;
            }
        }

        $sitePackageKey = $sitePackageKey ?: $this->getDefaultSitePackageKey();

        $prototypePreviewRenderPath = FusionService::RENDERPATH_DISCRIMINATOR . str_replace(['.', ':'], ['_', '__'], $prototypeName);

        $typoScriptView = new FusionView();
        $typoScriptView->setControllerContext($this->getControllerContext());
        $typoScriptView->setFusionPath($prototypePreviewRenderPath);
        $typoScriptView->setPackageKey($sitePackageKey);

        $html = $typoScriptView->renderStyleguidePrototype($prototypeName, $propSet, $renderProps);

        $this->view->assignMultiple([
            'packageKey' => $sitePackageKey,
            'prototypeName' => $prototypeName,
            'renderedHtml' => $html
        ]);
    }
}
