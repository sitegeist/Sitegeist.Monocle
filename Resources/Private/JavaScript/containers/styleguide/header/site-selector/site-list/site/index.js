import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withHandlers} from 'recompose';

import style from './style.css';

@withHandlers({
    handleClick: props => () => props.onClick(props.name)
})
export default class Site extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        handleClick: PropTypes.func.isRequired
    };

    render() {
        const {name, handleClick} = this.props;

        return (
            <button className={style.site} onClick={handleClick}>
                <div className={style.title}>
                    {name}
                </div>
            </button>
        );
    }
}
