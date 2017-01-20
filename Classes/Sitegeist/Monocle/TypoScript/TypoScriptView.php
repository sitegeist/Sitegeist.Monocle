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
use Neos\Fusion\View\FusionView as BaseFusionView;

/**
 * Class FusionView
 * @package Sitegeist\Monocle\TypoScript
 */
class FusionView extends BaseFusionView
{
    /**
     * @Flow\Inject
     * @var \Sitegeist\Monocle\TypoScript\FusionService
     */
    protected $fusionService;

    /**
     * Load TypoScript from the directories specified by $this->getOption('fusionPathPatterns')
     *
     * @return void
     */
    protected function loadTypoScript()
    {
        $fusionAst = $this->fusionService->getMergedTypoScriptObjectTreeForSitePackage($this->getOption('packageKey'));
        $this->parsedTypoScript = $fusionAst;
    }
}
