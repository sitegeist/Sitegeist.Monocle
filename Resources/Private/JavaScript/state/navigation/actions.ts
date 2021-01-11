import { createAction } from "typesafe-actions";

export const open = createAction(
    '@sitegeist/monocle/navigation/open'
)();

export const close = createAction(
    '@sitegeist/monocle/navigation/close'
)();

export const toggle = createAction(
    '@sitegeist/monocle/navigation/toggle'
)();

export const search = createAction(
    '@sitegeist/monocle/navigation/search',
    (term: string) => term
)();

export const up = createAction(
    '@sitegeist/monocle/navigation/up'
)();

export const down = createAction(
    '@sitegeist/monocle/navigation/down'
)();
