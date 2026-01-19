<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

use PackageFactory\PHPComponentEngine\ComponentInterface;
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
        ?UseCaseName $useCaseName = null
    ): ComponentInterface
    {
        $componentClass = $metadata->componentPhpClassName;
        $styleguideProps = self::readStyleguidePropsFromConfigFile(
            $metadata->componentStyleguideConfigFile,
            $propSetName,
            $useCaseName
        );
        $propsConfiguration = array_replace($styleguideProps, $props);
        $arguments = self::mapPropsToArguments($componentClass, $propsConfiguration);

        return $componentClass::create(...$arguments);
    }

    /**
     * @return array<string, mixed>
     */
    private static function readStyleguidePropsFromConfigFile(
        string $styleguideFile,
        ?PropSetName $propSetName = null,
        ?UseCaseName $useCaseName = null
    ): array
    {
        if (!is_file($styleguideFile)) {
            throw new \InvalidArgumentException(sprintf('Missing styleguide file "%s"', $styleguideFile));
        }

        if (!array_key_exists($styleguideFile, self::$styleguideConfigurationCache)) {
            $parsedConfiguration = Yaml::parseFile($styleguideFile);
            self::$styleguideConfigurationCache[$styleguideFile] = is_array($parsedConfiguration) ? $parsedConfiguration : [];
        }

        $configuration = self::$styleguideConfigurationCache[$styleguideFile];
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
     * @param class-string<ComponentInterface> $className
     * @param array<string, mixed> $props
     * @return array<int, mixed>
     */
    private static function mapPropsToArguments(string $className, array $props): array
    {
        $classReflection = new \ReflectionClass($className);
        $factoryMethodReflection = $classReflection->getMethod('create');

        $arguments = [];
        foreach ($factoryMethodReflection->getParameters() as $parameterReflection) {
            $name = $parameterReflection->getName();
            if (array_key_exists($name, $props)) {
                $arguments[] = self::mapPropValueForParameter($parameterReflection, $props[$name]);
                continue;
            }

            if ($parameterReflection->isDefaultValueAvailable()) {
                $arguments[] = $parameterReflection->getDefaultValue();
                continue;
            }

            $arguments[] = null;
        }

        return $arguments;
    }

    private static function mapPropValueForParameter(\ReflectionParameter $parameter, mixed $value): mixed
    {
        $type = $parameter->getType();
        if ($type instanceof \ReflectionNamedType && !$type->isBuiltin()) {
            $className = $type->getName();
            if (is_a($className, \BackedEnum::class, true)) {
                if ($value instanceof $className) {
                    return $value;
                }
                if (is_array($value) && array_key_exists('value', $value)) {
                    return $className::from($value['value']);
                }
                return $className::from($value);
            }
        }

        return self::mapPropValue($value);
    }

    private static function mapPropValue(mixed $value): mixed
    {
        if ($value instanceof ComponentInterface) {
            return $value;
        }

        if (!is_array($value)) {
            return $value;
        }

        if (array_is_list($value)) {
            return array_map([self::class, 'mapPropValue'], $value);
        }

        if (self::isComponentConfiguration($value)) {
            return self::createFromConfiguration($value);
        }

        $mapped = [];
        foreach ($value as $key => $item) {
            $mapped[$key] = self::mapPropValue($item);
        }

        return $mapped;
    }

    /**
     * @param array<string, mixed> $configuration
     */
    private static function isComponentConfiguration(array $configuration): bool
    {
        return array_key_exists('__type', $configuration)
            && is_string($configuration['__type'])
            && $configuration['__type'] !== '';
    }

    /**
     * @param array<string, mixed> $configuration
     */
    private static function createFromConfiguration(array $configuration): object
    {
        if (!self::isComponentConfiguration($configuration)) {
            throw new \InvalidArgumentException('Component configuration requires a "__type" key');
        }

        $props = [];
        foreach ($configuration as $key => $value) {
            if (str_starts_with($key, '__')) {
                continue;
            }
            $props[$key] = self::mapPropValue($value);
        }

        $type = $configuration['__type'];
        if (is_subclass_of($type, ComponentInterface::class, true)) {
            $metadata = CpxComponentMetadata::fromComponentIdentifier(StyleguideObjectIdentifier::fromString($configuration['__type']));
            return self::create($metadata, $props);
        } else {
            $className = CpxComponentMetadata::classNameFromIdentifier($type);
            return $className::create(...$props);
        }
    }
}
