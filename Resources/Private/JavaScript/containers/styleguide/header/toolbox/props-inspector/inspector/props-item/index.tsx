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
            options: {
                castValueTo?: string
            } | any
        }
    }
    onChange: (name: string, value: any) => void
}

interface PropsItemState {
    initialValue: string
    value: string
}

export class PropsItem extends PureComponent<PropsItemProps, PropsItemState> {
    state = {
        initialValue: '',
        value: ''
    };

    static getDerivedStateFromProps(props: PropsItemProps, state: PropsItemState): PropsItemState {
        if (state.initialValue !== props.prop.value) {
            return {
                ...state,
                initialValue: props.prop.value,
                value: props.prop.value
            };
        }

        return state;
    }

    castToFinalValueType(value: string) {
        const { prop } = this.props;

        switch (prop.editor.options.castValueTo) {
            case 'integer':
                return parseInt(value, 10);
            case 'float':
                return parseFloat(value);
            default:
                return value;
        }
    }

    handleChange = (value: string) => {
        const { onChange, prop } = this.props;

        if (onChange) {
            onChange(prop.name, this.castToFinalValueType(value));
            this.setState({ value });
        }
    };

    renderEditor = () => {
        const { prop } = this.props;
        const { value } = this.state;

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
                        options={prop.editor.options.options}
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
