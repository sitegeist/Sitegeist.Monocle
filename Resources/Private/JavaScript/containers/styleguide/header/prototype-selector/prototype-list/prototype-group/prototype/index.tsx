import * as React from "react";
import { PureComponent } from "react";
import cx from "classnames";

import { Icon } from "@neos-project/react-ui-components";

import style from "./style.module.css";

interface PrototypeProps {
    title: string
    name: string
    isFocused: boolean
    onClick: (name: string) => void
    structure: {
        color: string
        icon: string
    }
}

export class Prototype extends PureComponent<PrototypeProps> {
    private el: null | HTMLElement;

    setIconColor = (el: null | HTMLElement) => {
        if (el) {
            this.el = el;

            const {color} = this.props.structure;
            const svg = el.querySelector('svg');

            if (svg) {
                svg.style.color = color;
            }
        }
    };

    UNSAFE_componentWillReceiveProps({ isFocused }: PrototypeProps) {
        if (isFocused) {
            setTimeout(() => this.el?.focus(), 0);
        }
    }

    handleClick = () => {
        this.props.onClick(this.props.name);
    }

    render() {
        const {title, name, isFocused} = this.props;
        const {icon} = this.props.structure;

        return (
            <button
                className={cx({
                    [style.prototype]: true,
                    [style.isFocused]: isFocused
                })}
                onClick={this.handleClick}
                ref={this.setIconColor}
                >
                <Icon className={style.icon} icon={icon} size="2x"/>
                <div>
                    <div className={style.title}>
                        {title}
                    </div>
                    <div className={style.name}>
                        {name}
                    </div>
                </div>
            </button>
        );
    }
}
