import { createAction } from "typesafe-actions";

export const set = createAction(
    '@sitegeist/monocle/hotkeys/set',
    (hotkeys: {
        openNavigation: string
        closeNavigation: string
        navigateUp: string
        navigateDown: string
        openPreviewInNewWindow: string
    }) => hotkeys
)();

export const clear = createAction(
    '@sitegeist/monocle/hotkeys/clear'
)();
