<?php

namespace Sitegeist\Monocle\Controller;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\ActionController;
use TYPO3\Neos\Domain\Repository\SiteRepository;
use TYPO3\Neos\Domain\Model\Site;

use Sitegeist\Monocle\Helper\TypoScriptHelper;
use Sitegeist\Monocle\Helper\ContextHelper;
use Sitegeist\Monocle\TypoScript\TypoScriptService;
use Sitegeist\Monocle\TypoScript\TypoScriptView;

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
     * @var array
     * @Flow\InjectConfiguration("viewportPresets")
     */
    protected $viewportPresets;

    /**
     * Get all styleguide objects
     *
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
     * Get all active sites
     *
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
     * @return void
     */
    public function viewportPresetsAction() {
        $this->view->assign('value', $this->viewportPresets);
    }

    /**
     * Render the given prototype
     *
     * @param string $prototypeName
     * @return void
     */
    public function renderPrototypeAction($prototypeName) {
        $context = $this->contextHelper->getContext();
        $siteNode = $context->getCurrentSiteNode();

        $typoScriptView = new TypoScriptView();
        $typoScriptView->setControllerContext($this->controllerContext);
        $typoScriptView->setTypoScriptPath('monoclePrototypeRenderer_' . str_replace(['.', ':'], ['_', '__'], $prototypeName));
        $typoScriptView->assignMultiple([
            'value' => $siteNode
        ]);

        $renderedSourceCode = $typoScriptView->render();

        $this->view->assign('value', $renderedSourceCode);
    }
}
