<?php

declare(strict_types=1);

namespace Sitegeist\Monocle\StyleguideProvider\CpxPackage;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Package\FlowPackageInterface;
use Neos\Flow\Package\PackageManager;
use PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfiguration;
use PackageFactory\Neos\ComponentEngine\Application\Transpiler\TranspilerConfigurationLoader;
use PackageFactory\PHPComponentEngine\ComponentInterface;
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
use Sitegeist\Monocle\Service\ConfigurationService;
use Symfony\Component\Yaml\Yaml;

readonly class CpxComponentMetadata
{
    /**
     * @param StyleguideObject $styleguideObject
     * @param class-name-string<ComponentInterface> $componentPhpClassName
     * @param string $componentStyleguideConfigFile
     */
    public function __construct(
        public StyleguideObject $styleguideObject,
        public string $componentPhpClassName,
        public string $componentStyleguideConfigFile,
    ) {}


}
