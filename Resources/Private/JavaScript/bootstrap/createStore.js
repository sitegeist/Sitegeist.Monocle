import {createStore, compose, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import immutable from 'seamless-immutable';

import {reducer, sagas} from '../state';

export default env => {
    const initialState = {
        env,
        sites: {},
        breakpoints: {},
        prototypes: {}
    };
    const storeEnhancers = [];

    // saga middleqware
    const sagaMiddleware = createSagaMiddleware();
    storeEnhancers.push(applyMiddleware(sagaMiddleware));

    // dev tools extension
    if (window.devToolsExtension) {
        storeEnhancers.push(window.devToolsExtension());
    }

    // create store
    const store = createStore(
        reducer,
        immutable(initialState),
        compose(...storeEnhancers)
    );

    // run sagas
    sagas.forEach(sagaMiddleware.run);

    return store;
};
