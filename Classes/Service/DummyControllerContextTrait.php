<?php
namespace Sitegeist\Monocle\Service;

use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\ActionRequestFactory;
use Neos\Flow\Mvc\ActionResponse;
use Neos\Flow\Mvc\Controller\Arguments;
use Neos\Flow\Mvc\Routing\UriBuilder;
use Neos\Flow\Mvc\Controller\ControllerContext;
use Neos\Http\Factories\ResponseFactory;
use Neos\Http\Factories\ServerRequestFactory;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Utility trait to create controller contexts within CLI SAPI
 */
trait DummyControllerContextTrait
{
    /**
     * Create a dummy controller context
     *
     * @return ControllerContext
     */
    protected function createDummyControllerContext()
    {
        $actionRequestFactory = new ActionRequestFactory();
        $serverRequestFactory = new ServerRequestFactory();

        /** @var ServerRequestInterface */
        $httpRequest = $serverRequestFactory->createServerRequest('GET', 'http://neos.io');

        /** @var ActionRequest */
        $actionRequest = $actionRequestFactory->createActionRequest($httpRequest);
        $actionResponse = new ActionResponse();

        $arguments = new Arguments([]);
        $uriBuilder = new UriBuilder();
        $uriBuilder->setRequest($actionRequest);

        return new ControllerContext($actionRequest, $actionResponse, $arguments, $uriBuilder);
    }
}
