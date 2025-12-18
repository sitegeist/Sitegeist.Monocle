<?php

declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\NeosFusionSite;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\I18n\LocaleCollection;
use Neos\Fusion\View\FusionView;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamInterface;
use Sitegeist\Monocle\Domain\StyleguideIdentifier;
use Sitegeist\Monocle\Domain\StyleguideInterface;
use Sitegeist\Monocle\Domain\StyleguideObjects\Props\PropsCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObject;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectDetails;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectName;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideStructure;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseName;
use \Sitegeist\Monocle\Fusion\FusionService;
use Sitegeist\Monocle\Service\ConfigurationService;
use Sitegeist\Monocle\Service\DummyControllerContextTrait;

class NeosFusionSiteStyleguide implements StyleguideInterface
{
    use DummyControllerContextTrait;

    #[Flow\Inject]
    protected FusionService $fusionService;

    #[Flow\Inject]
    protected ConfigurationService $configurationService;

    private string $sitePackageKey;

    public function __construct(
        protected StyleguideIdentifier $identifier,
    ) {
        $this->sitePackageKey = $identifier->value;
    }

    public function getStyleguideIdentifier(): StyleguideIdentifier
    {
        return $this->identifier;
    }

    public function getStyleguideObjectList(): StyleguideObjectCollection
    {
        return $this->getStyleguideObjects($this->sitePackageKey);
    }

    public function getStyleguideObjectDetails(StyleguideObjectIdentifier $styleguideObject): StyleguideObjectDetails
    {
        $prototypeName = $styleguideObject->value;

        $fusionAst = $this->fusionService->getFusionConfigurationForPackageKey($this->sitePackageKey);
        $styleguideObjectsFromFusion = $this->fusionService->getStyleguideObjectsFromFusionAst($fusionAst);

        $styleguideObjectFromFusion = $styleguideObjectsFromFusion[$prototypeName] ?? null;
        if (is_null($styleguideObjectFromFusion)) {
            throw new \Exception($prototypeName . " not found");
        }

        return new StyleguideObjectDetails(
            StyleguideObjectIdentifier::fromString($prototypeName),
            StyleguideObjectName::fromString($styleguideObjectFromFusion['title']),
            new PropsCollection(),
            new PropSetCollection(),
            new UseCaseCollection()
        );
    }

    /**
     * @param $sitePackageKey
     * @param $styleguideObject
     * @return array
     * @throws \Neos\Neos\Domain\Exception
     */
    protected function getStyleguideObjects($sitePackageKey): StyleguideObjectCollection
    {
        $fusionAst = $this->fusionService->getFusionConfigurationForPackageKey($sitePackageKey);
        $styleguideObjects = $this->fusionService->getStyleguideObjectsFromFusionAst($fusionAst);
        $prototypeStructures = $this->configurationService->getSiteConfiguration($sitePackageKey, 'ui.structure');

        $hiddenPrototypeNamePatterns = $this->configurationService->getSiteConfiguration($sitePackageKey, 'hiddenPrototypeNamePatterns');
        if (is_array($hiddenPrototypeNamePatterns)) {
            $alwaysShowPrototypes = $this->configurationService->getSiteConfiguration($sitePackageKey, 'alwaysShowPrototypes');
            foreach ($hiddenPrototypeNamePatterns as $pattern) {
                $styleguideObjects = array_filter(
                    $styleguideObjects,
                    function ($prototypeName) use ($pattern, $alwaysShowPrototypes) {
                        if (in_array($prototypeName, $alwaysShowPrototypes, true)) {
                            return true;
                        }
                        return fnmatch($pattern, $prototypeName) === false;
                    },
                    ARRAY_FILTER_USE_KEY
                );
            }
        }

        $result = [];
        foreach ($styleguideObjects as $prototypeName => $styleguideObject) {
            $result[] = new StyleguideObject(
                StyleguideObjectIdentifier::fromString($prototypeName),
                StyleguideObjectName::fromString($styleguideObject['title']),
                $this->getStructureForPrototypeName($prototypeStructures, $prototypeName),
                $styleguideObject['description']
            );
        }
        return new StyleguideObjectCollection(... $result);
    }

    public function renderStyleguideObject(StyleguideObjectIdentifier $styleguideObject, array $props, ?PropSetName $propSet, ?UseCaseName $useCase, array $locales): string
    {
        $sitePackageKey = $this->identifier->value;

        $fusionRootPath = $this->configurationService->getSiteConfiguration($sitePackageKey, ['preview', 'fusionRootPath']);

        $view = new \Sitegeist\Monocle\Fusion\FusionView();
        $view->setControllerContext($this->createDummyControllerContext());

        $view->setPackageKey($sitePackageKey);
        $view->setFusionPath($fusionRootPath);
        $view->setLocales($locales);

        $view->assignMultiple([
            'sitePackageKey' => $sitePackageKey,
            'prototypeName' => $styleguideObject->value,
            'useCase' => $useCase,
            'propSet' => $propSet,
            'props' => $props,
            'locales' => $locales
        ]);

        // get the status and headers from the view
        $result = $view->render();
        if ($result instanceof ResponseInterface) {
            return (string)$result->getBody();
        }
        if ($result instanceof StreamInterface) {
            return (string)$result;
        }
    }

    /**
     * Find the matching structure for a prototype
     *
     * @param $prototypeStructures
     * @param $prototypeName
     * @return array
     */
    protected function getStructureForPrototypeName($prototypeStructures, $prototypeName): StyleguideStructure
    {
        foreach ($prototypeStructures as $structure) {
            if (preg_match(sprintf('!%s!', $structure['match']), $prototypeName)) {
                return new StyleguideStructure(
                    $structure['label'],
                    $structure['icon'],
                    $structure['color'],
                );
            }
        }

        return new StyleguideStructure(
            'Other',
            'icon-question',
            'white'
        );
    }
}
