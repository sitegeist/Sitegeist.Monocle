<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\PrototypeDetails\UseCases;

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
use Sitegeist\Monocle\Domain\PrototypeDetails\Props\PropValue;

/**
 * @Flow\Proxy(false)
 */
final class UseCase implements \JsonSerializable
{
    /**
     * @var UseCaseName
     */
    private $name;

    /**
     * @var UseCaseTitle
     */
    private $title;

    /**
     * @var array<string,PropValue>
     */
    private $overrides;

    /**
     * @param UseCaseName $name
     * @param array $overrides
     */
    public function __construct(
        UseCaseName $name,
        UseCaseTitle $title,
        array $overrides
    ) {
        $this->name = $name;
        $this->title = $title;
        $this->overrides = $overrides;
    }

    /**
     * @return array<mixed>
     */
    public function jsonSerialize()
    {
        return [
            'name' => $this->name,
            'title' => $this->title,
            'overrides' => $this->overrides
        ];
    }
}
