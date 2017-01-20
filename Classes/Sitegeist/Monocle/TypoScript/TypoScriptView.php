<?php
namespace Sitegeist\Monocle\TypoScript;

/**
 * This file is part of the Sitegeist.Monocle package
 *
 * (c) 2016
 * Martin Ficzel <ficzel@sitegeist.de>
 * Wilhelm Behncke <behncke@sitegeist.de>
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\View\TypoScriptView as BaseTypoScriptView;

/**
 * Class TypoScriptView
 * @package Sitegeist\Monocle\TypoScript
 */
class TypoScriptView extends BaseTypoScriptView
{
    /**
     * @Flow\Inject
     * @var \Sitegeist\Monocle\TypoScript\FusionService
     */
    protected $fusionService;

    /**
     * Load TypoScript from the directories specified by $this->getOption('typoScriptPathPatterns')
     *
     * @return void
     */
    protected function loadTypoScript()
    {
        $fusionAst = $this->fusionService->getMergedTypoScriptObjectTreeForSitePackage($this->getOption('packageKey'));
        $this->parsedTypoScript = $fusionAst;
    }
}
