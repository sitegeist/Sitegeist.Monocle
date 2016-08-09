import {createStore, compose, combineReducers} from 'redux';
import Immutable from 'seamless-immutable';

import DisplayOptions from './DisplayOptions/index';
import ViewportOptions from './ViewportOptions/index';

const initialState = {
    // sites: {
    //     active: null,
    //     available: []
    // },
    viewportOptions: {
        activePreset: null,
        availablePresets: {},
        width: null,
    },
    displayOptions: {
        renderedElements: true,
        sourceCode: false,
        description: false,
        fullscreen: false
    }
    // ,
    // styleguide: {
    //     path: null,
    //     prototypes: []
    // }
};

// const reducer = (state, action) => [
//     ViewportOptions.reducer,
//     DisplayOptions.reducer
// ].reduce((state, reducer) => reducer(state, action), state);

const reducer = combineReducers({
    viewportOptions: ViewportOptions.reducer,
    displayOptions: DisplayOptions.reducer
});

export default createStore(
    reducer,
    Immutable(initialState),
    window.devToolsExtension ?  window.devToolsExtension() : undefined
);

export const redux = {
    DisplayOptions,
    ViewportOptions
};
