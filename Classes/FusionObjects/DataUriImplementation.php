<?php
namespace Sitegeist\Monocle\FusionObjects;

use Neos\Flow\Annotations as Flow;
use Neos\Fusion\FusionObjects\AbstractFusionObject;

/**
 * Renderer props for a prototype Object
 */
class DataUriImplementation extends AbstractFusionObject
{
    /**
     * @return string
     */
    public function getType()
    {
        return $this->fusionValue('type');
    }

    /**
     * @return string
     */
    public function getContent()
    {
        return $this->fusionValue('content');
    }

    /**
     * Render a prototype
     *
     * @return mixed
     */
    public function evaluate()
    {
        $type = $this->getType();
        $content = $this->getContent();
        if ($type && $content) {
            return  'data:' . $type . ';base64,' . base64_encode($content);
        }
    }
}
