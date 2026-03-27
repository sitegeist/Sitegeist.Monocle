<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Tests\Unit\StyleguideProvider\CpxPackage;

use PHPUnit\Framework\TestCase;
use PackageFactory\ComponentEngine\ComponentCollectionInterface;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObject;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectName;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectPath;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideStructure;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseName;
use Sitegeist\Monocle\StyleguideProvider\CpxPackage\CpxComponentMetadata;
use Sitegeist\Monocle\StyleguideProvider\CpxPackage\CpxComponentFactory;
use Sitegeist\Monocle\Tests\Components\CollectionHost\CollectionHostComponent;
use Sitegeist\Monocle\Tests\Components\Enum\EnumComponent;
use Sitegeist\Monocle\Tests\Components\Enum\Status;
use Sitegeist\Monocle\Tests\Components\ListItem\ListItemComponent;
use Sitegeist\Monocle\Tests\Components\ModernListItem\ModernListItemComponent;
use Sitegeist\Monocle\Tests\Components\Nested\NestedComponent;
use Sitegeist\Monocle\Tests\Components\Primary\PrimaryComponent;
use Sitegeist\Monocle\Tests\Components\SlotHost\SlotHostComponent;

require_once __DIR__ . '/Fixtures/ComponentFactory/Components/Enum/Status.php';
require_once __DIR__ . '/Fixtures/ComponentFactory/Components/Enum/EnumComponent.php';
require_once __DIR__ . '/Fixtures/ComponentFactory/Components/ModernListItem/ModernListItemComponent.php';
require_once __DIR__ . '/Fixtures/ComponentFactory/Components/ListItem/ListItemComponent.php';
require_once __DIR__ . '/Fixtures/ComponentFactory/Components/Nested/NestedComponent.php';
require_once __DIR__ . '/Fixtures/ComponentFactory/Components/SlotHost/SlotHostComponent.php';
require_once __DIR__ . '/Fixtures/ComponentFactory/Components/CollectionHost/CollectionHostComponent.php';
require_once __DIR__ . '/Fixtures/ComponentFactory/Components/Primary/PrimaryComponent.php';

