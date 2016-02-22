<?php

namespace Sitegeist\Monocle\Controller;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\Flow\Mvc\Controller\ActionController;

use Sitegeist\Monocle\Helper\TypoScriptHelper;
use Sitegeist\Monocle\Helper\ContextHelper;

class PreviewController extends ActionController
{

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.defaultPath")
     */
    protected $defaultPath;

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.additionalResources")
     */
    protected $additionalResources;

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
     * @param NodeInterface $node
     * @param string $type
     * @param string $path
     * @param boolean $showRenderedResult
     * @param boolean $showRenderedCode
     * @param boolean $showDescription
     * @return void
     */
    public function showAction($type = NULL ,$path = NULL, $showRenderedResult = TRUE, $showRenderedCode = FALSE, $showDescription = FALSE) {

        if ($path == NULL) {
            $path=$this->defaultPath;
        }

        $context = $this->contextHelper->getContext();
        $site = $context->getCurrentSiteNode();

        $rootStyleguideSections = $this->typoScriptHelper->buildStylegideSectionsForNode($site);
        $styleguideSections = $rootStyleguideSections->byPath($path);

        $this->view->assign('type', $type);
        $this->view->assign('path', $path);
        $this->view->assign('node',  $site);

        $this->view->assign('styleguideRootSections', $rootStyleguideSections);
        $this->view->assign('styleguideSections', $styleguideSections);
        $this->view->assign('showRenderedResult', $showRenderedResult);
        $this->view->assign('showRenderedCode', $showRenderedCode);
        $this->view->assign('showDescription', $showDescription);

        $this->view->assign('additionalResources', $this->additionalResources);
    }
}