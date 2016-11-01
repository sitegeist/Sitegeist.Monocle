<?php
namespace Sitegeist\Monocle\Controller;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Utility\Arrays;
use TYPO3\Flow\Mvc\View\ViewInterface;
use TYPO3\Flow\Mvc\Controller\ActionController;
use TYPO3\Flow\Resource\ResourceManager;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

use Sitegeist\Monocle\Helper\TypoScriptHelper;
use Sitegeist\Monocle\Helper\ContextHelper;
use Sitegeist\Monocle\TypoScript\TypoScriptService;
use Sitegeist\Monocle\TypoScript\TypoScriptView;

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
     * @var array
     * @Flow\InjectConfiguration("preview.metaViewport")
     */
    protected $metaViewport;

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
     * @var ResourceManager
     */
    protected $resourceManager;

    /**
     * Initialize the view
     *
     * @param  ViewInterface $view
     * @return void
     */
    public function initializeView(ViewInterface $view)
    {
        $view->assign('defaultPath', $this->defaultPath);
        $view->assign('metaViewport', $this->metaViewport);

        //
        // Resolve resource uris in beforehand
        //
        $view->assign('additionalResources', array_map(function ($resourceList) {
            return array_map(function ($path) {
                if (strpos($path, 'resource://') === 0) {
                    list($package, $path) = $this->resourceManager->getPackageAndPathByPublicPath($path);
                    return $this->resourceManager->getPublicPackageResourceUri($package, $path);
                }

                return $path;
            }, $resourceList);
        }, $this->additionalResources));
    }

    /**
     * @return void
     */
    public function moduleAction()
    {
    }

    /**
     * @return void
     */
    public function iframeAction()
    {
    }

    /**
     * @param  string $prototypeName
     * @return void
     */
    public function componentAction($prototypeName)
    {
        $context = $this->contextHelper->getContext();
        $siteNode = $context->getCurrentSiteNode();

        $typoScriptView = new TypoScriptView();
        $typoScriptView->setControllerContext($this->controllerContext);
        $typoScriptView->setTypoScriptPath('monoclePrototypeRenderer_' . str_replace(['.', ':'], ['_', '__'], $prototypeName));
        $typoScriptView->assignMultiple([
            'value' => $siteNode
        ]);

        $this->view->assignMultiple([
            'prototypeName' => $prototypeName,
            'renderedHtml' =>  $typoScriptView->render()
        ]);
    }
}
