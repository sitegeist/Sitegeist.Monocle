import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';

import Header from './header';
import Main from './main';
import Loader from './loader';
import Login from './login';
import ErrorMessage from './error-message';

import './style.css';

export default class Styleguide extends PureComponent {
    static propTypes = {
        store: PropTypes.object.isRequired
    };

    render() {
        const {store} = this.props;

        return (
            <Provider store={store}>
                <div>
                    <Header/>
                    <Main/>
                    <Loader/>
                    <Login/>
                    <ErrorMessage/>
                </div>
            </Provider>
        );
    }
}
