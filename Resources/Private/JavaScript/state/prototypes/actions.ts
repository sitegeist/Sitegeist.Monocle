import { createAction } from "typesafe-actions";

export const add = createAction(
    '@sitegeist/monocle/prototypes/add',
    (listOfPrototypes: {
        [key: string]: unknown
    }) => listOfPrototypes
)();

export const clear = createAction(
    '@sitegeist/monocle/prototypes/clear'
)();

export const select = createAction(
    '@sitegeist/monocle/prototypes/select',
    (prototypeName: string) => prototypeName
)();

export const setCurrentlyRendered = createAction(
    '@sitegeist/monocle/prototypes/setCurrentlyRendered',
    (currentlyRenderedPrototype: unknown) => currentlyRenderedPrototype
)();

export const setCurrentlyRenderedPrototypeName = createAction(
    '@sitegeist/monocle/prototypes/setCurrentlyRenderedPrototypeName',
    (currentlyRenderedPrototypeName: string) => currentlyRenderedPrototypeName
)();

export const setCurrentHtml = createAction(
    '@sitegeist/monocle/prototypes/setCurrentHtml',
    (currentlyRenderedHtml: string) => currentlyRenderedHtml
)();

export const ready = createAction(
    '@sitegeist/monocle/prototypes/ready'
)();

export const reload = createAction(
    '@sitegeist/monocle/prototypes/reload'
)();

export const overrideProp = createAction(
    '@sitegeist/monocle/prototypes/overrideProp',
    (name: string, value: any) => ({name, value})
)();

export const selectPropSet = createAction(
    '@sitegeist/monocle/prototypes/selectPropSet',
    (name: string) => name
)();
