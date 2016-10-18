<?php

namespace Sitegeist\Monocle\MockObjects;

use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\TYPO3CR\Domain\Model\NodeType;
use TYPO3\TYPO3CR\Domain\Model\Workspace;
use TYPO3\TYPO3CR\Domain\Model\NodeTemplate;

class Node implements NodeInterface
{
    /**
     * @var NodeType
     */
    protected $nodeType;

    /**
     * @var string
     */
    protected $name = '';

    /**
     * @var array
     */
    protected $properties = [];

    /**
     * @var array
     */
    protected $childNodes = [];

    /**
     * @var bool
     */
    protected $hidden = false;

    /**
     * @var \DateTime
     */
    protected $hiddenAfterDateTime;

    /**
     * @var \DateTime
     */
    protected $hiddenBeforeDateTime;

    /**
     * @var bool
     */
    protected $hiddenInIndex = false;

    /**
     * Set the name of the node to $newName, keeping it's position as it is
     *
     * @param string $newName
     * @return void
     * @throws \InvalidArgumentException if $newName is invalid
     */
    public function setName($newName)
    {
        $this->name = $newName;
    }

    /**
     * Returns the name of this node
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Returns a full length plain text label of this node
     *
     * @return string
     */
    public function getLabel()
    {
        return $this->getNodeType()->getNodeLabelGenerator()->getLabel($this);
    }

    /**
     * Returns a full length plain text label of this node
     *
     * @return string
     * @deprecated since 1.2
     */
    public function getFullLabel()
    {
        return $this->getLabel();
    }

    /**
     * Sets the specified property.
     *
     * If the node has a content object attached, the property will be set there
     * if it is settable.
     *
     * @param string $propertyName Name of the property
     * @param mixed $value Value of the property
     * @return void
     */
    public function setProperty($propertyName, $value)
    {
        $this->properties[$propertyName] = $value;
    }

    /**
     * If this node has a property with the given name.
     *
     * If the node has a content object attached, the property will be checked
     * there.
     *
     * @param string $propertyName Name of the property to test for
     * @return boolean
     */
    public function hasProperty($propertyName)
    {
        return (array_key_exists($propertyName, $this->properties));
    }

    /**
     * Returns the specified property.
     *
     * If the node has a content object attached, the property will be fetched
     * there if it is gettable.
     *
     * @param string $propertyName Name of the property
     * @return mixed value of the property
     * @throws \TYPO3\TYPO3CR\Exception\NodeException if the node does not contain the specified property
     */
    public function getProperty($propertyName)
    {
        if (array_key_exists($propertyName, $this->properties)) {
            return $this->properties[$propertyName];
        } else {
            throw new \TYPO3\TYPO3CR\Exception\NodeException();
        }
    }

    /**
     * Removes the specified property.
     *
     * If the node has a content object attached, the property will not be removed on
     * that object if it exists.
     *
     * @param string $propertyName Name of the property
     * @return void
     * @throws \TYPO3\TYPO3CR\Exception\NodeException if the node does not contain the specified property
     */
    public function removeProperty($propertyName)
    {
        if (array_key_exists($propertyName, $this->properties)) {
            unset($this->properties[$propertyName]);
        } else {
            throw new \TYPO3\TYPO3CR\Exception\NodeException();
        }
    }

    /**
     * Returns all properties of this node.
     *
     * If the node has a content object attached, the properties will be fetched
     * there.
     *
     * @return array Property values, indexed by their name
     */
    public function getProperties()
    {
        return $this->properties;
    }

    /**
     * Sets all properties of this node.
     **
     * @return void
     */
    public function setProperties(array $properties)
    {
        $this->properties = $properties;
    }

    /**
     * Returns the names of all properties of this node.
     *
     * @return array Property names
     * @api
     */
    public function getPropertyNames()
    {
        return array_keys($this->properties);
    }

