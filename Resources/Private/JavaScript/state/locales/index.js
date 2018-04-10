import {createAction} from 'redux-actions';
import {createSelector} from 'reselect';
import {$get, $set} from 'plow-js';
import {select, put} from 'redux-saga/effects';
import {selectors as sites} from '../sites';
import url from 'build-url';

import {sagas as business} from '../business';

export const actions = {};

actions.set = createAction(
    '@sitegeist/monocle/locales/set',
    listOfLocales => listOfLocales
);

actions.clear = createAction(
    '@sitegeist/monocle/locales/clear'
);

actions.select = createAction(
    '@sitegeist/monocle/locales/select',
    localeName => localeName
);

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.set.toString():
            return $set('locales.byName', action.payload, state);

        case actions.clear.toString():
            return $set('locales.byName', {}, state);

        case actions.select.toString():
            return $set('locales.currentlySelected', action.payload, state);

        default:
            return state;
    }
};

export const selectors = {};

selectors.all = $get('locales.byName');

selectors.currentlySelected = createSelector(
    [
        $get('locales.currentlySelected'),
        selectors.all
    ],
    (currentlySelectedLocale, localesByName) =>
        localesByName && localesByName[currentlySelectedLocale]
);

selectors.current = createSelector(
    [
        $get('locales.currentlySelected'),
        selectors.all
    ],
    (currentlySelectedLocale, localesByName) => {
        if (localesByName && localesByName[currentlySelectedLocale]) {
            const locale = localesByName[currentlySelectedLocale];
            if (locale && locale.fallback) {
                return locale.fallback.join(',');
            }
            return currentlySelectedLocale;
        }
        return '';
    }
);

export const sagas = {};

sagas.load = business.operation(function * () {
    const localePresetsEndpoint = yield select($get('env.localePresetsEndpoint'));
    const sitePackageKey = yield select(sites.currentlySelectedSitePackageKey);
    const localePresets = yield business.authenticated(
        url(localePresetsEndpoint, {
            queryParams: {sitePackageKey}
        })
    );

    yield put(actions.set(localePresets));
});
