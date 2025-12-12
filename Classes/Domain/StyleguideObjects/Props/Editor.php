<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\StyleguideObjects\Props;

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

#[Flow\Proxy(false)]
final readonly class Editor
{
    public function __construct(
        public EditorIdentifier $identifier,
        public EditorOptions $options
    ) {
    }

    /**
     * @return array<mixed>
     */
    public function jsonSerialize()
    {
        return [
            'identifier' => $this->identifier,
            'options' => $this->options
        ];
    }
}
