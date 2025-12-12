<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider;

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
class NeosNeosFusionSiteStyleguideProvider implements StyleguideProviderInterface
{

    #[Flow\Inject]
    protected PackageManager $packageManager;

    public static function getProviderIdentifier(): StyleguideProviderIdentifier
    {
        return new StyleguideProviderIdentifier('NeosFusionSite');
    }

    public function getStyleguideMetadataCollection(): StyleguideMetadataCollection
    {
        $sitePackages = $this->packageManager->getFilteredPackages('available', 'neos-site');
        $metadataItems = [];
        foreach ($sitePackages as $sitePackage) {
            if (!$sitePackage instanceof FlowPackageInterface) {
                throw new \Exception(sprintf("site package %s is not instance of FlowPackageInterface", get_class($sitePackage)));
            }
            $identifier = new StyleguideIdentifier($sitePackage->getPackageKey());
            $metadataItems[] = new StyleguideMetadata(
                $identifier,
                new StyleguideName($sitePackage->getPackageKey()),
                new StyleguideAddress(
                    $this::getProviderIdentifier(),
                    $identifier
                ),
            );
        }
        return new StyleguideMetadataCollection(...$metadataItems);
    }

    public function getStyleguide(StyleguideIdentifier $identifier): StyleguideInterface
    {
        return new NeosNeosFusionSiteStyleguide($identifier);
    }
}
