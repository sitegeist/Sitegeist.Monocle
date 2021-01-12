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

interface EditorInterface extends \JsonSerializable
{
    /**
     * @return EditorIdentifier
     */
    public function getIdentifier(): EditorIdentifier;

    /**
     * @return EditorOptions
     */
    public function getOptions(): EditorOptions;
}
