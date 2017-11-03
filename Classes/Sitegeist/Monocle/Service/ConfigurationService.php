<?php
namespace Sitegeist\Monocle\Service;

use Neos\Flow\Annotations as Flow;
use Neos\Utility\Arrays;

/**
 * @Flow\Scope("singleton")
 */
class ConfigurationService
{
    /**
     * @var array
     * @Flow\InjectConfiguration
     */
    protected $configuration;

    /**
     * @var array
     */
    protected $mergedConfigurationCache = [];

    /**
     * @param $sitePackageKey
     * @param $path
     */
    public function getSiteConfiguration($sitePackageKey, $path = null) {
        $configuration = $this->getMergedConfigurationForSitePackage($sitePackageKey);
        if ($path == null){
            return $configuration;
        } else {
            return Arrays::getValueByPath($configuration, $path);
        }
    }

    /**
     * Get the merged configuration for a specific site-package
     *
     * @param $sitePackageKey
     * @return array
     */
    protected function getMergedConfigurationForSitePackage($sitePackageKey) {
        if (array_key_exists($sitePackageKey, $this->mergedConfigurationCache)) {
            return $this->mergedConfigurationCache[$sitePackageKey];
        }

        $configuration = $this->configuration;
        $siteConfiguration = Arrays::getValueByPath($configuration, ['packages' , $sitePackageKey] );
        if ($siteConfiguration) {
            $result = Arrays::arrayMergeRecursiveOverrule($configuration, $siteConfiguration);
        } else  {
            $result = $configuration;
        }

        $this->mergedConfigurationCache[$sitePackageKey] = $result;
        return $result;
    }
}
