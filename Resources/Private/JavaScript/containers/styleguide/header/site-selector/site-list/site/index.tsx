import * as React from "react";
import { PureComponent } from "react";

import style from "./style.module.css";

interface SiteProps {
    name: string
    title: string
    onClick: (name: string) => void
}


export class Site extends PureComponent<SiteProps> {
    handleClick = () => {
        const { name, onClick } = this.props;

        onClick(name);
    }

    render() {
        const { name, title } = this.props;

        return (
            <button className={style.site} onClick={this.handleClick}>
                <div className={style.title}>
                    {title ?? name}
                </div>
            </button>
        );
    }
}
