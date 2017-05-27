import React, {PureComponent} from 'react';
import {Provider} from 'react-redux';

import Header from './header';
import Loader from './loader';

export default class Styleguide extends PureComponent {
    render() {
        const {store} = this.props;

        return (
            <Provider store={store}>
                <div>
                    <Header/>
                    <section>
                        PREVIEW + DETAIL
                    </section>
                    <Loader/>
                </div>
            </Provider>
        );
    }
}
