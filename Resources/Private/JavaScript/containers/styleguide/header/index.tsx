import * as React from "react";

import { Bar } from "@neos-project/react-ui-components";

import { PrototypeSelector } from "./prototype-selector";
import { SiteSelector } from "./site-selector";
import { Toolbox } from "./toolbox";

import style from "./style.module.css";

export function Header() {
    return (
        <header className={style.header}>
            <Bar position="top" className={style.bar}>
                <div className={style.section}>
                    <SiteSelector/>
                </div>
                <div className={style.section}>
                    <PrototypeSelector/>
                </div>
                <div className={style.section}>
                    <Toolbox/>
                </div>
            </Bar>
        </header>
    );
}
