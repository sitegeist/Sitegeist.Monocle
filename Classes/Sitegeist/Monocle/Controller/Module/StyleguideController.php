<?php

namespace Sitegeist\Monocle\Controller\Module;

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
     * @param string $path
     * @param NodeInterface $node
     * @return void
     */
    public function indexAction($path = NULL, NodeInterface $node = NULL) {
        $context = $this->contextHelper->getContext($node);
        $site = $context->getCurrentSiteNode();

        if ($node == NULL) {
            $node = $site;
        }

        $styleguideRootSection = $this->typoScriptHelper->buildStylegideSectionsForNode($node);

        $this->view->assign('styleguideRootSection', $styleguideRootSection);

        $this->view->assign('path', $path);
        $this->view->assign('node', $node);
        $this->view->assign('site', $site);
    }
}