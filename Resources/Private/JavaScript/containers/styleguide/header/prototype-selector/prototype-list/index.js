import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withState} from 'recompose';
import TextInput from '@neos-project/react-ui-components/lib/TextInput';

import {visibility, outside, attached} from 'components';
import {selectors} from 'state';

import style from './style.css';

@withState('searchTerm', 'setSearchTerm', '')
@visibility
@outside
@attached
@connect(state => {
    return {
        prototypes: selectors.prototypes.all(state)
    };
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
        const {searchTerm, setSearchTerm} = this.props;

        return (
            <div className={style.list}>
                <div className={style.searchField}>
                    <TextInput placeholder="Search..." value={searchTerm} onChange={setSearchTerm}/>
                </div>
                <div className={style.prototypes}>
                    {this.filterPrototypes().map(prototype => (
                        <div className={style.prototype}>
                            <div className={style.title}>
                                {prototype.title}
                            </div>
                            <div className={style.name}>
                                {prototype.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
