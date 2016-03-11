<?php

namespace Sitegeist\Monocle\Helper;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Utility\Arrays;
use TYPO3\Flow\Utility\PositionalArraySorter;

use Sitegeist\Monocle\Domain\Model\Prototype;
use Sitegeist\Monocle\Domain\Model\Section;

class TypoScriptHelper
{

    /**
     * @Flow\Inject
     * @var \Sitegeist\Monocle\TypoScript\TypoScriptService
     */
    protected $typoScriptService;

    public function getPrototypeKey($prototypeName)
    {
        return 'Prototype_' . str_replace([':','.'],['_'],$prototypeName);
    }

    public function buildStyleguideObjectTree($typoScriptObjectTree)
    {
        $styleguideObjectTree = [];
        if ($typoScriptObjectTree && $typoScriptObjectTree['__prototypes'] ) {
            foreach ($typoScriptObjectTree['__prototypes'] as $prototypeName => $prototypeObjectTree) {
                if (array_key_exists('__meta', $prototypeObjectTree) && is_array($prototypeObjectTree['__meta']) && array_key_exists('styleguide', $prototypeObjectTree['__meta'])) {
                    $styleguideConfiguration = $prototypeObjectTree['__meta']['styleguide'];
                    $key = $this->getPrototypeKey($prototypeName);
                    $path = (isset($styleguideConfiguration['path'])) ? $styleguideConfiguration['path'] : 'other';

                    $styleguideObjectSubtreeTree = Arrays::getValueByPath($styleguideObjectTree, $path);
                    $styleguideObjectSubtreeTree[$key] = [
                        '__item' => [
                            'prototypeName' => $prototypeName,
                            'styleguideConfiguration' =>$styleguideConfiguration
                        ]
                    ];

                    $positionalConfigurationSorter = new PositionalArraySorter($styleguideObjectSubtreeTree, '__item.styleguideConfiguration.position');
                    $styleguideObjectTree = Arrays::setValueByPath($styleguideObjectTree, $path, $positionalConfigurationSorter->toArray());
                }
            }
        }
        return $styleguideObjectTree;
    }

}