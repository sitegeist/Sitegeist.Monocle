<?php
namespace Sitegeist\Monocle\TypoScript;

/*
 * This file is part of the TYPO3.TypoScript package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\ActionRequest;
use TYPO3\TypoScript\TypoScriptObjects\Helpers;
use TYPO3\TypoScript\TypoScriptObjects\TemplateImplementation;

/**
 * TypoScript object rendering a fluid template
 *
 * //tsPath variables TODO The result of this TS object is made available inside the template as "variables"
 * @api
 */
class InlineTemplateImplementation extends TemplateImplementation
{

    /**
     * @return string
     * @internal
     */
    public function getTemplate(){
        return $this->tsValue('template');
    }

    /**
     * {@inheritdoc}
     *
     * @return string
     */
    public function evaluate()
    {
        $actionRequest =  $this->tsRuntime->getControllerContext()->getRequest();
        if (!$actionRequest instanceof ActionRequest) {
            $actionRequest = null;
        }

        $template = $this->getTemplate();

        $fluidTemplate = new Helpers\FluidView($this, $actionRequest);
        $fluidTemplate->setTemplateSource($template);

        foreach ($this->properties as $key => $value) {
            if (in_array($key, $this->ignoreProperties)) {
                continue;
            }
            if (!is_array($value)) {
                // if a value is a SIMPLE TYPE, e.g. neither an Eel expression nor a TypoScript object,
                    // we can just evaluate it (to handle processors) and then assign it to the template.
                $evaluatedValue = $this->tsValue($key);
                $fluidTemplate->assign($key, $evaluatedValue);
            } else {
                // It is an array; so we need to create a "proxy" for lazy evaluation, as it could be a
                    // nested TypoScript object, Eel expression or simple value.
                $fluidTemplate->assign($key, new Helpers\TypoScriptPathProxy($this, $this->path . '/' . $key, $value));
            }
        }

        $this->initializeView($fluidTemplate);

        $sectionName = $this->getSectionName();

        if ($sectionName !== null) {
            return $fluidTemplate->renderSection($sectionName);
        } else {
            return $fluidTemplate->render();
        }
    }

    /**
     * This is a template method which can be overridden in subclasses to add new variables which should
     * be available inside the Fluid template. It is needed e.g. for Expose.
     *
     * @param Helpers\FluidView $view
     * @return void
     */
    protected function initializeView(Helpers\FluidView $view)
    {
        // template method
    }
}
