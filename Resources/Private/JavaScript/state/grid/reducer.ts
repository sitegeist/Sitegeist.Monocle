import { produce } from "immer";
import { getType } from "typesafe-actions";

import { State, Action } from "..";

import * as actions from "./actions";

export function reducer(state: State, action: Action): State {
    return produce(state, draft => {
        switch (action.type) {
            case getType(actions.show): {
                draft.gridPreview.isVisible = true;
                break;
            }

            case getType(actions.hide): {
                draft.gridPreview.isVisible = false;
                break;
            }

            case getType(actions.toggle):  {
                draft.gridPreview.isVisible = !state.gridPreview.isVisible;
                break;
            }

            default: break;
        }
    });
}
