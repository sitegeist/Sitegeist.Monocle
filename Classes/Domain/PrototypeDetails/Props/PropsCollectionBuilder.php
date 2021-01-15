<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails\Props;

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

/**
 * @Flow\Proxy("false")
 */
final class PropsCollectionBuilder
{
    /**
     * @var array<string,PropInterface>
     */
    private $props = [];

    /**
     * @param PropInterface $prop
     * @return self
     */
    public function addProp(PropInterface $prop): self
    {
        if (isset($this->props[(string) $prop->getName()])) {
            throw new \DomainException(
                sprintf(
                    'Tried to add duplicate prop "%s". Props must be unique ' .
                    'within a PropCollection.',
                    $prop->getName()
                )
            );
        }

        $this->props[(string) $prop->getName()] = $prop;

        return $this;
    }

    /**
     * @return PropsCollection
     */
    public function build(): PropsCollection
    {
        return new PropsCollection(...array_values($this->props));
    }
}
