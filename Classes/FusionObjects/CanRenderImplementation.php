<?php
namespace Sitegeist\Monocle\FusionObjects;

use Neos\Fusion\FusionObjects\AbstractFusionObject;

/**
 * CanRender Fusion-Object
 *
 * The CanRender Fusion object checks whether the given type can be rendered
 */
class CanRenderImplementation extends AbstractFusionObject
{
    /**
     * Fusion path which shall be checked
     *
     * @return string
     */
    public function getRenderPath()
    {
        return $this->fusionValue('renderPath');
    }

    /**
     * Fusion type which shall be checked
     *
     * @return string
     */
    public function getType()
    {
        return $this->fusionValue('type');
    }

    /**
     * @return boolean
     */
    public function evaluate()
    {
        if ($this->getRenderPath()) {
            return $this->runtime->canRender($this->getRenderPath());
        } elseif ($this->getType()) {
            return $this->runtime->canRender('/type<' . $this->getType() . '>');
        } else {
            return false;
        }
    }
}
