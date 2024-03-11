import * as React from "react";

import { BreakpointSelector } from './breakpoint-selector';
import { LocaleSelector } from './locale-selector';
import { PropsInspector } from './props-inspector';
import { ReloadTrigger } from './reload-trigger';
import { QrCodeTrigger } from './qrcode-trigger';
import { GridTrigger } from './grid-trigger';
import { FullscreenToggler } from './fullscreen-toggler';

import style from './style.module.css';

export function Toolbox() {
    return (
        <div className={style.toolbox}>
            <LocaleSelector/>
            <BreakpointSelector/>
            <PropsInspector/>
            <GridTrigger/>
            <ReloadTrigger/>
            <QrCodeTrigger/>
            <FullscreenToggler/>
        </div>
    );
}
