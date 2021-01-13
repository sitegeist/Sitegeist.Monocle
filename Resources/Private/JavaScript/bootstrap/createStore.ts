import { createStore as createReduxStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import createSagaMiddleware from "redux-saga";


import { reducer, saga, State } from "../state";

import { Environment } from "./createEnv";

export function createStore(env: Environment) {
    const initialState: State = {
        env,
        business: {
            tasks: {},
            errors: {},
            needsAuthentication: false
        },
        sites: {
            byName: {},
            currentlySelected: null
        },
        breakpoints: {
            byName: {},
            currentlySelected: null
        },
        prototypes: {
            byName: {},
            overriddenProps: {},
            currentHtml: '',
            currentlyRendered: null,
            currentlySelected: null,
            selectedPropSet: null
        },
        navigation: {
            currentIndex: -1,
            isOpen: false,
            searchTerm: ''
        },
        propsInspector: {
            isOpen: false
        },
        qrCode: {
            isVisible: false
        },
        hotkeys: {},
        locales: {
            byName: {},
            currentlySelected: null
        },
        preview: {}
    };
    const storeEnhancers = [];

    //
    // Saga middleqware
    //
    const sagaMiddleware = createSagaMiddleware();
    storeEnhancers.push(applyMiddleware(sagaMiddleware));

    //
    // Create store
    //
    const store = createReduxStore(
        reducer,
        initialState,
        composeWithDevTools(...storeEnhancers)
    );

    //
    // Run root saga
    //
    sagaMiddleware.run(saga);

    return store;
}

export type Store = ReturnType<typeof createStore>;
