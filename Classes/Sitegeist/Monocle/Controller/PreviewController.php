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
     * @var string
     */
    protected $defaultViewObjectName = FusionView::class;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.fusionRootPath")
     */
    protected $fusionRootPath;

    /**
     * @Flow\Inject
     * @var PackageManagerInterface
     */
    protected $packageManager;

    /**
     * @Flow\Inject
     * @var FusionService
     */
    protected $fusionService;

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

        $this->view->setPackageKey($sitePackageKey);
        $this->view->setFusionPath($this->fusionRootPath);
        $this->view->assignMultiple([
            'sitePackageKey' => $sitePackageKey,
            'prototypeName' => $prototypeName,
            'html' => $html
        ]);
    }

    /**
     * @return void
     */
    public function iframeAction()
    {
        $sitePackages = $this->packageManager->getFilteredPackages('available', null, 'neos-site');
        $sitePackage = reset($sitePackages);
        $sitePackageKey = $sitePackage->getPackageKey();

        $this->view->setPackageKey($sitePackageKey);
        $this->view->setFusionPath($this->fusionRootPath);
        $this->view->assignMultiple([
            'sitePackageKey' => '',
            'prototypeName' => '',
            'html' => ''
        ]);
    }
}
