import React, {PureComponent} from 'react';
import mergeClassNames from 'classnames';
import {connect} from 'react-redux';

import style from './style.css';

@connect(state => {
    return {
        message: Object.values(state.business.errors).join(', '),
        severity: 'fatal'
    };
})
export default class ErrorMessage extends PureComponent {
    render() {
        const {title, message, severity} = this.props;

        return message ? (
            <div
                className={mergeClassNames({
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