    /**
     * Sets a content object for this node.
     *
     * @param object $contentObject The content object
     * @return void
     * @throws \InvalidArgumentException if the given contentObject is no object.
     * @api
     */
    public function setContentObject($contentObject)
    {
        // TODO: Implement setContentObject() method.
    }

    /**
     * Returns the content object of this node (if any).
     *
     * @return object The content object or NULL if none was set
     * @api
     */
    public function getContentObject()
    {
        // TODO: Implement getContentObject() method.
    }

    /**
     * Unsets the content object of this node.
     *
     * @return void
     * @api
     */
    public function unsetContentObject()
    {
        // TODO: Implement unsetContentObject() method.
    }

    /**
     * Sets the node type of this node.
     *
     * @param \TYPO3\TYPO3CR\Domain\Model\NodeType $nodeType
     * @return void
     * @api
     */
    public function setNodeType(NodeType $nodeType)
    {
        $this->nodeType = $nodeType;
    }

    /**
     * Returns the node type of this node.
     *
     * @return \TYPO3\TYPO3CR\Domain\Model\NodeType
     * @api
     */
    public function getNodeType()
    {
        return $this->nodeType;
    }

    /**
     * Sets the "hidden" flag for this node.
     *
     * @param boolean $hidden If TRUE, this Node will be hidden
     * @return void
     * @api
     */
    public function setHidden($hidden)
    {
        $this->hidden = $hidden;
    }

    /**
     * Returns the current state of the hidden flag
     *
     * @return boolean
     * @api
     */
    public function isHidden()
    {
        return $this->hidden;
    }

    /**
     * Sets the date and time when this node becomes potentially visible.
     *
     * @param \DateTime $dateTime Date before this node should be hidden
     * @return void
     * @api
     */
    public function setHiddenBeforeDateTime(\DateTime $dateTime = null)
    {
        $this->hiddenBeforeDateTime = $dateTime;
    }

    /**
     * Returns the date and time before which this node will be automatically hidden.
     *
     * @return \DateTime Date before this node will be hidden
     * @api
     */
    public function getHiddenBeforeDateTime()
    {
        return $this->hiddenBeforeDateTime;
    }

    /**
     * Sets the date and time when this node should be automatically hidden
     *
     * @param \DateTime $dateTime Date after which this node should be hidden
     * @return void
     * @api
     */
    public function setHiddenAfterDateTime(\DateTime $dateTime = null)
    {
        $this->hiddenAfterDateTime = $dateTime;
    }

    /**
     * Returns the date and time after which this node will be automatically hidden.
     *
     * @return \DateTime Date after which this node will be hidden
     * @api
     */
    public function getHiddenAfterDateTime()
    {
        return $this->hiddenAfterDateTime;
    }

    /**
     * Sets if this node should be hidden in indexes, such as a site navigation.
     *
     * @param boolean $hidden TRUE if it should be hidden, otherwise FALSE
     * @return void
     * @api
     */
    public function setHiddenInIndex($hidden)
    {
        $this->hiddenInIndex = $hidden;
    }

    /**
     * If this node should be hidden in indexes
     *
     * @return boolean
     * @api
     */
    public function isHiddenInIndex()
    {
        return $this->hiddenInIndex;
    }

    /**
     * Sets the roles which are required to access this node
     *
     * @param array $accessRoles
     * @return void
     * @api
     */
    public function setAccessRoles(array $accessRoles)
    {
        // TODO: Implement setAccessRoles() method.
    }

    /**
     * Returns the names of defined access roles
     *
     * @return array
     * @api
     */
    public function getAccessRoles()
    {
        // TODO: Implement getAccessRoles() method.
    }

    /**
     * Sets the absolute path of this node
     *
     * This method is only for internal use by the content repository. Changing
     * the path of a node manually may lead to unexpected behavior and bad breath.
     *
     * @param string $path
     * @return void
     */
    public function setPath($path)
    {
        // TODO: Implement setPath() method.
    }

