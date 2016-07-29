import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {Navigation, Toolbar} from './Containers/index';

import store, {redux} from './Redux/index';

const initialize = () => {
	const appContainer = document.getElementById('app');

	fetch(appContainer.dataset.endpoint, {
		method: 'POST'
	})
	.then(response => response.json())
	.then(json => console.log(json));

	ReactDOM.render(
		<Provider store={store}>
			<div>
				<Navigation />
				<Toolbar />
			</div>
		</Provider>,
		appContainer
	);
};

setTimeout(initialize, 0);
