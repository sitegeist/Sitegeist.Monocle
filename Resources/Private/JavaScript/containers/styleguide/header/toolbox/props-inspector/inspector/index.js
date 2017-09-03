import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import mergeClassnames from 'classnames';

import {actions, selectors} from 'state';

import PropSetSelector from './prop-set-selector';
import PropsItem from './props-item';

import style from './style.css';

@connect(state => {
    const currentlyRenderedPrototype = selectors.prototypes.currentlyRendered(state);

    return {
        ...currentlyRenderedPrototype,
        overriddenProps: selectors.prototypes.overriddenProps(state),
        selectedPropSet: selectors.prototypes.selectedPropSet(state)
    };
}, {
    overrideProp: actions.prototypes.overrideProp,
    selectPropSet: actions.prototypes.selectPropSet
})
export default class Inspector extends PureComponent {
    static propTypes = {
        fusionAst: PropTypes.object,
        overriddenProps: PropTypes.object,
        selectedPropSet: PropTypes.string,
        isVisible: PropTypes.bool,
        selectPropSet: PropTypes.func.isRequired,
        overrideProp: PropTypes.func.isRequired
    };

    handleSelectPropSet = propSet => {
        const {selectPropSet} = this.props;

        selectPropSet(propSet);
    };

    handleChange = (name, value) => {
        const {overrideProp} = this.props;

        overrideProp(name, value);
    };

    render() {
        const {fusionAst, overriddenProps, selectedPropSet, isVisible} = this.props;
        if (!fusionAst) {
            return null;
        }
        const {props, propSets} = fusionAst.__meta.styleguide;

        return (
            <div
                className={mergeClassnames({
                    [style.inspector]: true,
                    [style.isVisible]: isVisible
                })}
                >
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