    /**
     * Returns the path of this node
     *
     * Example: /sites/mysitecom/homepage/about
     *
     * @return string The absolute node path
     * @api
     */
    public function getPath()
    {
        // TODO: Implement getPath() method.
    }

    /**
     * Returns the absolute path of this node with additional context information (such as the workspace name).
     *
     * Example: /sites/mysitecom/homepage/about@user-admin
     *
     * @return string Node path with context information
     * @api
     */
    public function getContextPath()
    {
        // TODO: Implement getContextPath() method.
    }

    /**
     * Returns the level at which this node is located.
     * Counting starts with 0 for "/", 1 for "/foo", 2 for "/foo/bar" etc.
     *
     * @return integer
     * @api
     */
    public function getDepth()
    {
        // TODO: Implement getDepth() method.
    }

    /**
     * Sets the workspace of this node.
     *
     * This method is only for internal use by the content repository. Changing
     * the workspace of a node manually may lead to unexpected behavior.
     *
     * @param \TYPO3\TYPO3CR\Domain\Model\Workspace $workspace
     * @return void
     */
    public function setWorkspace(Workspace $workspace)
    {
        // TODO: Implement setWorkspace() method.
    }

    /**
     * Returns the workspace this node is contained in
     *
     * @return \TYPO3\TYPO3CR\Domain\Model\Workspace
     * @api
     */
    public function getWorkspace()
    {
        // TODO: Implement getWorkspace() method.
    }

    /**
     * Returns the identifier of this node.
     *
     * This UUID is not the same as the technical persistence identifier used by
     * Flow's persistence framework. It is an additional identifier which is unique
     * within the same workspace and is used for tracking the same node in across
     * workspaces.
     *
     * It is okay and recommended to use this identifier for synchronisation purposes
     * as it does not change even if all of the nodes content or its path changes.
     *
     * @return string the node's UUID
     * @api
     */
    public function getIdentifier()
    {
        // TODO: Implement getIdentifier() method.
    }

    /**
     * Sets the index of this node
     *
     * This method is for internal use and must only be used by other nodes!
     *
     * @param integer $index The new index
     * @return void
     */
    public function setIndex($index)
    {
        // TODO: Implement setIndex() method.
    }

    /**
     * Returns the index of this node which determines the order among siblings
     * with the same parent node.
     *
     * @return integer
     */
    public function getIndex()
    {
        // TODO: Implement getIndex() method.
    }

    /**
     * Returns the parent node of this node
     *
     * @return NodeInterface The parent node or NULL if this is the root node
     * @api
     */
    public function getParent()
    {
        // TODO: Implement getParent() method.
    }

    /**
     * Returns the parent node path
     *
     * @return string Absolute node path of the parent node
     * @api
     */
    public function getParentPath()
    {
        // TODO: Implement getParentPath() method.
    }

    /**
     * Creates, adds and returns a child node of this node. Also sets default
     * properties and creates default subnodes.
     *
     * @param string $name Name of the new node
     * @param \TYPO3\TYPO3CR\Domain\Model\NodeType $nodeType Node type of the new node (optional)
     * @param string $identifier The identifier of the node, unique within the workspace, optional(!)
     * @return \TYPO3\TYPO3CR\Domain\Model\Node
     * @throws \InvalidArgumentException if the node name is not accepted.
     * @throws \TYPO3\TYPO3CR\Exception\NodeExistsException if a node with this path already exists.
     * @api
     */
    public function createNode($name, NodeType $nodeType = null, $identifier = null)
    {
        // TODO: Implement createNode() method.
    }

    /**
     * Creates, adds and returns a child node of this node, without setting default
     * properties or creating subnodes.
     *
     * For internal use only!
     *
     * @param string $name Name of the new node
     * @param \TYPO3\TYPO3CR\Domain\Model\NodeType $nodeType Node type of the new node (optional)
     * @param string $identifier The identifier of the node, unique within the workspace, optional(!)
     * @return \TYPO3\TYPO3CR\Domain\Model\Node
     * @throws \InvalidArgumentException if the node name is not accepted.
     * @throws \TYPO3\TYPO3CR\Exception\NodeExistsException if a node with this path already exists.
     */
    public function createSingleNode($name, NodeType $nodeType = null, $identifier = null)
    {
        // TODO: Implement createSingleNode() method.
    }

