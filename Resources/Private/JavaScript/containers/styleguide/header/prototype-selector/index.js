import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import Button from '@neos-project/react-ui-components/lib/Button';

import {withToggableState} from 'components';
import {selectors} from 'state';

import PrototypeList from './prototype-list';

import style from './style.css';

@withToggableState('isOpen')
@connect(state => {
    const currentlySelectedPrototype = selectors.prototypes.currentlySelected(state);

    return {
        label: currentlySelectedPrototype ? currentlySelectedPrototype.title : '---'
    };
})
export default class PrototypeSelector extends PureComponent {
    render() {
        const {isOpen, label, toggleIsOpen} = this.props;

        return (
            <div className={style.container}>
                <Button className={style.selector} onClick={toggleIsOpen} style="clean">{label}</Button>
                <PrototypeList isVisible={isOpen} onClickOutside={toggleIsOpen} onSelectPrototype={toggleIsOpen}/>
            </div>
        );
    }
}
