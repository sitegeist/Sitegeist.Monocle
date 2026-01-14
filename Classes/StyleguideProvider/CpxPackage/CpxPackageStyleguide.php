<?php

declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Package\FlowPackageInterface;
use Neos\Flow\Package\PackageManager;
use PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfiguration;
use PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfigurationLoader;
use Sitegeist\Monocle\Domain\StyleguideAddress;
use Sitegeist\Monocle\Domain\StyleguideIdentifier;
use Sitegeist\Monocle\Domain\StyleguideInterface;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectDetails;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseName;
use Sitegeist\Monocle\Service\ConfigurationService;

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
        $metadata = CpxComponentMetadata::fromComponentIdentifier($identifier);
        $component = CpxComponentFactory::create($metadata, $props, $propSet, $useCase);
        return $component->render();
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

            try {
                $metadata = CpxComponentMetadata::fromComponentIdentifier($identifier);
            } catch (\InvalidArgumentException) {
                continue;
            }
            if (!file_exists($metadata->componentStyleguideConfigFile)) {
                continue;
            }

            $items[] = $metadata;
        }
        return new CpxComponentMetadataCollection(...$items);
    }
}
