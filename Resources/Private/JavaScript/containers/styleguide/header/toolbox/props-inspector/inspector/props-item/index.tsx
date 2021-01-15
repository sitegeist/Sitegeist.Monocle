import * as React from "react";
import { PureComponent } from "react";

import TextInput from "@neos-project/react-ui-components/lib-esm/TextInput";
import TextArea from "@neos-project/react-ui-components/lib-esm/TextArea";
import CheckBox from "@neos-project/react-ui-components/lib-esm/CheckBox";
import SelectBox from "@neos-project/react-ui-components/lib-esm/SelectBox";

import style from "./style.css";

interface PropsItemProps {
    prop: {
        name: string
        value: any
        editor: {
            identifier: string
            options: any
        }
    }
    overriddenValue: any
    onChange: (name: string, value: any) => void
}

export class PropsItem extends PureComponent<PropsItemProps> {
    handleChange = (value: any) => {
        const { onChange, prop } = this.props;

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
        const { prop } = this.props;

        return (
            <div className={style.item}>
                <label htmlFor={`prop-${prop.name}`}>{prop.name}</label>
                {this.renderEditor()}
            </div>
        );
    }
}
