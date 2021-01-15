import { ActionType } from "typesafe-actions";

import * as actions from "./actions";

export { actions };
export type Action = ActionType<typeof actions>;

export { reducer } from "./reducer";
export * as selectors from "./selectors";
