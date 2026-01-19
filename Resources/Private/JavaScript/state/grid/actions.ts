import { createAction } from "typesafe-actions";
import type { GridDefinition } from "../../schema";

export const set = createAction(
    '@sitegeist/monocle/gridPreview/set',
    (grids: Record<string, GridDefinition> | GridDefinition[] | null) => grids
)();

export const show = createAction(
    '@sitegeist/monocle/gridPreview/show'
)();

export const hide = createAction(
    '@sitegeist/monocle/gridPreview/hide'
)();

export const toggle = createAction(
    '@sitegeist/monocle/gridPreview/toggle'
)();
