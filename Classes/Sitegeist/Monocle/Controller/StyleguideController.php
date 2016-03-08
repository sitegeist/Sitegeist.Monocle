<?php

namespace Sitegeist\Monocle\Controller;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Neos\Domain\Model\Site;
use TYPO3\Neos\Controller\Module\AbstractModuleController;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\Eel\FlowQuery\FlowQuery;

use Sitegeist\Monocle\Helper\TypoScriptHelper;
use Sitegeist\Monocle\Helper\ContextHelper;
use Sitegeist\Monocle\TypoScript\TypoScriptService;

class StyleguideController extends AbstractModuleController
{

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.defaultPath")
     */
    protected $defaultPath;

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
     * @var array
     * @Flow\InjectConfiguration("breakpoints")
     */
    protected $breakpoints;

    /**
     * @param NodeInterface $node
     * @param string $type
     * @param string $path
     * @param boolean $showRenderedResult
     * @param boolean $showRenderedCode
     * @param boolean $showDescription
     * @return void
     */
    public function indexAction($type = NULL, $path = NULL, $showRenderedResult = TRUE, $showRenderedCode = FALSE, $showDescription = FALSE) {

        if ($path == NULL) {
            $path=$this->defaultPath;
        }

        $context = $this->contextHelper->getContext();
        $site = $context->getCurrentSiteNode();

        $styleguideRootSection = $this->typoScriptHelper->buildStylegideSectionsForNode($site);

        $this->view->assign('initialState', $this->getInitialState($site));

        $this->view->assign('styleguideRootSection', $styleguideRootSection);

        $this->view->assign('type', $type);
        $this->view->assign('path', $path);

        $this->view->assign('showRenderedResult', $showRenderedResult);
        $this->view->assign('showRenderedCode', $showRenderedCode);
        $this->view->assign('showDescription', $showDescription);
    }

    protected function getInitialState(NodeInterface $siteNode)
    {
        $typoScriptObjectTree = $this->typoScriptService->getMergedTypoScriptObjectTree($siteNode);
        $styleguideObjectTree = $this->typoScriptHelper->buildStyleguideObjectTree($typoScriptObjectTree);

        $initialState = [
            'ui' => [
                'showCode' => TRUE,
                'showPreview' => TRUE,
                'showDescription' => TRUE
            ],
            'breakpoints' => $this->breakpoints,
            'styleguideObjectTree' => $styleguideObjectTree,
            'ts' => $typoScriptObjectTree
        ];


        return $initialState;
    }
}