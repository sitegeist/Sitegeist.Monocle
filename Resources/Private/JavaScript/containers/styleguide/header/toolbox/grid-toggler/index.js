import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import {actions} from 'state';

import style from './style.css';

@connect(() => ({}), {
    toggle: actions.grid.toggle
})
export default class GridToggler extends PureComponent {
    static propTypes = {
        toggle: PropTypes.func.isRequired
    };

    handleToggle = () => {
        const {toggle} = this.props;
        toggle();
    }


    render() {
        const {reload} = this.props;

        return (
            <Button className={style.selector} onClick={this.handleToggle} style="clean">
                <Icon className={style.icon} icon="th-large" className={style.icon}/>Grid
            </Button>
        );
    }
}
