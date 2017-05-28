import React, {PureComponent} from 'react';
import {withHandlers} from 'recompose';

import style from './style.css';

@withHandlers({
    handleClick: props => () => props.onClick(props.name)
})
export default class Site extends PureComponent {
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
