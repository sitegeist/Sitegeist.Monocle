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
 * @Flow\Proxy(false)
 */
final class PropsCollection implements PropsCollectionInterface
{
    /**
     * @var array|PropInterface[]
     */
    private $props;

    /**
     * @param PropInterface ...$props
     */
    public function __construct(PropInterface ...$props)
    {
        $this->props = $props;
    }

    /**
     * @return iterable<mixed,PropInterface>
     */
    public function getProps(): iterable
    {
        return $this->props;
    }

    /**
     * @return array|PropInterface[]
     */
    public function jsonSerialize()
    {
        return $this->props;
    }
}
