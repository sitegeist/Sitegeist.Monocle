import React, {PureComponent} from 'react';
import {Provider} from 'react-redux';
import mousetrap from 'mousetrap';
import {$get} from 'plow-js';
import url from 'build-url';

import {selectors} from 'state';

import Header from './header';
import Main from './main';
import Loader from './loader';
import Login from './login';

import './style.css';

export default class Styleguide extends PureComponent {
    componentDidMount() {
        mousetrap.bind('ctrl+space', e => {
            const {store} = this.props;
            const state = store.getState();
            const previewEndpoint = $get('env.previewUri', state);
            const currentlyRenderedPrototype = selectors.prototypes.currentlyRendered(state);
            const sitePackageKey = selectors.sites.currentlySelectedSitePackageKey(state);
            const previewUrl = currentlyRenderedPrototype && url(previewEndpoint, {
                queryParams: {
                    prototypeName: currentlyRenderedPrototype.prototypeName,
                    sitePackageKey
                }
            });

            window.open(previewUrl, '_blank');
        });
    }

    componentWillUnmount() {
        mousetrap.unbind('ctrl+space');
    }

    render() {
        const {store} = this.props;

        return (
            <Provider store={store}>
                <div>
                    <Header/>
                    <Main/>
                    <Loader/>
                    <Login/>
                </div>
            </Provider>
        );
    }
}
