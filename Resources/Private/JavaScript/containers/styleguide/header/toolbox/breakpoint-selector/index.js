import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import {withToggableState} from 'components';
import {selectors} from 'state';

import BreakpointList from './breakpoint-list';

import style from './style.css';

@withToggableState('isOpen')
@connect(state => {
    const currentlySelectedBreakpoint = selectors.breakpoints.currentlySelected(state);

    return {
        label: currentlySelectedBreakpoint ? currentlySelectedBreakpoint.label : 'Fullscreen'
    };
})
export default class BreakpointSelector extends PureComponent {
    render() {
        const {label, isOpen, toggleIsOpen} = this.props;

        return (
            <div className={style.container}>
                <Button className={style.selector} onClick={toggleIsOpen} style="clean">
                    <Icon icon="desktop" className={style.icon}/>
                    {label}
                </Button>
                <BreakpointList isVisible={isOpen} onClickOutside={toggleIsOpen} onSelectBreakpoint={toggleIsOpen}/>
            </div>
        );
    }
}
