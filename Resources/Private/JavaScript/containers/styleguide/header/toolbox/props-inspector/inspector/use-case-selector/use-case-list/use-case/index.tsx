import * as React from "react";
import { PureComponent } from "react";

import style from "./style.module.css";

interface UseCaseProps {
    name: string
    title: string
    onClick: (name: string) => void
}

export class UseCase extends PureComponent<UseCaseProps> {
    handleClick = () => this.props.onClick(this.props.name)

    render() {
        const { title } = this.props;

        return (
            <button className={style.useCase} onClick={this.handleClick}>
                <div className={style.title}>
                    {title}
                </div>
            </button>
        );
    }
}
