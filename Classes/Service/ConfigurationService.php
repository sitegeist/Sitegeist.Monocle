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

namespace Sitegeist\Monocle\Service;

use Neos\Flow\Annotations as Flow;
use Neos\Utility\Arrays;
use Sitegeist\Monocle\Domain\StyleguideAddress;

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

    public function getStyleguideConfiguration(StyleguideAddress $address, ?string $path = null): mixed
    {
        $configuration = $this->getMergedConfigurationForStyleguide($address);
        if ($path === null) {
            return $configuration;
        } else {
            return Arrays::getValueByPath($configuration, $path);
        }
    }

    /**
     * @return mixed[]
     */
    protected function getMergedConfigurationForStyleguide(StyleguideAddress $address): array
    {
        $addressAsString = $address->toString();
        if (array_key_exists($addressAsString, $this->mergedConfigurationCache)) {
            return $this->mergedConfigurationCache[$addressAsString];
        }

        $configuration = $this->configuration;
        $styleguideConfiguration = Arrays::getValueByPath($configuration, ['styleguides' , $addressAsString]);
        if ($styleguideConfiguration) {
            $result = Arrays::arrayMergeRecursiveOverrule($configuration, $styleguideConfiguration);
        } else {
            $result = $configuration;
        }

        $this->mergedConfigurationCache[$addressAsString] = $result;
        return $result;
    }

    /**
     * @param $sitePackageKey
     * @param $path
     * @deprecated
     */
    public function getSiteConfiguration($sitePackageKey, $path = null)
    {
        $configuration = $this->getMergedConfigurationForSitePackage($sitePackageKey);
        if ($path == null) {
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
     * @deprecated
     */
    protected function getMergedConfigurationForSitePackage($sitePackageKey)
    {
        if (array_key_exists($sitePackageKey, $this->mergedConfigurationCache)) {
            return $this->mergedConfigurationCache[$sitePackageKey];
        }

        $configuration = $this->configuration;
        $siteConfiguration = Arrays::getValueByPath($configuration, ['packages' , $sitePackageKey]);
        if ($siteConfiguration) {
            $result = Arrays::arrayMergeRecursiveOverrule($configuration, $siteConfiguration);
        } else {
            $result = $configuration;
        }

        $this->mergedConfigurationCache[$sitePackageKey] = $result;
        return $result;
    }
}
