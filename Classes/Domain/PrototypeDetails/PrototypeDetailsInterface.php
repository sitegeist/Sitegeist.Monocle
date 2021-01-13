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

/**
 * @Flow\Proxy(false)
 */
interface PrototypeDetailsInterface extends \JsonSerializable
{
    /**
     * @return PrototypeName
     */
    public function getPrototypeName(): PrototypeName;

    /**
     * @return RenderedCode
     */
    public function getRenderedCode(): RenderedCode;

    /**
     * @return ParsedCode
     */
    public function getParsedCode(): ParsedCode;

    /**
     * @return FusionPrototypeAst
     */
    public function getFusionAst(): FusionPrototypeAst;

    /**
     * @return Anatomy
     */
    public function getAnatomy(): Anatomy;

    /**
     * @return PropsCollectionInterface
     */
    public function getProps(): PropsCollectionInterface;

    /**
     * @return PropSetCollection
     */
    public function getPropSets(): PropSetCollection;
}
