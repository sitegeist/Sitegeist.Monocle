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

use GuzzleHttp\Psr7\Message;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ActionController;
use Sitegeist\Monocle\Service\PackageKeyTrait;
use Sitegeist\Monocle\Fusion\FusionView;
use Sitegeist\Monocle\Service\ConfigurationService;
use Neos\Flow\Http\Component\SetHeaderComponent;

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
     * @var string
     * @Flow\InjectConfiguration(package="Neos.Flow", path="i18n.defaultLocale");
     */
    protected $defaultLocale;

    /**
     * @var string
     * @Flow\InjectConfiguration(package="Neos.Flow", path="i18n.fallbackRule.order");
     */
    protected $localeFallback;

    /**
     * @param  string $prototypeName
     * @param  string $sitePackageKey
     * @param  string|null $useCase
     * @param  string|null  $propSet
     * @param  string|null  $props props as json encoded string
     * @param  string|null  $locales locales-fallback-chain as comma sepertated string
     * @param  bool|null $showGrid
     * @return void
     */
    public function indexAction(string $prototypeName, string $sitePackageKey, ?string $useCase = '__default', ?string $propSet = '__default', ?string $props = '', ?string $locales = '', ?bool $showGrid = false)
    {
        $renderProps = [];
        if ($props) {
            $data = json_decode($props, true);
            if (is_array($data)) {
                $renderProps = $data;
            }
        }

        if ($useCase == '__default') {
            $useCase = null;
        }

        if ($propSet == '__default') {
            $propSet = null;
        }

        if ($locales) {
            $renderLocales = explode(',', $locales);
        } else {
            $renderLocales = $this->localeFallback ?: [$this->defaultLocale];
        }

        $sitePackageKey = $sitePackageKey ?: $this->getDefaultSitePackageKey();
        $fusionRootPath = $this->configurationService->getSiteConfiguration($sitePackageKey, ['preview', 'fusionRootPath']);

        $this->view->setPackageKey($sitePackageKey);
        $this->view->setFusionPath($fusionRootPath);
        $this->view->setLocales($renderLocales);

        if ($showGrid) {
            $gridConfiguration = $this->configurationService->getSiteConfiguration($sitePackageKey, ['ui', 'grid']);
        }

        $this->view->assignMultiple([
            'sitePackageKey' => $sitePackageKey,
            'prototypeName' => $prototypeName,
            'useCase' => $useCase,
            'propSet' => $propSet,
            'props' => $renderProps,
            'locales' => $renderLocales,
            'grid' => $gridConfiguration ?? null
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
                    $renderedResponse = Message::parseResponse($header);
                    $this->response->setStatusCode($renderedResponse->getStatusCode());
                    foreach ($renderedResponse->getHeaders() as $headerName => $headerValues) {
                        $this->response->setComponentParameter(SetHeaderComponent::class, $headerName, $headerValues);
                    }
                    $output = substr($output, strlen($header));
                } catch (\InvalidArgumentException $exception) {
                }
            }
        }

        return $output;
    }
}
