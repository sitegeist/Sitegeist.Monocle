<?php

namespace Sitegeist\Monocle\Helper;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Utility\Arrays;
use TYPO3\Flow\Utility\PositionalArraySorter;
use TYPO3\Neos\Domain\Model\NodeInterface;

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
        return 'Prototype_' . str_replace([':','.'], ['_'], $prototypeName);
    }

    /**
     * Get all styleguide objects for the given site
     *
     * @param NodeInterface $siteNode
     * @return array
     */
    public function getStyleguideObjects($siteNode)
    {
        $typoScriptObjectTree = $this->typoScriptService->getMergedTypoScriptObjectTree($siteNode);
        $styleguideObjects = [];
        if ($typoScriptObjectTree && $typoScriptObjectTree['__prototypes']) {
            foreach ($typoScriptObjectTree['__prototypes'] as $prototypeName => $prototypeObject) {
                if (array_key_exists('__meta', $prototypeObject) && is_array($prototypeObject['__meta']) && array_key_exists('styleguide', $prototypeObject['__meta'])) {
                    $styleguideConfiguration = $prototypeObject['__meta']['styleguide'];
                    $styleguideObjects[$prototypeName] = [
                        'title' => (isset($styleguideConfiguration['title'])) ? $styleguideConfiguration['title'] : $prototypeName,
                        'path' => (isset($styleguideConfiguration['path'])) ? $styleguideConfiguration['path'] : 'other',
                        'description' => (isset($styleguideConfiguration['description'])) ? $styleguideConfiguration['description'] :  '',
                        'options' => (isset($styleguideConfiguration['options'])) ? $styleguideConfiguration['options'] : null
                    ];
                }
            }
        }
        return $styleguideObjects;
    }
}
