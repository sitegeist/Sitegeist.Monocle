import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import TextInput from '@neos-project/react-ui-components/lib/TextInput';
import TextArea from '@neos-project/react-ui-components/lib/TextArea';

import style from './style.css';

export default class PropsItem extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        isLarge: PropTypes.bool.isRequired,
        onChange: PropTypes.func.isRequired
    };

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
        );
    }
}
