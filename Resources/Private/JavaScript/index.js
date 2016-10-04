import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, compose, combineReducers, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga'
import Immutable from 'seamless-immutable';

import {Toolbar, App, PreviewSection } from './Containers/index';

import {redux, reducer, initialState} from './Redux/index';
import rootSaga from './Sagas/index'

const createEnhancedReduxStore = () => {
    const storeEnhancers = [];

    // saga middleqware
    const sagaMiddleware = createSagaMiddleware();
    storeEnhancers.push(applyMiddleware(sagaMiddleware));

    // dev tools extension
    if (window.devToolsExtension){
        storeEnhancers.push( window.devToolsExtension() );
    }

    // create store
    const store = createStore(
        reducer,
        Immutable(initialState),
        compose(...storeEnhancers)
    );

    // run saga
    sagaMiddleware.run(rootSaga);
    return store;
}

const initialize = () => {
    // create store
    const store = createEnhancedReduxStore();

    // init app
	const appContainer = document.getElementById('app');

    // set defaults from data
    store.dispatch(redux.Styleguide.actions.setRenderPrototypesEndpoint(appContainer.dataset.renderPrototypesEndpoint));
    store.dispatch(redux.Styleguide.actions.setIframeUri(appContainer.dataset.iframeUri));
    store.dispatch(redux.Styleguide.actions.setPreviewUri(appContainer.dataset.previewUri));
    store.dispatch(redux.Styleguide.actions.setFullscreenUri(appContainer.dataset.fullscreenUri));

	fetch(appContainer.dataset.prototypesEndpoint, {
		method: 'POST',
        credentials: 'same-origin'
	})
        .then(response => response.json())
        .then(json => (store.dispatch(redux.Styleguide.actions.setPrototypes(json))));

    // fetch the available sites
    fetch(appContainer.dataset.resourcesEndpoint, {
        method: 'POST',
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(json => (store.dispatch(redux.Styleguide.actions.setResources(json))));

    // fetch the available breakpoints to the current state
    fetch(appContainer.dataset.viewportPresetsEndpoint, {
        method: 'POST',
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(json => (store.dispatch(redux.ViewportOptions.actions.setAvailablePresets(json))));

    // fetch the available sites
    fetch(appContainer.dataset.sitesEndpoint, {
        method: 'POST',
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(json => (store.dispatch(redux.SiteOptions.actions.setAvailableSites(json))));

    // dispatch boot event
    store.dispatch(redux.actions.boot(appContainer.dataset));

	ReactDOM.render(
		<div>
			<Provider store={store}>
                <App>
				    <Toolbar />
                    <PreviewSection />
                </App>
			</Provider>
		</div>,
		appContainer
	);
};

setTimeout(initialize, 0);
