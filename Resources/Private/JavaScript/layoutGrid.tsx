import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid } from "./containers";

class MonocleLayoutGrid extends HTMLElement {

    target: HTMLDivElement = document.createElement('div');

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'closed'});
        shadow.appendChild(this.target);
    }

    connectedCallback() {
        const configuration : any = JSON.parse(this.getAttribute("configuration") ?? '');
        ReactDOM.render(
            <Grid grids={configuration} />,
            this.target
        );
    }
}

customElements.define('monocle-layout-grid', MonocleLayoutGrid);
