import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import mousetrap from "mousetrap";

import { Button } from "@neos-project/react-ui-components";

import { selectors, actions, State } from "../../../../state";

import { PrototypeList } from "./prototype-list";

import style from "./style.module.css";

interface PrototypeSelectorProps {
    toggle: () => void
    select: (prototypeName: string) => void
    close: () => void
    isOpen: boolean
    searchTerm: string
    prototypeGroups: {
        label: string
        prototypes: {
            title: string
            name: string
            isFocused: boolean
            structure: {
                color: string
                icon: string
            }
        }[]
    }[]
    label: string
    search: (term: string) => void
}

class PrototypeSelectorC extends PureComponent<PrototypeSelectorProps> {
    componentDidMount() {
        mousetrap.bind('ctrl+f', e => {
            e.preventDefault();
            this.props.toggle();
        });
    }

    componentWillUnmount() {
        mousetrap.unbind('ctrl+f');
    }

    handleSelectPrototype = (prototypeName: string) => {
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

export const PrototypeSelector = connect((state: State) => {
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
})(PrototypeSelectorC);
