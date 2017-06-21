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

/**
 * Class PreviewController
 * @package Sitegeist\Monocle\Controller
 */
class PreviewController extends ActionController
{
    /**
     * @Flow\Inject
     * @var PackageManagerInterface
     */
    protected $packageManager;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.defaultPath")
     */
    protected $defaultPath;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.additionalResources")
     */
    protected $additionalResources;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.metaViewport")
     */
    protected $metaViewport;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.htmlTagAttributes")
     */
    protected $htmlTagAttributes;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.bodyTagAttributes")
     */
    protected $bodyTagAttributes;

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
        $view->assign('defaultPath', $this->defaultPath);
        $view->assign('metaViewport', $this->metaViewport);

        $htmlTagAttributes = ' ';
        if ($this->htmlTagAttributes && is_array($this->htmlTagAttributes)) {
            foreach ($this->htmlTagAttributes as $key => $value) {
                $htmlTagAttributes .= $key . '="' . $value . '" ';
            }
        }
        $view->assign('htmlTagAttributes', $htmlTagAttributes);

        $bodyTagAttributes = ' ';
        if ($this->bodyTagAttributes && is_array($this->bodyTagAttributes)) {
            foreach ($this->bodyTagAttributes as $key => $value) {
                $bodyTagAttributes .= $key . '="' . $value . '" ';
            }
        }
        $view->assign('bodyTagAttributes', $bodyTagAttributes);

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
     * @return void
     */
    public function iframeAction()
    {
    }

    /**
     * @param  string $prototypeName
     * @return void
     */
    public function componentAction($prototypeName)
    {
        $sitePackages = $this->packageManager->getFilteredPackages('available', null, 'neos-site');
        $sitePackage = reset($sitePackages);
        $sitePackageKey = $sitePackage->getPackageKey();

        $prototypePreviewRenderPath = FusionService::RENDERPATH_DISCRIMINATOR . str_replace(['.', ':'], ['_', '__'], $prototypeName);

        $typoScriptView = new FusionView();
        $typoScriptView->setControllerContext($this->getControllerContext());
        $typoScriptView->setFusionPath($prototypePreviewRenderPath);
        $typoScriptView->setPackageKey($sitePackageKey);

        $html = $typoScriptView->render();

        $this->view->assignMultiple([
            'packageKey' => $sitePackageKey,
            'prototypeName' => $prototypeName,
            'renderedHtml' => $html
        ]);
    }
}
