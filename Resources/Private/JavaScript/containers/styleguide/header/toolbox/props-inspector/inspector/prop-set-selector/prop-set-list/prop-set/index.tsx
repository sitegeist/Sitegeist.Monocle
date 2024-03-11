import * as React from "react";
import { PureComponent } from "react";

import style from "./style.module.css";

interface PropSetProps {
    label: string
    name: string
    onClick: (name: string) => void
}

export class PropSet extends PureComponent<PropSetProps> {
    handleClick = () => this.props.onClick(this.props.name)

    render() {
        const { label } = this.props;

        return (
            <button className={style.propSet} onClick={this.handleClick}>
                <div className={style.title}>
                    {label}
                </div>
            </button>
        );
    }
}
