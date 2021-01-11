import { createSelector } from "reselect";

import { State } from "..";

export const isBusy = createSelector(
    [
        (state: State) => state.business.tasks
    ],
    tasks => Object.keys(tasks).length > 0
);

export const needsAuthentication = (state: State) =>
    state.business.needsAuthentication;
