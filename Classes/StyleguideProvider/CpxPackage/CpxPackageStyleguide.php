<?php

declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Package\FlowPackageInterface;
use Neos\Flow\Package\PackageManager;
use PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfiguration;
use PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfigurationLoader;
use PackageFactory\PHPComponentEngine\ComponentInterface;
use Sitegeist\Monocle\Domain\StyleguideAddress;
use Sitegeist\Monocle\Domain\StyleguideIdentifier;
use Sitegeist\Monocle\Domain\StyleguideInterface;
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\PropsCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObject;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectDetails;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectName;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectPath;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideStructure;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseName;
use Sitegeist\Monocle\Service\ConfigurationService;
use Symfony\Component\Yaml\Yaml;

class CpxPackageStyleguide implements StyleguideInterface
{
    #[Flow\Inject]
    protected ConfigurationService $configurationService;

    #[Flow\Inject]
    protected PackageManager $packageManager;

    #[Flow\Inject]
    protected TranspilerConfigurationLoader $transpilerConfigurationLoader;

    /**
     * @var CpxComponentMetadata[]
     */
    protected array $items;

    public function __construct(
        protected StyleguideAddress $styleguideAddress,
        protected FlowPackageInterface $package,
    ) {
        $this->package = $package;
    }

    public function getStyleguideAddress(): StyleguideAddress
    {
        return $this->styleguideAddress;
    }

    public function getStyleguideIdentifier(): StyleguideIdentifier
    {
        return $this->styleguideAddress->styleguide;
    }

    public function getStyleguideObjectList(): StyleguideObjectCollection
    {
        $list = $this->buildItemList();
        return $list->asStyleguideObjectCollection();
    }

    public function getStyleguideObjectDetails(StyleguideObjectIdentifier $identifier): StyleguideObjectDetails
    {
        $list = $this->buildItemList();
        $item = $list->find($identifier);
        if ($item instanceof CpxComponentMetadata) {
            return $item->prepareStyleguideObjectDetails();
        }
        throw new \InvalidArgumentException($identifier->value . ' not found');
    }

    public function renderStyleguideObject(StyleguideObjectIdentifier $identifier, array $props, ?PropSetName $propSet, ?UseCaseName $useCase, array $locales): string
    {
        $list = $this->buildItemList();
        $item = $list->find($identifier);
        if ($item instanceof CpxComponentMetadata) {
            $component = CpxComponentFactory::buildComponentFromMetadata($item, $props, $propSet, $useCase, true);
            $previewComponentConfiguration = $this->configurationService->getStyleguideConfiguration($this->styleguideAddress, 'preview');
            if ($previewComponentConfiguration) {
                $preview = CpxComponentFactory::buildComponentFromConfiguration($previewComponentConfiguration, ['content' => $component]);
                return $preview->render();
            } else {
                return $component->render();
            }
        }
        throw new \InvalidArgumentException($identifier->value . ' not found');
    }

    private function buildItemList(): CpxComponentMetadataCollection
    {
        $items = [];
        $transpilerConfiguration = $this->transpilerConfigurationLoader->forPackage($this->package->getPackageKey());
        foreach ($transpilerConfiguration as $configuration) {
            /**
             * @var TranspilerConfiguration $configuration
             */
            $identifier = StyleguideObjectIdentifier::fromString($configuration->moduleId);

            $componentId = str_replace('.cpx', '', $configuration->moduleId);
            list($package, $path) = explode('/', $componentId, 2);

            $phpClass = CpxComponentFactory::classNameFromComponentIdentifier($identifier);
            if ($phpClass == null) {
                continue;
            }

            $yamlFile = str_replace('.cpx', '.styleguide.yaml', $configuration->src);
            if (!file_exists($yamlFile)) {
                continue;
            }

            $pathSegments = explode('/', $path);

            $items[] = new CpxComponentMetadata(
                new StyleguideObject(
                    $identifier,
                    StyleguideObjectName::fromString($pathSegments[array_key_last($pathSegments)]),
                    StyleguideObjectPath::fromString(str_replace('/', '.', $path)),
                    new StyleguideStructure('', '', ''),
                    ''
                ),
                $phpClass,
                $yamlFile,
            );
        }
        return new CpxComponentMetadataCollection(...$items);
    }
}
