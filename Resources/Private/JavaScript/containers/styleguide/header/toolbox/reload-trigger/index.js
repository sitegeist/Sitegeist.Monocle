import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import {actions} from 'state';

import style from './style.css';

@connect(() => ({}), {
    reload: actions.prototypes.reload
})
export default class ReloadTrigger extends PureComponent {
    static propTypes = {
        reload: PropTypes.func.isRequied
    };

    render() {
        const {reload} = this.props;

        return (
            <Button className={style.selector} onClick={reload} style="clean">
                <Icon icon="refresh" className={style.icon}/>
            </Button>
        );
    }
}
