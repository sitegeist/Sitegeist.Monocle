<?php

namespace Sitegeist\Monocle\TypoScript;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TypoScript\TypoScriptObjects\AbstractTypoScriptObject;
use TYPO3\TYPO3CR\Domain\Service\NodeTypeManager;

class DummyNode extends AbstractTypoScriptObject
{

    /**
     * @var NodeTypeManager
     * @Flow\Inject
     */
    protected $nodeTypeManager;

    /**
     * A node object or a string node path or NULL to resolve the current document node
     *
     * @return mixed
     */
    public function getNodeType()
    {
        $nodeTypeName = $this->tsValue('nodeType');
        $nodeType = $this->nodeTypeManager->getNodeType($nodeTypeName);
        if ($nodeType) {
            return $nodeType;
        } else {
            return $this->nodeTypeManager->getNodeType('unstructured');
        }
    }

    /**
     * Render the Uri.
     *
     * @return string The rendered URI or NULL if no URI could be resolved for the given node
     * @throws NeosException
     */
    public function evaluate()
    {
        $nodeType = $this->getNodeType();
        $name = $this->tsValue('name');
        $properties = $this->tsValue('properties');
        $childNodes = $this->tsValue('childNodes');

        $dummyNode = new \Sitegeist\Monocle\MockObjects\Node();
        $dummyNode->setNodeType($nodeType);
        $dummyNode->setName($name);
        $dummyNode->setProperties($properties);
        $dummyNode->setChildNodes($childNodes);

        return $dummyNode;
    }
}