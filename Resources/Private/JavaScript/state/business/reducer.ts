import { produce } from "immer";
import { getType } from "typesafe-actions";

import { State, Action } from "..";

import * as actions from "./actions";

export function reducer(state: State, action: Action): State {
    return produce(state, draft => {
        switch (action.type) {
            case getType(actions.addTask): {
                draft.business.tasks[action.payload] = {};
                break;
            }

            case getType(actions.errorTask): {
                draft.business.errors[action.payload.taskName] = action.payload.reason;
                break;
            }

            case getType(actions.finishTask): {
                delete draft.business.tasks[action.payload];
                break;
            }

            case getType(actions.commenceAuthorization): {
                draft.business.needsAuthentication = true;
                break;
            }

            case getType(actions.authorize): {
                draft.business.needsAuthentication = false;
                break;
            }

            default: break;
        }
    });
}
