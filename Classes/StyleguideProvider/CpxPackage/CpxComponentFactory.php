<?php

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

declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

use PackageFactory\ComponentEngine\ComponentCollection;
use PackageFactory\ComponentEngine\ComponentCollectionInterface;
use PackageFactory\ComponentEngine\ComponentInterface;
use PackageFactory\ComponentEngine\StringComponent;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseName;
use Symfony\Component\Yaml\Yaml;

final class CpxComponentFactory
{
    /**
     * @var array<string, array<string, mixed>>
     */
    private static array $styleguideConfigurationCache = [];

    public static function create(
        CpxComponentMetadata $metadata,
        array $props = [],
        ?PropSetName $propSetName = null,
        ?UseCaseName $useCaseName = null,
        bool $withContainer = false
    ): ComponentInterface {
        $componentClass = $metadata->componentPhpClassName;
        $styleguideConfiguration = self::readStyleguideConfiguration($metadata->componentStyleguideConfigFile);
        $styleguideProps = self::readStyleguidePropsFromConfiguration(
            $styleguideConfiguration,
            $propSetName,
            $useCaseName
        );
        $propsConfiguration = array_replace($styleguideProps, $props);
        $arguments = self::mapPropsToArguments($componentClass, $propsConfiguration);

        $component = $componentClass::create(...$arguments);
        if ($withContainer && array_key_exists('container', $styleguideConfiguration)) {
            $containerConfiguration = $styleguideConfiguration['container'];
            if (self::isComponentConfiguration($containerConfiguration)) {
                $containerConfiguration['content'] = $component;
                return self::createComponentFromConfiguration($containerConfiguration);
            }
        }
        return $component;
    }

    /**
     * @return array<string, mixed>
     */
    private static function readStyleguidePropsFromConfiguration(
        array $configuration,
        ?PropSetName $propSetName = null,
        ?UseCaseName $useCaseName = null
    ): array {
        $props = $configuration['props'] ?? [];

        $props = is_array($props) ? $props : [];
        if ($useCaseName && isset($configuration['useCases'][$useCaseName->value]) && is_array($configuration['useCases'][$useCaseName->value])) {
            $useCaseConfig = $configuration['useCases'][$useCaseName->value];
            $useCaseProps = $useCaseConfig['props'] ?? [];
            $props = is_array($useCaseProps) ? $useCaseProps : [];
        }
        if ($propSetName && isset($configuration['propSets'][$propSetName->value]) && is_array($configuration['propSets'][$propSetName->value])) {
            $propSetConfig = $configuration['propSets'][$propSetName->value];
            $propSetProps = is_array($propSetConfig['props'] ?? null) ? $propSetConfig['props'] : $propSetConfig;
            $props = array_replace($props, $propSetProps);
        }

        return $props;
    }

    /**
     * @return array<string, mixed>
     */
    private static function readStyleguideConfiguration(string $styleguideFile): array
    {
        if (!is_file($styleguideFile)) {
            throw new \InvalidArgumentException(sprintf('Missing styleguide file "%s"', $styleguideFile));
        }

        if (!array_key_exists($styleguideFile, self::$styleguideConfigurationCache)) {
            $parsedConfiguration = Yaml::parseFile($styleguideFile);
            self::$styleguideConfigurationCache[$styleguideFile] = is_array($parsedConfiguration) ? $parsedConfiguration : [];
        }

        return self::$styleguideConfigurationCache[$styleguideFile];
    }

    /**
     * @param class-string<ComponentInterface> $className
     * @param array<string, mixed> $props
     * @return array<string, mixed>
     */
    private static function mapPropsToArguments(string $className, array $props): array
    {
        $classReflection = new \ReflectionClass($className);
        $factoryMethodReflection = $classReflection->getMethod('create');

        $arguments = [];
        foreach ($factoryMethodReflection->getParameters() as $parameterReflection) {
            $name = $parameterReflection->getName();
            if (array_key_exists($name, $props)) {
                $arguments[$name] = self::mapPropValue($props[$name], $parameterReflection);
            } elseif ($parameterReflection->isDefaultValueAvailable()) {
                $arguments[$name] = $parameterReflection->getDefaultValue();
                continue;
            } else {
                $arguments[$name] = null;
            }
            unset($props[$name]);
        }

        if (count($props) > 0) {
            throw new \Exception(sprintf('Superficial props "%s" were given for "%s"', implode(', ', array_keys($props)), $className));
        }

        return $arguments;
    }

    private static function mapPropValue(mixed $value, ?\ReflectionParameter $reflection = null): mixed
    {
        if (!is_array($value)) {
            if (
                is_string($value)
                && $reflection !== null
                && self::parameterSupportsComponentList($reflection)
                && self::looksLikeHtml($value)
            ) {
                return StringComponent::fromHtmlString($value);
            }

            if ($reflection !== null) {
                $type = $reflection->getType();
                if ($type instanceof \ReflectionNamedType) {
                    $typeName = $type->getName();
                    if (
                        enum_exists($typeName)
                        && method_exists($typeName, 'from')
                    ) {
                        return $typeName::from($value);
                    }
                }
            }
            return $value;
        }

        if (array_is_list($value) && $reflection !== null && self::parameterSupportsComponentList($reflection)) {
            return self::createComponentCollectionFromValues($value);
        }

        if (array_is_list($value)) {
            return array_map(
                static fn (mixed $item): mixed => self::mapPropValue($item),
                $value
            );
        }

        if (self::isComponentConfiguration($value)) {
            return self::createComponentFromConfiguration($value);
        }

        if (self::isStructConfiguration($value)) {
            return self::createStructFromConfiguration($value);
        }

        if (self::isEnumConfiguration($value)) {
            return self::createEnumFromConfiguration($value);
        }

        throw new \Exception('Unexpected props configuration is neither scalar, component, struct nur enum');
    }

