import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withState, withHandlers} from 'recompose';
import TextInput from '@neos-project/react-ui-components/lib/TextInput';

import {visibility, outside, attached} from 'components';
import {selectors, actions} from 'state';

import Prototype from './prototype';

import style from './style.css';

@visibility
@outside
@attached()
@withState('searchTerm', 'setSearchTerm', '')
@connect(state => {
    return {
        prototypes: selectors.prototypes.all(state)
    };
}, {
    selectPrototype: actions.prototypes.select
})
@withHandlers({
    handleSelectPrototype: props => prototypeName => {
        props.selectPrototype(prototypeName);
        props.onSelectPrototype(prototypeName);
    }
})
export default class PrototypeList extends PureComponent {
    filterPrototypes() {
        const {prototypes, searchTerm} = this.props;
        const lowerCasedSearchTerm = searchTerm.toLowerCase();

        return Object.keys(prototypes)
            .map(name => Object.assign({name}, prototypes[name], {
                relevance: (
                    prototypes[name].title.toLowerCase().includes(lowerCasedSearchTerm) * 2 +
                    name.toLowerCase().includes(lowerCasedSearchTerm) +
                    prototypes[name].description.toLowerCase().includes(lowerCasedSearchTerm)
                )
            }))
            .filter(prototype => prototype.relevance)
            .sort((a, b) => b.relevance - a.relevance);
    }

    render() {
        const {searchTerm, setSearchTerm, handleSelectPrototype} = this.props;

        return (
            <div className={style.list}>
                <div className={style.searchField}>
                    <TextInput placeholder="Search..." value={searchTerm} onChange={setSearchTerm}/>
                </div>
                <div className={style.prototypes}>
                    {this.filterPrototypes().map(
                        prototype => <Prototype key={prototype.name} onClick={handleSelectPrototype} {...prototype}/>
                    )}
                </div>
            </div>
        );
    }
}
