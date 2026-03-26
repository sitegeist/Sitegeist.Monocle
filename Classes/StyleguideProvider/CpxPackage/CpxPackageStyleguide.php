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

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Package\FlowPackageInterface;
use Neos\Flow\Package\PackageManager;
use Neos\Flow\ResourceManagement\ResourceManager;
use PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfiguration;
use PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfigurationLoader;
use Sitegeist\Monocle\Domain\StyleguideAddress;
use Sitegeist\Monocle\Domain\StyleguideIdentifier;
use Sitegeist\Monocle\Domain\StyleguideInterface;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObject;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideStructure;
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
    protected ResourceManager $resourceManager;

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
        $component = CpxComponentFactory::create($metadata, $props, $propSet, $useCase, true);

        $styles = $this->configurationService->getStyleguideConfiguration($this->getStyleguideAddress(), 'preview.styles');
        $styleTags = array_reduce(
            is_array($styles) ? array_filter($styles) : [],
            fn (string $carry, string $path) => $carry . '<link rel="stylesheet" href="' . $this->resourceManager->getPublicPackageResourceUriByPath($path) . '"></link>',
            ''
        );

        $scripts = $this->configurationService->getStyleguideConfiguration($this->getStyleguideAddress(), 'preview.scripts');
        $scriptTags = array_reduce(
            is_array($scripts) ? array_filter($scripts) : [],
            fn (string $carry, string $path) => $carry . '<script async src="' . $this->resourceManager->getPublicPackageResourceUriByPath($path) . '"></script>',
            ''
        );

        return <<<EOL
        <!DOCTYPE html>
        <html lang="de">
            <head>
                <title>{$identifier->value}</title>
                {$styleTags}
                {$scriptTags}
            </head>
            <body>{$component->render()}</body>
        <head>
        EOL;
    }

    private function buildItemList(): CpxComponentMetadataCollection
    {
        $items = [];
        $prototypeStructures = $this->configurationService->getStyleguideConfiguration($this->getStyleguideAddress(), 'ui.structure');
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

            $items[] = new CpxComponentMetadata(
                $this->resolveStyleguideObject($metadata->styleguideObject, is_array($prototypeStructures) ? $prototypeStructures : []),
                $metadata->componentPhpClassName,
                $metadata->componentStyleguideConfigFile
            );
        }
        return new CpxComponentMetadataCollection(...$items);
    }

    private function resolveStyleguideObject(StyleguideObject $styleguideObject, array $prototypeStructures): StyleguideObject
    {
        return new StyleguideObject(
            $styleguideObject->identifier,
            $styleguideObject->name,
            $styleguideObject->path,
            $this->getStructureForComponentPath($prototypeStructures, $styleguideObject->path->value),
            $styleguideObject->description
        );
    }

    private function getStructureForComponentPath(array $prototypeStructures, string $componentPath): StyleguideStructure
    {
        foreach ($prototypeStructures as $structure) {
            if (!isset($structure['match'], $structure['label'], $structure['icon'], $structure['color'])) {
                continue;
            }

            if (preg_match(sprintf('!%s!', $structure['match']), $componentPath)) {
                return new StyleguideStructure(
                    $structure['label'],
                    $structure['icon'],
                    $structure['color'],
                );
            }
        }

        return new StyleguideStructure(
            'Other',
            'icon-question',
            'white'
        );
    }
}
