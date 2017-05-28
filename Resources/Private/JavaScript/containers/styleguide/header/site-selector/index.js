import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import {withToggableState} from 'components';
import {selectors} from 'state';

import SiteList from './site-list';

import style from './style.css';

@withToggableState('isOpen')
@connect(state => {
    const currentlySelectedSitePackageKey = selectors.sites.currentlySelectedSitePackageKey(state);

    return {
        label: currentlySelectedSitePackageKey ? currentlySelectedSitePackageKey : '---'
    };
})
export default class SiteSelector extends PureComponent {
    render() {
        const {isOpen, label, toggleIsOpen} = this.props;

        return (
            <div className={style.container}>
                <Button className={style.selector} style="clean" onClick={toggleIsOpen}>
                    <Icon icon="globe" className={style.icon}/>
                    {label}
                </Button>
                <SiteList isVisible={isOpen} onClickOutside={toggleIsOpen} onSelectSite={toggleIsOpen}/>
            </div>
        );
    }
}
