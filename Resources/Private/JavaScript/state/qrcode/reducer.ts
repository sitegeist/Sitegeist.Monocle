import produce from "immer";
import { getType } from "typesafe-actions";

import { State, Action } from "..";

import * as actions from "./actions";

export function reducer(state: State, action: Action): State {
    return produce(state, draft => {
        switch (action.type) {
            case getType(actions.show): {
                draft.qrCode.isVisible = true;
                break;
            }

            case getType(actions.hide): {
                draft.qrCode.isVisible = false;
                break;
            }

            case getType(actions.toggle):  {
                draft.qrCode.isVisible = !state.qrCode.isVisible;
                break;
            }

            default: break;
        }
    });
}
