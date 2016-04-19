<?php

namespace Sitegeist\Monocle\TypoScript;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TypoScript\TypoScriptObjects\AbstractTypoScriptObject;
use TYPO3\TYPO3CR\Domain\Service\NodeTypeManager;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;

class DummyNodeImplementation extends AbstractTypoScriptObject
{

    /**
     * @var NodeTypeManager
     * @Flow\Inject
     */
    protected $nodeTypeManager;

    /**
     * A node object or a string node path or NULL to resolve the current document node
     *
     * @return NodeType
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
     * The node name
     *
     * @var string
     */
    public function getName() {
        return $this->tsValue('name');
    }

    /**
     * The properties of the node
     *
     * @var array
     */
    public function getProperties() {
        return $this->tsValue('properties');
    }

    /**
     * The child nodes of the node
     *
     * @var array
     */
    public function getChildNodes() {
        return $this->tsValue('childNodes');
    }

    /**
     * Generate a dummy node for testing and prototyping purposes
     *
     * @return NodeInterface
     * @throws NeosException
     */
    public function evaluate()
    {
        $dummyNode = new \Sitegeist\Monocle\MockObjects\Node();
        $dummyNode->setNodeType($this->getNodeType());
        $dummyNode->setName($this->getName());
        $dummyNode->setProperties($this->getProperties());
        $dummyNode->setChildNodes($this->getChildNodes());

        return $dummyNode;
    }
}