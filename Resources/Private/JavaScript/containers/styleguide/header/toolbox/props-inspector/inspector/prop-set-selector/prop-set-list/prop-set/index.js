import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withHandlers} from 'recompose';

import style from './style.css';

@withHandlers({
    handleClick: props => () => props.onClick(props.name)
})
export default class PropSet extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        handleClick: PropTypes.func.isRequired
    };

    render() {
        const {label, handleClick} = this.props;

        return (
            <button className={style.propSet} onClick={handleClick}>
                <div className={style.title}>
                    {label}
                </div>
            </button>
        );
    }
}
