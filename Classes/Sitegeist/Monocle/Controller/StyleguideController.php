<?php

namespace Sitegeist\Monocle\Controller;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Neos\Controller\Module\AbstractModuleController;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\Eel\FlowQuery\FlowQuery;

use Sitegeist\Monocle\Helper\TypoScriptHelper;
use Sitegeist\Monocle\Helper\ContextHelper;

class StyleguideController extends AbstractModuleController
{



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
    public function indexAction($type = NULL, $path = NULL, $showRenderedResult = TRUE, $showRenderedCode = FALSE, $showDescription = FALSE) {
        $context = $this->contextHelper->getContext();
        $site = $context->getCurrentSiteNode();

        $styleguideRootSection = $this->typoScriptHelper->buildStylegideSectionsForNode($site);

        $this->view->assign('styleguideRootSection', $styleguideRootSection);

        $this->view->assign('type', $type);
        $this->view->assign('path', $path);

        $this->view->assign('showRenderedResult', $showRenderedResult);
        $this->view->assign('showRenderedCode', $showRenderedCode);
        $this->view->assign('showDescription', $showDescription);
    }
}