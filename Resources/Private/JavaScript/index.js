import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Toolbar, App, PreviewSection } from './Containers/index';

import store, {redux} from './Redux/index';

const initialize = () => {
	const appContainer = document.getElementById('app');

    store.dispatch(redux.Styleguide.actions.setRenderPrototypesEndpoint(appContainer.dataset.renderPrototypesEndpoint));

	fetch(appContainer.dataset.prototypesEndpoint, {
		method: 'POST'
	})
	.then(response => response.json())
	.then(json => (store.dispatch(redux.Styleguide.actions.setPrototypes(json))));

    // fetch the available breakpoints to the current state
    fetch(appContainer.dataset.viewportPresetsEndpoint, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(json => (store.dispatch(redux.ViewportOptions.actions.setAvailablePresets(json))));

    // fetch the available sites
    fetch(appContainer.dataset.sitesEndpoint, {
        method: 'POST'
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
