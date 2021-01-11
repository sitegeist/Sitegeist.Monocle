import { createAction } from "typesafe-actions";

export const set = createAction(
    '@sitegeist/monocle/hotkeys/set',
    (hotkeys: object) => hotkeys
)();

export const clear = createAction(
    '@sitegeist/monocle/hotkeys/clear'
)();
