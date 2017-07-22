import React, {PureComponent} from 'react';
import {withHandlers} from 'recompose';

import Icon from '@neos-project/react-ui-components/lib/Icon';

import style from './style.css';

@withHandlers({
    handleClick: props => () => props.onClick(props.name)
})
export default class Prototype extends PureComponent {
    setIconColor = el => {
        if (el) {
            const {color} = this.props.structure;
            el.querySelector('i').style.color = color;
        }
    };

    render() {
        const {title, name, handleClick} = this.props;
        const {icon} = this.props.structure;

        return (
            <button className={style.prototype} onClick={handleClick} ref={this.setIconColor}>
                <Icon icon={icon}/>
                <div>
                    <div className={style.title}>
                        {title}
                    </div>
                    <div className={style.name}>
                        {name}
                    </div>
                </div>
            </button>
        );
    }
}
