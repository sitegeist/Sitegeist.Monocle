<?php
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
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseName;
use Sitegeist\Monocle\Domain\StyleguideRepository;
use Sitegeist\Monocle\Fusion\FusionView;

/**
 * Class PreviewController
 * @package Sitegeist\Monocle\Controller
 */
class PreviewController extends ActionController
{
    /**
     * @var string
     */
    protected $defaultViewObjectName = FusionView::class;

    /**
     * @var FusionView
     */
    protected $view;

    #[Flow\InjectConfiguration(package: "Neos.Flow", path: "i18n.defaultLocale")]
    protected string $defaultLocale;

    /**
     * @var string[]
     */
    #[Flow\InjectConfiguration(package: "Neos.Flow", path: "i18n.fallbackRule.order")]
    protected array $localeFallback;

    #[Flow\Inject]
    protected StyleguideRepository $styleguideRepository;

    /**
     * @param  string $prototypeName
     * @param  string $sitePackageKey
     * @param  string|null $useCase
     * @param  string|null  $propSet
     * @param  string|null  $props props as json encoded string
     * @param  string|null  $locales locales-fallback-chain as comma sepertated string
     * @return string
     */
    public function indexAction(string $prototypeName, string $sitePackageKey, ?string $useCase = '__default', ?string $propSet = '__default', ?string $props = '', ?string $locales = ''): string
    {
        $renderProps = [];
        if ($props) {
            $data = json_decode($props, true);
            if (is_array($data)) {
                $renderProps = $data;
            }
        }

        if ($useCase === '__default') {
            $useCase = null;
        }

        if ($propSet === '__default') {
            $propSet = null;
        }

        if ($locales) {
            $renderLocales = explode(',', $locales);
        } else {
            $renderLocales = $this->localeFallback ?: [$this->defaultLocale];
        }

        $styleguide = $this->styleguideRepository->getStyleGuide(StyleguideAddress::fromString($sitePackageKey));
        $result = $styleguide->renderStyleguideObject(
            StyleguideObjectIdentifier::fromString($prototypeName),
            $renderProps,
            $propSet ?  PropSetName::fromString($propSet): null,
            $useCase ? UseCaseName::fromString($useCase) : null,
            $renderLocales
        );

        return $result;
    }
}
