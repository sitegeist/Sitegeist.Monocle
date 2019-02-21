<?php
namespace Sitegeist\Monocle\Routing;

use Neos\Flow\Annotations as Flow;
use Neos\Flow\Mvc\Routing\DynamicRoutePart;

class IgnoreRoutePartHandler extends DynamicRoutePart
{
    /**
     * Returns the first part of $routePath.
     * If a split string is set, only the first part of the value until location of the splitString is returned.
     * This method can be overridden by custom RoutePartHandlers to implement custom matching mechanisms.
     *
     * @param string $routePath The request path to be matched
     * @return string value to match, or an empty string if $routePath is empty or split string was not found
     * @api
     */
    protected function findValueToMatch($routePath)
    {
        return $routePath;
    }

    /**
     * Checks, whether given value can be matched.
     * In the case of default Dynamic Route Parts a value matches when it's not empty.
     * This method can be overridden by custom RoutePartHandlers to implement custom matching mechanisms.
     *
     * @param string $value value to match
     * @return boolean TRUE if value could be matched successfully, otherwise FALSE.
     * @api
     */
    protected function matchValue($value)
    {
        return true;
    }
}
