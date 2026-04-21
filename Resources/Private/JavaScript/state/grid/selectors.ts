import { State } from "..";

export const isVisible = (state: State) =>
    state.gridPreview.isVisible
;

export const gridsByName = (state: State) =>
    state.gridPreview.grids
;
