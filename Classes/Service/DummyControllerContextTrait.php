<?php
namespace Sitegeist\Monocle\Service;

use Neos\Flow\Http\Request;
use Neos\Flow\Http\Response;
use Neos\Flow\Http\Uri;
use Neos\Flow\Mvc\ActionRequest;
use Neos\Flow\Mvc\Controller\Arguments;
use Neos\Flow\Mvc\Routing\UriBuilder;
use Neos\Flow\Mvc\Controller\ControllerContext;

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
        $httpRequest = Request::create(new Uri('http://neos.io'));
        $request = new ActionRequest($httpRequest);
        $response = new Response();
        $arguments = new Arguments([]);
        $uriBuilder = new UriBuilder();
        $uriBuilder->setRequest($request);

        return new ControllerContext($request, $response, $arguments, $uriBuilder);
    }
}
