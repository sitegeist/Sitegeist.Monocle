<?php


namespace Sitegeist\Monocle\ViewHelpers;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Fluid\Core\ViewHelper\AbstractViewHelper;

class RenderHtmlSourcecodeViewHelper extends AbstractViewHelper
{

    /**
     * @param string $value
     * @return mixed
     */
    public function render($value = NULL)
    {
        if ($value === null) {
            $value = $this->renderChildren();
        }

        try {
            $simplexml = new \SimpleXMLElement($value);

            $dom = \dom_import_simplexml($simplexml)->ownerDocument;
            $dom->formatOutput = true;
            $result = $dom->saveXML();
            $result = preg_replace('/^.+\n/', '', $result);

        } catch (\Exception $e) {
            $result = $value;
        }

        return $result;
    }
}
