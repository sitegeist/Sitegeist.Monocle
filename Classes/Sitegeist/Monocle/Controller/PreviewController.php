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
use Sitegeist\Monocle\Service\ConfigurationService;

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
     * @var FusionView
     */
    protected $view;

    /**
     * @Flow\Inject
     * @var ConfigurationService
     */
    protected $configurationService;

    /**
     * @param  string $prototypeName
     * @param  string $sitePackageKey
     * @param  string $propSet
     * @param  string $props props as json encoded string
     * @return void
     */
    public function indexAction($prototypeName, $sitePackageKey, $propSet = '__default', $props = '')
    {
        $renderProps = [];

        if ($props) {
            $data = json_decode($props, true);
            if (is_array($data)) {
                $renderProps = $data;
            }
        }

        $sitePackageKey = $sitePackageKey ?: $this->getDefaultSitePackageKey();
        $fusionRootPath = $this->configurationService->getSiteConfiguration($sitePackageKey, ['preview', 'fusionRootPath']);

        $this->view->setPackageKey($sitePackageKey);
        $this->view->setFusionPath($fusionRootPath);

        $this->view->assignMultiple([
            'sitePackageKey' => $sitePackageKey,
            'prototypeName' => $prototypeName,
            'propSet' => $propSet,
            'props' => $renderProps
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
