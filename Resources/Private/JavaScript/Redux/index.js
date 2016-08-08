import {createStore, compose} from 'redux';
import Immutable from 'seamless-immutable';

import DisplayOptions from './DisplayOptions/index';
import Breakpoints from './Breakpoints/index';

const initialState = {
    sites: {
        active: null,
        available: []
    },
    breakpoints: {
        active: null,
        available: []
    },
    displayOptions: {
        renderedElements: true,
        sourceCode: false,
        description: false,
        fullscreen: false
    },
    styleguide: {
        path: null,
        prototypes: []
    }
};

const reducer = (state, action) => [
    DisplayOptions.reducer,
    Breakpoints.reducer
].reduce((state, reducer) => reducer(state, action), state);

export default createStore(
    reducer,
    Immutable(initialState)
    //window.devToolsExtension ?  window.devToolsExtension : undefined
);

export const redux = {
    DisplayOptions,
    Breakpoints
};
