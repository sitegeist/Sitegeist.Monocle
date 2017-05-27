import React, {PureComponent} from 'react';

import BreakpointSelector from './breakpoint-selector';
import ReloadTrigger from './reload-trigger';
import FullscreenToggler from './fullscreen-toggler';

import style from './style.css';

export default class Toolbox extends PureComponent {
    render() {
        return (
            <div className={style.toolbox}>
                <BreakpointSelector/>
                <ReloadTrigger/>
                <FullscreenToggler/>
            </div>
        );
    }
}
