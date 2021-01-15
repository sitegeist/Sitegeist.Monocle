import { createAction } from "typesafe-actions";

export const show = createAction(
    '@sitegeist/monocle/qrcode/show'
)();

export const hide = createAction(
    '@sitegeist/monocle/qrcode/hide'
)();

export const toggle = createAction(
    '@sitegeist/monocle/qrcode/toggle'
)();