    /**
     * Creates and persists a node from the given $nodeTemplate as child node
     *
     * @param \TYPO3\TYPO3CR\Domain\Model\NodeTemplate $nodeTemplate
     * @param string $nodeName name of the new node. If not specified the name of the nodeTemplate will be used.
     * @return NodeInterface the freshly generated node
     * @api
     */
    public function createNodeFromTemplate(NodeTemplate $nodeTemplate, $nodeName = null)
    {
        // TODO: Implement createNodeFromTemplate() method.
    }

    /**
     * Returns a node specified by the given relative path.
     *
     * @param string $path Path specifying the node, relative to this node
     * @return NodeInterface The specified node or NULL if no such node exists
     * @api
     */
    public function getNode($path)
    {
        // TODO: Implement getNode() method.
    }

    /**
     * Returns the primary child node of this node.
     *
     * Which node acts as a primary child node will in the future depend on the
     * node type. For now it is just the first child node.
     *
     * @return NodeInterface The primary child node or NULL if no such node exists
     * @api
     */
    public function getPrimaryChildNode()
    {
        // TODO: Implement getPrimaryChildNode() method.
    }

    /**
     * Returns all direct child nodes of this node.
     * If a node type is specified, only nodes of that type are returned.
     *
     * @param string $nodeTypeFilter If specified, only nodes with that node type are considered
     * @param integer $limit An optional limit for the number of nodes to find. Added or removed nodes can still change the number nodes!
     * @param integer $offset An optional offset for the query
     * @return array<\TYPO3\TYPO3CR\Domain\Model\NodeInterface> An array of nodes or an empty array if no child nodes matched
     * @api
     */
    public function getChildNodes($nodeTypeFilter = null, $limit = null, $offset = null)
    {
        return $this->childNodes;
    }

    /**
     * Checks if this node has any child nodes.
     *
     * @param string $nodeTypeFilter If specified, only nodes with that node type are considered
     * @return boolean TRUE if this node has child nodes, otherwise FALSE
     * @api
     */
    public function hasChildNodes($nodeTypeFilter = null)
    {
        return count($this->childNodes > 0);
    }

    public function setChildNodes(array $childNodes)
    {
        $this->childNodes = $childNodes;
    }

    /**
     * Removes this node and all its child nodes. This is an alias for setRemoved(TRUE)
     *
     * @return void
     * @api
     */
    public function remove()
    {
        // TODO: Implement remove() method.
    }

    /**
     * Removes this node and all its child nodes or sets ONLY this node to not being removed.
     *
     * @param boolean $removed If TRUE, this node and it's child nodes will be removed or set to be not removed.
     * @return void
     * @api
     */
    public function setRemoved($removed)
    {
        // TODO: Implement setRemoved() method.
    }

    /**
     * If this node is a removed node.
     *
     * @return boolean
     * @api
     */
    public function isRemoved()
    {
        // TODO: Implement isRemoved() method.
    }

    /**
     * Tells if this node is "visible".
     * For this the "hidden" flag and the "hiddenBeforeDateTime" and "hiddenAfterDateTime" dates are
     * taken into account.
     *
     * @return boolean
     * @api
     */
    public function isVisible()
    {
        // TODO: Implement isVisible() method.
    }

    /**
     * Tells if this node may be accessed according to the current security context.
     *
     * @return boolean
     * @api
     */
    public function isAccessible()
    {
        // TODO: Implement isAccessible() method.
    }

    /**
     * Tells if a node, in general,  has access restrictions, independent of the
     * current security context.
     *
     * @return boolean
     * @api
     */
    public function hasAccessRestrictions()
    {
        // TODO: Implement hasAccessRestrictions() method.
    }

