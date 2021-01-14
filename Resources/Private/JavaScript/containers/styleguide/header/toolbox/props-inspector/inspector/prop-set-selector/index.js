import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Button from '@neos-project/react-ui-components/lib-esm/Button';
import Icon from '@neos-project/react-ui-components/lib-esm/Icon';

import {withToggableState} from 'components';

import PropSetList from './prop-set-list';

import style from './style.css';

@withToggableState('isOpen')
export default class PropSetSelector extends PureComponent {
    static propTypes = {
        onSelectPropSet: PropTypes.func.isRequired,
        toggleIsOpen: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        label: PropTypes.string.isRequired,
        propSets: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            overrides: PropTypes.objectOf(PropTypes.any)
        }))
    };

    handleSelectPropSet = propSet => {
        const {onSelectPropSet, toggleIsOpen} = this.props;

        onSelectPropSet(propSet);
        toggleIsOpen();
    };

    render() {
        const {isOpen, label, toggleIsOpen, propSets} = this.props;

        return (
            <div className={style.container}>
                <label htmlFor="propsets">Choose Prop set</label>
                <Button className={style.selector} id="propsets" style="clean" onClick={toggleIsOpen}>
                    {label}
                    <Icon icon={isOpen ? 'chevron-up' : 'chevron-down'} className={style.icon}/>
                </Button>
                <PropSetList
                    isVisible={isOpen}
                    onClickOutside={toggleIsOpen}
                    onSelectPropSet={this.handleSelectPropSet}
                    propSets={propSets}
                    />
            </div>
        );
    }
}
