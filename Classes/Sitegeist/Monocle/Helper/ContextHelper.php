<?php

namespace Sitegeist\Monocle\Helper;

use TYPO3\Flow\Annotations as Flow;
use TYPO3\TYPO3CR\Domain\Model\NodeInterface;
use TYPO3\Neos\Domain\Service\ContentContext;
use TYPO3\Neos\Domain\Service\ContentContextFactory;

class ContextHelper
{

    /**
     * @Flow\Inject
     * @var \TYPO3\Neos\Domain\Repository\SiteRepository
     */
    protected $siteRepository;

    /**
     * @Flow\Inject
     * @var ContentContextFactory
     */
    protected $contextFactory;

    public function getContext(NodeInterface $node = null)
    {
        $contextProperties = [];
        $contextProperties['currentSite'] = $this->siteRepository->findFirstOnline();
        $context = $this->contextFactory->create($contextProperties);
        return $context;
    }
}
