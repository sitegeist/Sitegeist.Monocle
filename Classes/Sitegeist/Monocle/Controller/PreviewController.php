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
use Sitegeist\Monocle\Service\PackageKeyTrait;
use Sitegeist\Monocle\Fusion\FusionView;
use Neos\Flow\Http\Response;

/**
 * Class PreviewController
 * @package Sitegeist\Monocle\Controller
 */
class PreviewController extends ActionController
{
    use PackageKeyTrait;

    /**
     * @var string
     */
    protected $defaultViewObjectName = FusionView::class;

    /**
     * @var array
     * @Flow\InjectConfiguration("defaultPrototypeName")
     */
    protected $defaultPrototypeName;

    /**
     * @Flow\InjectConfiguration("preview.metaViewport")
     * @var FusionView
     */
    protected $view;

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
     * @Flow\InjectConfiguration("preview.fusionRootPath")
     * @var string
     */
    protected $fusionRootPath;

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
     * @param  string $prototypeName
     * @param  string $sitePackageKey
     * @param  string $propSet
     * @param  array $props
     * @return void
     */
    public function componentAction($prototypeName, $sitePackageKey, $propSet = '__default', array $props = [])
    {
        $sitePackageKey = $sitePackageKey ?: $this->getDefaultSitePackageKey();

        $this->view->setPackageKey($sitePackageKey);
        $this->view->setFusionPath($this->fusionRootPath);
        $this->view->assignMultiple([
            'sitePackageKey' => $sitePackageKey,
            'prototypeName' => $prototypeName,
            'propSet' => $propSet,
            'props' => $props
        ]);

        // get the status and headers from the view
        $result = $this->view->render();
        $result = $this->mergeHttpResponseFromOutput($result);
        return $result;
    }

    /**
     * @param string $output
     * @return string The message body without the message head
     */
    protected function mergeHttpResponseFromOutput($output)
    {
        if (substr($output, 0, 5) === 'HTTP/') {
            $endOfHeader = strpos($output, "\r\n\r\n");
            if ($endOfHeader !== false) {
                $header = substr($output, 0, $endOfHeader + 4);
                try {
                    $renderedResponse = Response::createFromRaw($header);

                    /** @var Response $response */
                    $response = $this->controllerContext->getResponse();
                    $response->setStatus($renderedResponse->getStatusCode());
                    foreach ($renderedResponse->getHeaders()->getAll() as $headerName => $headerValues) {
                        $response->setHeader($headerName, $headerValues[0]);
                    }

                    $output = substr($output, strlen($header));
                } catch (\InvalidArgumentException $exception) {
                }
            }
        }

        return $output;
    }
}
