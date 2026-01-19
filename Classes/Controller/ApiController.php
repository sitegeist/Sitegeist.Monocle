<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Controller;

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
use Neos\Flow\Mvc\Controller\ActionController;
use Sitegeist\Monocle\Domain\StyleguideAddress;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;
use Sitegeist\Monocle\Domain\StyleguideRepository;
use Sitegeist\Monocle\Service\ConfigurationService;

/**
 * Class ApiController
 * @package Sitegeist\Monocle\Controller
 */
class ApiController extends ActionController
{
    protected $defaultViewObjectName = 'Neos\Flow\Mvc\View\JsonView';

    #[Flow\Inject]
    protected ConfigurationService $configurationService;

    #[Flow\Inject]
    protected StyleguideRepository $styleguideRepository;

    /**
     * Get all configurations for this site package
     */
    public function configurationAction(?string $sitePackageKey = null): void
    {
        if ($sitePackageKey) {
            $styleguideAddress = StyleguideAddress::fromString($sitePackageKey);
        } else {
            $styleguideAddress = $this->styleguideRepository->getDefault()->address;
        }

        $allStyleguides = $this->styleguideRepository->getAllStyleGuides();
        $styleguide = $this->styleguideRepository->getStyleGuide($styleguideAddress);

        $value = [];
        $value['styleguide'] = $styleguideAddress->toString();
        $value['sitePackage'] = $styleguideAddress->toString();
        $value['ui'] = [
            'sitePackages' => $allStyleguides,
            'styleguides' => $allStyleguides,
            'viewportPresets' => $this->configurationService->getStyleguideConfiguration($styleguideAddress, 'ui.viewportPresets'),
            'localePresets' => $this->configurationService->getStyleguideConfiguration($styleguideAddress, 'ui.localePresets'),
            'hotkeys' => $this->configurationService->getStyleguideConfiguration($styleguideAddress, 'ui.hotkeys'),
            'preview' => $this->configurationService->getStyleguideConfiguration($styleguideAddress, 'preview'),
            'grids' => $this->configurationService->getStyleguideConfiguration($styleguideAddress, 'ui.grids')
        ];
        $value['styleguideObjects'] = $styleguide->getStyleguideObjectList();

        $this->view->setVariablesToRender(['value']);
        $this->view->assign('value', $value);
    }

    /**
     * Render informations about the given prototype
     */
    public function prototypeDetailsAction(string $sitePackageKey, string $prototypeName): void
    {
        $styleguideAddress = StyleguideAddress::fromString($sitePackageKey);
        $styleguide = $this->styleguideRepository->getStyleGuide($styleguideAddress);
        $styleguideObjectDetails = $styleguide->getStyleguideObjectDetails(StyleguideObjectIdentifier::fromString($prototypeName));
        $this->view->assign('value', $styleguideObjectDetails);
    }
}
