<?php

namespace Sitegeist\Monocle\Controller;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\ActionController;
use TYPO3\Flow\Resource\ResourceManager;

use TYPO3\Neos\Domain\Repository\SiteRepository;
use TYPO3\Neos\Domain\Model\Site;

use Sitegeist\Monocle\Helper\TypoScriptHelper;
use Sitegeist\Monocle\Helper\ContextHelper;
use Sitegeist\Monocle\TypoScript\TypoScriptService;
use Sitegeist\Monocle\TypoScript\TypoScriptView;
use Sitegeist\Monocle\TypoScript\ReverseTypoScriptParser;

class ApiController extends ActionController
{

    /**
     * @var array
     */
    protected $defaultViewObjectName = 'TYPO3\Flow\Mvc\View\JsonView';

    /**
     * @Flow\Inject
     * @var TypoScriptService
     */
    protected $typoScriptService;

    /**
     * @Flow\Inject
     * @var TypoScriptHelper
     */
    protected $typoScriptHelper;

    /**
     * @Flow\Inject
     * @var ContextHelper
     */
    protected $contextHelper;

    /**
     * @Flow\Inject
     * @var SiteRepository
     */
    protected $siteRepository;

    /**
     * @Flow\Inject
     * @var ResourceManager
     */
    protected $resourceManager;

    /**
     * @var array
     * @Flow\InjectConfiguration("viewportPresets")
     */
    protected $viewportPresets;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.additionalResources")
     */
    protected $additionalResources;

    /**
     * Get all styleguide objects
     *
     * @Flow\SkipCsrfProtection
     * @return void
     */
    public function styleguideObjectsAction() {
        $context = $this->contextHelper->getContext();
        $siteNode = $context->getCurrentSiteNode();

        $typoScriptObjectTree = $this->typoScriptService->getMergedTypoScriptObjectTree($siteNode);
        $styleguideObjects = [];
        if ($typoScriptObjectTree && $typoScriptObjectTree['__prototypes'] ) {
            foreach ($typoScriptObjectTree['__prototypes'] as $prototypeName => $prototypeObjectTree) {
                if (array_key_exists('__meta', $prototypeObjectTree) && is_array($prototypeObjectTree['__meta']) && array_key_exists('styleguide', $prototypeObjectTree['__meta'])) {
                    $styleguideConfiguration = $prototypeObjectTree['__meta']['styleguide'];
                    $styleguideObjects[$prototypeName] = [
                        'title' => (isset($styleguideConfiguration['title'])) ? $styleguideConfiguration['title'] : '',
                        'path' => (isset($styleguideConfiguration['path'])) ? $styleguideConfiguration['path'] : 'other',
                        'description' => (isset($styleguideConfiguration['description'])) ? $styleguideConfiguration['description'] : ''
                    ];
                }
            }
        }
        $this->view->assign('value', $styleguideObjects);
    }

    /**
     * Get all the configured resources
     *
     * @Flow\SkipCsrfProtection
     * @return void
     */
    public function styleguideResourcesAction() {
        $styleSheets = $this->additionalResources['styleSheets'];
        $javaScripts = $this->additionalResources['javaScripts'];

        $result = [
            'styleSheets' => [],
            'javaScripts' => []
        ];

        foreach ($styleSheets as $styleSheetPath) {
            $resolvedPath = $this->resolveResourcePathes($styleSheetPath);
            if ($resolvedPath) {
                $result['styleSheets'][] = $resolvedPath;
            }
        }

        foreach ($javaScripts as $javaScriptPath) {
            $resolvedPath = $this->resolveResourcePathes($javaScriptPath);
            if ($resolvedPath) {
                $result['javaScripts'][] = $resolvedPath;
            }
        }

        $this->view->assign('value', $result);
    }

    /**
     * Get all active sites
     *
     * @Flow\SkipCsrfProtection
     * @return void
     */
    public function sitesAction() {
        $siteInfo = [];
        $sites = $this->siteRepository->findAll()->toArray();
        /**
         * @var Site $site
         */
        foreach ($sites as $site) {
            $siteInfo[$site->getNodeName()] = [
                'name' => $site->getName(),
                'online' => $site->isOnline(),
                'nodeName' => $site->getNodeName(),
                'siteResourcesPackageKe' => $site->getSiteResourcesPackageKey()
             ];
        }
        $this->view->assign('value', $siteInfo);
    }

    /**
     * Get all configured breakpoints
     *
     * @Flow\SkipCsrfProtection
     * @return void
     */
    public function viewportPresetsAction() {
        $this->view->assign('value', $this->viewportPresets);
    }

    /**
     * Render the given prototype
     *
     * @Flow\SkipCsrfProtection
     * @param string $prototypeName
     * @return void
     */
    public function renderPrototypeAction($prototypeName) {
        $context = $this->contextHelper->getContext();
        $siteNode = $context->getCurrentSiteNode();

        // render html
        $typoScriptView = new TypoScriptView();
        $typoScriptView->setControllerContext($this->controllerContext);
        $typoScriptView->setTypoScriptPath('monoclePrototypeRenderer_' . str_replace(['.', ':'], ['_', '__'], $prototypeName));
        $typoScriptView->assignMultiple([
            'value' => $siteNode
        ]);

        // render fusion source
        $typoScriptObjectTree = $this->typoScriptService->getMergedTypoScriptObjectTree($siteNode);
        $typoScriptAst =  $typoScriptObjectTree['__prototypes'][$prototypeName];
        $typoScriptCode = ReverseTypoScriptParser::restorePrototypeCode($prototypeName, $typoScriptAst);

        $result = [
            'prototypeName' => $prototypeName,
            'renderedHtml' =>  $typoScriptView->render(),
            'renderedCode' => $typoScriptCode,
            'parsedCode' => json_encode($typoScriptAst)
        ];

        $this->view->assign('value', $result);
    }

    protected function resolveResourcePathes($path) {
        if (strpos($path, 'resource://') === 0) {
            try {
                list($package, $path) = $this->resourceManager->getPackageAndPathByPublicPath($path);
                return $this->resourceManager->getPublicPackageResourceUri($package, $path);
            } catch (Exception $exception) {
            }
        }
        return $path;
    }
}
