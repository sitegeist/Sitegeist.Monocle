import React, {PureComponent} from 'react';
import {Provider} from 'react-redux';

import Header from './header';
import Main from './main';
import Loader from './loader';

import './style.css';

export default class Styleguide extends PureComponent {
    render() {
        const {store} = this.props;

        return (
            <Provider store={store}>
                <div>
                    <Header/>
                    <Main/>
                    <Loader/>
                </div>
            </Provider>
        );
    }
}
