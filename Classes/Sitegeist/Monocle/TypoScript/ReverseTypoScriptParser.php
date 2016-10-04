<?php

namespace Sitegeist\Monocle\TypoScript;

use TYPO3\Flow\Annotations as Flow;

class ReverseTypoScriptParser
{

    const RESERVED_KEYS = ['__prototypeObjectName','__meta','__prototypeChain', '__prototypes', '__objectType', '__eelExpression', '__value'];

    const TOP_META_KEYS = ['context','styleguide'];


    const INDENTATION = '    ';

    /**
     * Get PrototypeName and AST and restore the original Code representation
     *
     * @param string $prototypeName
     * @param array $aspectSyntaxTree
     * @return string
     */
    static public function restorePrototypeCode ($prototypeName, $abstractSyntaxTree, $indentation = '') {
        $result = '';

        $result .= $indentation . 'prototype(' . $prototypeName . ')' . ( array_key_exists('__prototypeObjectName',  $abstractSyntaxTree) ? ' < prototype(' . $abstractSyntaxTree['__prototypeObjectName'] . ')' : '' ) . ' {' . chr(10);

        // handle __meta context
        if ( array_key_exists('__meta',  $abstractSyntaxTree)) {
            foreach (array_keys($abstractSyntaxTree['__meta']) as $key) {
                if (in_array($key, self::TOP_META_KEYS) === false ) continue;
                $result .= self::restoreValueCode('@' . $key, $abstractSyntaxTree['__meta'][$key], $indentation . self::INDENTATION);
            }
        }

        // handle __prototypes
        if ( array_key_exists('__prototypes',  $abstractSyntaxTree)) {
            foreach (array_keys($abstractSyntaxTree['__prototypes']) as $key ) {
                $result .= self::restorePrototypeCode($key, $abstractSyntaxTree['__prototypes'][$key], $indentation . self::INDENTATION);
            }
        }

        // add properties
        foreach (array_keys($abstractSyntaxTree) as $key ) {
            if (in_array($key, self::RESERVED_KEYS)) continue;
            $result .=  self::restoreValueCode($key, $abstractSyntaxTree[$key], $indentation . self::INDENTATION);
        }


        // handle remaining __meta keys
        if ( array_key_exists('__meta',  $abstractSyntaxTree)) {
            foreach (array_keys($abstractSyntaxTree['__meta']) as $key) {
                if (in_array($key, self::TOP_META_KEYS) === true ) continue;
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
    static public function restoreValueCode($valueName, $abstractSyntaxTree, $indentation) {
        $result = '';
        if (is_array($abstractSyntaxTree)) {
            $multiline = false;
            if (array_key_exists('__objectType', $abstractSyntaxTree) && $abstractSyntaxTree['__objectType'] !== null ) {
                $multiline = true;
                $result .= $indentation . $valueName . ' = ' . $abstractSyntaxTree['__objectType'] . ' {' . chr(10);
                foreach (array_keys($abstractSyntaxTree) as $key) {
                    if (in_array($key, self::RESERVED_KEYS)) continue;
                    $result .= self::restoreValueCode($key, $abstractSyntaxTree[$key], $indentation . self::INDENTATION);
                }
            } else if (array_key_exists('__eelExpression', $abstractSyntaxTree) && $abstractSyntaxTree['__eelExpression'] !== null) {
                $result .= $indentation . $valueName . ' = ${' . $abstractSyntaxTree['__eelExpression'] . '}' . chr(10);
            } else if (array_key_exists('__value', $abstractSyntaxTree)) {
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
                if ( array_key_exists('__meta',  $abstractSyntaxTree)) {
                    foreach (array_keys($abstractSyntaxTree['__meta']) as $key) {
                        $result .= self::restoreValueCode('@' . $key, $abstractSyntaxTree['__meta'][$key], $indentation . self::INDENTATION);
                    }
                }

                // handle __prototypes
                if ( array_key_exists('__prototypes',  $abstractSyntaxTree)) {
                    foreach (array_keys($abstractSyntaxTree['__prototypes']) as $key ) {
                        $result .= self::restorePrototypeCode($key, $abstractSyntaxTree['__prototypes'][$key], $indentation . self::INDENTATION);
                    }
                }
                $result .= $indentation . '}' . chr(10);
            } else {
                // handle __meta
                if ( array_key_exists('__meta',  $abstractSyntaxTree)) {
                    foreach (array_keys($abstractSyntaxTree['__meta']) as $key) {
                        $result .= self::restoreValueCode($valueName . '.@' . $key, $abstractSyntaxTree['__meta'][$key], $indentation);
                    }
                }
            }
        } else {
            if (is_string($abstractSyntaxTree)) {
                $result .= $indentation . $valueName . ' = "' . $abstractSyntaxTree . '"' . chr(10);
            } else if (is_scalar($abstractSyntaxTree)) {
                $result .= $indentation . $valueName . ' = ' . (string)$abstractSyntaxTree . chr(10);
            } else {
                $result .= $indentation . $valueName . ' = ' . json_encode($abstractSyntaxTree) . chr(10);
            }
        }
        return $result;
    }

}
