import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";

import Button from "@neos-project/react-ui-components/lib-esm/Button";
import Icon from "@neos-project/react-ui-components/lib-esm/Icon";

import { selectors, State } from "../../../../state";

import { SiteList } from "./site-list";

import style from "./style.css";

interface SiteSelectorProps {
    hasMultipleSites: boolean
    label: string
}

interface SiteSelectorState {
    isOpen: boolean
}

class SiteSelectorC extends PureComponent<SiteSelectorProps, SiteSelectorState> {
    state: SiteSelectorState = {
        isOpen: false
    };

    toggleIsOpen = () => {
        this.setState(state => ({ isOpen: !state.isOpen }));
    };

    render() {
        const { hasMultipleSites, label } = this.props;
        const { isOpen } = this.state;

        return (
            <div className={style.container}>
                <Button className={style.selector} style="clean" onClick={this.toggleIsOpen}>
                    <Icon icon="globe" className={style.icon}/>
                    {label}
                </Button>
                <SiteList
                    isVisible={isOpen && hasMultipleSites}
                    onClickOutside={this.toggleIsOpen}
                    onSelectSite={this.toggleIsOpen}
                    />
            </div>
        );
    }
}

export const SiteSelector = connect((state: State) => {
    const currentlySelectedSitePackageKey = selectors.sites.currentlySelectedSitePackageKey(state);
    const sites = selectors.sites.all(state);

    return {
        hasMultipleSites: sites && Object.keys(sites).length > 1,
        label: currentlySelectedSitePackageKey ? currentlySelectedSitePackageKey : '---'
    };
})(SiteSelectorC);
