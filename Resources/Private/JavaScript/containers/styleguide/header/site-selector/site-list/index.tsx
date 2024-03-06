import * as React from "react";
import { PureComponent } from "react";
import {connect} from "react-redux";

import { visibility, outside, attached } from "../../../../../components";
import { selectors, actions, State } from "../../../../../state";

import { Site } from "./site";

import style from "./style.module.css";

interface SiteListProps {
    sites: {
        [key: string]: string
    }
    selectSite: (name: string) => void
    onSelectSite: (name: string) => void
}

class SiteListC extends PureComponent<SiteListProps> {
    handleSelectSite = (name: string) => {
        this.props.selectSite(name);
        this.props.onSelectSite(name);
    }

    render() {
        const { sites } = this.props;

        return (
            <div className={style.list}>
                <div className={style.sites}>
                    {Object.keys(sites).map(
                        site => (
                            <Site
                                key={site}
                                name={site}
                                onClick={this.handleSelectSite}
                                />
                        )
                    )}
                </div>
            </div>
        );
    }
}

export const SiteList = visibility(outside(attached('left')(
    connect((state: State) => {
        return {
            sites: selectors.sites.all(state)
        };
    }, {
        selectSite: actions.routing.route
    })(SiteListC)
)));
