<?php declare(strict_types=1);
namespace Sitegeist\Monocle\Domain\Fusion;

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
use Neos\Utility\Arrays;
use Neos\Fusion\Core\Runtime as FusionRuntime;

/**
 * @Flow\Proxy(false)
 */
final class Prototype
{
    /**
     * @var PrototypeName
     */
    private $name;

    /**
     * @var array<string,mixed>
     */
    private $ast;

    /**
     * @var FusionRuntime
     */
    private $runtime;

    /**
     * @param PrototypeName $name
     * @param array<string,mixed> $ast
     * @param FusionRuntime $runtime
     */
    public function __construct(
        PrototypeName $name,
        array $ast,
        FusionRuntime $runtime
    ) {
        $this->name = $name;
        $this->ast = $ast;
        $this->runtime = $runtime;
    }

    /**
     * @return PrototypeName
     */
    public function getName(): PrototypeName
    {
        return $this->name;
    }

    /**
     * @return array
     */
    public function getAst(): array
    {
        return $this->ast;
    }

    /**
     * @return boolean
     */
    public function isComponent(): bool
    {
        return $this->extends(
            PrototypeName::fromString('Neos.Fusion:Component')
        );
    }

    /**
     * @param PrototypeName $ancestorPrototypeName
     * @return boolean
     */
    public function extends(PrototypeName $ancestorPrototypeName): bool
    {
        if (isset($this->ast['__prototypeChain'])) {
            return in_array(
                (string) $ancestorPrototypeName,
                $this->ast['__prototypeChain']
            );
        }

        return false;
    }

    /**
     * @param null|string $path
     * @return array|string[]
     */
    public function getKeys(?string $path = null): array
    {
        if ($path !== null) {
            $ast = Arrays::getValueByPath($this->ast, $path);
            if (!is_array($ast)) {
                $ast = [];
            }
        } else {
            $ast = $this->ast;
        }

        return array_filter(array_keys($ast), function (string $key): bool {
            return substr($key, 0, 2) !== '__';
        });
    }

    /**
     * @param string $path
     * @param array $context
     * @return mixed
     */
    public function evaluate(string $path, array $context = [])
    {
        if ($path[0] !== '/') {
            throw new \InvalidArgumentException(
                '$path must start with "/".'
            );
        }

        $currentContext = $this->runtime->getCurrentContext();
        $this->runtime->pushContextArray(array_merge($currentContext ?: [], $context));

        $result = $this->runtime->evaluate(
            sprintf('/<%s>%s', $this->name, $path)
        );

        $this->runtime->popContext();

        return $result;
    }
}
