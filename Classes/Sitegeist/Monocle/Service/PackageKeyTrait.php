<?php
namespace Sitegeist\Monocle\Service;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Package\PackageManagerInterface;

/**
 * Utility trait to determine package keys
 */
trait PackageKeyTrait
{

    /**
     * @Flow\Inject
     * @var PackageManagerInterface
     */
    protected $packageManager;

    /**
     * Determine the default package key
     *
     * @return string
     */
    protected function getDefaultSitePackageKey()
    {
        $sitePackages = $this->packageManager->getFilteredPackages('available', null, 'neos-site');
        $sitePackage = reset($sitePackages);

        return $sitePackage->getPackageKey();
    }
}
