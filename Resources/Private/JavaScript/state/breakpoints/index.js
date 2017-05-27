import {createAction} from 'redux-actions';
import {createSelector} from 'reselect';
import {$get, $set, $override} from 'plow-js';
import {select, put} from 'redux-saga/effects';

import {sagas as business} from '../business';

export const actions = {};

actions.set = createAction(
    '@sitegeist/monocle/breakpoints/set',
    listOfPrototypes => listOfPrototypes
);

actions.clear = createAction(
    '@sitegeist/monocle/breakpoints/clear'
);

actions.select = createAction(
    '@sitegeist/monocle/breakpoints/select',
    breakpointName => breakpointName
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.set.toString():
            return $override('breakpoints.byName', action.payload, state);

        case actions.clear.toString():
            return $set('breakpoints.byName', {}, state);

        case actions.select.toString():
            return $set('breakpoints.currentlySelected', action.payload, state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.all = $get('breakpoints.byName');

selectors.currentlySelected = createSelector(
    [
        $get('breakpoints.currentlySelected'),
        selectors.all
    ],
    (currentlySelectedBreakPoint, breakpointsByName) =>
        breakpointsByName && breakpointsByName[currentlySelectedBreakPoint]
);

export const sagas = {};

sagas.loadBreakpointsOnBootstrap = business.operation(function * () {
    const viewportPresetsEndpoint = yield select($get('env.viewportPresetsEndpoint'));
    const breakpoints = yield business.authenticated(viewportPresetsEndpoint);

    yield put(actions.set(breakpoints));
});
