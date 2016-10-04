<?php

namespace Sitegeist\Monocle\TypoScript;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

class TypoScriptService extends \TYPO3\Neos\Domain\Service\TypoScriptService
{
    const RENDERPATH_DISCRIMINATOR = 'monoclePrototypeRenderer_';

    /**
     * @Flow\InjectConfiguration(path="typoScript.autoInclude", package="TYPO3.Neos")
     * @var array
     */
    protected $autoIncludeConfiguration = array();

    public function getMergedTypoScriptObjectTree(NodeInterface $startNode)
    {
        $result = parent::getMergedTypoScriptObjectTree($startNode);

        $styleguidePrototypeConfigurations = [];
        $styleguideRenderingPrototypes = [];
        $styleguidePenderingProops = [];

        foreach ($result['__prototypes'] as $prototypeName => $prototypeConfiguration) {
            if (array_key_exists('__meta', $prototypeConfiguration)
                && array_key_exists('styleguide', $prototypeConfiguration['__meta'])
            ) {
                $styleguidePrototypeConfigurations[$prototypeName] = $prototypeConfiguration;
            }
        }

        // create rendering protoytpes with dummy data
        foreach ($styleguidePrototypeConfigurations as $prototypeName => $prototypeConfiguration ) {
            $renderPrototypeTypoScript = [
                '__objectType' => $prototypeName,
                '__value' => NULL,
                '__eelExpression' => NULL
            ];
            if (array_key_exists('props', $prototypeConfiguration['__meta']['styleguide']) && is_array($prototypeConfiguration['__meta']['styleguide']['props'])) {
                $styleguidePenderingProops[$prototypeName] = $prototypeConfiguration['__meta']['styleguide']['props'];
            }
            $styleguideRenderingPrototypes[$prototypeName] = $renderPrototypeTypoScript;
        }

        // apply props to the prototypes
        foreach ($styleguideRenderingPrototypes as $prototypeName => $prototypeConfiguration) {
            foreach ($styleguidePenderingProops as $propPrototypeName => $props){
                if ($propPrototypeName == $prototypeName) {
                    $styleguideRenderingPrototypes[$prototypeName] = array_merge_recursive($styleguideRenderingPrototypes[$prototypeName], $props);
                } else {
                    $styleguideRenderingPrototypes[$prototypeName]['__prototypes'][$propPrototypeName] = $props;
                }
            }
        }

        // create render pathes
        foreach($styleguideRenderingPrototypes as $prototypeName => $prototypeConfiguration) {
            $result[self::RENDERPATH_DISCRIMINATOR . str_replace(['.', ':'], ['_', '__'], $prototypeName)] = $prototypeConfiguration;
        }

        return  $result;
    }

}
