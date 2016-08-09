import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Toolbar, App, PreviewSection } from './Containers/index';

import store, {redux} from './Redux/index';

const initialize = () => {
	const appContainer = document.getElementById('app');

	fetch(appContainer.dataset.endpoint, {
		method: 'POST'
	})
	.then(response => response.json())
	.then(json => console.log(json));

    // add the available breakpoints to the current state
    fetch(appContainer.dataset.breakpoint_endpoint, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(json => (store.dispatch(redux.ViewportOptions.actions.setAvailablePresets(json))));

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
