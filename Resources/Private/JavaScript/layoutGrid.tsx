import * as React from "react";
import * as ReactDOM from "react-dom";
import { Grid } from "./grid";

class MonocleLayoutGrid extends HTMLElement {

    target: HTMLDivElement = document.createElement('div');

    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'closed'});

        shadow.appendChild(this.target);
    }

    render() {
        ReactDOM.render(
            <Grid
                label={this.getAttribute("label") ?? ''}
                mediaQuery={this.getAttribute("mediaQuery") ?? ''}
                gap={this.getAttribute("gap") ?? ''}
                gutter={this.getAttribute("gutter") ?? ''}
                columns={parseInt(this.getAttribute("columns") ?? '', 10) ?? 12}
                width={this.getAttribute("width") ?? '100%'}
                maxWidth={this.getAttribute("maxWidth") ?? '100%'}
                margin={this.getAttribute("margin") ?? '0 auto'}
                />,
            this.target
        );
    }

    connectedCallback() {
        this.style.width = "100%";
        this.style.height = "100%";
        this.style.position = "fixed";
        this.style.zIndex = "99999";

        this.target.style.width = "100%";
        this.target.style.height = "100%";

        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    static get observedAttributes() { return ['label', 'mediaQuery', 'gap', 'gutter', 'columns', 'width', 'maxWidth', 'margin'];}

}

customElements.define('monocle-layout-grid', MonocleLayoutGrid);
