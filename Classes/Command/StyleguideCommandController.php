<?php
namespace Sitegeist\Monocle\Command;

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

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamInterface;
use Sitegeist\Monocle\Domain\PrototypeDetails\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\PrototypeDetails\UseCases\UseCaseName;
use Sitegeist\Monocle\Domain\StyleguideAddress;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;
use Sitegeist\Monocle\Domain\StyleguideRepository;
use Sitegeist\Monocle\Fusion\FusionService;
use Sitegeist\Monocle\Fusion\FusionView;
use Neos\Flow\Annotations as Flow;
use Neos\Flow\Cli\CommandController;
use Symfony\Component\Yaml\Yaml;
use Sitegeist\Monocle\Service\DummyControllerContextTrait;
use Sitegeist\Monocle\Service\PackageKeyTrait;
use Sitegeist\Monocle\Service\ConfigurationService;

/**
 * Class StyleguideCommandController
 * @package Sitegeist\Monocle\Command
 */
class StyleguideCommandController extends CommandController
{
    #[Flow\Inject]
    protected StyleguideRepository $styleguideRepository;

    #[Flow\Inject]
    protected ConfigurationService $configurationService;

    /**
     * Get a list of all available styleguides
     *
     * @param string $format Result encoding ``yaml`` and ``json`` are supported
     */
    public function listCommand($format = 'json'): void
    {
        $styleguides = $this->styleguideRepository->getAllStyleGuides();

        $data = [];
        foreach ($styleguides as $styleguide) {
            $data[$styleguide->address->toString()] = $styleguide->name->value;
        }
        $this->outputData($data, $format);
    }

    /**
     * Get a list of all configured default styleguide viewports
     *
     * @param string $format Result encoding ``yaml`` and ``json`` are supported
     * @param string $styleguide site-package (defaults to first found)
     */
    public function viewportsCommand(string $format = 'json', ?string $styleguide = null): void
    {
        $styleguide =  $styleguide ? $this->styleguideRepository->getStyleGuide(StyleguideAddress::fromString($styleguide)) : $this->styleguideRepository->getDefault();
        $viewportPresets = $this->configurationService->getSiteConfiguration($styleguide->address->toString(), 'ui.viewportPresets');
        $this->outputData($viewportPresets, $format);
    }

    /**
     * Get all styleguide items currently available
     *
     * @param string $format Result encoding ``yaml`` and ``json`` are supported
     * @param string $styleguide site-package (defaults to first found)
     */
    public function itemsCommand(string $format = 'json', ?string $styleguide = null): void
    {
        $styleguide =  $styleguide ? $this->styleguideRepository->getStyleGuide(StyleguideAddress::fromString($styleguide)) : $this->styleguideRepository->getDefault();
        $styleguideObjects =  $styleguide->getStyleguideObjectList();
        $styleguideObjects = json_decode(json_encode($styleguideObjects, JSON_THROW_ON_ERROR), true, 512,JSON_THROW_ON_ERROR);
        $this->outputData($styleguideObjects, $format);
    }

    /**
     * Render a given fusion component to HTML
     *
     * @param string $styleguide The prototype name of the component
     * @param string $item site-package (defaults to first found)
     * @param string|null $useCase The useCase for the preview
     * @param string|null $propSet The propSet used for the preview
     * @param string|null $props Custom props for the preview
     * @param string|null $locales Custom locales for the preview
     * @return void
     */
    public function renderCommand(string $styleguide, string $item, ?string $useCase = '__default', ?string $propSet = '__default', ?string $props = '', ?string $locales = '')
    {
        $styleguide = $this->styleguideRepository->getStyleGuide(StyleguideAddress::fromString($styleguide));
        $styleguide->renderStyleguideObject(
            StyleguideObjectIdentifier::fromString($item),
            json_decode($props, true) ?? [],
            $propSet ? PropSetName::fromString($propSet): null,
            $useCase ? UseCaseName::fromString($useCase) : null,
            json_decode($locales, true) ?? []
        );
    }

    protected function outputData($data, $format)
    {
        switch ($format) {
            case 'json':
                $json = json_encode($data);
                $this->outputLine($json . chr(10));
                break;
            case 'yaml':
                $yaml = Yaml::dump($data, 99);
                $this->outputLine($yaml . chr(10));
                break;
            default:
                throw new \Exception(sprintf('Unsupported format %s', $format));
                break;
        }
    }
}
