import {createStore, compose, combineReducers, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga'

import Immutable from 'seamless-immutable';

import ViewportOptions from './ViewportOptions/index';
import SiteOptions from './SiteOptions/index';
import Styleguide from './Styleguide/index';

import rootSaga from '../Sagas/index'

const initialState = {
    siteOptions: {
        activeSite: null,
        availableSites: {}
    },
    viewportOptions: {
        activePreset: null,
        availablePresets: {},
        width: null,
    },
    styleguide: {
        path: '',
        renderPrototypesEndpoint: null,
        prototypes: [],
        resources: {}
    }
};

const reducer = combineReducers({
    viewportOptions: ViewportOptions.reducer,
    siteOptions: SiteOptions.reducer,
    styleguide: Styleguide.reducer
});

export const redux = {
    ViewportOptions,
    SiteOptions,
    Styleguide
};

export default (function(){

    const storeEnhancers = [];

    const sagaMiddleware = createSagaMiddleware();
    storeEnhancers.push(applyMiddleware(sagaMiddleware));

    if (window.devToolsExtension){
        storeEnhancers.push( window.devToolsExtension() );
    }

    const store = createStore(
        reducer,
        Immutable(initialState),
        compose(...storeEnhancers)
    );

    sagaMiddleware.run(rootSaga);

    return store;
}());
