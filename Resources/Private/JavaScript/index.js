import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Toolbar, App, PreviewSection } from './Containers/index';

import store, {redux} from './Redux/index';

const initialize = () => {
	const appContainer = document.getElementById('app');

    // set defaults from data
    store.dispatch(redux.Styleguide.actions.setRenderPrototypesEndpoint(appContainer.dataset.renderPrototypesEndpoint));
    store.dispatch(redux.Styleguide.actions.setIframeUri(appContainer.dataset.iframeUri));
    store.dispatch(redux.Styleguide.actions.setPreviewUri(appContainer.dataset.previewUri));
    store.dispatch(redux.Styleguide.actions.setFullscreenUri(appContainer.dataset.fullscreenUri));
    store.dispatch(redux.Styleguide.actions.setPath((window.location.hash && window.location.hash !== '#') ? window.location.hash.substring(1) : appContainer.dataset.defaultPath));

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
