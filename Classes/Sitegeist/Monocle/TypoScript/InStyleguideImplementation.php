<?php

namespace Sitegeist\Monocle\TypoScript;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TypoScript\TypoScriptObjects\AbstractTypoScriptObject;
use TYPO3\TYPO3CR\Domain\Service\NodeTypeManager;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

class InStyleguideImplementation extends AbstractTypoScriptObject
{
    /**
     * Check, whether we are currently within the styleguide
     *
     * @return boolean
     */
    public function evaluate()
    {
        return strrpos($this->path, TypoScriptService::RENDERPATH_DISCRIMINATOR, -strlen($this->path)) !== false;
    }
}
