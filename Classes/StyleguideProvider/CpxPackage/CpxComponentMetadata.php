<?php

declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Reflection\ClassReflection;
use PackageFactory\PHPComponentEngine\ComponentInterface;
use ReflectionNamedType;
use ReflectionParameter;
use ReflectionType;
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\Editor;
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\EditorIdentifier;
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\EditorOptions;
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\Prop;
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\PropName;
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\PropsCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\PropValue;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSet;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObject;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectDetails;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCase;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseName;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseTitle;
use Symfony\Component\Yaml\Yaml;

readonly class CpxComponentMetadata
{
    /**
     * @param StyleguideObject $styleguideObject
     * @param class-name-string<ComponentInterface> $componentPhpClassName
     * @param string $componentStyleguideConfigFile
     */
    public function __construct(
        public StyleguideObject $styleguideObject,
        public string $componentPhpClassName,
        public string $componentStyleguideConfigFile,
    ) {
    }

    public function prepareStyleguideObjectDetails(): StyleguideObjectDetails
    {
        $config = Yaml::parseFile($this->componentStyleguideConfigFile);

        $props = [];

        $componentClassReflection = new \ReflectionClass($this->componentPhpClassName);
        $componentFactoryMethodReflection = $componentClassReflection->getMethod('create');

        foreach ($componentFactoryMethodReflection->getParameters() as $parameter) {
            $propValue = $config['props'][$parameter->getName()] ?? null;

            if (!$propValue || !$parameter->hasType()) {
                continue;
            }

            $parameterType = $parameter->getType();

            // string
            if ($parameterType instanceof \ReflectionNamedType && ($parameterType->getName() === 'string')) {
                $props[] = new Prop(
                    PropName::fromString($parameter->getName()),
                    PropValue::fromAny($propValue),
                    new Editor(
                        EditorIdentifier::fromString('Sitegeist.Monocle/Props/Editors/Text'),
                        EditorOptions::empty()
                    )
                );
            }

            // int, float
            if ($parameterType instanceof \ReflectionNamedType && ($parameterType->getName() === 'int' || $parameterType->getName() === 'float')) {
                $props[] = new Prop(
                    PropName::fromString($parameter->getName()),
                    PropValue::fromAny($propValue),
                    new Editor(
                        EditorIdentifier::fromString(
                            'Sitegeist.Monocle/Props/Editors/Text'
                        ),
                        EditorOptions::fromArray([
                            'castValueTo' => match ($parameterType->getName()) {
                                'int' => 'integer',
                                'float' => 'float',
                            }
                        ])
                    )
                );
            }

            // boolean
            if ($parameterType instanceof \ReflectionNamedType && ($parameterType->getName() === 'bool')) {
                $props[] = new Prop(
                    PropName::fromString($parameter->getName()),
                    PropValue::fromAny($propValue),
                    new Editor(
                        EditorIdentifier::fromString('Sitegeist.Monocle/Props/Editors/Checkbox'),
                        EditorOptions::empty()
                    )
                );
            }

            // typed objects
            if ($parameterType instanceof \ReflectionNamedType && ($parameterType->isBuiltin() === false)) {
                $parameterClassReflection = new \ReflectionClass($parameterType->getName());

                // enum
                if ($parameterClassReflection->isEnum()) {
                    $parameterEnumReflection = new \ReflectionEnum($parameterType->getName());
                    $options = [];
                    foreach ($parameterEnumReflection->getCases() as $case) {
                        if ($case instanceof \ReflectionEnumBackedCase) {
                            $options[] = ['label' => $case->getName(), 'value' => $case->getBackingValue()];
                        }
                    }
                    $props[] = new Prop(
                        PropName::fromString($parameter->getName()),
                        PropValue::fromAny($propValue),
                        new Editor(
                            EditorIdentifier::fromString('Sitegeist.Monocle/Props/Editors/SelectBox'),
                            EditorOptions::fromArray([
                                'options' => $options
                            ])
                        )
                    );
                }
            }
        }

        $propSets = [];
        if (array_key_exists('propSets', $config)) {
            foreach ($config[ 'propSets' ] as $propSetName => $propSetConfig) {
                $propSets[] = new PropSet(PropSetName::fromString($propSetName), $propSetConfig);
            }
        }

        $useCases = [];
        if (array_key_exists('useCases', $config)) {
            foreach ($config[ 'useCases' ] as $useCaseName => $useCaseConfig) {
                $useCases[] = new UseCase(
                    UseCaseName::fromString($useCaseName),
                    UseCaseTitle::fromString($useCaseConfig['title'] ?? $useCaseName),
                    $useCaseConfig
                );
            }
        }

        return new StyleguideObjectDetails(
            $this->styleguideObject->identifier,
            $this->styleguideObject->name,
            new PropsCollection(...$props),
            new PropSetCollection(...$propSets),
            new UseCaseCollection(...$useCases)
        );
    }
}
