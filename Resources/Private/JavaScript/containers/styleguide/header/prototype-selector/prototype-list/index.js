import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import TextInput from '@neos-project/react-ui-components/lib-esm/TextInput';

import {visibility, outside, attached} from 'components';

import PrototypeGroup from './prototype-group';

import style from './style.css';

@visibility
@outside
@attached()
export default class PrototypeList extends PureComponent {
    static propTypes = {
        searchTerm: PropTypes.string.isRequired,
        prototypeGroups: PropTypes.array.isRequired,
        onChangeSearchTerm: PropTypes.func.isRequired,
        onSelectPrototype: PropTypes.func.isRequired
    };

    render() {
        const {searchTerm, prototypeGroups, onChangeSearchTerm, onSelectPrototype} = this.props;

        return (
            <div className={style.list}>
                <div className={style.searchField}>
                    <TextInput autoFocus placeholder="Search..." value={searchTerm} onChange={onChangeSearchTerm}/>
                </div>
                <div className={style.prototypes}>
                    {prototypeGroups.map(
                        prototypeGroup => (
                            <PrototypeGroup
                                key={prototypeGroup.label}
                                onSelectPrototype={onSelectPrototype}
                                {...prototypeGroup}
                                />
                        )
                    )}
                </div>
            </div>
        );
    }
}
