import { createSelector } from "reselect";

import { State } from "..";

export const all = (state: State) => state.breakpoints.byName;

export const currentlySelected = createSelector(
    [
        (state: State) => state.breakpoints.currentlySelected,
        all
    ],
    (currentlySelectedBreakPoint, breakpointsByName) =>
        breakpointsByName && breakpointsByName[currentlySelectedBreakPoint]
);
