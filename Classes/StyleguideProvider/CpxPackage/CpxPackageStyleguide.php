<?php

declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

use Neos\Flow\Annotations as Flow;
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

class CpxPackageStyleguide implements StyleguideInterface
{
    #[Flow\Inject]
    protected ConfigurationService $configurationService;

    private string $packageKey;

    public function __construct(
        protected StyleguideIdentifier $identifier,
    ) {
        $this->packageKey = $identifier->value;
    }

    public function getStyleguideIdentifier(): StyleguideIdentifier
    {
        return $this->identifier;
    }

    public function getStyleguideObjectList(): StyleguideObjectCollection
    {
        return $this->getStyleguideObjects($this->packageKey);
    }

    public function getStyleguideObjectDetails(StyleguideObjectIdentifier $styleguideObject): StyleguideObjectDetails
    {
        return new StyleguideObjectDetails(
            $styleguideObject,
            StyleguideObjectName::fromString(),
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
        $result = [];
//        foreach ($styleguideObjects as $prototypeName => $styleguideObject) {
//            $result[] = new StyleguideObject(
//                StyleguideObjectIdentifier::fromString($prototypeName),
//                StyleguideObjectName::fromString($styleguideObject['title']),
//                $this->getStructureForPrototypeName($prototypeStructures, $prototypeName),
//                $styleguideObject['description']
//            );
//        }
        return new StyleguideObjectCollection(... $result);
    }

    public function renderStyleguideObject(StyleguideObjectIdentifier $styleguideObject, array $props, ?PropSetName $propSet, ?UseCaseName $useCase, array $locales): string
    {
        return "not implemented yet";
    }
}
