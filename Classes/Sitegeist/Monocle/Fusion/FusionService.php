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
use \Neos\Neos\Domain\Service\FusionService as NeosFusionService;

/**
 * Class FusionService
 * @package Sitegeist\Monocle\Fusion
 */
class FusionService extends NeosFusionService
{
    const RENDERPATH_DISCRIMINATOR = 'monoclePrototypeRenderer_';

    /**
     * @Flow\InjectConfiguration(path="fusion.autoInclude", package="Neos.Neos")
     * @var array
     */
    protected $autoIncludeConfiguration = array();

    /**
     * Returns a merged TypoScript object tree in the context of the given site-package
     *
     * @param string $siteResourcesPackageKey
     * @return array The merged object tree as of the given node
     * @throws \Neos\Neos\Domain\Exception
     */
    public function getMergedTypoScriptObjectTreeForSitePackage($siteResourcesPackageKey)
    {
        $siteRootFusionPathAndFilename = sprintf($this->siteRootFusionPattern, $siteResourcesPackageKey);

        $mergedFusionCode = '';
        $mergedFusionCode .= $this->generateNodeTypeDefinitions();
        $mergedFusionCode .= $this->getFusionIncludes($this->prepareAutoIncludeFusion());
        $mergedFusionCode .= $this->getFusionIncludes($this->prependFusionIncludes);
        $mergedFusionCode .= $this->readExternalFusionFile($siteRootFusionPathAndFilename);
        $mergedFusionCode .= $this->getFusionIncludes($this->appendFusionIncludes);

        $fusionAst = $this->fusionParser->parse($mergedFusionCode, $siteRootFusionPathAndFilename);
        $finalFusionAst = $this->addStyleguidePrototypesToFusionAst($fusionAst);

        return $finalFusionAst;
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
                    $styleguideObjects[$prototypeFullName] = [
                        'title' => (isset($styleguideConfiguration['title'])) ? $styleguideConfiguration['title'] : implode(' ', array_reverse(explode('.', $prototypeName))),
                        'path' => (isset($styleguideConfiguration['path'])) ? $styleguideConfiguration['path'] : $prototypeName,
                        'description' => (isset($styleguideConfiguration['description'])) ? $styleguideConfiguration['description'] :  '',
                        'options' => (isset($styleguideConfiguration['options'])) ? $styleguideConfiguration['options'] : null,
                    ];
                }
            }
        }
        return $styleguideObjects;
    }

    /**
     * Add styleguide rendering configuration to the fusion-ast
     *
     * @param array $fusionAst
     * @return array
     */
    protected function addStyleguidePrototypesToFusionAst($fusionAst)
    {
        $styleguidePrototypeConfigurations = [];
        $styleguideRenderingPrototypes = [];
        $styleguidePenderingProps = [];

        foreach ($fusionAst['__prototypes'] as $prototypeName => $prototypeConfiguration) {
            if (array_key_exists('__meta', $prototypeConfiguration)
                && array_key_exists('styleguide', $prototypeConfiguration['__meta'])
            ) {
                $styleguidePrototypeConfigurations[$prototypeName] = $prototypeConfiguration;
            }
        }

         // create rendering prototypes with dummy data
        foreach ($styleguidePrototypeConfigurations as $prototypeName => $prototypeConfiguration) {
            $renderPrototypeTypoScript = [
                '__objectType' => $prototypeName,
                '__value' => null,
                '__eelExpression' => null
            ];
            if (array_key_exists('props', $prototypeConfiguration['__meta']['styleguide']) && is_array($prototypeConfiguration['__meta']['styleguide']['props'])) {
                $styleguidePenderingProps[$prototypeName] = $prototypeConfiguration['__meta']['styleguide']['props'];
            }
            $styleguideRenderingPrototypes[$prototypeName] = $renderPrototypeTypoScript;
        }

        // apply props to the prototypes inside
        foreach ($styleguidePrototypeConfigurations as $prototypeName => $prototypeConfiguration) {
            foreach ($styleguidePenderingProps as $propPrototypeName => $props) {
                if ($propPrototypeName == $prototypeName) {
                    $styleguideRenderingPrototypes[$prototypeName] = array_merge_recursive($styleguideRenderingPrototypes[$prototypeName], $props);
                } else {
                    $styleguideRenderingPrototypes[$prototypeName]['__prototypes'][$propPrototypeName] = $props;
                }
            }
        }

        // create render pathes
        foreach ($styleguideRenderingPrototypes as $prototypeName => $prototypeConfiguration) {
            $key = self::RENDERPATH_DISCRIMINATOR . str_replace(['.', ':'], ['_', '__'], $prototypeName);
            $fusionAst[$key] = $prototypeConfiguration;
        }

        return $fusionAst;
    }
}
