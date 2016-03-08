<?php


namespace Sitegeist\Monocle\Domain\Model;

use TYPO3\Flow\Annotations as Flow;

class Item
{
    /**
     * @var string
     */
    protected $path = '';

    /**
     * @var string
     */
    protected $title;

    /**
     * Item constructor.
     * @param string $parent
     */
    public function __construct($path = '', $title)
    {
        $this->path = $path;
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     *
     */
    public function getPath()
    {
        return $this->path;
    }

    public function getDotPath() {
        $dotPath = $this->getPath();
        $dotPath = str_replace(['.',':'], ['_','_'], $dotPath);
        $dotPath = str_replace(['/'], ['.'],$dotPath);
        return $dotPath;
    }
}