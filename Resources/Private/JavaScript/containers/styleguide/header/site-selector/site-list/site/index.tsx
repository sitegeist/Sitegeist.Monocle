import * as React from "react";
import { PureComponent } from "react";

import style from "./style.css";

interface SiteProps {
    name: string
    onClick: (name: string) => void
}


export class Site extends PureComponent<SiteProps> {
    handleClick = () => {
        const { name, onClick } = this.props;

        onClick(name);
    }

    render() {
        const { name } = this.props;

        return (
            <button className={style.site} onClick={this.handleClick}>
                <div className={style.title}>
                    {name}
                </div>
            </button>
        );
    }
}
