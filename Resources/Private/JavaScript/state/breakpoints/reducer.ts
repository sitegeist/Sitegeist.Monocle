import { produce } from "immer";
import { getType } from "typesafe-actions";

import { State, Action } from "..";

import * as actions from "./actions";

export function reducer(state: State, action: Action): State {
    return produce(state, draft => {
        switch (action.type) {
            case getType(actions.set): {
                for (const [
                    viewportPresetName,
                    viewportPresetOrNull
                ] of Object.entries(action.payload)) {
                    if (viewportPresetOrNull !== null) {
                        draft.breakpoints.byName[viewportPresetName] =
                            viewportPresetOrNull;
                    }
                }
                break;
            }

            case getType(actions.clear): {
                draft.breakpoints.byName = {};
                break;
            }

            case getType(actions.select):  {
                draft.breakpoints.currentlySelected = action.payload;
                break;
            }

            default: break;
        }
    });
}
