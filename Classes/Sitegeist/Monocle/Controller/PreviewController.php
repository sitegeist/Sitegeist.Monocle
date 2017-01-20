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
use Sitegeist\Monocle\TypoScript\TypoScriptService;
use Sitegeist\Monocle\TypoScript\TypoScriptView;

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
     * @Flow\Inject
     * @var TypoScriptService
     */
    protected $typoScriptService;

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

        $prototypePreviewRenderPath = TypoScriptService::RENDERPATH_DISCRIMINATOR . str_replace(['.', ':'], ['_', '__'], $prototypeName);

        $typoScriptView = new TypoScriptView();
        $typoScriptView->setControllerContext($this->getControllerContext());
        $typoScriptView->setTypoScriptPath($prototypePreviewRenderPath);
        $typoScriptView->setPackageKey($sitePackageKey);

        $html = $typoScriptView->render();

        $this->view->assignMultiple([
            'packageKey' => $sitePackageKey,
            'prototypeName' => $prototypeName,
            'renderedHtml' => $html
        ]);
    }
}
