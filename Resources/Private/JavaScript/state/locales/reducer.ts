import produce from "immer";
import { getType } from "typesafe-actions";

import { State, Action } from "..";

import * as actions from "./actions";

export function reducer(state: State, action: Action): State {
    return produce(state, draft => {
        switch (action.type) {
            case getType(actions.set): {
                draft.locales.byName = action.payload;
                break;
            }

            case getType(actions.clear): {
                draft.locales.byName = {};
                break;
            }

            case getType(actions.select): {
                draft.locales.currentlySelected = action.payload;
                break;
            }

            default: break;
        }
    });
};
