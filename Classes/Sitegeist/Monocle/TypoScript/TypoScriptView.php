<?php

namespace Sitegeist\Monocle\TypoScript;

use TYPO3\Flow\Annotations as Flow;

class TypoScriptView extends \TYPO3\Neos\View\TypoScriptView
{
    /**
     * @Flow\Inject
     * @var \Sitegeist\Monocle\TypoScript\TypoScriptService
     */
    protected $typoScriptService;

}