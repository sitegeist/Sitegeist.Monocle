<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Domain;


/**
 * This file is part of the Sitegeist.Monocle package
 *
 * (c) 2020
 * Martin Ficzel <ficzel@sitegeist.de>
 * Wilhelm Behncke <behncke@sitegeist.de>
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */


use Neos\Flow\I18n\LocaleCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectCollection;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectIdentifier;
use Sitegeist\Monocle\Domain\StyleguideObjects\PropSets\PropSetName;
use Sitegeist\Monocle\Domain\StyleguideObjects\StyleguideObjectDetails;
use Sitegeist\Monocle\Domain\StyleguideObjects\UseCases\UseCaseName;

interface StyleguideInterface
{
    public function getStyleguideIdentifier(): StyleguideIdentifier;

    public function getStyleguideObjectList(): StyleguideObjectCollection;

    public function getStyleguideObjectDetails(StyleguideObjectIdentifier $identifier): StyleguideObjectDetails;

    public function renderStyleguideObject(StyleguideObjectIdentifier $identifier, array $props, ?PropSetName $propSet, ?UseCaseName $useCase, array $locales): string;
}
