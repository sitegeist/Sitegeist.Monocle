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
use Sitegeist\Monocle\Domain\Fusion\Prototype;
use Sitegeist\Monocle\Domain\PrototypeDetails\Props\PropValue;

/**
 * @Flow\Proxy(false)
 */
final class UseCaseCollection implements \JsonSerializable
{
    /**
     * @var array|UseCase[]
     */
    private $useCases;

    /**
     * @param UseCase ...$useCases
     */
    public function __construct(UseCase ...$useCases)
    {
        $this->useCases = $useCases;
    }

    /**
     * @param Prototype $prototype
     * @return self
     */
    public static function fromPrototype(Prototype $prototype): self
    {
        $ast = $prototype->getAst();
        $useCases = [];

        if (isset($ast['__meta']['styleguide']['useCases'])) {
            foreach ($ast['__meta']['styleguide']['useCases'] as $useCaseNameAsString => $useCaseAst) {
                $useCaseName = UseCaseName::fromString((string)$useCaseNameAsString);
                $useCaseTitle = UseCaseTitle::fromString((string)($useCaseAst['title'] ?? $useCaseNameAsString));
                $values = $prototype->evaluate(sprintf(
                    '/__meta/styleguide/useCases/%s/props<Neos.Fusion:DataStructure>',
                    $useCaseName
                ));
                $overrides = [];

                if (is_array($values)) {
                    foreach ($values as $name => $value) {
                        if (PropValue::isValid($value)) {
                            $overrides[(string) $name] =
                                PropValue::fromAny($value);
                        }
                    }
                }

                $useCases[] = new UseCase($useCaseName, $useCaseTitle, $overrides);
            }
        }

        return new self(...$useCases);
    }

    /**
     * @return array|UseCases[]
     */
    public function jsonSerialize()
    {
        return $this->useCases;
    }
}
