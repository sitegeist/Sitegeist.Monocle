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
            foreach ($typoScriptObjectTree['__prototypes'] as $prototypeName => $prototypeObjectTree) {
                if (array_key_exists('__meta', $prototypeObjectTree) && is_array($prototypeObjectTree['__meta']) && array_key_exists('styleguide', $prototypeObjectTree['__meta'])) {
                    $styleguideConfiguration = $prototypeObjectTree['__meta']['styleguide'];
                    $styleguideObjects[] = [
                        'prototypeName' => $prototypeName,
                        'title' => (isset($styleguideConfiguration['title'])) ? $styleguideConfiguration['title'] : '',
                        'path' => (isset($styleguideConfiguration['path'])) ? $styleguideConfiguration['path'] : 'other',
                        'description' => (isset($styleguideConfiguration['description'])) ? $styleguideConfiguration['description'] : ''
                    ];
                }
            }
        }
        return $styleguideObjects;
    }

}
