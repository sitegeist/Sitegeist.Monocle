import produce from "immer";
import { getType } from "typesafe-actions";

import { State, Action } from "..";

import * as actions from "./actions";

export function reducer(state: State, action: Action): State {
    return produce(state, draft => {
        switch (action.type) {
            case getType(actions.toggle): {
                draft.propsInspector.isOpen = !state.propsInspector.isOpen;
                break;
            }

            default: break;
        }
    });
};
