import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

export default class AnatomyItem extends PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        children: PropTypes.array.isRequired,
        onSelect: PropTypes.func.isRequired
    };

    handleSelect = () => {
        const {name, onSelect} = this.props;

        if (onSelect) {
            onSelect(name);
        }
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
