<?php

namespace Sitegeist\Monocle\Controller;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Neos\Controller\Module\AbstractModuleController;

class StyleguideController extends AbstractModuleController
{

    /**
     * @var array
     * @Flow\InjectConfiguration("preview.defaultPath")
     */
    protected $defaultPath;


    /**
     * @return void
     */
    public function indexAction() {
        $this->view->assign('defaultPath', $this->defaultPath);
    }

}
