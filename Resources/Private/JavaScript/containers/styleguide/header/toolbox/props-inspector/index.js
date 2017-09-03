import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@neos-project/react-ui-components/lib/Button';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import {withToggableState} from 'components';

import Inspector from './inspector';

import style from './style.css';

@withToggableState('isOpen')
@connect(() => ({}), {})
export default class PropsInspector extends PureComponent {
    static propTypes = {
        toggleIsOpen: PropTypes.func.isRequired,
        isOpen: PropTypes.bool
    };

    render() {
        const {toggleIsOpen, isOpen} = this.props;

        return (
            <div className={style.container}>
                <Button className={style.inspector} onClick={toggleIsOpen} style="clean">
                    <Icon icon="check-square" className={style.icon}/>
                    Props
                </Button>
                <Inspector isVisible={isOpen}/>
            </div>
        );
    }
}
