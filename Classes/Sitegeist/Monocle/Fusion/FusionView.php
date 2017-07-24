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
     * @var array
     */
    protected $overriddenPropsPerPrototype = [];

    /**
     * Special method to render a specific prototype
     *
     * @param string $prototypeName
     * @param string $propSet
     * @param array $props
     * @return string
     */
    public function renderStyleguidePrototype($prototypeName, $propSet = '__default', array $props = [])
    {
        $fusionAst = $this->fusionService->getMergedTypoScriptObjectTreeForSitePackage($this->getOption('packageKey'));
        $fusionAst = $this->postProcessFusionAstForPrototype($fusionAst, $prototypeName, $propSet, $props);

        $fusionPath = sprintf('/<%s>', $prototypeName);
        $fusionRuntime = new FusionRuntime($fusionAst, $this->controllerContext);

        $fusionRuntime->pushContextArray($this->variables);

        try {
            $output = $fusionRuntime->render($fusionPath);
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
    protected function postProcessFusionAstForPrototype(array $fusionAst, $prototypeName, $propSet, array $props)
    {
        $this->assertWellFormedStyleguideObject($fusionAst, $prototypeName);

        $prototypeConfiguration = $fusionAst['__prototypes'][$prototypeName];
        $styleguideConfiguration = $fusionAst['__prototypes'][$prototypeName]['__meta']['styleguide'];

        if (array_key_exists('props', $styleguideConfiguration)) {
            $prototypeConfiguration = array_replace_recursive(
                $prototypeConfiguration,
                $styleguideConfiguration['props']
            );
        }

        if (
            $propSet !== '__default' &&
            array_key_exists('propSets', $styleguideConfiguration) &&
            array_key_exists($propSet, $styleguideConfiguration['propSets'])
        ) {
            $prototypeConfiguration = array_replace_recursive(
                $prototypeConfiguration,
                $styleguideConfiguration['propSets'][$propSet]['props']
            );
        }

        if (count($props)) {
            $prototypeConfiguration = array_replace_recursive($prototypeConfiguration, $props);
        }

        $fusionAst['__prototypes'][$prototypeName] = $prototypeConfiguration;

        foreach ($fusionAst['__prototypes'] as $otherPrototypeName => &$prototypeConfiguration) {
            if ($otherPrototypeName === $prototypeName) continue;

            if (
                array_key_exists('__meta', $prototypeConfiguration) &&
                array_key_exists('styleguide', $prototypeConfiguration['__meta']) &&
                array_key_exists('props', $prototypeConfiguration['__meta']['styleguide'])
            ) {
                $prototypeConfiguration = array_replace_recursive(
                    $prototypeConfiguration,
                    $prototypeConfiguration['__meta']['styleguide']['props']
                );
            }
        }

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
