import {createAction} from 'redux-actions';
import {createSelector} from 'reselect';
import {$get, $set} from 'plow-js';
import {selectors as sites} from '../sites';
import url from 'build-url';

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
