<?php
declare(strict_types=1);

namespace Sitegeist\Monocle\Domain;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\ObjectManagement\ObjectManagerInterface;
use Neos\Flow\Reflection\ReflectionService;
use function PHPUnit\Framework\fileExists;

#[Flow\Scope("singleton")]
class StyleguideRepository
{
    #[Flow\Inject]
    protected ObjectManagerInterface $objectManager;

    #[Flow\InjectConfiguration(path: 'styleguideProviders')]
    protected array $styleguideProviderConfiguration;

    #[Flow\InjectConfiguration(path: 'defaultStyleguide')]
    protected ?string $defaultStyleguide;

    /**
     * @var array<string, StyleguideProviderInterface>
     */
    protected ?array $styleguideProviders = null;

    public function getDefault(): StyleguideMetadata
    {
        $all = $this->getAllStyleGuides();
        return $all->metadataItems[array_key_first($all->metadataItems)];
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
            return $provider->getStyleguide($address->styleguide);
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
