<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

use PackageFactory\PHPComponentEngine\ComponentInterface;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseName;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;
use Symfony\Component\Yaml\Yaml;

class CpxComponentFactory
{
    public static function buildComponentFromMetadata(CpxComponentMetadata $metadata, array $props, ?PropSetName $propSetName, ?UseCaseName $useCaseName, bool $addContainer = false): ComponentInterface
    {
        $styleguideConfiguration = Yaml::parseFile($metadata->componentStyleguideConfigFile);

        $defaultProps = $styleguideConfiguration['props'] ?? [];
        $containerConfiguration = $styleguideConfiguration['container'] ?? null;

        if ($propSetName) {
            $propsFromPropSet = $styleguideConfiguration['propSets'][$propSetName->value] ?? [];
            $propConfiguration = array_merge($defaultProps, $propsFromPropSet, $props);
        } elseif ($useCaseName) {
            $containerConfiguration = $styleguideConfiguration['useCases'][$useCaseName->value]['container'] ?? $containerConfiguration;
            $propsFromUseCase = $styleguideConfiguration['useCases'][$useCaseName->value]['props'] ?? [];
            $propConfiguration = array_merge($propsFromUseCase, $props);
        } else {
            $propConfiguration = array_merge($defaultProps, $props);
        }

        $propsResolved = self::prepareComponentInstantiationArguments($metadata->componentPhpClassName, $propConfiguration);

        $component = $metadata->componentPhpClassName::create(...$propsResolved);

        if ($addContainer && $containerConfiguration) {
            $containerWithComponent = self::buildComponentFromConfiguration($containerConfiguration, ['content' => $component]);
            return $containerWithComponent;
        } else {
            return $component;
        }
    }


    public static function buildComponentFromConfiguration(array $configuration, array $props): ComponentInterface
    {
        if (array_key_exists('component', $configuration)) {
            $componentClass = self::classNameFromComponentIdentifier(StyleguideObjectIdentifier::fromString($configuration['component']));
            if ($componentClass) {
                $props = array_merge($configuration['props'] ?? [], $props);
                $propsResolved = self::prepareComponentInstantiationArguments($componentClass, $props);
                return $componentClass::create(...$propsResolved);
            } else {
                throw new \InvalidArgumentException(sprintf('Component %s could not be resolved', $configuration['component']));
            }
        }
        throw new \InvalidArgumentException('Configuration could not be resolved');
    }

    /**
     * @param class-string<ComponentInterface> $className
     * @param array $configuration
     * @return array<string, mixed>
     */
    public static function prepareComponentInstantiationArguments(string $className, array $configuration): array
    {
        $classReflection = new \ReflectionClass($className);
        $factoryMethodReflection = $classReflection->getMethod('create');

        $props = [];
        foreach ($factoryMethodReflection->getParameters() as $parameterReflection) {
            $propName = $parameterReflection->getName();
            $propValueConfiguration = $configuration[$propName] ?? [];

            if (!$propValueConfiguration) {
                $props[$propName] = null;
                continue;
            }

            $parameterType = $parameterReflection->getType();
            if (!$parameterType) {
                throw new \InvalidArgumentException(sprintf('Parameter "%s" has no type', $propName));
            }

            if ($parameterType instanceof \ReflectionNamedType) {
                $props[$propName] = self::getParameterValueForNamedType($parameterType, $propValueConfiguration);
            } elseif ($parameterType instanceof \ReflectionUnionType) {
                $props[$propName] = self::getParameterValueForUnionType($parameterType, $propValueConfiguration);
            }
        }
        return $props;
    }

    private static function getParameterValueForNamedType(\ReflectionNamedType $type, mixed $configuration): mixed
    {
        if ($type->isBuiltin()) {
            return $configuration;
        }

        $className = $type->getName();
        if ($configuration instanceof $className) {
            return $configuration;
        }

        $classReflection = new \ReflectionClass($className);

        // enum
        if ($classReflection->isEnum() && is_subclass_of($className, \BackedEnum::class, true)) {
            return $className::from($configuration);
        }

        // named component
        if (is_subclass_of($type->getName(), ComponentInterface::class, true)) {
            return self::buildComponentFromConfiguration($configuration, $configuration);
        }

        // any component
        if ($className === ComponentInterface::class) {
            return self::buildComponentFromConfiguration($configuration, $configuration);
        }

        return null;
    }

    private static function getParameterValueForUnionType(\ReflectionUnionType $type, mixed $configuration): mixed
    {
        $value = null;
        foreach ($type->getTypes() as $subtype) {
            if ($subtype instanceof \ReflectionNamedType) {
                $value = self::getParameterValueForNamedType($subtype, $configuration);
            }
            if ($value !== null) {
                return $value;
            }
        }
        return null;
    }

    /**
     * @return class-string<ComponentInterface>
     */
    public static function classNameFromComponentIdentifier(StyleguideObjectIdentifier $identifier): ?string
    {
        $componentId = str_replace('.cpx', '', $identifier->value);
        list($package, $path) = explode('/', $componentId, 2);
        $phpClass = str_replace('.', '\\', $package) . '\\Components\\' . str_replace('/', '\\', $path);
        if (!class_exists($phpClass)) {
            return null;
        }
        if (!is_subclass_of($phpClass, ComponentInterface::class, true)) {
            return null;
        }
        return $phpClass;
    }
}
