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
final class Editor implements EditorInterface
{
    /**
     * @var EditorIdentifier
     */
    private $identifier;

    /**
     * @var EditorOptions
     */
    private $options;

    /**
     * @param EditorIdentifier $identifier
     * @param EditorOptions $options
     */
    public function __construct(
        EditorIdentifier $identifier,
        EditorOptions $options
    ) {
        $this->identifier = $identifier;
        $this->options = $options;
    }

    /**
     * @param PropValue $propValue
     * @return null|self
     */
    public static function forPropValue(PropValue $propValue): ?self
    {
        switch (true) {
            case $propValue->isBoolean():
                return new self(
                    EditorIdentifier::fromString(
                        'Sitegeist.Monocle/Props/Editors/Checkbox'
                    ),
                    EditorOptions::empty()
                );
            case $propValue->isNumber():
                return new self(
                    EditorIdentifier::fromString(
                        'Sitegeist.Monocle/Props/Editors/Number'
                    ),
                    EditorOptions::empty()
                );
            case $propValue->isString():
                if ($propValue->getLength() > 80) {
                    return new self(
                        EditorIdentifier::fromString(
                            'Sitegeist.Monocle/Props/Editors/TextArea'
                        ),
                        EditorOptions::empty()
                    );
                } else {
                    return new self(
                        EditorIdentifier::fromString(
                            'Sitegeist.Monocle/Props/Editors/Text'
                        ),
                        EditorOptions::empty()
                    );
                }
            default:
                return null;
        }
    }

    /**
     * @return EditorIdentifier
     */
    public function getIdentifier(): EditorIdentifier
    {
        return $this->identifier;
    }

    /**
     * @return EditorOptions
     */
    public function getOptions(): EditorOptions
    {
        return $this->options;
    }

    /**
     * @return array<mixed>
     */
    public function jsonSerialize()
    {
        return [
            'identifier' => $this->identifier,
            'options' => $this->options
        ];
    }
}
