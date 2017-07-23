import React, {PureComponent} from 'react';

import TextInput from '@neos-project/react-ui-components/lib/TextInput';
import TextArea from '@neos-project/react-ui-components/lib/TextArea';

import style from './style.css';

export default class PropsItem extends PureComponent {
    handleChange = value => {
        const {onChange, name} = this.props;

        if (onChange) {
            onChange(name, value);
        }
    };

    render() {
        const {name, value, isLarge} = this.props;

        return (
            <div key={name} className={style.item}>
                <label htmlFor={`prop-${name}`}>{name}</label>
                {
                    isLarge ?
                    <TextArea minRows={6} id={`prop-${name}`} value={value} onChange={this.handleChange}/> :
                    <TextInput id={`prop-${name}`} value={value} onChange={this.handleChange}/>
                }
            </div>
        )
    }
}
