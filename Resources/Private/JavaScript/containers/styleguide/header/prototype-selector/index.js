import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mousetrap from 'mousetrap';

import Button from '@neos-project/react-ui-components/lib/Button';

import {withToggableState} from 'components';
import {selectors, actions} from 'state';

import PrototypeList from './prototype-list';

import style from './style.css';

@withToggableState('isOpen')
@connect(state => {
    const isOpen = selectors.navigation.isOpen(state);
    const searchTerm = selectors.navigation.searchTerm(state);
    const prototypeGroups = selectors.navigation.filteredAndGroupedPrototypes(state);
    const currentlySelectedPrototype = selectors.prototypes.currentlySelected(state);

    return {
        isOpen,
        searchTerm,
        prototypeGroups,
        label: currentlySelectedPrototype ? currentlySelectedPrototype.title : '---'
    };
}, {
    toggle: actions.navigation.toggle,
    open: actions.navigation.open,
    close: actions.navigation.close,
    search: actions.navigation.search,
    select: actions.prototypes.select
})
export default class PrototypeSelector extends PureComponent {
    static propTypes = {
        toggle: PropTypes.func.isRequired,
        select: PropTypes.func.isRequired,
        close: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired,
        searchTerm: PropTypes.string.isRequired,
        prototypeGroups: PropTypes.array.isRequired,
        label: PropTypes.string.isRequired,
        search: PropTypes.func.isRequired
    };

    componentDidMount() {
        mousetrap.bind('ctrl+f', e => {
            e.preventDefault();
            this.props.toggle();
        });
    }

    componentWillUnmount() {
        mousetrap.unbind('ctrl+f');
    }

    handleSelectPrototype = prototypeName => {
        const {select, close} = this.props;

        select(prototypeName);
        close();
    }

    handleToggle = () => {
        const {toggle} = this.props;

        toggle();
    }

    render() {
        const {isOpen, searchTerm, prototypeGroups, label, close, search} = this.props;

        return (
            <div className={style.container}>
                <div className={style.selector}>
                    <Button onClick={this.handleToggle} style="clean">{label}</Button>
                </div>
                <PrototypeList
                    searchTerm={searchTerm}
                    prototypeGroups={prototypeGroups}
                    isVisible={isOpen}
                    onClickOutside={close}
                    onChangeSearchTerm={search}
                    onSelectPrototype={this.handleSelectPrototype}
                    />
            </div>
        );
    }
}
