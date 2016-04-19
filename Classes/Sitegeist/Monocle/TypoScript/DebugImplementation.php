<?php

namespace Sitegeist\Monocle\TypoScript;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TypoScript\TypoScriptObjects\AbstractTypoScriptObject;

class DebugImplementation extends AbstractTypoScriptObject
{

    /**
     * The title of the debug section
     *
     * @return string
     */
    public function getTitle(){
        return $this->tsValue('title');
    }

    /**
     * The date that will be debugged
     *
     * @return mixed
     */
    public function getData() {
        return $this->tsValue('data');
    }

    /**
     * Create a debug output for the given data
     *
     * @return string
     */
    public function evaluate()
    {
        return \TYPO3\Flow\var_dump($this->getData(), $this->getTitle(), true);
    }
}