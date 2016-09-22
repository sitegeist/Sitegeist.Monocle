import {createStore, compose, combineReducers} from 'redux';
import Immutable from 'seamless-immutable';

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
    styleguide: {
        path: '',
        renderPrototypesEndpoint: null,
        prototypes: [],
        resources: {}
    }
};

const reducer = combineReducers({
    viewportOptions: ViewportOptions.reducer,
    siteOptions: SiteOptions.reducer,
    styleguide: Styleguide.reducer
});

export default createStore(
    reducer,
    Immutable(initialState),
    window.devToolsExtension ? window.devToolsExtension() : undefined
);

export const redux = {
    ViewportOptions,
    SiteOptions,
    Styleguide
};
