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

interface PropInterface extends \JsonSerializable
{
    /**
     * @return PropName
     */
    public function getName(): PropName;

    /**
     * @return PropValue
     */
    public function getValue(): PropValue;

    /**
     * @return EditorInterface
     */
    public function getEditor(): EditorInterface;
}