    /**
     * Checks if the given $nodeType would be allowed as a child node of this node according to the configured constraints.
     *
     * @param NodeType $nodeType
     * @return boolean TRUE if the passed $nodeType is allowed as child node
     */
    public function isNodeTypeAllowedAsChildNode(NodeType $nodeType)
    {
        // TODO: Implement isNodeTypeAllowedAsChildNode() method.
    }

    /**
     * Moves this node before the given node
     *
     * @param NodeInterface $referenceNode
     * @return void
     * @api
     */
    public function moveBefore(NodeInterface $referenceNode)
    {
        // TODO: Implement moveBefore() method.
    }

    /**
     * Moves this node after the given node
     *
     * @param NodeInterface $referenceNode
     * @return void
     * @api
     */
    public function moveAfter(NodeInterface $referenceNode)
    {
        // TODO: Implement moveAfter() method.
    }

    /**
     * Moves this node into the given node
     *
     * @param NodeInterface $referenceNode
     * @return void
     * @api
     */
    public function moveInto(NodeInterface $referenceNode)
    {
        // TODO: Implement moveInto() method.
    }

    /**
     * Copies this node before the given node
     *
     * @param NodeInterface $referenceNode
     * @param string $nodeName
     * @return NodeInterface
     * @throws \TYPO3\TYPO3CR\Exception\NodeExistsException
     * @api
     */
    public function copyBefore(NodeInterface $referenceNode, $nodeName)
    {
        // TODO: Implement copyBefore() method.
    }

    /**
     * Copies this node after the given node
     *
     * @param NodeInterface $referenceNode
     * @param string $nodeName
     * @return NodeInterface
     * @throws \TYPO3\TYPO3CR\Exception\NodeExistsException
     * @api
     */
    public function copyAfter(NodeInterface $referenceNode, $nodeName)
    {
        // TODO: Implement copyAfter() method.
    }

    /**
     * Copies this node to below the given node. The new node will be added behind
     * any existing sub nodes of the given node.
     *
     * @param NodeInterface $referenceNode
     * @param string $nodeName
     * @return NodeInterface
     * @throws \TYPO3\TYPO3CR\Exception\NodeExistsException
     * @api
     */
    public function copyInto(NodeInterface $referenceNode, $nodeName)
    {
        // TODO: Implement copyInto() method.
    }

    /**
     * Return the NodeData representation of the node.
     *
     * @return \TYPO3\TYPO3CR\Domain\Model\NodeData
     */
    public function getNodeData()
    {
        // TODO: Implement getNodeData() method.
    }

    /**
     * Return the context of the node
     *
     * @return \TYPO3\TYPO3CR\Domain\Service\Context
     */
    public function getContext()
    {
        // TODO: Implement getContext() method.
    }

    /**
     * Return the assigned content dimensions of the node.
     *
     * @return array An array of dimensions to array of dimension values
     */
    public function getDimensions()
    {
        // TODO: Implement getDimensions() method.
    }

    /**
     * Given a context a new node is returned that is like this node, but
     * lives in the new context.
     *
     * @param \TYPO3\TYPO3CR\Domain\Service\Context $context
     * @return NodeInterface
     */
    public function createVariantForContext($context)
    {
        // TODO: Implement createVariantForContext() method.
    }

    /**
     * Determine if this node is configured as auto-created childNode of the parent node. If that is the case, it
     * should not be deleted.
     *
     * @return boolean TRUE if this node is auto-created by the parent.
     */
    public function isAutoCreated()
    {
        // TODO: Implement isAutoCreated() method.
    }

    /**
     * Get other variants of this node (with different dimension values)
     *
     * A variant of a node can have different dimension values and path (for non-aggregate nodes).
     * The resulting node instances might belong to a different context.
     *
     * @return array<NodeInterface> All node variants of this node (excluding the current node)
     */
    public function getOtherNodeVariants()
    {
        // TODO: Implement getOtherNodeVariants() method.
    }
}
