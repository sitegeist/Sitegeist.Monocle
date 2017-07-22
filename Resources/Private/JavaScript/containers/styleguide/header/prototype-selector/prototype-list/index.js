import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withState, withHandlers} from 'recompose';
import mousetrap from 'mousetrap';

import TextInput from '@neos-project/react-ui-components/lib/TextInput';

import {visibility, outside, attached} from 'components';
import {selectors, actions} from 'state';

import PrototypeGroup from './prototype-group';

import style from './style.css';

const sortLabels = (a, b, accessor = i => i.label) => {
    if (accessor(a) === accessor(b)) {
        return 0;
    }

    return accessor(a) < accessor(b) ? -1 : 1;
};

@visibility
@outside
@attached()
@withState('searchTerm', 'setSearchTerm', '')
@withState('focused', 'setFocus', -1)
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
    filterAndGroupPrototypes() {
        const {prototypes, searchTerm, focused} = this.props;
        const lowerCasedSearchTerm = searchTerm.toLowerCase();

        return Object.values(
            Object.keys(prototypes)
                .map(name => Object.assign({name}, prototypes[name], {
                    relevance: (
                        (prototypes[name].title.toLowerCase().includes(lowerCasedSearchTerm) * 2) +
                        name.toLowerCase().includes(lowerCasedSearchTerm) +
                        prototypes[name].description.toLowerCase().includes(lowerCasedSearchTerm)
                    )
                }))
                .filter(prototype => prototype.relevance)
                .sort((a, b) => (
                    sortLabels(a, b, i => i.structure.label) ||
                    b.relevance - a.relevance
                ))
                .map((prototype, index) => Object.assign({}, prototype, {isFocused: focused === index}))
                .reduce((groups, prototype) => {
                    if (!groups[prototype.structure.label]) {
                        groups[prototype.structure.label] = {
                            ...prototype.structure,
                            prototypes: []
                        };
                    }

                    groups[prototype.structure.label].prototypes.push(prototype);

                    return groups;
                }, {})

        ).sort(sortLabels);
    }

    increaseFocus = () => {
        const {focused, setFocus, prototypes} = this.props;

        if (focused < Object.keys(prototypes).length - 1) {
            setFocus(focused + 1);
        }
    }

    decreaseFocus = () => {
        const {focused, setFocus} = this.props;

        if (focused > 0) {
            setFocus(focused - 1);
        }
    }

    componentDidMount() {
        const input = document.querySelector(`.${style.searchField} input`);

        if (input) {
            mousetrap(input).bind('down', this.increaseFocus);
            mousetrap(input).bind('up', this.decreaseFocus);
            mousetrap(input).bind('esc', this.props.onClickOutside);
        }

        mousetrap.bind('down', this.increaseFocus);
        mousetrap.bind('up', this.decreaseFocus);
        mousetrap.bind('esc', this.props.onClickOutside);
    }

    componentWillUnmount() {
        const input = document.querySelector(`.${style.searchField} input`);

        if (input) {
            mousetrap(input).unbind('down');
            mousetrap(input).unbind('up');
            mousetrap(input).unbind('esc');
        }

        mousetrap.unbind('down');
        mousetrap.unbind('up');
        mousetrap.unbind('esc');
    }

    render() {
        const {searchTerm, setSearchTerm, handleSelectPrototype} = this.props;

        return (
            <div className={style.list}>
                <div className={style.searchField}>
                    <TextInput autoFocus placeholder="Search..." value={searchTerm} onChange={setSearchTerm}/>
                </div>
                <div className={style.prototypes}>
                    {this.filterAndGroupPrototypes().map(
                        prototypeGroup => (
                            <PrototypeGroup
                                key={prototypeGroup.label}
                                onSelectPrototype={handleSelectPrototype}
                                {...prototypeGroup}
                                />
                        )
                    )}
                </div>
            </div>
        );
    }
}
