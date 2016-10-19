import {combineReducers} from 'redux';
import {createAction} from 'redux-actions';

import ViewportOptions from './ViewportOptions/index';
import SiteOptions from './SiteOptions/index';
import Styleguide from './Styleguide/index';

const BOOT = '@sitegeist/monocle-ui/Styleguide/BOOT';

const actionTypes =  {
    BOOT
};

const boot = createAction(BOOT, payload => payload);

const actions = {
    boot
};

export const initialState = {
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
        prototypes: {},
        resources: {}
    }
};

export const reducer = combineReducers({
    viewportOptions: ViewportOptions.reducer,
    siteOptions: SiteOptions.reducer,
    styleguide: Styleguide.reducer
});

export const redux = {
    ViewportOptions,
    SiteOptions,
    Styleguide,
    actionTypes,
    actions
};
