import React, {PureComponent} from 'react';
import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import style from './style.css';

export default class BreakpointSelector extends PureComponent {
    render() {
        return (
            <Button className={style.selector}>
                <Icon icon="desktop" className={style.icon}/>
                BREAKPOINTSELECTOR
            </Button>
        );
    }
}
