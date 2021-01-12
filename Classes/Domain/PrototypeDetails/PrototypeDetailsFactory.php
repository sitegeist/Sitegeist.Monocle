<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails;

/**
 * This file is part of the Sitegeist.Monocle package
 *
 * (c) 2020
 * Martin Ficzel <ficzel@sitegeist.de>
 * Wilhelm Behncke <behncke@sitegeist.de>
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Sitegeist\Monocle\Fusion\FusionService;
use Sitegeist\Monocle\Fusion\FusionView;
use Sitegeist\Monocle\Fusion\ReverseFusionParser;
use Symfony\Component\Yaml\Yaml;

/**
 * @Flow\Scope("singleton")
 */
final class PrototypeDetailsFactory
{
    /**
     * @Flow\Inject
     * @var FusionService
     */
    protected $fusionService;

    /**
     * @Flow\Inject
     * @var AnatomyFactory
     */
    protected $anatomyFactory;

    /**
     * @param string $prototypeNameString
     * @param string $sitePackageKey
     * @param ControllerContext $controllerContext
     * @return PrototypeDetailsInterface
     */
    public function forPrototypeInSitePackage(
        string $prototypeNameString,
        string $sitePackageKey,
        ControllerContext $controllerContext
    ): PrototypeDetailsInterface {
        $prototypeName = PrototypeName::fromString($prototypeNameString);
        $prototypePreviewRenderPath = FusionService::RENDERPATH_DISCRIMINATOR . str_replace(['.', ':'], ['_', '__'], $prototypeNameString);

        // render html
        $fusionView = new FusionView();
        $fusionView->setControllerContext($controllerContext);
        $fusionView->setFusionPath($prototypePreviewRenderPath);
        $fusionView->setPackageKey($sitePackageKey);

        // render fusion source
        $fusionObjectTree = $this->fusionService->getMergedFusionObjectTreeForSitePackage($sitePackageKey);
        $fusionAstArray =  $fusionObjectTree['__prototypes'][$prototypeNameString];
        $fusionAst = FusionPrototypeAst::fromArray($fusionAstArray);


        return new PrototypeDetails(
            $prototypeName,
            RenderedCode::fromString(
                ReverseFusionParser::restorePrototypeCode($prototypeNameString, $fusionAstArray)
            ),
            ParsedCode::fromString(
                Yaml::dump($fusionAstArray, 99)
            ),
            FusionPrototypeAst::fromArray($fusionAstArray),
            $this->anatomyFactory->fromPrototypeNameAndFusionPrototypeAstForPrototypeDetails(
                $prototypeName,
                $fusionAst
            )
        );
    }
}
