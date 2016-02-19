<?php

namespace Sitegeist\Monocle\Controller;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\Flow\Mvc\Controller\ActionController;

use Sitegeist\Monocle\Helper\TypoScriptHelper;

class PreviewController extends ActionController
{

    /**
     * @Flow\Inject
     * @var TypoScriptHelper
     */
    protected $typoScriptHelper;

    /**
     * @param NodeInterface $node
     * @param string $path
     * @return void
     */
    public function showAction(NodeInterface $node, $path = NULL) {
        $rootStyleguideSections = $this->typoScriptHelper->buildStylegideSectionsForNode($node);
        $styleguideSections = $rootStyleguideSections->byPath($path);

        $this->view->assign('styleguideSections', $styleguideSections);
        $this->view->assign('node', $node);
    }
}