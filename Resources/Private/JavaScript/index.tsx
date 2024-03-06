import * as React from "react";
import * as ReactDOM from "react-dom";

import { createEnv, createStore, createKeyBindings, createHistoryStateHandler } from "./bootstrap";
import { Styleguide } from "./containers";

import "./root.css";

import { IconPrefix, config, library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false; // Dont insert the supporting CSS into the <head> of the HTML document
config.familyPrefix = "neos-fa" as IconPrefix;
config.replacementClass = "neos-svg-inline--fa";

library.add(fab as any, fas as any, far as any);

const appContainer = document.getElementById("app");

if (appContainer) {
    const env = createEnv(appContainer);
    const store = createStore(env);

    createKeyBindings(store);
    createHistoryStateHandler(store);

    ReactDOM.render(<Styleguide store={store} />, appContainer);
} else {
    throw new Error("Could not find appContainer.");
}
