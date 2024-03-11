import { SagaIterator } from "redux-saga";
import { select, put, fork, take } from "redux-saga/effects";

import { buildUrl } from "../utils";
import { Environment } from "../bootstrap";

import * as prototypes from "./prototypes";
import * as breakpoints from "./breakpoints";
import * as locales from "./locales";
import * as sites from "./sites";
import * as business from "./business";
import * as navigation from "./navigation";
import * as hotkeys from "./hotkeys";
import * as preview from "./preview";
import * as propsInspector from "./props-inspector";
import * as routing from "./routing";
import * as qrcode from "./qrcode";
import * as grid from "./grid";
import { configurationSchema } from "../schema";

interface AnatomyType {
    prototypeName: string
    children: AnatomyType[]
}

export interface State {
    readonly env: Environment
    readonly breakpoints: {
        readonly byName: {
            readonly [key: string]: {
                readonly label: string
                readonly width: number
                readonly height: number
            }
        }
        readonly currentlySelected: null | string
    }
    readonly business: {
        readonly tasks: {
            readonly [key: string]: Record<string, unknown>  // @TODO: Refactor
        }
        readonly errors: {
            readonly [key: string]: string
        }
        readonly needsAuthentication: boolean
    }
    readonly hotkeys: Record<string, never> | { // @TODO: Refactor
        readonly openNavigation: string
        readonly closeNavigation: string
        readonly navigateUp: string
        readonly navigateDown: string
        readonly openPreviewInNewWindow: string
    }
    readonly locales: {
        readonly byName: {
            readonly [key: string]: {
                readonly label: string
                readonly fallback?: string[]
            }
        }
        readonly currentlySelected: null | string
    }
    readonly preview: Record<string, never> | { // @TODO: Refactor
        readonly sourceQuerySelector: string
        readonly fusionRootPath: string
        readonly defaultPrototypeName?: string | null | undefined // @TODO: Refactor
    }
    readonly propsInspector: {
        readonly isOpen: boolean
    }
    readonly gridPreview: {
        readonly isVisible: boolean
    }
    readonly sites: {
        readonly byName: {
            readonly [key: string]: string
        }
        readonly currentlySelected: null | string
    }
    readonly qrCode: {
        readonly isVisible: boolean
    }
    readonly prototypes: {
        readonly byName: {
            readonly [key: string]: {
                readonly title: string
                readonly description: string
                readonly structure: {
                    readonly label: string
                    readonly position?: number
                }
                readonly options?: {
                    readonly position: number
                }
            }
        }
        readonly overriddenProps: {
            readonly [key: string]: any
        }
        readonly selectedPropSet: null | string
        readonly selectedUseCase: null | string
        readonly currentlySelected: null | string
        readonly currentlyRendered: null | {
            readonly prototypeName: string
            readonly renderedCode: string
            readonly parsedCode: string
            readonly anatomy: AnatomyType | AnatomyType[]
            readonly fusionAst: {
                readonly __meta: {
                    readonly styleguide: {
                        readonly props: {
                            readonly [key: string]: any
                        }
                        readonly propSets: {
                            readonly [key: string]: any
                        }
                        readonly useCases: {
                            readonly [key: string]: any
                        }
                    }
                }
            }
            readonly props: {
                readonly name: string
                readonly value: any
                readonly editor: {
                    readonly identifier: string
                    readonly options: any
                }
            }[]
            readonly propSets: {
                readonly name: string
                readonly overrides: Record<string, any>
            }[]
            readonly useCases: {
                readonly name: string
                readonly title: string
                readonly overrides: Record<string, any>
            }[]
        }
        readonly currentHtml: string
    }
    readonly navigation: {
        readonly isOpen: boolean
        readonly searchTerm: string
        readonly currentIndex: number
    }
}

export type Action =
    | prototypes.Action
    | breakpoints.Action
    | locales.Action
    | sites.Action
    | business.Action
    | navigation.Action
    | hotkeys.Action
    | preview.Action
    | propsInspector.Action
    | routing.Action
    | qrcode.Action
    | grid.Action
;

export const actions = {
    prototypes: prototypes.actions,
    breakpoints: breakpoints.actions,
    locales: locales.actions,
    sites: sites.actions,
    business: business.actions,
    navigation: navigation.actions,
    hotkeys: hotkeys.actions,
    preview: preview.actions,
    propsInspector: propsInspector.actions,
    routing: routing.actions,
    qrcode: qrcode.actions,
    grid: grid.actions
};

export const reducer = (state: State, action: Action) => [
    prototypes.reducer,
    breakpoints.reducer,
    locales.reducer,
    sites.reducer,
    business.reducer,
    navigation.reducer,
    hotkeys.reducer,
    preview.reducer,
    propsInspector.reducer,
    qrcode.reducer,
    grid.reducer
].reduce((state, reducer) => reducer(state, action), state);