    /**
     * @param array<string, mixed> $configuration
     */
    private static function isComponentConfiguration(array $configuration): bool
    {
        if (!array_key_exists('__type', $configuration) || !is_string($configuration['__type'])) {
            return false;
        }
        $className = self::classNameFromIdentifier($configuration['__type']);
        if (class_exists($className) && is_subclass_of($className, ComponentInterface::class)) {
            return true;
        }
        return false;
    }

    /**
     * @param array<string, mixed> $configuration
     */
    private static function isStructConfiguration(array $configuration): bool
    {
        if (!array_key_exists('__type', $configuration) || !is_string($configuration['__type'])) {
            return false;
        }
        $className = self::classNameFromIdentifier($configuration['__type']);
        if (class_exists($className) && method_exists($className, 'create')) {
            return true;
        }
        return false;
    }

    /**
     * @param array<string, mixed> $configuration
     */
    private static function isEnumConfiguration(array $configuration): bool
    {
        if (!array_key_exists('__type', $configuration) || !array_key_exists('value', $configuration)) {
            return false;
        }
        $className = self::classNameFromIdentifier($configuration['__type']);
        if (enum_exists($className) && method_exists($className, 'from')) {
            return true;
        }
        return false;
    }

    /**
     * @param array<string, mixed> $configuration
     */
    private static function createComponentFromConfiguration(array $configuration): ComponentInterface
    {
        $propsFiltered = [];
        foreach ($configuration as $key => $value) {
            if (str_starts_with($key, '__')) {
                continue;
            }
            $propsFiltered[$key] = $value;
        }

        $metadata = CpxComponentMetadata::fromComponentIdentifier(StyleguideObjectIdentifier::fromString($configuration['__type']));
        $useCase = $configuration['__useCase'] ?? null;
        $propSet = $configuration['__propSet'] ?? null;

        return self::create(
            $metadata,
            $propsFiltered,
            $propSet ? PropSetName::fromString($propSet) : null,
            $useCase ? UseCaseName::fromString($useCase) : null
        );
    }

    /**
     * @param array<string, mixed> $configuration
     */
    private static function createStructFromConfiguration(array $configuration): object
    {
        $propsFiltered = [];
        foreach ($configuration as $key => $value) {
            if (str_starts_with($key, '__')) {
                continue;
            }
            $propsFiltered[$key] = $value;
        }

        $className = self::classNameFromIdentifier($configuration['__type']);
        $arguments = self::mapPropsToArguments($className, $propsFiltered);
        return $className::create(...$arguments);
    }

    /**
     * @param array<string, mixed> $configuration
     */
    private static function createEnumFromConfiguration(array $configuration): \BackedEnum
    {
        $className = self::classNameFromIdentifier($configuration['__type']);
        $value = $configuration['value'];
        return $className::from($value);
    }

    private static function createComponentCollectionFromValues(array $values): ?ComponentCollectionInterface
    {
        $items = [];
        foreach ($values as $value) {
            $mappedValue = self::mapPropValue($value);
            if (is_string($mappedValue)) {
                $items[] = self::looksLikeHtml($mappedValue)
                    ? StringComponent::fromHtmlString($mappedValue)
                    : StringComponent::fromString($mappedValue);
                continue;
            }

            if ($mappedValue instanceof ComponentInterface || $mappedValue === null) {
                $items[] = $mappedValue;
                continue;
            }

            throw new \InvalidArgumentException('List props must resolve to components or strings.');
        }

        return ComponentCollection::list(...$items);
    }

    private static function parameterSupportsComponentList(\ReflectionParameter $parameter): bool
    {
        return self::reflectionTypeSupportsComponentList($parameter->getType());
    }

    private static function reflectionTypeSupportsComponentList(?\ReflectionType $reflectionType): bool
    {
        if ($reflectionType instanceof \ReflectionNamedType) {
            $typeName = $reflectionType->getName();
            return $typeName === ComponentCollectionInterface::class
                || $typeName === ComponentInterface::class;
        }

        if ($reflectionType instanceof \ReflectionUnionType) {
            foreach ($reflectionType->getTypes() as $unionedType) {
                if (self::reflectionTypeSupportsComponentList($unionedType)) {
                    return true;
                }
            }
        }

        return false;
    }

    private static function looksLikeHtml(string $value): bool
    {
        return preg_match('/<[^>]+>/', $value) === 1;
    }

    /**
     * @return class-string<ComponentInterface>
     */
    private static function classNameFromIdentifier(string $identifier): string
    {
        $componentId = str_replace('.cpx', '', $identifier);
        if (!str_contains($componentId, '/')) {
            throw new \InvalidArgumentException(sprintf('Invalid component identifier "%s"', $identifier));
        }

        [$package, $path] = explode('/', $componentId, 2);
        $phpClass = str_replace('.', '\\', $package) . '\\Components\\' . str_replace('/', '\\', $path);

        if (!class_exists($phpClass)) {
            throw new \InvalidArgumentException(sprintf('Component class "%s" could not be resolved', $phpClass));
        }

        return $phpClass;
    }
}
