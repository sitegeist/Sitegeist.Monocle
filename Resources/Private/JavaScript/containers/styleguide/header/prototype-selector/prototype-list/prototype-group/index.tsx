import * as React from "react";
import { PureComponent } from "react";

import { Prototype } from "./prototype";

import style from "./style.css";

interface PrototypeGroupProps {
    label: string
    prototypes: {
        title: string
        name: string
        isFocused: boolean
        structure: {
            color: string
            icon: string
        }
    }[]
    onSelectPrototype: (name: string) => void
}

export class PrototypeGroup extends PureComponent<PrototypeGroupProps> {
    render() {
        const {label, prototypes, onSelectPrototype} = this.props;

        return (
            <div className={style.group}>
                <small className={style.label}>{label}</small>
                {prototypes.map(
                    prototype => (
                        <Prototype
                            key={prototype.name}
                            onClick={onSelectPrototype}
                            {...prototype}
                            />
                    )
                )}
            </div>
        );
    }
}
