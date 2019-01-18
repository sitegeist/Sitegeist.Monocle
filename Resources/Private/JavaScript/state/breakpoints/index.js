import {createAction} from 'redux-actions';
import {createSelector} from 'reselect';
import {$get, $set} from 'plow-js';

export const actions = {};

actions.set = createAction(
    '@sitegeist/monocle/breakpoints/set',
    listOfBreakpoints => listOfBreakpoints
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
            return $set('breakpoints.byName', action.payload, state);

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
