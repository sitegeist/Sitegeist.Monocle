import { createAction } from "typesafe-actions";

export const route = createAction(
    '@sitegeist/monocle/routing/route',
    (sitePackageKey: string, prototypeName?: string) => ({
        sitePackageKey,
        prototypeName
    })
)();
