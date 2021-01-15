import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/lib-esm/Button';
import Icon from '@neos-project/react-ui-components/lib-esm/Icon';

import { selectors, State } from '../../../../../state';

import { LocalesList } from './locale-list';

import style from './style.css';

interface LocaleSelectorProps {
    label: string
    enable: boolean
}

interface LocaleSelectorState {
    isOpen: boolean
}

class LocaleSelectorC extends PureComponent<LocaleSelectorProps, LocaleSelectorState> {
    state: LocaleSelectorState = {
        isOpen: false
    };

    toggleIsOpen = () => {
        this.setState(state => ({ isOpen: !state.isOpen }));
    };

    render() {
        const { label, enable } = this.props;
        const { isOpen } = this.state;

        return (
            enable &&
            <div className={style.container}>
                <Button className={style.selector} onClick={this.toggleIsOpen} style="clean">
                    <Icon icon="flag" className={style.icon}/>
                    {label}
                </Button>
                <LocalesList isVisible={isOpen} onClickOutside={this.toggleIsOpen} onSelectLocale={this.toggleIsOpen}/>
            </div>
        );
    }
}

export const LocaleSelector = connect((state: State) => {
    const currentlySelectedLocale = selectors.locales.currentlySelected(state);
    const availableLocales = selectors.locales.all(state);

    return {
        label: currentlySelectedLocale ? currentlySelectedLocale.label : 'default',
        enable: Boolean(availableLocales)
    };
})(LocaleSelectorC);
