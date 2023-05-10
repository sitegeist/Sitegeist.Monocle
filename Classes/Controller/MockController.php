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
use Neos\Flow\Http\Component\SetHeaderComponent;
use Neos\Flow\Property\Exception\TargetNotFoundException;

/**
 * Class MockController
 * @package Sitegeist\Monocle\Controller
 */
class MockController extends ActionController
{
    /**
     * @var array
     * @Flow\InjectConfiguration(path="uriMock.static")
     */
    protected $staticUriMocks;

    /**
     * Return the given content and the type header
     *
     * @param string $content
     * @param string $type
     * @return void
     */
    public function mirrorAction($content = '', $type = 'text/html')
    {
        $this->response->setComponentParameter(SetHeaderComponent::class, 'Content-Type', $type);
        return $content;
    }

    /**
     * Return the given static content as defined in the configuration
     *
     * @param string $key
     * @return void
     */
    public function staticAction($key)
    {
        if ($key && is_array($this->staticUriMocks) && array_key_exists($key, $this->staticUriMocks)) {
            $config = $this->staticUriMocks[$key];
            $this->response->setComponentParameter(SetHeaderComponent::class, 'Content-Type', $config['contentType']);
            return file_get_contents($config['path']);
        }

        throw new TargetNotFoundException();
    }
}
