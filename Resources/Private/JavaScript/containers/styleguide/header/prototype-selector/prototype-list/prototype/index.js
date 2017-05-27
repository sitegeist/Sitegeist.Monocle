import React, {PureComponent} from 'react';
import {withHandlers} from 'recompose';

import style from './style.css';

@withHandlers({
    handleClick: props => () => props.onClick(props.name)
})
export default class Prototype extends PureComponent {
    render() {
        const {title, name, handleClick} = this.props;

        return (
            <button className={style.prototype} onClick={handleClick}>
                <div className={style.title}>
                    {title}
                </div>
                <div className={style.name}>
                    {name}
                </div>
            </button>
        );
    }
}
