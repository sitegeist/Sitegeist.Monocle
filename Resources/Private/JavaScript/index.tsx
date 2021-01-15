import * as React from "react";
import * as ReactDOM from "react-dom";

import { createEnv, createStore, createKeyBindings, createHistoryStateHandler } from "./bootstrap";
import { Styleguide } from "./containers";

const appContainer = document.getElementById('app');

if (appContainer) {
    const env = createEnv(appContainer);
    const store = createStore(env);

    createKeyBindings(store);
    createHistoryStateHandler(store);

    ReactDOM.render(
        <Styleguide store={store}/>,
        appContainer
    );
} else {
    throw new Error('Could not find appContainer.');
}
