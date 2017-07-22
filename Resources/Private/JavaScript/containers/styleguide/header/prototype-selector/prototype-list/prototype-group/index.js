import React, {PureComponent} from 'react';

import Prototype from './prototype';

import style from './style.css';

export default class PrototypeGroup extends PureComponent {
    render() {
        const {label, icon, color, prototypes, onSelectPrototype} = this.props;

        return (
            <div className={style.group}>
                <small className={style.label}>{label}</small>
                {prototypes.map(
                    prototype => <Prototype key={prototype.name} onClick={onSelectPrototype} {...prototype}/>
                )}
            </div>
        );
    }
}
