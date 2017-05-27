import React, {PureComponent} from 'react';
import Button from '@neos-project/react-ui-components/lib/Button';

import {withToggableState} from 'components';

import PrototypeList from './prototype-list';

import style from './style.css';

@withToggableState('isOpen')
export default class PrototypeSelector extends PureComponent {
    render() {
        const {isOpen, toggleIsOpen} = this.props;

        return (
            <div className={style.container}>
                <Button className={style.selector} onClick={toggleIsOpen}>PROTOTYPESELECTOR</Button>
                <PrototypeList isVisible={isOpen} onClickOutside={toggleIsOpen}/>
            </div>
        );
    }
}
