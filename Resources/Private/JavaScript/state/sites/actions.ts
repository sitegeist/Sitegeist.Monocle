import { createAction } from "typesafe-actions";

export const initialized = createAction(
    '@sitegeist/monocle/sites/initialized'
)();

export const set = createAction(
    '@sitegeist/monocle/sites/set',
    (listOfSites: {
        [key: string]: string
    }) => listOfSites
)();

export const clear = createAction(
    '@sitegeist/monocle/sites/clear'
)();

export const select = createAction(
    '@sitegeist/monocle/sites/select',
    (siteName: string) => siteName
)();
