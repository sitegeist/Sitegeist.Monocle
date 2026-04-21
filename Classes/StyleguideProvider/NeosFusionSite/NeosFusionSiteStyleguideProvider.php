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

namespace Sitegeist\Monocle\StyleguideProvider\NeosFusionSite;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Package\FlowPackageInterface;
use Neos\Flow\Package\PackageManager;
use Sitegeist\Monocle\Domain\StyleguideAddress;
use Sitegeist\Monocle\Domain\StyleguideIdentifier;
use Sitegeist\Monocle\Domain\StyleguideInterface;
use Sitegeist\Monocle\Domain\StyleguideMetadata;
use Sitegeist\Monocle\Domain\StyleguideMetadataCollection;
use Sitegeist\Monocle\Domain\StyleguideName;
use Sitegeist\Monocle\Domain\StyleguideProviderIdentifier;
use Sitegeist\Monocle\Domain\StyleguideProviderInterface;

/**
 * This provider will generate a styleguide for each neos site package
 */
class NeosFusionSiteStyleguideProvider implements StyleguideProviderInterface
{
    #[Flow\Inject]
    protected PackageManager $packageManager;

    public function getStyleguideMetadataCollection(StyleguideProviderIdentifier $providerIdentifier): StyleguideMetadataCollection
    {
        if (class_exists(\Neos\Neos\Domain\Service\FusionSourceCodeFactory::class)) {
            $sitePackages = $this->packageManager->getFilteredPackages('available', 'neos-site');
            $metadataItems = [];
            foreach ($sitePackages as $sitePackage) {
                if (!$sitePackage instanceof FlowPackageInterface) {
                    throw new \Exception(sprintf("site package %s is not instance of FlowPackageInterface", get_class($sitePackage)));
                }
                $styleguideIdentifier = new StyleguideIdentifier($sitePackage->getPackageKey());
                $metadataItems[] = new StyleguideMetadata(
                    $styleguideIdentifier,
                    new StyleguideName($sitePackage->getPackageKey()),
                    new StyleguideAddress(
                        $providerIdentifier,
                        $styleguideIdentifier
                    ),
                );
            }
            return new StyleguideMetadataCollection(...$metadataItems);
        } else {
            return new StyleguideMetadataCollection();
        }
    }

    public function getStyleguide(StyleguideAddress $address): StyleguideInterface
    {
        if (class_exists(\Neos\Neos\Domain\Service\FusionSourceCodeFactory::class)) {
            return new NeosFusionSiteStyleguide($address);
        } else {
            throw new \InvalidArgumentException('Neos Fusion styleguides can only work with Neos');
        }
    }
}
