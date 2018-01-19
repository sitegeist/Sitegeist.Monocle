import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withHandlers} from 'recompose';

import style from './style.css';

@withHandlers({
    handleClick: props => () => props.onClick(props.name)
})
export default class Breakpoint extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        dimensions: PropTypes.string.isRequired,
        handleClick: PropTypes.func.isRequired
    };

    render() {
        const {label, dimensions, handleClick} = this.props;

        return (
            <button className={style.breakpoint} onClick={handleClick}>
                <div className={style.title}>
                    {label}
                </div>
                <div className={style.dimensions}>
                    {dimensions}
                </div>
            </button>
        );
    }
}
