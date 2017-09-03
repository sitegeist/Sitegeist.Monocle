import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Prototype from './prototype';

import style from './style.css';

export default class PrototypeGroup extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        prototypes: PropTypes.array.isRequired,
        onSelectPrototype: PropTypes.func.isRequired
    };

    render() {
        const {label, prototypes, onSelectPrototype} = this.props;

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
