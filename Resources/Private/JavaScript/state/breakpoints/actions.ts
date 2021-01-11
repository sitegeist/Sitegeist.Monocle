import { createAction } from "typesafe-actions";

export const set = createAction(
    '@sitegeist/monocle/breakpoints/set',
    listOfBreakpoints => listOfBreakpoints
)();

export const clear = createAction(
    '@sitegeist/monocle/breakpoints/clear'
)();

export const select = createAction(
    '@sitegeist/monocle/breakpoints/select',
    breakpointName => breakpointName
)();
