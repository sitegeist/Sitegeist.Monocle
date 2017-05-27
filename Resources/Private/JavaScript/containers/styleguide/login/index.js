import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import Dialog from '@neos-project/react-ui-components/lib/Dialog';

import visibility from 'components';

import style from './style.css';

@connect(state => {
    return {
        visibility: state.business.needsAuthentication
    };
})
@visibility
export default class Styleguide extends PureComponent {
    render() {
        return (
            <div className={style.overlay}>
                <Dialog/>
            </div>
        );
    }
}
