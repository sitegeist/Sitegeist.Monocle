import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import Button from "@neos-project/react-ui-components/lib-esm/Button";
import Icon from "@neos-project/react-ui-components/lib-esm/Icon";

import { selectors, State } from "../../../../../state";

import { BreakpointList } from "./breakpoint-list";

import style from "./style.css";

interface BreakpointSelectorProps {
    label: string
}

interface BreakpointSelectorState {
    isOpen: boolean
}

class BreakpointSelectorC extends PureComponent<BreakpointSelectorProps, BreakpointSelectorState> {
    static propTypes = {
        label: PropTypes.string.isRequired,
        isOpen: PropTypes.bool,
        toggleIsOpen: PropTypes.func.isRequired
    };

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
