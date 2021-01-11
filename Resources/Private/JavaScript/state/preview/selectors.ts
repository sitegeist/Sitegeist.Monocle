import { State } from "..";

export const sourceQuerySelector = (state: State) =>
    'sourceQuerySelector' in state.preview
        ? state.preview.sourceQuerySelector
        : null
;

export const defaultPrototypeName = (state: State) =>
    'defaultPrototypeName' in state.preview
        ? state.preview.defaultPrototypeName
        : null
;
