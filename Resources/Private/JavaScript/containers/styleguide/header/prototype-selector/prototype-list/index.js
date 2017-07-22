import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withState, withHandlers} from 'recompose';
import mousetrap from 'mousetrap';

import TextInput from '@neos-project/react-ui-components/lib/TextInput';

import {visibility, outside, attached} from 'components';

import PrototypeGroup from './prototype-group';

import style from './style.css';

@visibility
@outside
@attached()
export default class PrototypeList extends PureComponent {
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
