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
     * @return array
     */
    protected function getActiveSitePackageKeys()
    {
        $sitePackages = $this->packageManager->getFilteredPackages('available', null, 'neos-site');
        $result = [];
        foreach ($sitePackages as $sitePackage) {
            $packageKey = $sitePackage->getPackageKey();
            $result[] = $packageKey;
        }
        return $result;
    }
}
