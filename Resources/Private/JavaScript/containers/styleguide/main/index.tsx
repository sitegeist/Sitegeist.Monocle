import * as React from "react";

import { PreviewFrame } from "./preview-frame";

import style from "./style.module.css";

export function Main() {
    return (
        <section className={style.main}>
            <PreviewFrame/>
        </section>
    );
}
