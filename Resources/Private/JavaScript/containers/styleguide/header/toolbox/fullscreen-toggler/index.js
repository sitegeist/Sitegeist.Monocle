import React, {PureComponent} from 'react';
import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import style from './style.css';

export default class FullscreenToggler extends PureComponent {
    render() {
        return (
            <Button className={style.selector}>
                <Icon icon="external-link" className={style.icon}/>
            </Button>
        );
    }
}
