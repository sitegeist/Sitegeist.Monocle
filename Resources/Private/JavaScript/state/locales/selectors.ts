import { createSelector } from "reselect";

import { State } from "..";

export const all = (state: State) => state.locales.byName;

export const currentlySelected = createSelector(
    [
        (state: State) => state.locales.currentlySelected,
        all
    ],
    (currentlySelectedLocale, localesByName) =>
        localesByName
        && currentlySelectedLocale
        && localesByName[currentlySelectedLocale]
);

export const current = createSelector(
    [
        (state: State) => state.locales.currentlySelected,
        all
    ],
    (currentlySelectedLocale, localesByName) => {
        if (localesByName && currentlySelectedLocale && localesByName[currentlySelectedLocale]) {
            const locale = localesByName[currentlySelectedLocale];
            if (locale && locale.fallback) {
                return locale.fallback.join(',');
            }
            return currentlySelectedLocale;
        }
        return '';
    }
);
