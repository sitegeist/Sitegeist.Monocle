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
use Sitegeist\Monocle\Service\PackageKeyTrait;
use Sitegeist\Monocle\Service\ConfigurationService;

/**
 * Class ModuleController
 * @package Sitegeist\Monocle\Controller
 */
class ModuleController extends ActionController
{
    use PackageKeyTrait;

    /**
     * @Flow\Inject
     * @var ConfigurationService
     */
    protected $configurationService;

    /**
     * Initialize the view
     *
     * @param  ViewInterface $view
     * @return void
     */
    public function initializeView(ViewInterface $view)
    {
        $sitePackageKey = $this->getDefaultSitePackageKey();
        $uiSettings = $this->configurationService->getSiteConfiguration($sitePackageKey, 'ui');
        $previewSettings = $this->configurationService->getSiteConfiguration($sitePackageKey, 'preview');

        $this->view->assign('defaultSitePackageKey', $sitePackageKey);
        $this->view->assign('uiSettings', json_encode($uiSettings));
        $this->view->assign('previewSettings', json_encode($previewSettings));
    }

    /**
     * @return void
     */
    public function indexAction()
    {
    }
}
