<?php


namespace Sitegeist\Monocle\ViewHelpers;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use Sitegeist\Monocle\Helper\ContextHelper;
use Sitegeist\Monocle\TypoScript\TypoScriptView;

class RenderPrototypeViewHelper extends AbstractViewHelper
{

    /**
     * @Flow\Inject
     * @var ContextHelper
     */
    protected $contextHelper;

    /**
     * @param string $prototypeName
     * @param NodeInterface $node
     * @return mixed
     */
    public function render($prototypeName, NodeInterface $node)
    {
        $typoScriptView = new TypoScriptView();
        $typoScriptView->setControllerContext($this->controllerContext);
        $typoScriptView->setTypoScriptPath('monoclePrototypeRenderer_' . str_replace(['.', ':'], ['_', '__'], $prototypeName));
        $typoScriptView->assignMultiple([
            'value' => $node
        ]);
        return $typoScriptView->render();
    }
}
