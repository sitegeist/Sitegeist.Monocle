<?php

namespace Sitegeist\Monocle\TypoScript;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TypoScript\View\TypoScriptView as BaseTypoScriptView;

class TypoScriptView extends BaseTypoScriptView
{
    /**
     * @Flow\Inject
     * @var \Sitegeist\Monocle\TypoScript\TypoScriptService
     */
    protected $typoScriptService;

    /**
     * Load TypoScript from the directories specified by $this->getOption('typoScriptPathPatterns')
     *
     * @return void
     */
    protected function loadTypoScript()
    {
        $fusionAst = $this->typoScriptService->getMergedTypoScriptObjectTreeForSitePackage($this->getOption('packageKey'));
        $this->parsedTypoScript = $fusionAst;
    }
}
