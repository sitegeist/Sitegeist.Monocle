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
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectPath;
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
        $fusionAst = $this->fusionService->getFusionConfigurationForPackageKey($this->sitePackageKey);
        $styleguideObjects = $this->fusionService->getStyleguideObjectsFromFusionAst($fusionAst);
        $prototypeStructures = $this->configurationService->getSiteConfiguration($this->sitePackageKey, 'ui.structure');

        $hiddenPrototypeNamePatterns = $this->configurationService->getSiteConfiguration($this->sitePackageKey, 'hiddenPrototypeNamePatterns');
        if (is_array($hiddenPrototypeNamePatterns)) {
            $alwaysShowPrototypes = $this->configurationService->getSiteConfiguration($this->sitePackageKey, 'alwaysShowPrototypes');
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
                StyleguideObjectPath::fromString($prototypeName),
                $this->getStructureForPrototypeName($prototypeStructures, $prototypeName),
                $styleguideObject['description']
            );
        }
        return new StyleguideObjectCollection(... $result);
    }

    public function getStyleguideObjectDetails(StyleguideObjectIdentifier $identifier): StyleguideObjectDetails
    {
        $prototypeName = $identifier->value;

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

    public function renderStyleguideObject(StyleguideObjectIdentifier $identifier, array $props, ?PropSetName $propSet, ?UseCaseName $useCase, array $locales): string
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
            'prototypeName' => $identifier->value,
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
