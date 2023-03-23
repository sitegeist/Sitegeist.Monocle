<?php
namespace Sitegeist\Monocle\Fusion;

/**
 * This file is part of the Sitegeist.Monocle package
 *
 * (c) 2016
 * Martin Ficzel <ficzel@sitegeist.de>
 * Wilhelm Behncke <behncke@sitegeist.de>
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Package\PackageManager;
use Neos\Fusion\Core\FusionConfiguration;
use Neos\Fusion\Core\FusionSourceCodeCollection;
use \Neos\Neos\Domain\Service\FusionService as NeosFusionService;

/**
 * Class FusionService
 * @package Sitegeist\Monocle\Fusion
 */
class FusionService extends NeosFusionService
{
    /**
     * @Flow\Inject
     * @var PackageManager
     */
    protected $packageManager;

    /**
     * Returns a merged fusion object tree in the context of the given site-package
     *
     * @param string $siteResourcesPackageKey
     * @return array The merged object tree as of the given node
     * @throws \Neos\Neos\Domain\Exception
     */
    public function getMergedFusionObjectTreeForSitePackage($siteResourcesPackageKey)
    {
        return $this->getFusionConfigurationForPackageKey($siteResourcesPackageKey)->toArray();
    }


    /**
     * Returns fusion configuration for the given package
     *
     * @param string $packageKey
     * @return array The merged object tree as of the given node
     * @throws \Neos\Neos\Domain\Exception
     */
    public function getFusionConfigurationForPackageKey(string $packageKey): FusionConfiguration
    {
        $package = $this->packageManager->getPackage($packageKey);
        $siteRootFusionPathAndFilename = sprintf('resource://%s/Private/Fusion/Root.fusion', $packageKey);

        // always include monocle prototypes
        $fusionCodeCollection = FusionSourceCodeCollection::tryFromFilePath('resource://Sitegeist.Monocle/Private/Fusion/Root.fusion');

        // use autoinclude for neos-site packages only as this is a neos specific behavior
        if ($package->getComposerManifest('type') == 'neos-site') {
            $fusionCodeCollection = $fusionCodeCollection->union(
                $this->fusionSourceCodeFactory->createFromAutoIncludes()
            );
        }

        // and the root fusion of package
        $fusionCodeCollection = $fusionCodeCollection->union(
            FusionSourceCodeCollection::tryFromFilePath($siteRootFusionPathAndFilename)
        );

        return $this->fusionParser->parseFromSource($fusionCodeCollection);
    }

    /**
     * Get all styleguide objects for the given fusion-ast
     *
     * @param array $fusionAst
     * @return array
     */
    public function getStyleguideObjectsFromFusionAst($fusionAst)
    {
        $styleguideObjects = [];
        if ($fusionAst && $fusionAst['__prototypes']) {
            foreach ($fusionAst['__prototypes'] as $prototypeFullName => $prototypeObject) {
                if (array_key_exists('__meta', $prototypeObject) && is_array($prototypeObject['__meta']) && array_key_exists('styleguide', $prototypeObject['__meta'])) {
                    list($prototypeVendor, $prototypeName) = explode(':', $prototypeFullName, 2);
                    $styleguideConfiguration = $prototypeObject['__meta']['styleguide'];
                    $useCases = null;
                    if (array_key_exists('useCases', $styleguideConfiguration)) {
                        $useCases = [];
                        foreach ($styleguideConfiguration['useCases'] as $key => $config) {
                            $useCases[] = [
                                "title" => (is_array($config) && isset($config['title'])) ? (string)$config['title'] : (string)$key,
                                "name" => (string)$key
                            ];
                        }
                    }
                    $styleguideObjects[$prototypeFullName] = [
                        'title' => (isset($styleguideConfiguration['title'])) ? $styleguideConfiguration['title'] : implode(' ', array_reverse(explode('.', $prototypeName))),
                        'path' => (isset($styleguideConfiguration['path'])) ? $styleguideConfiguration['path'] : $prototypeName,
                        'description' => (isset($styleguideConfiguration['description'])) ? $styleguideConfiguration['description'] :  '',
                        'options' => (isset($styleguideConfiguration['options'])) ? $styleguideConfiguration['options'] : null,
                        'propSets' => (isset($styleguideConfiguration['propSets'])) ? array_keys($styleguideConfiguration['propSets']) : null,
                        'useCases' => $useCases
                    ];
                }
            }
        }
        return $styleguideObjects;
    }

    /**
     * Get anatomical prototype tree from fusion AST excerpt
     *
     * @param array $fusionAstExcerpt
     * @return array
     */
    public function getAnatomicalPrototypeTreeFromAstExcerpt($fusionAstExcerpt)
    {
        $result = [];

        if (!is_array($fusionAstExcerpt)) {
            return $result;
        }

        foreach ($fusionAstExcerpt as $key => $value) {
            if (substr($key, 0, 2) === '__') {
                continue;
            }

            $anatomy = $this->getAnatomicalPrototypeTreeFromAstExcerpt($value);

            if (array_key_exists('prototypeName', $anatomy)) {
                if ($anatomy['prototypeName'] !== null) {
                    $result[] = $anatomy;
                }
            } else {
                $result = array_merge($result, $anatomy);
            }
        }

        if (!array_key_exists('__objectType', $fusionAstExcerpt)) {
            return $result;
        } else {
            return [
                'prototypeName' => $fusionAstExcerpt['__objectType'],
                'children' => $result
            ];
        }
    }
}
