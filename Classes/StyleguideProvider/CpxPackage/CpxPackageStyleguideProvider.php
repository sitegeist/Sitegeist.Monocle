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
use PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfigurationLoader;
use Sitegeist\Monocle\Domain\StyleguideAddress;
use Sitegeist\Monocle\Domain\StyleguideIdentifier;
use Sitegeist\Monocle\Domain\StyleguideInterface;
use Sitegeist\Monocle\Domain\StyleguideMetadata;
use Sitegeist\Monocle\Domain\StyleguideMetadataCollection;
use Sitegeist\Monocle\Domain\StyleguideName;
use Sitegeist\Monocle\Domain\StyleguideProviderIdentifier;
use Sitegeist\Monocle\Domain\StyleguideProviderInterface;
use Sitegeist\Monocle\StyleguideProvider\NeosFusionSite\CpxPackageStyleguide;

/**
 * This provider will generate a styleguide for each neos site package
 */
class CpxPackageStyleguideProvider implements StyleguideProviderInterface
{
    #[Flow\Inject]
    protected PackageManager $packageManager;

    public function getStyleguideMetadataCollection(StyleguideProviderIdentifier $providerIdentifier): StyleguideMetadataCollection
    {
        $items = [];
        if (class_exists(\PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfigurationLoader::class)) {
            $packages = $this->packageManager->getFlowPackages();
            foreach ($packages as $package) {
                $componentPath = $package->getPackagePath() . '/Components';
                if (file_exists($componentPath) && is_dir($componentPath)) {
                    $identifier = StyleguideIdentifier::fromString($package->getPackageKey());
                    $items[] = new StyleguideMetadata(
                        $identifier,
                        StyleguideName::fromString($package->getComposerName()),
                        new StyleguideAddress(
                            $providerIdentifier,
                            $identifier,
                        )
                    );
                }
            }
        }
        return new StyleguideMetadataCollection(...$items);
    }

    public function getStyleguide(StyleguideAddress $address): StyleguideInterface
    {
        if (class_exists(\PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfigurationLoader::class)) {
            $package = $this->packageManager->getPackage($address->styleguide->value);
            if ($package instanceof FlowPackageInterface) {
                return new \Sitegeist\Monocle\StyleguideProvider\CpxPackage\CpxPackageStyleguide(
                    $address,
                    $package,
                );
            }
        }
        throw new \InvalidArgumentException('Neos Fusion styleguides can only work with Neos');
    }
}
