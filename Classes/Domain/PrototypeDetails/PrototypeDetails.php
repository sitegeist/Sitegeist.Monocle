<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails;

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

use Neos\Flow\Annotations as Flow;
use Sitegeist\Monocle\Domain\Fusion\PrototypeName;
use Sitegeist\Monocle\Domain\PrototypeDetails\Props\PropsCollectionInterface;
use Sitegeist\Monocle\Domain\PrototypeDetails\PropSets\PropSetCollection;
use Sitegeist\Monocle\Domain\PrototypeDetails\UseCases\UseCaseCollection;

/**
 * @Flow\Proxy(false)
 */
final class PrototypeDetails implements PrototypeDetailsInterface
{
    /**
     * @var PrototypeName
     */
    private $prototypeName;

    /**
     * @var RenderedCode
     */
    private $renderedCode;

    /**
     * @var ParsedCode
     */
    private $parsedCode;

    /**
     * @var FusionPrototypeAst
     */
    private $fusionAst;

    /**
     * @var Anatomy
     */
    private $anatomy;

    /**
     * @var PropsCollectionInterface
     */
    private $props;

    /**
     * @var PropSetCollection
     */
    private $propSets;

    /**
     * @var UseCaseCollection
     */
    private $useCases;

    /**
     * @param PrototypeName $prototypeName
     * @param RenderedCode $renderedCode
     * @param ParsedCode $parsedCode
     * @param FusionPrototypeAst $fusionAst
     * @param Anatomy $anatomy
     * @param PropsCollectionInterface $props
     * @param PropSetCollection $propSets
     * @param UseCaseCollection $useCases
     */
    public function __construct(
        PrototypeName $prototypeName,
        RenderedCode $renderedCode,
        ParsedCode $parsedCode,
        FusionPrototypeAst $fusionAst,
        Anatomy $anatomy,
        PropsCollectionInterface $props,
        PropSetCollection $propSets,
        UseCaseCollection $useCases
    ) {
        $this->prototypeName = $prototypeName;
        $this->renderedCode = $renderedCode;
        $this->parsedCode = $parsedCode;
        $this->fusionAst = $fusionAst;
        $this->anatomy = $anatomy;
        $this->props = $props;
        $this->propSets = $propSets;
        $this->useCases = $useCases;
    }

    /**
     * @return PrototypeName
     */
    public function getPrototypeName(): PrototypeName
    {
        return $this->prototypeName;
    }

    /**
     * @return RenderedCode
     */
    public function getRenderedCode(): RenderedCode
    {
        return $this->renderedCode;
    }

    /**
     * @return ParsedCode
     */
    public function getParsedCode(): ParsedCode
    {
        return $this->parsedCode;
    }

    /**
     * @return FusionPrototypeAst
     */
    public function getFusionAst(): FusionPrototypeAst
    {
        return $this->fusionAst;
    }

    /**
     * @return Anatomy
     */
    public function getAnatomy(): Anatomy
    {
        return $this->anatomy;
    }

    /**
     * @return PropsCollectionInterface
     */
    public function getProps(): PropsCollectionInterface
    {
        return $this->props;
    }

    /**
     * @return PropSetCollection
     */
    public function getPropSets(): PropSetCollection
    {
        return $this->propSets;
    }

    /**
     * @return UseCaseCollection
     */
    public function getUseCases(): UseCaseCollection
    {
        return $this->useCases;
    }

    /**
     * @return array<mixed>
     */
    public function jsonSerialize()
    {
        return [
            'prototypeName' => $this->prototypeName,
            'renderedCode' => $this->renderedCode,
            'parsedCode' => $this->parsedCode,
            'fusionAst' => $this->fusionAst,
            'anatomy' => $this->anatomy,
            'props' => $this->props,
            'propSets' => $this->propSets,
            'useCases' => $this->useCases
        ];
    }
}
