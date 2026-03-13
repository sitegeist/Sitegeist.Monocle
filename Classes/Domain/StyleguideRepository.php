<?php

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

declare(strict_types=1);

namespace Sitegeist\Monocle\Domain;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\ObjectManagement\ObjectManagerInterface;

#[Flow\Scope("singleton")]
class StyleguideRepository
{
    #[Flow\Inject]
    protected ObjectManagerInterface $objectManager;

    #[Flow\InjectConfiguration(package: 'Sitegeist.Monocle', path: 'styleguideProviders')]
    protected array $styleguideProviderConfiguration;

    #[Flow\InjectConfiguration(package: 'Sitegeist.Monocle', path: 'defaultStyleguide')]
    protected ?string $defaultStyleguide;

    /**
     * @var array<string, StyleguideProviderInterface>
     */
    protected ?array $styleguideProviders = null;

    public function getDefault(): StyleguideMetadata
    {
        $all = $this->getAllStyleGuides();
        if ($this->defaultStyleguide) {
            return $all->byAddress(StyleguideAddress::fromString($this->defaultStyleguide));
        }
        return $all->first();
    }

    public function getAllStyleGuides(): StyleguideMetadataCollection
    {
        $providers = $this->getProviders();
        $styleguides = [];
        foreach ($providers as $identifier => $provider) {
            $styleguides[] = $provider->getStyleguideMetadataCollection(StyleguideProviderIdentifier::fromString($identifier));
        }
        return StyleguideMetadataCollection::fromMultiple(...$styleguides);
    }

    public function getStyleGuide(StyleguideAddress $address): StyleguideInterface
    {
        $providers = $this->getProviders();
        $provider = $providers[$address->provider->value] ?? null;
        if ($provider instanceof StyleguideProviderInterface) {
            return $provider->getStyleguide($address);
        }

        throw new \Exception(sprintf('Styleguide %s in Provider %s was not found', $address->styleguide->value, $address->provider->value));
    }

    /**
     * @return StyleguideProviderInterface[]
     */
    protected function getProviders(): array
    {
        if (is_null($this->styleguideProviders)) {
            $this->styleguideProviders = [];
            foreach ($this->styleguideProviderConfiguration as $identifier => $providerClassName) {
                $this->styleguideProviders[$identifier] = $this->objectManager->get($providerClassName);
            }
        }
        return $this->styleguideProviders;
    }
}
