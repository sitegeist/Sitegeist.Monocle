import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {Toolbar} from './Containers/index';

import store, {redux} from './Redux/index';

const initialize = () => {
	const appContainer = document.getElementById('app');

	ReactDOM.render(
		<div>
			<Provider store={store}>
				<Toolbar />
			</Provider>
		</div>,
		appContainer
	);
};

setTimeout(initialize, 0);
