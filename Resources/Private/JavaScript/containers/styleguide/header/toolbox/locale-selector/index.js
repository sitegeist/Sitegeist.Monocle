import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import {withToggableState} from 'components';
import {selectors} from 'state';

import LocalesList from './locale-list';

import style from './style.css';

@withToggableState('isOpen')
@connect(state => {
    const currentlySelectedLocale = selectors.locales.currentlySelected(state);
    const availableLocales = selectors.locales.all(state);

    return {
        label: currentlySelectedLocale ? currentlySelectedLocale.label : 'default',
        enable: availableLocales ? true : false
    };
})
export default class LocaleSelector extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        isOpen: PropTypes.bool,
        enable: PropTypes.bool,
        toggleIsOpen: PropTypes.func.isRequired
    };

    render() {
        const {label, isOpen, enable, toggleIsOpen} = this.props;

        return (
            enable &&
            <div className={style.container}>
                <Button className={style.selector} onClick={toggleIsOpen} style="clean">
                    <Icon icon="flag" className={style.icon}/>
                    {label}
                </Button>
                <LocalesList isVisible={isOpen} onClickOutside={toggleIsOpen} onSelectLocale={toggleIsOpen}/>
            </div>
        );
    }
}
