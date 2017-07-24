import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {withHandlers} from 'recompose';

import {visibility, outside, attached} from 'components';
import {selectors, actions} from 'state';

import PropSet from './prop-set';

import style from './style.css';

@visibility
@outside
@withHandlers({
    handleSelectPropSet: props => propSetName => {
        props.onSelectPropSet(propSetName);
    }
})
export default class PropSetList extends PureComponent {
    render() {
        const {propSets, handleSelectPropSet} = this.props;

        return (
            <div className={style.list}>
                <div className={style.propSets}>
                    <PropSet
                        key="__default"
                        name="__default"
                        label={'Default'}
                        onClick={handleSelectPropSet}
                        />
                    {Object.keys(propSets).map(
                        propSetName => (
                            <PropSet
                                key={propSetName}
                                name={propSetName}
                                label={propSets[propSetName].label || propSetName}
                                onClick={handleSelectPropSet}
                                />
                        )
                    )}
                </div>
            </div>
        );
    }
}
