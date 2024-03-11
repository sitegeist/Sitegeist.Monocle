import { produce } from "immer";
import { getType } from "typesafe-actions";

import { State, Action } from "..";

import * as actions from "./actions";

export function reducer(state: State, action: Action): State {
    return produce(state, draft => {
        switch (action.type) {
            case getType(actions.open): {
                draft.navigation.isOpen = true;
                draft.navigation.currentIndex = -1;
                break;
            }

            case getType(actions.close): {
                draft.navigation.isOpen = false;
                draft.navigation.currentIndex = -1;
                break;
            }

            case getType(actions.toggle): {
                draft.navigation.isOpen = !state.navigation.isOpen;
                draft.navigation.currentIndex = -1;
                break;
            }

            case getType(actions.search): {
                draft.navigation.searchTerm = action.payload;
                draft.navigation.currentIndex = -1;
                break;
            }

            case getType(actions.up): {
                const { currentIndex, isOpen } = state.navigation;

                if (currentIndex > 0 && isOpen) {
                    draft.navigation.currentIndex = currentIndex - 1;
                }

                break;
            }

            case getType(actions.down): {
                const { currentIndex, isOpen } = state.navigation;
                const numberOfPrototypes =
                    Object.keys(state.prototypes.byName).length;

                if (currentIndex < numberOfPrototypes - 1 && isOpen) {
                    draft.navigation.currentIndex = currentIndex + 1;
                }

                break;
            }

            default: break;
        }
    });
}
