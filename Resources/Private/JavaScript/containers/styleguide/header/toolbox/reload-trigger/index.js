import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/lib-esm/Button';
import Icon from '@neos-project/react-ui-components/lib-esm/Icon';

import {actions} from 'state';

import style from './style.css';

@connect(() => ({}), {
    reload: actions.prototypes.reload
})
export default class ReloadTrigger extends PureComponent {
    static propTypes = {
        reload: PropTypes.func.isRequired
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
