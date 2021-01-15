import { createAction } from "typesafe-actions";

export const set = createAction(
    '@sitegeist/monocle/locales/set',
    listOfLocales => listOfLocales
)();

export const clear = createAction(
    '@sitegeist/monocle/locales/clear'
)();

export const select = createAction(
    '@sitegeist/monocle/locales/select',
    localeName => localeName
)();
