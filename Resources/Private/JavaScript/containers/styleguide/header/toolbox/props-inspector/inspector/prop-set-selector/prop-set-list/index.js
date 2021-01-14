import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withHandlers} from 'recompose';

import {visibility, outside} from 'components';

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
    static propTypes = {
        propSets: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            overrides: PropTypes.objectOf(PropTypes.any)
        })),
        handleSelectPropSet: PropTypes.func.isRequired
    };

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
                    {propSets.map(
                        propSet => (
                            <PropSet
                                key={propSet.name}
                                name={propSet.name}
                                label={propSet.name}
                                onClick={handleSelectPropSet}
                                />
                        )
                    )}
                </div>
            </div>
        );
    }
}
