import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import TextInput from '@neos-project/react-ui-components/lib/TextInput';
import TextArea from '@neos-project/react-ui-components/lib/TextArea';
import CheckBox from '@neos-project/react-ui-components/lib/CheckBox';

import style from './style.css';

export default class PropsItem extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        onChange: PropTypes.func.isRequired
    };

    handleChange = value => {
        const {onChange, name, type} = this.props;

        if (onChange) {
            onChange(name, value);
        }
    };

    renderField = (name, value, onChange) => {
        switch (typeof value) {
            case 'string':
                const isLarge = (value.length > 80);
                if (isLarge) {
                    return <TextArea minRows={6} id={`prop-${name}`} value={value} onChange={onChange}/>
                } else {
                    return <TextInput id={`prop-${name}`} value={value} onChange={onChange}/>
                }
            case 'boolean':
                return <CheckBox id={`prop-${name}`} isChecked={value} onChange={onChange}/>
            default:
                return 'no matching editor found'
        }
    }

    render() {
        const {name, value, type} = this.props;

        return (
            ['string','boolean'].includes(type) &&
            <div key={name} className={style.item}>
                <label htmlFor={`prop-${name}`}>{name}</label>
                {
                    this.renderField(name, value, this.handleChange)
                }
            </div>
        );
    }
}
