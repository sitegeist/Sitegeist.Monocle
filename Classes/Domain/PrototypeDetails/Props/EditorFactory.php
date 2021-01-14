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
final class EditorFactory
{
    /**
     * Provides a fitting editor for any given prop value
     *
     * @param PropValue $propValue
     * @return null|EditorInterface
     */
    public function forPropValue(PropValue $propValue): ?EditorInterface
    {
        switch (true) {
            case $propValue->isBoolean():
                return $this->checkBox();
            case $propValue->isNumber():
                return $this->number();
            case $propValue->isString():
                if ($propValue->getLength() <= 80) {
                    return $this->text();
                } else {
                    return $this->textArea();
                }
            default:
                return null;
        }
    }

    /**
     * Provides a CheckBox editor
     *
     * @return EditorInterface
     */
    public function checkbox(): EditorInterface
    {
        return new Editor(
            EditorIdentifier::fromString(
                'Sitegeist.Monocle/Props/Editors/Checkbox'
            ),
            EditorOptions::empty()
        );
    }

    /**
     * Provides a Number editor
     *
     * @return EditorInterface
     */
    public function number(): EditorInterface
    {
        return new Editor(
            EditorIdentifier::fromString(
                'Sitegeist.Monocle/Props/Editors/Number'
            ),
            EditorOptions::empty()
        );
    }

    /**
     * Provides a Text editor
     *
     * @return EditorInterface
     */
    public function text(): EditorInterface
    {
        return new Editor(
            EditorIdentifier::fromString(
                'Sitegeist.Monocle/Props/Editors/Text'
            ),
            EditorOptions::empty()
        );
    }

    /**
     * Provides a TextArea editor
     *
     * @return EditorInterface
     */
    public function textArea(): EditorInterface
    {
        return new Editor(
            EditorIdentifier::fromString(
                'Sitegeist.Monocle/Props/Editors/TextArea'
            ),
            EditorOptions::empty()
        );
    }

    /**
     * Provides a SelectBox Editor
     *
     * @param array<string,mixed> $options
     * @return EditorInterface
     */
    public function selectBox(array $options): EditorInterface
    {
        return new Editor(
            EditorIdentifier::fromString(
                'Sitegeist.Monocle/Props/Editors/SelectBox'
            ),
            EditorOptions::fromArray($options)
        );
    }
}
