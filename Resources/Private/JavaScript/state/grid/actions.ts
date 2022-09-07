import { createAction } from "typesafe-actions";

export const show = createAction(
    '@sitegeist/monocle/gridPreview/show'
)();

export const hide = createAction(
    '@sitegeist/monocle/gridPreview/hide'
)();

export const toggle = createAction(
    '@sitegeist/monocle/gridPreview/toggle'
)();
