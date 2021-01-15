import { actions } from "../state";

import { Store } from "./createStore";

export function createHistoryStateHandler(store: Store) {
    window.onpopstate = (event: PopStateEvent) => {
        const {sitePackageKey, prototypeName} = event.state;

        store.dispatch(actions.routing.route(sitePackageKey, prototypeName));
    };
}
