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
use Neos\Fusion\View\FusionView as BaseFusionView;
use Neos\Fusion\Core\Runtime as FusionRuntime;
use Neos\Flow\I18n\Locale;
use Neos\Flow\I18n\Service;

/**
 * A specialized fusion view that
 */
class FusionView extends BaseFusionView
{
    const RENDERPATH_DISCRIMINATOR = 'monoclePrototypeRenderer_';

    /**
     * @Flow\Inject
     * @var \Sitegeist\Monocle\Fusion\FusionService
     */
    protected $fusionService;

    /**
     * @Flow\Inject
     * @var Service
     */
    protected $i18nService;

    /**
     * Load Fusion from the directories specified by $this->getOption('fusionPathPatterns')
     *
     * @return void
     */
    protected function loadFusion()
    {
        $fusionAst = $this->fusionService->getMergedFusionObjectTreeForSitePackage($this->getOption('packageKey'));
        $this->parsedFusion = $fusionAst;
    }

    /**
     * @var array
     */
    protected $overriddenPropsPerPrototype = [];

    /**
     * Special method to render a specific prototype
     *
     * @param string $prototypeName
     * @param string $propSet
     * @param array $props
     * @param array $locales
     * @return string
     */
    public function renderStyleguidePrototype($prototypeName, $propSet = '__default', $props = [], $locales = [])
    {
        $prototypePreviewRenderPath = FusionService::RENDERPATH_DISCRIMINATOR . str_replace(['.', ':'], ['_', '__'], $prototypeName);

        if ($locales) {
            $currentLocale = new Locale($locales[0]);
            $this->i18nService->getConfiguration()->setCurrentLocale($currentLocale);
            $this->i18nService->getConfiguration()->setFallbackRule(array('strict' => false, 'order' => array_reverse($locales)));
        }

        $fusionAst = $this->fusionService->getMergedFusionObjectTreeForSitePackage($this->getOption('packageKey'));
        $fusionAst = $this->postProcessFusionAstForPrototype($fusionAst, $prototypePreviewRenderPath, $prototypeName, $propSet, $props);

        $fusionRuntime = new FusionRuntime($fusionAst, $this->controllerContext);
        $fusionRuntime->pushContextArray($this->variables);

        try {
            $output = $fusionRuntime->render($prototypePreviewRenderPath);
        } catch (RuntimeException $exception) {
            throw $exception->getPrevious();
        }

        $fusionRuntime->popContext();

        return $output;
    }

    /**
     * Override props via parameters, props and propSet configuration
     *
     * @param array $fusionAst
     * @param string $prototypeName
     * @param string $propSet
     * @param array $props
     * @return array
     */
    protected function postProcessFusionAstForPrototype(array $fusionAst, $prototypePreviewRenderPath, $prototypeName, $propSet, $props = [])
    {
        $this->assertWellFormedStyleguideObject($fusionAst, $prototypeName);
        $styleguideConfiguration = $fusionAst['__prototypes'][$prototypeName]['__meta']['styleguide'];

        // create render configuration ith a wrapper component
        $prototypeConfiguration = [
            '__objectType' => 'Neos.Fusion:Component',
            '__value' => null,
            '__eelExpression' => null,
            'renderer' => [
                '__objectType' => $prototypeName,
                '__value' => null,
                '__eelExpression' => null
            ]
        ];

        // merge styleguide-props to render configuration
        if (array_key_exists('props', $styleguideConfiguration)) {
            $prototypeConfiguration = array_replace_recursive(
                $prototypeConfiguration,
                $styleguideConfiguration['props']
            );
        }

        // merge styleguide-propSet to render configuration if defined
        if (
            $propSet !== '__default' &&
            array_key_exists('propSets', $styleguideConfiguration) &&
            array_key_exists($propSet, $styleguideConfiguration['propSets'])
        ) {
            $prototypeConfiguration = array_replace_recursive(
                $prototypeConfiguration,
                $styleguideConfiguration['propSets'][$propSet]
            );
        }

        // merge props to render configuration if defined
        if (count($props)) {
            $prototypeConfiguration = array_replace_recursive($prototypeConfiguration, $props);
        }

        // add prop assignments to the renderer
        foreach (array_keys($prototypeConfiguration) as $key) {
            if (!in_array($key, ['__objectType', '__value', '__eelExpression', 'renderer'])) {
                $prototypeConfiguration['renderer'][$key] = [
                    '__objectType' => null,
                    '__value' => null,
                    '__eelExpression' => 'props.' . $key
                ];
            }
        }

        // save to fusionAst
        $fusionAst[$prototypePreviewRenderPath] = $prototypeConfiguration;

        return $fusionAst;
    }

    /**
     * Make sure, that this prototype is actually configured for being rendered in the styleguide
     *
     * @param array $fusionAst
     * @param string $prototypeName
     * @return void
     */
    protected function assertWellFormedStyleguideObject(array $fusionAst, $prototypeName)
    {
        if (!array_key_exists($prototypeName, $fusionAst['__prototypes'])) {
            throw new \Exception(sprintf('Prototype "%s" does not exist.', $prototypeName), 1500825696);
        }

        if (
            !array_key_exists('__meta', $fusionAst['__prototypes'][$prototypeName]) ||
            !array_key_exists('styleguide', $fusionAst['__prototypes'][$prototypeName]['__meta'])
        ) {
            throw new \Exception(
                sprintf(
                    'Prototype "%s" has no styleguide configuration. ' .
                    'Remember to add one one under "@styleguide" in your fusion code.',
                    $prototypeName
                ),
                1500825686
            );
        }
    }
}
