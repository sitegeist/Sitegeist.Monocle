<?php

namespace Sitegeist\Monocle\Domain\Model;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TypoScript\View\TypoScriptView;

class Prototype extends Item
{
    /**
     * @var string
     */
    protected $title;

    /**
     * @var string
     */
    protected $description;

    /**
     * @var string
     */
    protected $prototypeName;

    /**
     * Prototype constructor.
     * @param $title
     * @param $description
     * @param $prototypeName
     */
    public function __construct($path, $title, $description, $prototypeName)
    {
        parent::__construct($path . '/' . $prototypeName, $title);
        $this->setDescription($description);
        $this->setPrototypeName($prototypeName);
    }


    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getPrototypeName()
    {
        return $this->prototypeName;
    }

    /**
     * @param string $prototypeName
     */
    public function setPrototypeName($prototypeName)
    {
        $this->prototypeName = $prototypeName;
    }

}