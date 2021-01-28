<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails\Props;

/**
 * This file is part of the Sitegeist.Monocle package
 *
 * (c) 2020
 * Martin Ficzel <ficzel@sitegeist.de>
 * Wilhelm Behncke <behncke@sitegeist.de>
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;

/**
 * @Flow\Proxy(false)
 */
final class Prop implements PropInterface
{
    /**
     * @var PropName
     */
    private $name;

    /**
     * @var PropValue
     */
    private $value;

    /**
     * @var EditorInterface
     */
    private $editor;

    /**
     * @param PropName $name
     * @param PropValue $value
     * @param EditorInterface $editor
     */
    public function __construct(
        PropName $name,
        PropValue $value,
        EditorInterface $editor
    ) {
        $this->name = $name;
        $this->value = $value;
        $this->editor = $editor;
    }

    /**
     * @return PropName
     */
    public function getName(): PropName
    {
        return $this->name;
    }

    /**
     * @return PropValue
     */
    public function getValue(): PropValue
    {
        return $this->value;
    }

    /**
     * @return EditorInterface
     */
    public function getEditor(): EditorInterface
    {
        return $this->editor;
    }

    public function jsonSerialize()
    {
        return [
            'name' => $this->name,
            'value' => $this->value,
            'editor' => $this->editor
        ];
    }
}