final class CpxComponentFactoryTest extends TestCase
{
    public function testCreatesComponentFromStyleguideProps(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/Primary/PrimaryComponent',
                PrimaryComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/Primary/PrimaryComponent.styleguide.yaml'
            )
        );

        self::assertInstanceOf(PrimaryComponent::class, $component);
        self::assertSame('Default Title', $component->title);
        self::assertCount(2, $component->items);
        self::assertSame('alpha', $component->items[0]);
        self::assertInstanceOf(ListItemComponent::class, $component->items[1]);
        self::assertSame('Item from primary', $component->items[1]->label);
        self::assertInstanceOf(NestedComponent::class, $component->nested);
        self::assertSame('Nested Default', $component->nested->label);
    }

    public function testLocalPropsOverrideStyleguideProps(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/Primary/PrimaryComponent',
                PrimaryComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/Primary/PrimaryComponent.styleguide.yaml'
            ),
            [
                'title' => 'Override Title',
                'items' => [
                    'beta',
                    [
                        '__type' => 'Sitegeist.Monocle.Tests/ListItem/ListItemComponent',
                        'label' => 'Override Item',
                    ],
                ],
                'nested' => [
                    '__type' => 'Sitegeist.Monocle.Tests/Nested/NestedComponent',
                    'label' => 'Nested Override',
                ],
            ]
        );

        self::assertSame('Override Title', $component->title);
        self::assertCount(2, $component->items);
        self::assertSame('beta', $component->items[0]);
        self::assertInstanceOf(ListItemComponent::class, $component->items[1]);
        self::assertSame('Override Item', $component->items[1]->label);
        self::assertInstanceOf(NestedComponent::class, $component->nested);
        self::assertSame('Nested Override', $component->nested->label);
    }

    public function testBackedEnumPropsUseValueKey(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/Enum/EnumComponent',
                EnumComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/Enum/EnumComponent.styleguide.yaml'
            )
        );

        self::assertInstanceOf(EnumComponent::class, $component);
        self::assertSame(Status::Active, $component->status);
    }

    public function testPropSetOverridesStyleguideProps(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/Primary/PrimaryComponent',
                PrimaryComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/Primary/PrimaryComponent.styleguide.yaml'
            ),
            [],
            PropSetName::fromString('highlighted')
        );

        self::assertSame('Highlighted Title', $component->title);
        self::assertInstanceOf(NestedComponent::class, $component->nested);
        self::assertSame('Nested Default', $component->nested->label);
    }

    public function testLocalPropsOverridePropSetProps(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/Primary/PrimaryComponent',
                PrimaryComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/Primary/PrimaryComponent.styleguide.yaml'
            ),
            [
                'title' => 'Local Override Title',
            ],
            PropSetName::fromString('highlighted')
        );

        self::assertSame('Local Override Title', $component->title);
        self::assertSame('Local Override Title', $component->title);
    }

    public function testUseCaseReplacesDefaultProps(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/Primary/PrimaryComponent',
                PrimaryComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/Primary/PrimaryComponent.styleguide.yaml'
            ),
            [],
            null,
            UseCaseName::fromString('compact')
        );

        self::assertSame('Compact Title', $component->title);
        self::assertCount(1, $component->items);
        self::assertSame('compact', $component->items[0]);
        self::assertInstanceOf(NestedComponent::class, $component->nested);
        self::assertSame('Nested Compact', $component->nested->label);
    }

    public function testSlotPropSupportsDirectComponentConfiguration(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/SlotHost/SlotHostComponent',
                SlotHostComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/SlotHost/SlotHostComponent.styleguide.yaml'
            )
        );

        self::assertInstanceOf(SlotHostComponent::class, $component);
        self::assertInstanceOf(ModernListItemComponent::class, $component->content);
        self::assertSame('[item:single]', $component->render());
    }

    public function testSlotPropSupportsMultipleComponentConfigurations(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/SlotHost/SlotHostComponent',
                SlotHostComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/SlotHost/SlotHostComponent.styleguide.yaml'
            ),
            [],
            null,
            UseCaseName::fromString('multipleComponents')
        );

        self::assertInstanceOf(ComponentCollectionInterface::class, $component->content);
        self::assertSame('[item:first][item:second]', $component->render());
    }

    public function testSlotPropSupportsMixedStringsAndComponents(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/SlotHost/SlotHostComponent',
                SlotHostComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/SlotHost/SlotHostComponent.styleguide.yaml'
            ),
            [],
            null,
            UseCaseName::fromString('mixedList')
        );

        self::assertInstanceOf(ComponentCollectionInterface::class, $component->content);
        self::assertSame('alpha[item:middle]omega', $component->render());
    }

    public function testSlotPropSupportsPlainStringContent(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/SlotHost/SlotHostComponent',
                SlotHostComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/SlotHost/SlotHostComponent.styleguide.yaml'
            ),
            [],
            null,
            UseCaseName::fromString('stringOnly')
        );

        self::assertSame('just text', $component->content);
        self::assertSame('just text', $component->render());
    }

    public function testCollectionPropSupportsMultipleComponentConfigurations(): void
    {
        $component = CpxComponentFactory::create(
            $this->createMetadata(
                'Sitegeist.Monocle.Tests/CollectionHost/CollectionHostComponent',
                CollectionHostComponent::class,
                __DIR__ . '/Fixtures/ComponentFactory/Components/CollectionHost/CollectionHostComponent.styleguide.yaml'
            )
        );

        self::assertInstanceOf(CollectionHostComponent::class, $component);
        self::assertInstanceOf(ComponentCollectionInterface::class, $component->content);
        self::assertSame('[item:first][item:second]', $component->render());
    }

    private function createMetadata(string $identifier, string $className, string $styleguideFile): CpxComponentMetadata
    {
        $componentId = str_replace('.cpx', '', $identifier);
        if (!str_contains($componentId, '/')) {
            throw new \InvalidArgumentException(sprintf('Invalid component identifier "%s"', $identifier));
        }

        [, $path] = explode('/', $componentId, 2);
        $pathSegments = explode('/', $path);

        $styleguideObject = new StyleguideObject(
            StyleguideObjectIdentifier::fromString($identifier),
            StyleguideObjectName::fromString($pathSegments[array_key_last($pathSegments)]),
            StyleguideObjectPath::fromString(str_replace('/', '.', $path)),
            new StyleguideStructure('', '', ''),
            ''
        );

        return new CpxComponentMetadata($styleguideObject, $className, $styleguideFile);
    }
}
