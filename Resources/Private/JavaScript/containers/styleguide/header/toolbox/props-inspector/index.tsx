import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";

import Button from "@neos-project/react-ui-components/lib-esm/Button";
import Icon from "@neos-project/react-ui-components/lib-esm/Icon";

import { selectors, actions, State } from "../../../../../state";

import { Inspector } from "./inspector";

import style from "./style.css";

interface PropsInspectorProps {
    toggleIsOpen: () => void
    isOpen: boolean
}

export class PropsInspectorC extends PureComponent<PropsInspectorProps> {
    render() {
        const { toggleIsOpen, isOpen } = this.props;

        return (
            <div className={style.container}>
                <Button
                    isActive={isOpen}
                    className={style.inspector}
                    onClick={toggleIsOpen}
                    style="clean"
                    >
                    <Icon icon="check-square" className={style.icon}/>
                    Props
                </Button>
                <Inspector isVisible={isOpen}/>
            </div>
        );
    }
}

export const PropsInspector = connect((state: State) => ({
    isOpen: selectors.propsInspector.isOpen(state)
}), {
    toggleIsOpen: actions.propsInspector.toggle
})(PropsInspectorC);
