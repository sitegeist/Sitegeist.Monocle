import { createSelector } from "reselect";

import { State } from "..";

export const all = (state: State) =>
    state.sites.byName
;

export const currentlySelectedSitePackageKey = createSelector(
    [
        (state: State) => state.sites.currentlySelected,
        (state: State) => state.env.defaultSitePackageKey
    ],
    (currentlySelectedSitePackageKey, defaultSitePackageKey) =>
        currentlySelectedSitePackageKey || defaultSitePackageKey
);

export const currentlySelected = createSelector(
    [
        currentlySelectedSitePackageKey,
        all
    ],
    (currentlySelectedSitePackageKey, sitesByName) =>
        sitesByName
        && currentlySelectedSitePackageKey
        && sitesByName[currentlySelectedSitePackageKey]
);
