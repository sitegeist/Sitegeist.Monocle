import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import {visibility} from 'components';
import {selectors} from 'state';

import style from './style.css';

@connect(state => {
    return {
        isVisible: selectors.business.isBusy(state)
    };
})
@visibility
export default class Loader extends PureComponent {
    render() {
        return (
            <div className={style.loader}>
                <div className={style.caption}>
                    LOADER
                </div>
            </div>
        );
    }
}
