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
use Neos\Neos\Controller\Module\AbstractModuleController;

/**
 * Class StyleguideController
 * @package Sitegeist\Monocle\Controller
 */
class StyleguideController extends AbstractModuleController
{

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.defaultPath")
     */
    protected $defaultPath;

    /**
     * @return void
     */
    public function indexAction()
    {
    }
}
