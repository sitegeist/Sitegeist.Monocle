<?php

namespace Sitegeist\Monocle\Domain\Model;

use TYPO3\Flow\Annotations as Flow;

class Section extends Item
{
    /**
     * @var array<Item>
     */
    protected $items = [];

    /**
     * @var array
     */
    protected $sections = [];

    /**
     * @return array
     */
    public function getItems()
    {
        return $this->items;
    }

    /**
     * @param array $items
     */
    public function setItems($items)
    {
        $this->items = $items;
    }

    /**
     * @param Item $item
     */
    public function addItem($key, Item $item) {
        $this->items[$key] = $item;
    }

    /**
     * @return array
     */
    public function getSections()
    {
        return $this->sections;
    }

    /**
     * @param array $sections
     */
    public function setSections($sections)
    {
        $this->sections = $sections;
    }

    /**
     * @param $path
     * @return $this
     */
    public function byPath($path) {

        if ($path === '' || $path === null) {
            return $this;
        }

        if (strpos($path, '/') !== FALSE) {
            list ($firstPathSegment, $remainingPath) = explode('/', $path, 2);
        } else {
            $firstPathSegment = $path;
            $remainingPath = NULL;
        }

        if (array_key_exists($firstPathSegment, $this->sections)) {
            return $this->sections[$firstPathSegment]->byPath($remainingPath);
        } else {
            $this->sections[$firstPathSegment] = new Section( ($this->path ? $this->path . '/' : '' ) . $firstPathSegment, $firstPathSegment);
            return $this->sections[$firstPathSegment]->byPath($remainingPath);
        }
    }
}