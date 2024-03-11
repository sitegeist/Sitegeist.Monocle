import * as React from "react";
import { PureComponent } from "react";

import style from "./style.module.css";

interface BreakpointProps {
    label: string
    name: string
    dimensions?: string
    onClick: (name: string) => void
}

export class Breakpoint extends PureComponent<BreakpointProps> {
    handleClick = () => this.props.onClick(this.props.name)

    render() {
        const { label, dimensions } = this.props;

        return (
            <button className={style.breakpoint} onClick={this.handleClick}>
                <div className={style.title}>
                    {label}
                </div>
                {dimensions ? (
                    <div className={style.dimensions}>
                        {dimensions}
                    </div>
                ) : null}
            </button>
        );
    }
}
