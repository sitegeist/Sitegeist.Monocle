import {createAction} from 'redux-actions';
import {createSelector} from 'reselect';
import {$get, $set, $override} from 'plow-js';

export const actions = {};

actions.initialized = createAction(
    '@sitegeist/monocle/sites/initialized'
);

actions.set = createAction(
    '@sitegeist/monocle/sites/set',
    listOfSites => listOfSites
);

actions.clear = createAction(
    '@sitegeist/monocle/sites/clear'
);

actions.select = createAction(
    '@sitegeist/monocle/sites/select',
    siteName => siteName
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.set.toString():
            return $override('sites.byName', action.payload, state);

        case actions.clear.toString():
            return $set('sites.byName', {}, state);

        case actions.select.toString():
            return $set('sites.currentlySelected', action.payload, state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.all = $get('sites.byName');

selectors.currentlySelectedSitePackageKey = createSelector(
    [
        $get('sites.currentlySelected'),
        $get('env.defaultSitePackageKey')
    ],
    (currentlySelectedSitePackageKey, defaultSitePackageKey) =>
        currentlySelectedSitePackageKey || defaultSitePackageKey
);

selectors.currentlySelected = createSelector(
    [
        selectors.currentlySelectedSitePackageKey,
        selectors.all
    ],
    (currentlySelectedSitePackageKey, sitesByName) =>
        sitesByName && sitesByName[currentlySelectedSitePackageKey]
);
