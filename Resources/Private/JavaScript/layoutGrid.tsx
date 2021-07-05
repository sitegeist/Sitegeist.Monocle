import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid } from "./containers";

class MonocleLayoutGrid extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        ReactDOM.render(
            <Grid />,
            this
        );
    }
}

customElements.define('monocle-layout-grid', MonocleLayoutGrid);
