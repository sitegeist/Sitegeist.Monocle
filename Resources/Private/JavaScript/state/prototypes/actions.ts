import { createAction } from "typesafe-actions";

export const add = createAction(
    '@sitegeist/monocle/prototypes/add',
    (listOfPrototypes: {
        [key: string]: {
            title: string
            description: string
            structure: {
                label: string
                position?: number
            }
            options?: {
                position: number
            }
        }
    }) => listOfPrototypes
)();

export const clear = createAction(
    '@sitegeist/monocle/prototypes/clear'
)();

export const select = createAction(
    '@sitegeist/monocle/prototypes/select',
    (prototypeName: string) => prototypeName
)();

interface AnatomyType {
    prototypeName: string
    children: AnatomyType[]
}

export const setCurrentlyRendered = createAction(
    '@sitegeist/monocle/prototypes/setCurrentlyRendered',
    (currentlyRenderedPrototype: null | {
        prototypeName: string
        renderedCode: string
        parsedCode: string
        anatomy: AnatomyType | AnatomyType[]
        fusionAst: {
            __meta: {
                styleguide: {
                    props: {
                        [key: string]: any
                    }
                    propSets: {
                        [key: string]: any
                    }
                    useCases: {
                        [key: string]: any
                    }
                }
            }
        }
        props: {
            name: string
            value: any
            editor: {
                identifier: string
                options: any
            }
        }[]
        propSets: {
            name: string
            overrides: Record<string, any>
        }[]
        useCases: {
            name: string
            title: string
            overrides: Record<string, any>
        }[]
    }) => currentlyRenderedPrototype
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

export const selectUseCase = createAction(
    '@sitegeist/monocle/prototypes/selectUseCase',
    (name: string) => name
)();
