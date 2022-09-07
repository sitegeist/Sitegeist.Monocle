import * as React from "react";
import { PureComponent } from "react";
import {connect} from "react-redux";

import Button from "@neos-project/react-ui-components/lib-esm/Button";
import Icon from "@neos-project/react-ui-components/lib-esm/Icon";

import { selectors, actions, State } from "../../../../../state";

import style from "./style.css";

interface GridTriggerProps {
    toggle: () => void
    isOpen: boolean
}

class GridTriggerC extends PureComponent<GridTriggerProps> {
    handleToggle = () => {
        const { toggle } = this.props;

        toggle();
    }

    render() {
        const { isOpen } = this.props;

        return (
            <Button 
                isActive={isOpen}
                className={style.selector} 
                onClick={this.handleToggle} 
                style="clean"
                >
                <Icon icon={isOpen ? "border-all" : "border-none"}  className={style.icon}/>
            </Button>
        );
    }
}

export const GridTrigger = connect((state: State) => ({
    isOpen: selectors.grid.isVisible(state)
}), {
    toggle: actions.grid.toggle
})(GridTriggerC);
