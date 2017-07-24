import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import {actions, selectors} from 'state';

import PropSetSelector from './prop-set-selector';
import PropsItem from './props-item';

@connect(state => {
    return {
        overriddenProps: selectors.prototypes.overriddenProps(state),
        selectedPropSet: selectors.prototypes.selectedPropSet(state)
    }
}, {
    overrideProp: actions.prototypes.overrideProp,
    selectPropSet: actions.prototypes.selectPropSet
})
export default class Props extends PureComponent {
    handleSelectPropSet = propSet => {
        const {selectPropSet} = this.props;

        selectPropSet(propSet);
    };

    handleChange = (name, value) => {
        const {overrideProp} = this.props;

        overrideProp(name, value);
    };

    render() {
        const {fusionAst, overriddenProps, selectedPropSet} = this.props;
        const {props, propSets} = fusionAst.__meta.styleguide;

        return (
            <div>
                {propSets && (
                    <PropSetSelector
                        label={selectedPropSet in propSets ? propSets[selectedPropSet].label : 'Default'}
                        propSets={propSets}
                        onSelectPropSet={this.handleSelectPropSet}
                        />
                )}
                {props && Object.keys(props).filter(name => typeof props[name] === 'string').map(name => (
                    <PropsItem
                        key={name}
                        name={name}
                        value={name in overriddenProps ? overriddenProps[name] : props[name]}
                        isLarge={props[name].length > 80}
                        onChange={this.handleChange}
                        />
                ))}
            </div>
        );
    }
}