export const selectors = {
    prototypes: prototypes.selectors,
    breakpoints: breakpoints.selectors,
    locales: locales.selectors,
    sites: sites.selectors,
    business: business.selectors,
    navigation: navigation.selectors,
    hotkeys: hotkeys.selectors,
    preview: preview.selectors,
    propsInspector: propsInspector.selectors,
    qrcode: qrcode.selectors,
    grid: grid.selectors
};

function* loadConfiguration(): SagaIterator<void> {
    const moduleUri: string = yield select(
        (state: State) => state.env.moduleUri
    );

    const routePath = window.location.pathname === moduleUri
        ? ''
        : window.location.pathname.substring(moduleUri.length + 1);
    const routePathSplitted = routePath.split('/');
    let routePrototypeName: null | string = routePathSplitted[1];

    while (true) { // eslint-disable-line
        yield take(actions.sites.select);
        yield* business.sagas.operation(function* (): SagaIterator<void> { // eslint-disable-line
            const sitePackageKey: string = yield select(
                selectors.sites.currentlySelectedSitePackageKey
            );
            const configurationEndpoint: string = yield select(
                (state: State) => state.env.configurationEndpoint
            );

            yield put(actions.prototypes.clear());
            yield put(actions.prototypes.setCurrentlyRendered(null));

            const configurationResponse = yield business.sagas.authenticated(
                buildUrl(configurationEndpoint, {
                    queryParams: {sitePackageKey}
                })
            );
            const parserResult = configurationSchema
                .safeParse(configurationResponse);

            if (parserResult.success) {
                const configuration = parserResult.data;

                yield put(actions.sites.set(configuration.ui.sitePackages));
                yield put(actions.breakpoints.set(configuration.ui.viewportPresets));
                yield put(actions.locales.set(configuration.ui.localePresets));
                yield put(actions.preview.set(configuration.ui.preview));

                if (!Array.isArray(configuration.styleguideObjects)) {
                    yield put(actions.prototypes.add(configuration.styleguideObjects));
                }

                const listOfPrototypes = (
                    yield select(prototypes.selectors.all)
                ) as ReturnType<typeof prototypes.selectors.all>;

                if (!listOfPrototypes || !Object.keys(listOfPrototypes).length) {
                    yield put(business.actions.errorTask(
                        '@sitegeist/monocle/bootstrap',
                        `The prototype list is empty. Please check the ` +
                        `Root.fusion file in your site package ` +
                        `"${sitePackageKey}" and make sure your components ` +
                        `are included correctly.`
                    ));
                    return;
                }

                const defaultPrototypeName = (
                    yield select(preview.selectors.defaultPrototypeName)
                ) as ReturnType<typeof preview.selectors.defaultPrototypeName>;
                const prototypeName = routePrototypeName
                    || defaultPrototypeName
                    || Object.keys(listOfPrototypes)[0];

                if (!prototypeName) {
                    yield put(business.actions.errorTask(
                        '@sitegeist/monocle/bootstrap',
                        `Could not determine default prototypeName. Please ` +
                        `make sure to have a defaultPrototypeName configured ` +
                        `for your site package.`
                    ));
                    return;
                }

                routePrototypeName = null;

                try {
                    yield put(prototypes.actions.select(prototypeName));
                } catch (err) {
                    yield put(business.actions.errorTask(
                        '@sitegeist/monocle/bootstrap',
                        `Could not select default Prototype: ${err.message}`
                    ));
                    return;
                }

            } else {
                throw new Error(parserResult.error.message);
            }
        });

        yield put(business.actions.finishTask('@sitegeist/monocle/bootstrap'));
        yield put(business.actions.finishTask('@sitegeist/monocle/switch-site'));
    }
}

export function* saga(): SagaIterator<void> {
    yield put(business.actions.addTask('@sitegeist/monocle/bootstrap'));

    document.title = 'Monocle: Loading...';

    const moduleUri: string = yield select(
        (state: State) => state.env.moduleUri
    );
    const routePath = window.location.pathname === moduleUri
        ? ''
        : moduleUri === '/'
            ? window.location.pathname.substring(1)
            : window.location.pathname.substring(moduleUri.length + 1);
    const [routeSitePackageKey] = routePath.split('/');

    const defaultSitePackageKey: string = yield select(
        (state: State) => state.env.defaultSitePackageKey
    );
    const sitePackageKey = routeSitePackageKey || defaultSitePackageKey;

    //
    // Fork subsequent sagas
    //
    yield fork(routing.sagas.updateHistoryWhenPrototypeChanges);
    yield fork(prototypes.sagas.reloadIframe);
    yield fork(prototypes.sagas.renderPrototypeOnSelect);

    yield fork(loadConfiguration);
    yield put(sites.actions.select(sitePackageKey));

    yield fork(routing.sagas.updateStateOnDirectRouting);
}
