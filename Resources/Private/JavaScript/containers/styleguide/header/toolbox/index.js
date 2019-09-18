import React, {PureComponent} from 'react';

import BreakpointSelector from './breakpoint-selector';
import LocaleSelector from './locale-selector';
import PropsInspector from './props-inspector';
import ReloadTrigger from './reload-trigger';
import QrCodeTrigger from './qrcode-trigger';
import FullscreenToggler from './fullscreen-toggler';
import GridToggler from './grid-toggler';

import style from './style.css';

export default class Toolbox extends PureComponent {
    render() {
        return (
	<div className={style.toolbox}>
		<LocaleSelector/>
        <BreakpointSelector/>
        <GridToggler/>
        <PropsInspector/>
		<ReloadTrigger/>
		<QrCodeTrigger/>
		<FullscreenToggler/>
	</div>
        );
    }
}
