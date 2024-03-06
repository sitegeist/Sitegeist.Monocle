import * as React from "react";
import { PureComponent } from "react";

import style from "./style.module.css";

interface AnatomyItemProps {
    name: string,
    children: AnatomyItemChild[],
    onSelect: (name: string) => void
}

interface AnatomyItemChild {
    prototypeName: string
    children: AnatomyItemChild[]
}

export class AnatomyItem extends PureComponent<AnatomyItemProps> {
    handleSelect = (event: React.MouseEvent) => {
        const {name, onSelect} = this.props;
        onSelect(name);
        event.stopPropagation();
    };

    render() {
        const {name, children, onSelect} = this.props;

        return (
            <div className={style.item} onClick={this.handleSelect} role="button">
                <div className={style.name}>{name}</div>

                {children.length ?
                    <ul className={style.list}>
                        {children.map(
                            ({prototypeName, children}) => (
                                <li key={prototypeName} className={style.child}>
                                    <AnatomyItem name={prototypeName} children={children} onSelect={onSelect}/>
                                </li>
                            )
                        )}
                    </ul> : null
                }
            </div>
        );
    }
}
