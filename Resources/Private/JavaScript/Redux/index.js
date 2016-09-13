import {createStore, compose, combineReducers} from 'redux';
import Immutable from 'seamless-immutable';

import DisplayOptions from './DisplayOptions/index';
import ViewportOptions from './ViewportOptions/index';
import SiteOptions from './SiteOptions/index';
import Styleguide from './Styleguide/index';

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
    displayOptions: {
        renderedElements: true,
        sourceCode: false,
        description: true
    },
    styleguide: {
        path: 'atoms',
        renderPrototypesEndpoint: null,
        prototypes: [],
        resources: {}
    }
};

// const reducer = (state, action) => [
//     ViewportOptions.reducer,
//     DisplayOptions.reducer
// ].reduce((state, reducer) => reducer(state, action), state);

const reducer = combineReducers({
    viewportOptions: ViewportOptions.reducer,
    displayOptions: DisplayOptions.reducer,
    siteOptions: SiteOptions.reducer,
    styleguide: Styleguide.reducer
});

export default createStore(
    reducer,
    Immutable(initialState),
    window.devToolsExtension ? window.devToolsExtension() : undefined
);

export const redux = {
    DisplayOptions,
    ViewportOptions,
    SiteOptions,
    Styleguide
};
