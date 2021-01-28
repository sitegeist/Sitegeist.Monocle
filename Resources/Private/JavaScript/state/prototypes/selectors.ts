import { createSelector } from "reselect";

import { State } from "..";

export const all = (state: State) =>
    state.prototypes.byName
;

export const byId = (state: State, prototypeName: string) =>
    state.prototypes.byName[prototypeName]
;

export const currentlyRendered = (state: State) =>
    state.prototypes.currentlyRendered
;

export const currentHtml =  (state: State) =>
    state.prototypes.currentHtml
;

export const overriddenProps = (state: State) =>
    state.prototypes.overriddenProps
;

export const currentlySelected = createSelector(
    [
        (state: State) => state.prototypes.currentlySelected,
        all
    ],
    (currentlySelectedPrototypeName, prototypesByName) =>
        prototypesByName
        && currentlySelectedPrototypeName
        && prototypesByName[currentlySelectedPrototypeName]
);

export const selectedPropSet = createSelector(
    [
        (state: State) => state.prototypes.selectedPropSet,
        currentlyRendered
    ],
    (propSetName, prototypeDetails) => prototypeDetails?.propSets.find(
        propSet => propSet.name === propSetName
    ) ?? { name: '__default', overrides: {} }
);
