import {createStore} from 'redux';
import Immutable from 'seamless-immutable';

import DisplayOptions from './DisplayOptions/index';

const initialState = {
	displayOptions: {
		renderedElements: true,
		sourceCode: false,
		description: false,
		fullscreen: false
	}
};

export default createStore(DisplayOptions.reducer, Immutable(initialState));

export const redux = {
	DisplayOptions
};
