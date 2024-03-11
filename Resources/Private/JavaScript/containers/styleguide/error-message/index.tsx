import * as React from "react";
import {PureComponent} from "react";
import cx from "classnames";
import {connect} from "react-redux";

import style from "./style.module.css";

import { State } from "../../../state";

interface ErrorMessageProps {
    title?: string
    message: string
    severity: 'warning' | 'error' | 'fatal'
}

class ErrorMessageC extends PureComponent<ErrorMessageProps> {
    render() {
        const {title, message, severity} = this.props;

        return message ? (
            <div
                className={cx({
                    [style.container]: true,
                    [style[`severity-${severity}`]]: true
                })}
                >
                {['error', 'fatal'].includes(severity) && <h1>An error occured</h1>}
                {title && <h2>{title}</h2>}

                <div className={style.message}>
                    {message}
                </div>
            </div>
        ) : null;
    }
}

export const ErrorMessage = connect(
    (state: State) => {
        return {
            message: Object.values(state.business.errors).join(', '),
            severity: 'fatal'
        };
    }
)(ErrorMessageC);
