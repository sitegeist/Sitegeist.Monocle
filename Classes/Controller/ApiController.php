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
use Sitegeist\Monocle\Service\PackageKeyTrait;
use Sitegeist\Monocle\Service\ConfigurationService;

/**
 * Class ApiController
 * @package Sitegeist\Monocle\Controller
 */
class ApiController extends ActionController
{
    use PackageKeyTrait;

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
        $sitePackageKey = $sitePackageKey ?: $this->getDefaultSitePackageKey();
        $allStyleguides = $this->styleguideRepository->getAllStyleGuides();
        $styleguide = $this->styleguideRepository->getStyleGuide(StyleguideAddress::fromString($sitePackageKey));

        $value = [];
        $value['sitePackage'] = $sitePackageKey;
        $value['ui'] = [
            'sitePackages' => $allStyleguides,
            'viewportPresets' => $this->configurationService->getSiteConfiguration($sitePackageKey, 'ui.viewportPresets'),
            'localePresets' => $this->configurationService->getSiteConfiguration($sitePackageKey, 'ui.localePresets'),
            'hotkeys' => $this->configurationService->getSiteConfiguration($sitePackageKey, 'ui.hotkeys'),
            'preview' => $this->configurationService->getSiteConfiguration($sitePackageKey, 'preview')
        ];
        $value['styleguideObjects'] = $styleguide->getStyleguideObjectList();

        $this->view->assign('value', $value);
    }

    /**
     * Render informations about the given prototype
     */
    public function prototypeDetailsAction(string $sitePackageKey, string $prototypeName): void
    {
        $styleguide = $this->styleguideRepository->getStyleGuide(StyleguideAddress::fromString($sitePackageKey));
        $styleguideObjectDetails = $styleguide->getStyleguideObjectDetails(StyleguideObjectIdentifier::fromString($prototypeName));

        $this->view->assign('value', $styleguideObjectDetails);
    }
}
