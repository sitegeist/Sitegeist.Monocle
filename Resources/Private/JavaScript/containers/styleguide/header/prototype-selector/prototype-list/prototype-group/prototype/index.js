import React, {PureComponent} from 'react';
import {withHandlers} from 'recompose';
import mergeClassNames from 'classnames';

import Icon from '@neos-project/react-ui-components/lib/Icon';

import style from './style.css';

@withHandlers({
    handleClick: props => () => props.onClick(props.name)
})
export default class Prototype extends PureComponent {
    setIconColor = el => {
        if (el) {
            this.el = el;
            const {color} = this.props.structure;
            el.querySelector('i').style.color = color;
        }
    };

    componentWillReceiveProps({isFocused}) {
        if (isFocused) {
            setTimeout(() => this.el.focus(), 0);
        }
    }

    render() {
        const {title, name, isFocused, handleClick} = this.props;
        const {icon} = this.props.structure;

        return (
            <button
                className={mergeClassNames({
                    [style.prototype]: true,
                    [style.isFocused]: isFocused
                })}
                onClick={handleClick}
                ref={this.setIconColor}
                >
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
