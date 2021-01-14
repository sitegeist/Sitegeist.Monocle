import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import TextInput from '@neos-project/react-ui-components/lib-esm/TextInput';
import TextArea from '@neos-project/react-ui-components/lib-esm/TextArea';
import CheckBox from '@neos-project/react-ui-components/lib-esm/CheckBox';
import SelectBox from '@neos-project/react-ui-components/lib-esm/SelectBox';

import style from './style.css';

export default class PropsItem extends PureComponent {
    static propTypes = {
        prop: PropTypes.shape({
            name: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired,
            editor: PropTypes.shape({
                identifier: PropTypes.string,
                options: PropTypes.any.isRequired
            }).isRequired
        }),
        overriddenValue: PropTypes.any,
        onChange: PropTypes.func.isRequired
    };

    handleChange = value => {
        const {onChange, prop} = this.props;

        if (onChange) {
            onChange(prop.name, value);
        }
    };

    renderEditor = () => {
        const { prop, overriddenValue } = this.props;
        const value = overriddenValue !== undefined ?
            overriddenValue : prop.value;

        switch (prop.editor.identifier) {
            case 'Sitegeist.Monocle/Props/Editors/Checkbox':
                return (
                    <CheckBox
                        id={`prop-${prop.name}`}
                        isChecked={value}
                        onChange={this.handleChange}
                        />
                );
            case 'Sitegeist.Monocle/Props/Editors/Number':
                return (
                    <TextInput
                        id={`prop-${prop.name}`}
                        value={value}
                        onChange={this.handleChange}
                        />
                );
            case 'Sitegeist.Monocle/Props/Editors/Text':
                return (
                    <TextInput
                        id={`prop-${prop.name}`}
                        value={value}
                        onChange={this.handleChange}
                        />
                );
            case 'Sitegeist.Monocle/Props/Editors/TextArea':
                return (
                    <TextArea
                        minRows={6}
                        id={`prop-${prop.name}`}
                        value={value}
                        onChange={this.handleChange}
                        />
                );
            case 'Sitegeist.Monocle/Props/Editors/SelectBox':
                return (
                    <SelectBox
                        id={`prop-${prop.name}`}
                        value={value}
                        options={Object.entries(prop.editor.options.options).map(([label, value]) => ({
                            label,
                            value
                        }))}
                        onValueChange={this.handleChange}
                        />
                );
            default:
                return 'no matching editor found';
        }
    }

    render() {
        const {prop} = this.props;

        return (
            <div className={style.item}>
                <label htmlFor={`prop-${prop.name}`}>{prop.name}</label>
                {this.renderEditor()}
            </div>
        );
    }
}
