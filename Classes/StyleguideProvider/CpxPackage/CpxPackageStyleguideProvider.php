<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

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
        return new StyleguideMetadataCollection();
    }

    public function getStyleguide(StyleguideIdentifier $identifier): StyleguideInterface
    {
        if (class_exists(\Neos\Neos\Domain\Service\FusionSourceCodeFactory::class)) {
            return new CpxPackageStyleguide($identifier);
        } else {
            throw new \InvalidArgumentException('Neos Fusion styleguides can only work with Neos');
        }
    }
}
