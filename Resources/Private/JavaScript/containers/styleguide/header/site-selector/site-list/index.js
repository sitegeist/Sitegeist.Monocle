import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withHandlers} from 'recompose';

import {visibility, outside, attached} from 'components';
import {selectors, actions} from 'state';

import Site from './site';

import style from './style.css';

@visibility
@outside
@attached('left')
@connect(state => {
    return {
        sites: selectors.sites.all(state)
    };
}, {
    selectSite: actions.sites.select
})
@withHandlers({
    handleSelectSite: props => siteName => {
        props.selectSite(siteName);
        props.onSelectSite(siteName);
    }
})
export default class SiteList extends PureComponent {
    render() {
        const {sites, handleSelectSite} = this.props;

        return (
            <div className={style.list}>
                <div className={style.sites}>
                    {Object.keys(sites).map(
                        site => (
                            <Site
                                key={site}
                                name={site}
                                onClick={handleSelectSite}
                                />
                        )
                    )}
                </div>
            </div>
        );
    }
}
