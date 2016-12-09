<?php
namespace Sitegeist\Monocle\TypoScript;

/**
 * This file is part of the Sitegeist.Monocle package
 *
 * (c) 2016
 * Martin Ficzel <ficzel@sitegeist.de>
 * Wilhelm Behncke <behncke@sitegeist.de>
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use TYPO3\Flow\Annotations as Flow;

/**
 * Class ReverseTypoScriptParser
 * @package Sitegeist\Monocle\TypoScript
 */
class ReverseTypoScriptParser
{
    protected static $RESERVED_KEYS = [
        '__prototypeObjectName',
        '__meta',
        '__prototypeChain',
        '__prototypes',
        '__objectType',
        '__eelExpression',
        '__value'
    ];

    protected static $TOP_META_KEYS = ['context','styleguide'];

    const INDENTATION = '    ';

    /**
     * Get PrototypeName and AST and restore the original Code representation
     *
     * @param string $prototypeName
     * @param array $aspectSyntaxTree
     * @return string
     */
    public static function restorePrototypeCode($prototypeName, $abstractSyntaxTree, $indentation = '')
    {
        $result = '';

        if (array_key_exists('__prototypeObjectName', $abstractSyntaxTree)) {
            $result .= sprintf(
                'prototype(%s) < prototype(%s) {',
                $prototypeName,
                $abstractSyntaxTree['__prototypeObjectName']
            );
        } else {
            $result .= sprintf('prototype(%s) {', $prototypeName);
        }

        // handle __meta context
        if (array_key_exists('__meta', $abstractSyntaxTree)) {
            foreach (array_keys($abstractSyntaxTree['__meta']) as $key) {
                if (in_array($key, self::$TOP_META_KEYS) === false) {
                    continue;
                }
                $result .= self::restoreValueCode('@' . $key, $abstractSyntaxTree['__meta'][$key], $indentation . self::INDENTATION);
            }
        }

        // handle __prototypes
        if (array_key_exists('__prototypes', $abstractSyntaxTree)) {
            foreach (array_keys($abstractSyntaxTree['__prototypes']) as $key) {
                $result .= self::restorePrototypeCode($key, $abstractSyntaxTree['__prototypes'][$key], $indentation . self::INDENTATION);
            }
        }

        // add properties
        foreach (array_keys($abstractSyntaxTree) as $key) {
            if (in_array($key, self::$RESERVED_KEYS)) {
                continue;
            }
            $result .=  self::restoreValueCode($key, $abstractSyntaxTree[$key], $indentation . self::INDENTATION);
        }


        // handle remaining __meta keys
        if (array_key_exists('__meta', $abstractSyntaxTree)) {
            foreach (array_keys($abstractSyntaxTree['__meta']) as $key) {
                if (in_array($key, self::$TOP_META_KEYS) === true) {
                    continue;
                }
                $result .= self::restoreValueCode('@' . $key, $abstractSyntaxTree['__meta'][$key], $indentation . self::INDENTATION);
            }
        }

        $result .= $indentation . '}' . chr(10);
        return $result;
    }

    /**
     * Get ValueName and AST and restore the original Code representation
     *
     * @param string $valueName
     * @param array $aspectSyntaxTree
     * @return string
     */
    public static function restoreValueCode($valueName, $abstractSyntaxTree, $indentation)
    {
        $result = '';
        if (is_array($abstractSyntaxTree)) {
            $multiline = false;
            if (array_key_exists('__objectType', $abstractSyntaxTree) && $abstractSyntaxTree['__objectType'] !== null) {
                $multiline = true;
                $result .= $indentation . $valueName . ' = ' . $abstractSyntaxTree['__objectType'] . ' {' . chr(10);
                foreach (array_keys($abstractSyntaxTree) as $key) {
                    if (in_array($key, self::$RESERVED_KEYS)) {
                        continue;
                    }
                    $result .= self::restoreValueCode($key, $abstractSyntaxTree[$key], $indentation . self::INDENTATION);
                }
            } elseif (array_key_exists('__eelExpression', $abstractSyntaxTree) && $abstractSyntaxTree['__eelExpression'] !== null) {
                $result .= $indentation . $valueName . ' = ${' . $abstractSyntaxTree['__eelExpression'] . '}' . chr(10);
            } elseif (array_key_exists('__value', $abstractSyntaxTree)) {
                if (is_string($abstractSyntaxTree['__value'])) {
                    $result .= $indentation . $valueName . ' = "' . $abstractSyntaxTree['__value'] . '"' . chr(10);
                } else {
                    $result .= $indentation . $valueName . ' = ' . (string)$abstractSyntaxTree['__value'] . chr(10);
                }
            } else {
                $multiline = true;
                $result .= $indentation . $valueName . ' {' . chr(10);
                foreach (array_keys($abstractSyntaxTree) as $key) {
                    $result .= self::restoreValueCode($key, $abstractSyntaxTree[$key], $indentation . self::INDENTATION);
                }
            }

            if ($multiline) {
                if (array_key_exists('__meta', $abstractSyntaxTree)) {
                    foreach (array_keys($abstractSyntaxTree['__meta']) as $key) {
                        $result .= self::restoreValueCode('@' . $key, $abstractSyntaxTree['__meta'][$key], $indentation . self::INDENTATION);
                    }
                }

                // handle __prototypes
                if (array_key_exists('__prototypes', $abstractSyntaxTree)) {
                    foreach (array_keys($abstractSyntaxTree['__prototypes']) as $key) {
                        $result .= self::restorePrototypeCode($key, $abstractSyntaxTree['__prototypes'][$key], $indentation . self::INDENTATION);
                    }
                }
                $result .= $indentation . '}' . chr(10);
            } else {
                // handle __meta
                if (array_key_exists('__meta', $abstractSyntaxTree)) {
                    foreach (array_keys($abstractSyntaxTree['__meta']) as $key) {
                        $result .= self::restoreValueCode($valueName . '.@' . $key, $abstractSyntaxTree['__meta'][$key], $indentation);
                    }
                }
            }
        } else {
            if (is_string($abstractSyntaxTree)) {
                $result .= $indentation . $valueName . ' = "' . $abstractSyntaxTree . '"' . chr(10);
            } elseif (is_scalar($abstractSyntaxTree)) {
                $result .= $indentation . $valueName . ' = ' . (string)$abstractSyntaxTree . chr(10);
            } else {
                $result .= $indentation . $valueName . ' = ' . json_encode($abstractSyntaxTree) . chr(10);
            }
        }
        return $result;
    }
}
