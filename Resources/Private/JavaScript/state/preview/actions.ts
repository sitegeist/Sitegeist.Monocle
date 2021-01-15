import { createAction } from "typesafe-actions";

export const set = createAction(
    '@sitegeist/monocle/preview/set',
    (payload: {
        defaultPrototypeName?: string | null | undefined,
        fusionRootPath: string,
        sourceQuerySelector: string
    }) => payload
)();

export const clear = createAction(
    '@sitegeist/monocle/preview/clear'
)();
