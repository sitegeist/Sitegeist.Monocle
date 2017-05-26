import React, {PureComponent} from 'react';
import Button from '@neos-project/react-ui-components/lib/Button';

import style from './style.css';

export default class PrototypeSelector extends PureComponent {
    render() {
        return (
            <Button className={style.selector}>PROTOTYPESELECTOR</Button>
        );
    }
}
