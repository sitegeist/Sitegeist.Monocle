<?php

namespace Sitegeist\Monocle\TypoScript;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

class TypoScriptService extends \TYPO3\Neos\Domain\Service\TypoScriptService
{

    /**
     * @Flow\InjectConfiguration(path="typoScript.autoInclude", package="TYPO3.Neos")
     * @var array
     */
    protected $autoIncludeConfiguration = array();

    public function getMergedTypoScriptObjectTree(NodeInterface $startNode)
    {
        $result = parent::getMergedTypoScriptObjectTree($startNode);

        foreach ($result['__prototypes'] as $prototypeName => $prototypeConfiguration) {
            if (array_key_exists('__meta', $prototypeConfiguration) && array_key_exists('styleguide', $prototypeConfiguration['__meta'])) {
                $result['monoclePrototypeRenderer_' . str_replace(['.', ':'], ['_', '__'], $prototypeName)] = [
                    '__objectType' => $prototypeName,
                    '__value' => NULL,
                    '__eelExpression' => NULL
                ];
            }
        }

        return  $result;
    }

}