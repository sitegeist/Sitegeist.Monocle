import * as React from "react";

import { PreviewFrame } from "./preview-frame";
import { InfoTabs } from "./info-tabs";

import style from "./style.module.css";

export function Main() {
    return (
        <section className={style.main}>
            <PreviewFrame/>
            <InfoTabs/>
        </section>
    );
}
