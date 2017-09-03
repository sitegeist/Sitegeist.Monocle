import React, {PureComponent} from 'react';
import {withHandlers} from 'recompose';

import style from './style.css';

@withHandlers({
    handleClick: props => () => props.onClick(props.name)
})
export default class PropSet extends PureComponent {
    render() {
        const {label, handleClick, name} = this.props;

        return (
            <button className={style.propSet} onClick={handleClick}>
                <div className={style.title}>
                    {label}
                </div>
            </button>
        );
    }
}
