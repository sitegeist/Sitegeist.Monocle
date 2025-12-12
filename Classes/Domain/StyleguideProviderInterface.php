<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Domain;

use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectName;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectDetails;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseName;

interface StyleguideProviderInterface
{
    public function getIdentifier(): StyleguideProviderIdentifier;

    public function getName(): StyleguideProviderName;

    public function getStyleguideObjectList(): StyleguideObjectCollection;

    public function getStyleguideObjectDetails(StyleguideObjectName $styleguideObject): StyleguideObjectDetails;

    public function renderStyleguideObject(StyleguideObjectName $styleguideObject, array $props = [], ?PropSetName $propSet = null, ?UseCaseName $useCase = null): string;
}
