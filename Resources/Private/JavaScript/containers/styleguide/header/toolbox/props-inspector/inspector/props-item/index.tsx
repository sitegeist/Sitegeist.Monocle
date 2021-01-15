import * as React from "react";
import { PureComponent } from "react";

import TextInput from "@neos-project/react-ui-components/lib-esm/TextInput";
import TextArea from "@neos-project/react-ui-components/lib-esm/TextArea";
import CheckBox from "@neos-project/react-ui-components/lib-esm/CheckBox";

import style from "./style.css";

interface PropsItemProps {
    name: string
    type: string
    value: any
    onChange: (name: string, value: any) => void
}

export class PropsItem extends PureComponent<PropsItemProps> {
    handleChange = (value: any) => {
        const {onChange, name} = this.props;

        if (onChange) {
            onChange(name, value);
        }
    };

    renderField = (name: string, value: any, type: string, onChange: (name: string, value: any) => void) => {
        switch (type) {
            case 'string': {
                const isLarge = value.length > 80;
                if (isLarge) {
                    return (
                         <TextArea minRows={6} id={`prop-${name}`} value={value} onChange={onChange}/>
                    );
                }
                return (
                    <TextInput id={`prop-${name}`} value={value} onChange={onChange}/>
                );
            }
            case 'boolean':
                return (
                    <CheckBox id={`prop-${name}`} isChecked={value} onChange={onChange}/>
                );
            default:
                return 'no matching editor found';
        }
    }

    render() {
        const { name, value, type } = this.props;

        return (
            ['string', 'boolean'].includes(type) &&
            <div key={name} className={style.item}>
                <label htmlFor={`prop-${name}`}>{name}</label>
                {
                    this.renderField(name, value, type, this.handleChange)
                }
            </div>
        );
    }
}
