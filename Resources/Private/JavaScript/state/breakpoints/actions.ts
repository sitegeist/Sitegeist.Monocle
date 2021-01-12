import { createAction } from "typesafe-actions";

export const set = createAction(
    '@sitegeist/monocle/breakpoints/set',
    (listOfBreakpoints: {
        [key: string]: {
            label: string
            width: number
            height: number
        }
    }) => listOfBreakpoints
)();

export const clear = createAction(
    '@sitegeist/monocle/breakpoints/clear'
)();

export const select = createAction(
    '@sitegeist/monocle/breakpoints/select',
    (breakpointName: string) => breakpointName
)();
