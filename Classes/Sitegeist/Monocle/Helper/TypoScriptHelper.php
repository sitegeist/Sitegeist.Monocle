<?php

namespace Sitegeist\Monocle\Helper;

use TYPO3\Flow\Annotations as Flow;
use Sitegeist\Monocle\Domain\Model\Prototype;
use Sitegeist\Monocle\Domain\Model\Section;

class TypoScriptHelper
{

    /**
     * @Flow\Inject
     * @var \Sitegeist\Monocle\TypoScript\TypoScriptService
     */
    protected $typoScriptService;

    public function buildStylegideSectionsForNode ($node)
    {
        $rootSection = new Section(NULL, 'Root');

        $mergedTypoScriptObjectTree = $this->typoScriptService->getMergedTypoScriptObjectTree($node);

        // identify all prototypes
        if ($mergedTypoScriptObjectTree && $mergedTypoScriptObjectTree['__prototypes'] ) {
            foreach ($mergedTypoScriptObjectTree['__prototypes'] as $prototypeName => $prototypeObjectTree) {
                if (array_key_exists('__meta', $prototypeObjectTree) && is_array($prototypeObjectTree['__meta']) && array_key_exists('styleguide', $prototypeObjectTree['__meta'])) {
                    $styleguideConfiguration = $prototypeObjectTree['__meta']['styleguide'];
                    if (array_key_exists('type', $styleguideConfiguration) && array_key_exists('section', $styleguideConfiguration)) {
                        $sectionPath = $styleguideConfiguration['type'] . '/' . $styleguideConfiguration['section'];
                        $title = $styleguideConfiguration['title'] ?: $prototypeName;
                        $description = $styleguideConfiguration['description'] ?: '';

                        $section = $rootSection->byPath($sectionPath);
                        $prototype = new Prototype($sectionPath, $title, $description, $prototypeName);
                        $section->addItem($prototypeName, $prototype);
                    }
                }
            }
        }

        return $rootSection;
    }

}