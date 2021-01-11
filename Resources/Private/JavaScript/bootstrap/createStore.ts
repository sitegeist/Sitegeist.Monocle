import { createStore as createReduxStore, compose, applyMiddleware } from "redux";
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
    // Dev tools extension
    //
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
        // @ts-ignore
        storeEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
    }

    //
    // Create store
    //
    const store = createReduxStore(
        reducer,
        initialState,
        compose(...storeEnhancers)
    );

    //
    // Run root saga
    //
    sagaMiddleware.run(saga);

    return store;
};

export type Store = ReturnType<typeof createStore>;
