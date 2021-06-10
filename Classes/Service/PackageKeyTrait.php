<?php
namespace Sitegeist\Monocle\Service;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Package\PackageManager;
use Neos\Flow\Package\PackageInterface;

/**
 * Utility trait to determine package keys
 */
trait PackageKeyTrait
{

    /**
     * @Flow\Inject
     * @var Neos\Flow\Package\PackageManager
     */
    protected $packageManager;

    /**
     * @Flow\InjectConfiguration("packages")
     * @var mixed[]
     */
    protected $packageConfigurations;

    /**
     * Determine the default site package key
     *
     * @return string
     */
    protected function getDefaultSitePackageKey()
    {
        $sitePackageKeys = $this->getActiveSitePackageKeys();
        return reset($sitePackageKeys);
    }

    /**
     * Get a list of all active site package keys
     * @return string[]
     */
    protected function getActiveSitePackageKeys(): array
    {
        $sitePackages = $this->packageManager->getFilteredPackages('available', null, 'neos-site');
        $sitePackageKeys = [];
        foreach ($sitePackages as $sitePackage) {
            $packageKey = $sitePackage->getPackageKey();
            $sitePackageKeys[] = $packageKey;
        }
        $configuredPackageKeys = $this->packageConfigurations ? array_keys($this->packageConfigurations) : [];
        return array_unique(array_merge($sitePackageKeys, $configuredPackageKeys));
    }
}
