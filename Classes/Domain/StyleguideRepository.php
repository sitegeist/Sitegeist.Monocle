<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Domain;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\ObjectManagement\ObjectManagerInterface;
use Neos\Flow\Reflection\ReflectionService;

class StyleguideRepository
{
    #[Flow\Inject]
    protected ObjectManagerInterface $objectManager;

    /**
     * @var array<string, StyleguideProviderInterface>
     */
    protected ?array $styleguideProviders = null;

    public function getAllStyleGuides(): StyleguideMetadataCollection
    {
        $providers = $this->getProviders();
        $styleguides = [];
        foreach ($providers as $provider) {
            $styleguides[] = $provider->getStyleguideMetadataCollection();
        }
        return StyleguideMetadataCollection::fromMultiple(...$styleguides);
    }

    public function getStyleGuide(StyleguideAddress $address): StyleguideInterface
    {
        $providers = $this->getProviders();
        foreach ($providers as $provider) {
            if ($provider::getProviderIdentifier()->equals($address->provider)) {
                return $provider->getStyleguide($address->styleguide);
            }
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
           /** @var ReflectionService $reflectionService */
            $reflectionService = $this->objectManager->get(ReflectionService::class);
            $providerClassNames = $reflectionService->getAllImplementationClassNamesForInterface(StyleguideProviderInterface::class);
            foreach ($providerClassNames as $providerClassName) {
                $this->styleguideProviders[$providerClassName::getProviderIdentifier()->value] = $this->objectManager->get($providerClassName);
            }
        }
        return $this->styleguideProviders;
    }
}
