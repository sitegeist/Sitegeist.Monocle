import * as React from "react";
import { PureComponent } from "react";

import style from "./style.module.css";

interface LocaleProps {
    label: string
    name: string
    onClick: (localeName: string) => void
}

export class Locale extends PureComponent<LocaleProps> {
    handleClick = () => this.props.onClick(this.props.name)

    render() {
        const { label, name } = this.props;

        return (
            <button className={style.locale} onClick={this.handleClick}>
                <div className={style.title}>
                    {label}
                </div>
                <div className={style.name}>
                    {name}
                </div>
            </button>
        );
    }
}
