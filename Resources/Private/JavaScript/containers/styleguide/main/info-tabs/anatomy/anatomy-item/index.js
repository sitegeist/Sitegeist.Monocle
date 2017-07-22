import React, {PureComponent} from 'react';

import style from './style.css';

export default class AnatomyItem extends PureComponent {
    handleSelect = () => {
        const {name, onSelect} = this.props;

        if (onSelect) {
            onSelect(name);
        }
    };

    render() {
        const {name, children, onSelect} = this.props;

        return (
            <div className={style.item} onClick={this.handleSelect}>
                <div className={style.name}>{name}</div>

                {children.length ?
                    <ul className={style.list}>
                        {children.map(
                            ({prototypeName, children}) =>
                                <li key={prototypeName} className={style.child}>
                                    <AnatomyItem name={prototypeName} children={children} onSelect={onSelect}/>
                                </li>
                        )}
                    </ul> : null
                }
            </div>
        )
    }
}
