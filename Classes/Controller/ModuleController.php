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
use Sitegeist\Monocle\Domain\StyleguideRepository;
use Sitegeist\Monocle\Service\ConfigurationService;

/**
 * Class ModuleController
 * @package Sitegeist\Monocle\Controller
 */
class ModuleController extends ActionController
{
    #[Flow\Inject]
    protected StyleguideRepository $styleguideRepository;

    #[Flow\Inject]
    protected ConfigurationService $configurationService;

    /**
     * Initialize the view
     *
     * @param  ViewInterface $view
     * @return void
     */
    public function initializeView(ViewInterface $view)
    {
        $defaultStyleguide = $this->styleguideRepository->getDefault();
        $styleguideAddress = $defaultStyleguide->address->toString();

        $this->view->assign('defaultStyleguideAddress', $styleguideAddress);
    }

    /**
     * @return void
     */
    public function indexAction()
    {
    }
}
