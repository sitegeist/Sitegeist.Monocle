<?php
namespace Sitegeist\Monocle\Service;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Package\PackageManager;
use Neos\Flow\Package\PackageInterface;
use Neos\Neos\Domain\Repository\DomainRepository;

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
     * @Flow\Inject
     * @var Neos\Neos\Domain\Repository\DomainRepository
     */
    protected $domainRepository;

    /**
     * @Flow\InjectConfiguration("defaultPackageKey")
     * @var string|null
     */
    protected $defaultPackageKey;

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
        try {
            $domain = $this->domainRepository->findOneByActiveRequest();
            if ($domain && $domain->getSite()) {
                return $domain->getSite()->getSiteResourcesPackageKey();
            }
        } catch (\Exception $e) {
            // ignore errors that may occur if no database is present
        }

        if ($this->defaultPackageKey) {
            return $this->defaultPackageKey;
        }

        $sitePackageKeys = $this->getActiveSitePackageKeys();
        return reset($sitePackageKeys);
    }

    /**
     * Get a list of all active site package keys
     * @return string[]
     */
    protected function getActiveSitePackageKeys(): array
    {
        /**
         * Adjust to a breaking api change in neos 8
         * @todo remove once Neos 7 Support is dropped
         */
        if (version_compare(FLOW_VERSION_BRANCH, '8.0') >= 0) {
            $sitePackages = $this->packageManager->getFilteredPackages('available', 'neos-site');
        } else {
            $sitePackages = $this->packageManager->getFilteredPackages('available', null, 'neos-site');
        }
        $sitePackageKeys = [];
        foreach ($sitePackages as $sitePackage) {
            $packageKey = $sitePackage->getPackageKey();
            $sitePackageKeys[] = $packageKey;
        }
        $configuredPackageKeys = $this->packageConfigurations ? array_keys($this->packageConfigurations) : [];
        return array_unique(array_merge($sitePackageKeys, $configuredPackageKeys));
    }
}
