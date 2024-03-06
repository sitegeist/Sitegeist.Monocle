import React, {PureComponent} from "react";
import {connect} from "react-redux";

import { Button, Icon } from "@neos-project/react-ui-components";

import { selectors, State } from "../../../../../state";

import { BreakpointList } from "./breakpoint-list";

import style from "./style.module.css";

interface BreakpointSelectorProps {
    label: string
}

interface BreakpointSelectorState {
    isOpen: boolean
}

class BreakpointSelectorC extends PureComponent<BreakpointSelectorProps, BreakpointSelectorState> {
    state: BreakpointSelectorState = {
        isOpen: false
    };

    toggleIsOpen = () => {
        this.setState(state => ({ isOpen: !state.isOpen }));
    };

    render() {
        const { label } = this.props;
        const { isOpen } = this.state;

        return (
            <div className={style.container}>
                <Button className={style.selector} onClick={this.toggleIsOpen} style="clean">
                    <Icon icon="desktop" className={style.icon}/>
                    {label}
                </Button>
                <BreakpointList isVisible={isOpen} onClickOutside={this.toggleIsOpen} onSelectBreakpoint={this.toggleIsOpen}/>
            </div>
        );
    }
}

export const BreakpointSelector = connect((state: State) => {
    const currentlySelectedBreakpoint = selectors.breakpoints.currentlySelected(state);

    return {
        label: currentlySelectedBreakpoint ? currentlySelectedBreakpoint.label : 'Fullscreen'
    };
})(BreakpointSelectorC);
