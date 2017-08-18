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
use Sitegeist\Monocle\Service\PackageKeyTrait;

/**
 * Class ModuleController
 * @package Sitegeist\Monocle\Controller
 */
class ModuleController extends ActionController
{
    use PackageKeyTrait;

    /**
     * @var array
     * @Flow\InjectConfiguration("ui")
     */
    protected $uiSettings;

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
        $this->view->assign('defaultSitePackageKey', $this->getDefaultSitePackageKey());
        $this->view->assign('uiSettings', json_encode($this->uiSettings));
    }

    /**
     * @return void
     */
    public function indexAction()
    {
    }
}
