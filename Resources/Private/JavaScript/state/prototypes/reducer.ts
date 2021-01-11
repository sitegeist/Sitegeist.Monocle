import produce from "immer";
import { getType } from "typesafe-actions";

import { State, Action } from "..";

import * as actions from "./actions";

export function reducer(state: State, action: Action): State {
    return produce(state, draft => {
        switch (action.type) {
            case getType(actions.add): {
                draft.prototypes.byName = {
                    ...state.prototypes.byName,
                    ...action.payload
                };
                break;
            }

            case getType(actions.clear): {
                draft.prototypes.byName = {};
                draft.prototypes.overriddenProps = {};
                draft.prototypes.selectedPropSet = '';
                break;
            }

            case getType(actions.select): {
                if (!state.prototypes.byName[action.payload]) {
                    throw new Error(
                        `Prototype "${action.payload}" does not exists and ` +
                        `cannot be selected.`
                    );
                }

                draft.prototypes.currentlySelected = action.payload;
                draft.prototypes.overriddenProps = {};
                draft.prototypes.selectedPropSet = '';
                break;
            }

            case getType(actions.setCurrentlyRendered): {
                draft.prototypes.currentlyRendered = action.payload;
                break;
            }

            case getType(actions.setCurrentlyRenderedPrototypeName): {
                draft.prototypes.currentlyRendered.prototypeName =
                    action.payload;
                draft.prototypes.currentlyRendered.renderedCode = '';
                draft.prototypes.currentlyRendered.parsedCode = '';
                draft.prototypes.currentlyRendered.anatomy = [];
                break;
            }

            case getType(actions.setCurrentHtml): {
                draft.prototypes.currentHtml = action.payload;
                break;
            }

            case getType(actions.overrideProp): {
                draft.prototypes.overriddenProps[action.payload.name] =
                    action.payload.value;
                break;
            }

            case getType(actions.selectPropSet): {
                draft.prototypes.selectedPropSet = action.payload;
                break;
            }

            default: break;
        }
    });
};
