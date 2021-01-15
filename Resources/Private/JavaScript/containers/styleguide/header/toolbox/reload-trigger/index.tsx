import * as React from "react";
import {PureComponent} from "react";
import { connect } from "react-redux";

import Button from "@neos-project/react-ui-components/lib-esm/Button";
import Icon from "@neos-project/react-ui-components/lib-esm/Icon";

import { actions } from "../../../../../state";

import style from "./style.css";

interface ReloadTriggerProps {
    reload: () => void
}

export default class ReloadTriggerC extends PureComponent<ReloadTriggerProps> {
    render() {
        const {reload} = this.props;

        return (
            <Button className={style.selector} onClick={reload} style="clean">
                <Icon icon="refresh" className={style.icon}/>
            </Button>
        );
    }
}

export const ReloadTrigger = connect(() => ({}), {
    reload: actions.prototypes.reload
})(ReloadTriggerC);
