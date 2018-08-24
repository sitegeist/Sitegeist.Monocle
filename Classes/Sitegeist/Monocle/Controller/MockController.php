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

/**
 * Class MockController
 * @package Sitegeist\Monocle\Controller
 */
class MockController extends ActionController
{
    /**
     * Return the given content and the type header
     *
     * @param string $content
     * @param string $type
     * @return void
     */
    public function mirrorAction($content = '', $type = 'text/html')
    {
        $this->response->setHeader('Content-Type', $type);
        return $content;
    }
}
