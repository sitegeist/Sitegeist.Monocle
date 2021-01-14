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
        prototypeDetails: currentlyRenderedPrototype,
        overriddenProps: selectors.prototypes.overriddenProps(state),
        selectedPropSet: selectors.prototypes.selectedPropSet(state)
    };
}, {
    overrideProp: actions.prototypes.overrideProp,
    selectPropSet: actions.prototypes.selectPropSet
})
export default class Inspector extends PureComponent {
    static propTypes = {
        prototypeDetails: PropTypes.shape({
            fusionAst: PropTypes.object,
            props: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string.isRequired,
                value: PropTypes.any.isRequired,
                editor: PropTypes.shape({
                    identifier: PropTypes.string,
                    options: PropTypes.any.isRequired
                }).isRequired
            }))
        }),
        overriddenProps: PropTypes.object,
        isVisible: PropTypes.bool,
        selectedPropSet: PropTypes.string,
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
        const {prototypeDetails, overriddenProps, selectedPropSet, isVisible} = this.props;
        if (!prototypeDetails || !prototypeDetails.fusionAst) {
            return null;
        }

        return (
            <div
                className={mergeClassnames({
                    [style.inspector]: true,
                    [style.isVisible]: isVisible
                })}
                >
                {prototypeDetails.propSets && (
                    <PropSetSelector
                        label={
                            prototypeDetails.propSets.some(
                                propSet => propSet.name === selectedPropSet
                            ) ?  selectedPropSet : 'Default'
                        }
                        propSets={prototypeDetails.propSets}
                        onSelectPropSet={this.handleSelectPropSet}
                        />
                )}
                {prototypeDetails.props && prototypeDetails.props.map(prop => (
                    <PropsItem
                        key={prop.name}
                        prop={prop}
                        overriddenValue={overriddenProps[prop.name]}
                        onChange={this.handleChange}
                        />
                ))}
            </div>
        );
    }
}
