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
use Sitegeist\Monocle\Domain\Fusion\Prototype;

/**
 * @Flow\Proxy(false)
 */
final class EditorFactory
{
    /**
     * Get an editor that fits the given prop of the given prototype
     *
     * @param Prototype $prototype
     * @param PropName $propName
     * @return EditorInterface|null
     */
    public function for(
        Prototype $prototype,
        PropName $propName
    ): ?EditorInterface {
        if (($hidePropsInInspector = $prototype->evaluate('/__meta/styleguide/options/hidePropsInInspector')) && in_array((string)$propName, $hidePropsInInspector, true)) {
            return null;
        }
        if ($manualConfiguration = $prototype->evaluate(
            sprintf(
                '/__meta/styleguide/options/propEditors/%s<Neos.Fusion:DataStructure>',
                $propName
            )
        )) {
            try {
                return $this->fromManualConfiguration($manualConfiguration);
            } catch (\UnexpectedValueException $e) {
                throw new \DomainException(
                    sprintf(
                        'Invalid editor configuration for prop "%s" of "%s": %s',
                        $propName,
                        $prototype->getName(),
                        $e->getMessage()
                    )
                );
            }
        }

        if ($propValue = PropValue::of($prototype, $propName)) {
            return $this->forPropValue($propValue);
        }

        return null;
    }

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
                return $this->number('float');
            case $propValue->isString():
                if ($propValue->getLength() <= 80) {
                    return $this->text();
                } else {
                    return $this->textArea();
                }
                break;
            default:
                return null;
        }
    }

    /**
     * @param array<string,mixed> $manualConfiguration
     * @return EditorInterface
     */
    public function fromManualConfiguration(array $manualConfiguration): EditorInterface
    {
        if (!isset($manualConfiguration['editor'])) {
            throw new \UnexpectedValueException(
                'Path "editor" must be defined.'
            );
        }

        if (!is_string($manualConfiguration['editor'])) {
            throw new \UnexpectedValueException(
                'Path "editor" must evaluate to a string.'
            );
        }

        if (!isset($manualConfiguration['editorOptions'])) {
            $manualConfiguration['editorOptions'] = [];
        }

        if (!is_array($manualConfiguration['editorOptions'])) {
            throw new \UnexpectedValueException(
                'Path "editorOptions" must evaluate to an array.'
            );
        }

        switch ($manualConfiguration['editor']) {
            case 'Sitegeist.Monocle/Props/Editors/Checkbox':
                return $this->checkbox();
            case 'Sitegeist.Monocle/Props/Editors/Text':
                return $this->text();
            case 'Sitegeist.Monocle/Props/Editors/TextArea':
                return $this->textArea();
            case 'Sitegeist.Monocle/Props/Editors/SelectBox':
                return $this->selectBox($manualConfiguration['editorOptions']);
            default:
                throw new \UnexpectedValueException(
                    sprintf(
                        'Unknown editor "%s".',
                        $manualConfiguration['editor']
                    )
                );
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
     * Provides a Number editor
     *
     * @return EditorInterface
     */
    public function number(string $numberType): EditorInterface
    {
        if (!in_array($numberType, ['integer', 'float'])) {
            throw new \UnexpectedValueException(
                '$numberType must be either "integer" or "float".'
            );
        }

        return new Editor(
            EditorIdentifier::fromString(
                'Sitegeist.Monocle/Props/Editors/Text'
            ),
            EditorOptions::fromArray([
                'castValueTo' => $numberType
            ])
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
        if (!isset($options['options'])) {
            $options['options'] = [];
        }

        if (!is_array($options['options'])) {
            throw new \UnexpectedValueException(
                sprintf(
                    'SelectBox options must be an array. Got "%" instead.',
                    gettype($options['options'])
                )
            );
        } else {
            $options['options'] = array_values($options['options']);
        }

        foreach ($options['options'] as $option) {
            if (!isset($option['label'])) {
                throw new \UnexpectedValueException(
                    'All SelectBox options must have a label.'
                );
            }

            if (!is_string($option['label'])) {
                throw new \UnexpectedValueException(
                    sprintf(
                        'All SelectBox option labels must be of type string. Got "%s" instead.',
                        gettype($option['label'])
                    )
                );
            }

            if (!isset($option['value'])) {
                throw new \UnexpectedValueException(
                    sprintf(
                        'All SelectBox options must have a value. Found option "%s" without one.',
                        $option['label']
                    )
                );
            }

            if (!is_string($option['value']) && !is_int($option['value']) && !is_float($option['value'])) {
                throw new \UnexpectedValueException(
                    sprintf(
                        'All SelectBox option labels must be either of type string, integer or float. Got "%s" for option "%s" instead.',
                        gettype($option['value']),
                        $option['label']
                    )
                );
            }
        }

        return new Editor(
            EditorIdentifier::fromString(
                'Sitegeist.Monocle/Props/Editors/SelectBox'
            ),
            EditorOptions::fromArray($options)
        );
    }
}
