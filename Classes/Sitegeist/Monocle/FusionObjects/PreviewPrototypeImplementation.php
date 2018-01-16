<?php
namespace Sitegeist\Monocle\FusionObjects;

/*
 * This file is part of the Neos.Fusion package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\FusionObjects\AbstractFusionObject;
use Sitegeist\Monocle\Fusion\FusionView;
use Sitegeist\Monocle\Fusion\FusionService;
use Sitegeist\Monocle\Service\PackageKeyTrait;
use Neos\Flow\Package\PackageManagerInterface;

/**
 * Renderer props for a prototype Object
 */
class PreviewPrototypeImplementation extends AbstractFusionObject
{
    use PackageKeyTrait;

    /**
     * @return string
     */
    public function getSitePackageKey()
    {
        $sitePackageKey = $this->fusionValue('sitePackageKey');
        if (!$sitePackageKey) {
            $context = $this->runtime->getCurrentContext();
            if (array_key_exists('sitePackageKey', $context)) {
                $sitePackageKey = $context['sitePackageKey'];
            }
        }
        if (!$sitePackageKey) {
            $sitePackageKey = $this->getDefaultSitePackageKey();
        }
        return $sitePackageKey;
    }

    /**
     * @return string
     */
    public function getPrototypeName()
    {
        return $this->fusionValue('prototypeName');
    }

    /**
     * @return string
     */
    public function getPropSet()
    {
        return $this->fusionValue('propSet');
    }

    /**
     * @return string
     */
    public function getProps()
    {
        return $this->fusionValue('props');
    }

    /**
     * Render a prototype
     *
     * @return mixed
     */
    public function evaluate()
    {
        $sitePackageKey = $this->getSitePackageKey();
        $prototypeName = $this->getPrototypeName();
        $propSet = $this->getPropSet();
        $props = $this->getProps();

        $prototypePreviewRenderPath = FusionService::RENDERPATH_DISCRIMINATOR . str_replace(['.', ':'], ['_', '__'], $prototypeName);

        // render html
        $fusionView = new FusionView();
        $fusionView->setControllerContext($this->getRuntime()->getControllerContext());
        $fusionView->setFusionPath($prototypePreviewRenderPath);
        $fusionView->setPackageKey($sitePackageKey);

        $html = $fusionView->renderStyleguidePrototype($prototypeName, $propSet, $props);

        return  $html;
    }
}
